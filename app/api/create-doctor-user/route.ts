import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export const runtime = "nodejs";

export async function GET() {
  const existing = await prisma.user.findFirst({
    where: { Role: "DOCTOR" },
  });

  if (existing) {
    return NextResponse.json({
      message: "Doctor user already exists",
      email: existing.Email,
    });
  }

  const hashed = await bcrypt.hash("doctor123", 10);

  await prisma.user.create({
    data: {
      Name: "Doctor User",
      Email: "doctor@hospital.com",
      Password: hashed,
      Role: "DOCTOR",
    },
  });

  return NextResponse.json({
    message: "Doctor user created",
    email: "doctor@hospital.com",
    password: "doctor123",
  });
}
