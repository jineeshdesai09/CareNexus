import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export const runtime = "nodejs";

export async function GET() {
  const existing = await prisma.user.findFirst({
    where: { Role: "RECEPTIONIST" },
  });

  if (existing) {
    return NextResponse.json({
      message: "Receptionist already exists",
      email: existing.Email,
    });
  }

  const hashedPassword = await bcrypt.hash("reception123", 10);

  await prisma.user.create({
    data: {
      Name: "Reception User",
      Email: "reception@hospital.com",
      Password: hashedPassword,
      Role: "RECEPTIONIST",
    },
  });

  return NextResponse.json({
    message: "Receptionist user created",
    email: "reception@hospital.com",
    password: "reception123",
  });
}
