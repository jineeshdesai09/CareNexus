"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "../lib/session";

export async function createDoctorAvailability(formData: FormData) {

  const userId = await getSession();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const doctorId = Number(formData.get("DoctorID"));
  const daysOfWeek = formData.getAll("DayOfWeek").map(Number);
  const fromTime = String(formData.get("FromTime"));
  const toTime = String(formData.get("ToTime"));
  const maxPatients = Number(formData.get("MaxPatients") ?? 0);
  const isEmergencyOnly = formData.get("IsEmergencyOnly") === "on";

  if (!doctorId || !fromTime || !toTime || daysOfWeek.length === 0) {
    throw new Error("Missing required availability fields");
  }

  for (const dayOfWeek of daysOfWeek) {
    const existing = await prisma.doctorAvailability.findFirst({
      where: {
        DoctorID: doctorId,
        DayOfWeek: dayOfWeek,
      },
    });

    if (existing) {
      continue; // Skip if already exists to allow batch processing
    }

    await prisma.doctorAvailability.create({
      data: {
        DoctorID: doctorId,
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
