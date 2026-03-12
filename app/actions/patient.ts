"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/app/lib/session";
import { redirect } from "next/navigation";

export async function searchPatients(query: string) {
  const userId = await getSession();
  if (!userId) throw new Error("Unauthorized");

  if (!query || query.length < 2) return [];

  return await prisma.patient.findMany({
    where: {
      OR: [
        { PatientName: { contains: query, mode: "insensitive" } },
        { MobileNo: { contains: query } },
        { PatientNo: isNaN(Number(query)) ? undefined : Number(query) },
      ].filter(Boolean) as any,
    },
    select: {
      PatientID: true,
      PatientName: true,
      PatientNo: true,
      MobileNo: true,
      Age: true,
      Gender: true,
    },
    take: 10,
    orderBy: { PatientName: "asc" },
  });
}

export async function createPatient(formData: FormData) {
  const userId = await getSession();
  if (!userId) throw new Error("Unauthorized");

  const hospital = await prisma.hospital.findFirst();
  if (!hospital) throw new Error("Hospital not configured");

  // Generate PatientNo
  const lastPatient = await prisma.patient.findFirst({
    orderBy: { PatientNo: "desc" },
    select: { PatientNo: true },
  });

  const nextPatientNo = lastPatient?.PatientNo
    ? lastPatient.PatientNo + 1
    : (hospital.OpeningPatientNo || 1001);

  const dobString = formData.get("DOB") as string;
  if (!dobString) throw new Error("Date of Birth is required");

  const dob = new Date(dobString);
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
    age--;
  }

  await prisma.patient.create({
    data: {
      PatientName: String(formData.get("PatientName")),
      PatientNo: nextPatientNo,
      RegistrationDateTime: new Date(),
      DOB: dob,
      Age: age,
      Gender: String(formData.get("Gender")),
      BloodGroup: String(formData.get("BloodGroup") || ""),
      MobileNo: String(formData.get("MobileNo")),
      EmergencyContactNo: String(formData.get("EmergencyContactNo") || ""),
      Address: String(formData.get("Address") || ""),
      ReferredBy: String(formData.get("ReferredBy") || ""),
      Description: String(formData.get("Description") || ""),
      HospitalID: hospital.HospitalID,
      UserID: userId,
    },
  });

  redirect("/reception/patients/directory?success=1");
}
