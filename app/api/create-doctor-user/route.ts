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

  const newUser = await prisma.user.create({
    data: {
      Name: "Doctor User",
      Email: "doctor@hospital.com",
      Password: hashed,
      Role: "DOCTOR",
    },
  });

  const hospital = await prisma.hospital.findFirst();
  if (hospital) {
    await prisma.doctor.create({
      data: {
        FirstName: "Doctor",
        LastName: "User",
        Gender: "Male",
        MobileNo: "9876543210",
        Email: "doctor@hospital.com",
        RegistrationNo: "REG12345",
        Specialization: "General Physician",
        Department: "General Medicine",
        ConsultationFee: 500,
        HospitalID: hospital.HospitalID,
        UserID: newUser.UserID
      }
    });
  }

  return NextResponse.json({
    message: "Doctor user created",
    email: "doctor@hospital.com",
    password: "doctor123",
  });
}
