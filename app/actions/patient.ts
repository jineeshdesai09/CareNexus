"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "../lib/session";
import { calculateAge } from "../lib/utils/date";

export async function createPatient(formData: FormData) {

  const userId = await getSession();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const dobValue = formData.get("DOB");

  if (!dobValue) {
    throw new Error("Date of Birth is required");
  }

  const dob = new Date(String(dobValue));
  const age = calculateAge(dob);

  const hospital = await prisma.hospital.findFirst({
    select: {
      HospitalID: true,
      OpeningPatientNo: true,
    },
  });

  if (!hospital) {
    throw new Error("Hospital not configured");
  }

  const hospitalId = hospital.HospitalID;

  const lastPatient = await prisma.patient.findFirst({
    where: { HospitalID: hospitalId },
    orderBy: { PatientNo: "desc" },
    select: { PatientNo: true },
  });

  const nextPatientNo = lastPatient
    ? lastPatient.PatientNo + 1
    : hospital.OpeningPatientNo;

  console.log("DOB:", dob);
  console.log("Calculated Age:", age);
  console.log("Generated PatientNo:", nextPatientNo);

}
