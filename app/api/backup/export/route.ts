import { NextResponse } from "next/server";
import { getCurrentUser } from "@/app/lib/auth";
import { spawn } from "child_process";
import { recordAuditLog } from "@/app/lib/audit";

export const runtime = "nodejs";

export async function GET() {
  const user = await getCurrentUser();

  if (!user || user.Role !== "ADMIN") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    return new NextResponse("DATABASE_URL not configured", { status: 500 });
  }

  try {
    // Record the action
    await recordAuditLog({
      Action: "EXPORT",
      Module: "SYSTEM_MAINTENANCE",
      UserID: user.UserID,
      Details: "Initiated full database export (SQL dump)"
    });

    const pgDump = spawn("pg_dump", [
      databaseUrl,
      "--no-owner",
      "--no-privileges",
      "--format=p", // plain text SQL
    ]);

    const stream = new ReadableStream({
      start(controller) {
        pgDump.stdout.on("data", (chunk) => controller.enqueue(chunk));
        pgDump.stderr.on("data", (chunk) => console.error(`pg_dump stderr: ${chunk}`));
        pgDump.on("close", (code) => {
          if (code !== 0) {
            console.error(`pg_dump exited with code ${code}`);
            controller.error(new Error(`pg_dump failed with code ${code}`));
          } else {
            controller.close();
          }
        });
      },
    });

    return new NextResponse(stream, {
      headers: {
        "Content-Type": "application/sql",
        "Content-Disposition": `attachment; filename="backup_${new Date().toISOString().split('T')[0]}.sql"`,
      },
    });
  } catch (error) {
    console.error("Backup export failed:", error);
    return new NextResponse("Backup export failed", { status: 500 });
  }
}
