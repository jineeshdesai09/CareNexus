"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "../lib/session";
import { redirect } from "next/navigation";
import bcrypt from "bcrypt";

export async function createDoctor(formData: FormData) {
  const userId = await getSession();
  if (!userId) throw new Error("Unauthorized");

  // Only admins can create doctors
  const caller = await prisma.user.findUnique({ where: { UserID: userId } });
  if (!caller || caller.Role !== "ADMIN") throw new Error("Forbidden: Admin only");

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

  // Only admins can update doctors
  const caller = await prisma.user.findUnique({ where: { UserID: userId } });
  if (!caller || caller.Role !== "ADMIN") throw new Error("Forbidden: Admin only");

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

export async function searchDoctorPatients(params: {
  query?: string;
  gender?: string;
  ageMin?: number;
  ageMax?: number;
}) {
  const userId = await getSession();
  if (!userId) throw new Error("Unauthorized");

  const doctor = await prisma.doctor.findFirst({
    where: { UserID: userId },
  });

  if (!doctor) throw new Error("Doctor profile not found");

  const { query, gender, ageMin, ageMax } = params;

  // Find OPDs for this doctor that match patient filters
  const opds = await prisma.oPD.findMany({
    where: {
      TreatedByDoctorID: doctor.DoctorID,
      Patient: {
        AND: [
          query ? {
            OR: [
              { PatientName: { contains: query, mode: "insensitive" } },
              { MobileNo: { contains: query } },
              { PatientNo: isNaN(Number(query)) ? undefined : Number(query) },
            ].filter(Boolean) as any
          } : {},
          gender && gender !== "all" ? { Gender: gender } : {},
          ageMin ? { Age: { gte: ageMin } } : {},
          ageMax ? { Age: { lte: ageMax } } : {},
        ]
      }
    },
    include: {
      Patient: true,
    },
    orderBy: { OPDDateTime: "desc" },
  });

  // Deduplicate to get unique patients with their latest visit and next follow-up
  const uniquePatientsMap = new Map();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  opds.forEach((opd) => {
    if (!uniquePatientsMap.has(opd.Patient.PatientID)) {
      uniquePatientsMap.set(opd.Patient.PatientID, {
        ...opd.Patient,
        lastVisit: opd.OPDDateTime,
        upcomingFollowUp: null,
      });
    }

    const patientData = uniquePatientsMap.get(opd.Patient.PatientID);
    if (opd.FollowUpDate && new Date(opd.FollowUpDate) >= today) {
      if (!patientData.upcomingFollowUp || new Date(opd.FollowUpDate) < new Date(patientData.upcomingFollowUp)) {
        patientData.upcomingFollowUp = opd.FollowUpDate;
      }
    }
  });

  return Array.from(uniquePatientsMap.values());
}

