"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/app/lib/session";
import { getCurrentUser } from "@/app/lib/auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

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
      Occupation: String(formData.get("Occupation") || ""),
      MobileNo: String(formData.get("MobileNo")),
      EmergencyContactNo: String(formData.get("EmergencyContactNo") || ""),
      Address: String(formData.get("Address") || ""),
      PinCode: String(formData.get("PinCode") || ""),
      ReferredBy: String(formData.get("ReferredBy") || ""),
      Description: String(formData.get("Description") || ""),
      Height: formData.get("Height") ? Number(formData.get("Height")) : null,
      HospitalID: hospital.HospitalID,
      UserID: userId,
    },
  });

  redirect("/reception/patients/directory?success=1");
}

export async function getAvailableSpecializations() {
  const user = await getCurrentUser();
  if (!user || user.Role !== "PATIENT") throw new Error("Unauthorized");

  const specializations = await prisma.doctor.findMany({
    select: {
      Specialization: true,
    },
    distinct: ['Specialization'],
    where: {
      Availabilities: {
        some: {
          IsAvailable: true,
        }
      }
    }
  });

  return specializations.map(s => s.Specialization);
}

export async function getDoctorsBySpecialization(specialization: string) {
  const user = await getCurrentUser();
  if (!user || user.Role !== "PATIENT") throw new Error("Unauthorized");

  const doctors = await prisma.doctor.findMany({
    where: {
      Specialization: specialization,
      Availabilities: {
        some: {
          IsAvailable: true,
        }
      }
    },
    include: {
      Availabilities: {
        where: {
          IsAvailable: true,
        }
      }
    }
  });

  return doctors.map(doc => ({
    ...doc,
    ConsultationFee: doc.ConsultationFee.toString(),
  }));
}

export async function bookAppointment(doctorId: number, dateStr: string, reason: string) {
  const user = await getCurrentUser();
  if (!user || user.Role !== "PATIENT") throw new Error("Unauthorized");

  const patient = await prisma.patient.findFirst({
    where: { UserID: user.UserID }
  });

  if (!patient) throw new Error("Patient profile not found");

  // Parse "YYYY-MM-DD" to a safe mid-day local time so it reliably falls on "Today" for dashboard queries
  let date: Date;
  if (dateStr.includes("T")) {
    date = new Date(dateStr); // Fallback for old ISO string payloads
  } else {
    const [year, month, day] = dateStr.split("-").map(Number);
    date = new Date(year, month - 1, day, 12, 0, 0); // Noon
  }
  
  const dayOfWeek = date.getDay(); // 0-6

  // Verify doctor is actually available on this day
  const availability = await prisma.doctorAvailability.findFirst({
    where: {
      DoctorID: doctorId,
      DayOfWeek: dayOfWeek,
      IsAvailable: true
    }
  });

  if (!availability) {
    throw new Error("Doctor is not available on this day.");
  }

  // Count existing appointments for this doctor on this date
  const startOfDay = new Date(date);
  startOfDay.setHours(0,0,0,0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23,59,59,999);

  const existingAppointments = await prisma.oPD.count({
    where: {
      TreatedByDoctorID: doctorId,
      OPDDateTime: {
        gte: startOfDay,
        lte: endOfDay
      },
      Status: {
        not: "CANCELLED"
      }
    }
  });

  if (existingAppointments >= availability.MaxPatients) {
    throw new Error("Doctor is fully booked for this day.");
  }

  // Prevent duplicate booking: same patient, same doctor, same day
  const duplicateBooking = await prisma.oPD.findFirst({
    where: {
      PatientID: patient.PatientID,
      TreatedByDoctorID: doctorId,
      OPDDateTime: { gte: startOfDay, lte: endOfDay },
      Status: { notIn: ["CANCELLED"] },
    },
  });

  if (duplicateBooking) {
    throw new Error("You already have an appointment with this doctor on the selected day.");
  }

  // Use a transaction to minimize race conditions for token generation
  const opd = await prisma.$transaction(async (tx) => {
    // 1. Fetch the actual highest token number currently issued
    const lastOpd = await tx.oPD.findFirst({
      where: {
        TreatedByDoctorID: doctorId,
        OPDDateTime: { gte: startOfDay, lte: endOfDay },
        IsEmergency: false,
      },
      orderBy: { TokenNo: "desc" },
      select: { TokenNo: true },
    });

    const tokenNo = (lastOpd?.TokenNo || 0) + 1;

    // 2. Generate unique OPD No
    const dateSuffix = date.toISOString().slice(0, 10).replace(/-/g, "");
    const dailyCount = await tx.oPD.count({
      where: { OPDDateTime: { gte: startOfDay, lte: endOfDay } }
    });
    const opdNo = `OPD-${dateSuffix}-${String(dailyCount + 1).padStart(4, "0")}`;

    // 3. Get hospital settings
    const hospital = await tx.hospital.findFirst();

    // 4. Create the record
    return await tx.oPD.create({
      data: {
        PatientID: patient.PatientID,
        TreatedByDoctorID: doctorId,
        OPDDateTime: date,
        Description: reason,
        Status: "REGISTERED",
        OPDNo: opdNo,
        TokenNo: tokenNo,
        RegistrationFee: hospital?.RegistrationCharge || 0,
        UserID: user.UserID
      },
    });
  });

  revalidatePath("/patient/appointments");
  return { success: true, opdId: opd.OPDID };
}

export async function cancelAppointment(opdId: number) {
  const user = await getCurrentUser();
  if (!user || user.Role !== "PATIENT") throw new Error("Unauthorized");

  const patient = await prisma.patient.findFirst({
    where: { UserID: user.UserID },
  });
  if (!patient) throw new Error("Patient profile not found");

  const opd = await prisma.oPD.findUnique({ where: { OPDID: opdId } });
  if (!opd) throw new Error("Appointment not found");

  // Ownership check — patient can only cancel their own appointments
  if (opd.PatientID !== patient.PatientID) throw new Error("Forbidden: Not your appointment");

  // Can only cancel if appointment hasn't started yet (REGISTERED or WAITING)
  if (!["REGISTERED", "WAITING"].includes(opd.Status)) {
    throw new Error(
      `This appointment cannot be cancelled — it is currently "${opd.Status}". Only appointments that haven't started can be cancelled.`
    );
  }

  await prisma.oPD.update({
    where: { OPDID: opdId },
    data: { Status: "CANCELLED" },
  });

  revalidatePath("/patient/appointments");
  return { success: true };
}
