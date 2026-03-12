"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "../lib/session";
import { redirect } from "next/navigation";
import bcrypt from "bcrypt";

export async function createDoctor(formData: FormData) {
  const userId = await getSession();
  if (!userId) throw new Error("Unauthorized");

  const hospital = await prisma.hospital.findFirst();
  if (!hospital) throw new Error("Hospital not configured");

  const email = String(formData.get("Email"));
  const firstName = String(formData.get("FirstName"));
  const lastName = String(formData.get("LastName"));

  // Create User account to allow login
  const existingUser = await prisma.user.findUnique({ where: { Email: email } });
  let doctorUserId = null;

  if (!existingUser) {
    const hashed = await bcrypt.hash("doctor123", 10);
    const newUser = await prisma.user.create({
      data: {
        Name: `Dr. ${firstName} ${lastName}`,
        Email: email,
        Password: hashed,
        Role: "DOCTOR"
      }
    });
    doctorUserId = newUser.UserID;
  } else {
    doctorUserId = existingUser.UserID;
  }

  await prisma.doctor.create({
    data: {
      FirstName: String(formData.get("FirstName")),
      LastName: String(formData.get("LastName")),
      DOB: formData.get("DOB")
        ? new Date(String(formData.get("DOB")))
        : null,
      Gender: String(formData.get("Gender")),
      MobileNo: String(formData.get("MobileNo")),
      Email: String(formData.get("Email")),
      Address: String(formData.get("Address") ?? ""),

      RegistrationNo: String(formData.get("RegistrationNo")),
      RegistrationCouncil: String(formData.get("RegistrationCouncil") ?? ""),
      Specialization: String(formData.get("Specialization")),
      Department: String(formData.get("Department")),
      Qualification: String(formData.get("Qualification") ?? ""),
      ExperienceYears: Number(formData.get("ExperienceYears") ?? 0),
      ConsultationFee: Number(formData.get("ConsultationFee") ?? 0),

      AboutDoctor: String(formData.get("AboutDoctor") ?? ""),

      HospitalID: hospital.HospitalID,
      UserID: doctorUserId
    },
  });

  redirect("/admin/doctors");
}

export async function updateDoctor(formData: FormData) {
  const userId = await getSession();
  if (!userId) throw new Error("Unauthorized");

  const doctorId = Number(formData.get("DoctorID"));

  await prisma.doctor.update({
    where: { DoctorID: doctorId },
    data: {
      FirstName: String(formData.get("FirstName")),
      LastName: String(formData.get("LastName")),
      DOB: formData.get("DOB")
        ? new Date(String(formData.get("DOB")))
        : null,
      Gender: String(formData.get("Gender")),
      MobileNo: String(formData.get("MobileNo")),
      Email: String(formData.get("Email")),
      Address: String(formData.get("Address") ?? ""),

      RegistrationNo: String(formData.get("RegistrationNo")),
      RegistrationCouncil: String(formData.get("RegistrationCouncil") ?? ""),
      Specialization: String(formData.get("Specialization")),
      Department: String(formData.get("Department")),
      Qualification: String(formData.get("Qualification") ?? ""),
      ExperienceYears: Number(formData.get("ExperienceYears") ?? 0),
      ConsultationFee: Number(formData.get("ConsultationFee") ?? 0),

      AboutDoctor: String(formData.get("AboutDoctor") ?? ""),
    },
  });

  redirect("/admin/doctors");
}
