import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export const runtime = "nodejs";

export async function GET() {
  const existingAdmin = await prisma.user.findFirst({
    where: { Role: "ADMIN" },
  });

  if (existingAdmin) {
    return NextResponse.json({
      message: "Admin already exists",
    });
  }

  const hashedPassword = await bcrypt.hash("admin123", 10);

  await prisma.user.create({
    data: {
      Name: "System Admin",
      Email: "admin@hospital.com",
      Password: hashedPassword,
      Role: "ADMIN",
    },
  });

  return NextResponse.json({
    message: "Admin user created",
    email: "admin@hospital.com",
    password: "admin123",
  });
}
