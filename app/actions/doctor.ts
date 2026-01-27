"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "../lib/session";
import { redirect } from "next/navigation";

export async function createDoctor(formData: FormData) {
  const userId = await getSession();
  if (!userId) throw new Error("Unauthorized");

  const hospital = await prisma.hospital.findFirst();
  if (!hospital) throw new Error("Hospital not configured");

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
    },
  });

  redirect("/doctors");
}
