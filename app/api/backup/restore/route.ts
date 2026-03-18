import { NextResponse } from "next/server";
import { getCurrentUser } from "@/app/lib/auth";
import { spawn } from "child_process";
import { recordAuditLog } from "@/app/lib/audit";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const user = await getCurrentUser();

  if (!user || user.Role !== "ADMIN") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("backup") as File;

  if (!file) {
    return new NextResponse("No backup file provided", { status: 400 });
  }

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    return new NextResponse("DATABASE_URL not configured", { status: 500 });
  }

  try {
    // Record the action
    await recordAuditLog({
      Action: "RESTORE",
      Module: "SYSTEM_MAINTENANCE",
      UserID: user.UserID,
      Details: `Initiated database restore from file: ${file.name}`
    });

    const psql = spawn("psql", [databaseUrl]);

    const reader = file.stream().getReader();
    
    // Pipe file stream to psql stdin
    const writeToPsql = async () => {
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          psql.stdin.end();
          break;
        }
        psql.stdin.write(value);
      }
    };

    const psqlPromise = new Promise<void>((resolve, reject) => {
      psql.on("close", (code) => {
        if (code !== 0) {
          reject(new Error(`psql exited with code ${code}`));
        } else {
          resolve();
        }
      });
      psql.stderr.on("data", (chunk) => console.error(`psql stderr: ${chunk}`));
    });

    await Promise.all([writeToPsql(), psqlPromise]);

    return NextResponse.json({ message: "Database restored successfully" });
  } catch (error: any) {
    console.error("Restore failed:", error);
    return new NextResponse(`Restore failed: ${error.message}`, { status: 500 });
  }
}
