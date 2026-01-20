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

  if (!hospital || hospital.OpeningPatientNo === null) {
    throw new Error(
      "Hospital Opening Patient Number is not configured. Please update Hospital."
    );
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

  const patientName = String(formData.get("PatientName"));
  const gender = String(formData.get("Gender"));
  const mobileNo = String(formData.get("MobileNo"));
  const address = String(formData.get("Address") ?? "");

  if (!patientName || !gender || !mobileNo) {
    throw new Error("Missing required patient fields");
  }

  const bloodGroup = String(formData.get("BloodGroup") ?? "");
  const emergencyContactNo = String(
    formData.get("EmergencyContactNo") ?? ""
  );
  const referredBy = String(formData.get("ReferredBy") ?? "");
  const description = String(formData.get("Description") ?? "");

  const existingPatient = await prisma.patient.findFirst({
    where: {
      MobileNo: mobileNo,
      HospitalID: hospitalId,
    },
  });

  if (existingPatient) {
    throw new Error("Patient with this mobile number already exists");
  }

  const patient = await prisma.patient.create({
    data: {
      PatientName: patientName,
      PatientNo: nextPatientNo,
      RegistrationDateTime: new Date(),

      DOB: dob,
      Age: age,
      Gender: gender,
      BloodGroup: bloodGroup || null,

      MobileNo: mobileNo,
      EmergencyContactNo: emergencyContactNo || null,

      Address: address || null,
      ReferredBy: referredBy || null,
      Description: description || null,

      HospitalID: hospitalId,
    },
  });

  console.log("Patient created with ID:", patient.PatientID);
}
