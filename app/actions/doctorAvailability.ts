"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "../lib/auth";
import { redirect } from "next/navigation";

export async function updateMyAvailability(formData: FormData) {
  const user = await getCurrentUser();
  if (!user || user.Role !== "DOCTOR") {
    throw new Error("Unauthorized");
  }

  const doctor = await prisma.doctor.findFirst({
    where: { Email: user.Email }
  });

  if (!doctor) {
    throw new Error("Doctor profile not found.");
  }

  const daysOfWeek = formData.getAll("DayOfWeek").map(Number);
  const fromTime = String(formData.get("FromTime"));
  const toTime = String(formData.get("ToTime"));
  const maxPatients = Number(formData.get("MaxPatients") ?? 0);
  const isEmergencyOnly = formData.get("IsEmergencyOnly") === "on";

  if (!fromTime || !toTime || daysOfWeek.length === 0) {
    throw new Error("Missing required availability fields");
  }

  for (const dayOfWeek of daysOfWeek) {
    const existing = await prisma.doctorAvailability.findFirst({
      where: {
        DoctorID: doctor.DoctorID,
        DayOfWeek: dayOfWeek,
      },
    });

    if (existing) {
        // Update existing if it exists
        await prisma.doctorAvailability.update({
            where: { AvailabilityID: existing.AvailabilityID },
            data: {
                FromTime: fromTime,
                ToTime: toTime,
                MaxPatients: maxPatients,
                IsEmergencyOnly: isEmergencyOnly,
                IsAvailable: true,
            }
        });
    } else {
        await prisma.doctorAvailability.create({
        data: {
            DoctorID: doctor.DoctorID,
            DayOfWeek: dayOfWeek,
            FromTime: fromTime,
            ToTime: toTime,
            MaxPatients: maxPatients,
            IsEmergencyOnly: isEmergencyOnly,
            IsAvailable: true,
        },
        });
    }
  }

  redirect("/doctor/schedule");
}
