"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/app/lib/session";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function createOPD(formData: FormData) {
  const userId = await getSession();
  if (!userId) throw new Error("Unauthorized");

  // Only receptionists can create OPD records from the reception flow
  const caller = await prisma.user.findUnique({ where: { UserID: userId } });
  if (!caller || caller.Role !== "RECEPTIONIST") throw new Error("Forbidden: Only receptionists can create OPD records");

  const patientId = Number(formData.get("PatientID"));
  const doctorId = Number(formData.get("DoctorID"));
  const isEmergency = formData.get("IsEmergency") === "on";
  const isFollowUp = formData.get("IsFollowUpCase") === "on";
  const description = String(formData.get("Description") ?? "");

  const weight = formData.get("Weight") ? Number(formData.get("Weight")) : null;
  const spo2 = formData.get("SpO2") ? Number(formData.get("SpO2")) : null;
  const height = formData.get("Height") ? Number(formData.get("Height")) : null;

  if (!patientId || !doctorId) {
    throw new Error("Patient and Doctor required");
  }


  await prisma.$transaction(async (tx) => {
    let tokenNo: number;

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    if (isEmergency) {
      tokenNo = 0;
    } else {
      const lastToken = await tx.oPD.findFirst({
        where: {
          TreatedByDoctorID: doctorId,
          OPDDateTime: { gte: startOfDay, lte: endOfDay },
          IsEmergency: false,
        },
        orderBy: { TokenNo: "desc" },
        select: { TokenNo: true },
      });

      tokenNo = (lastToken?.TokenNo || 0) + 1;
    }

    const hospital = await tx.hospital.findFirst();
    const isFeeEnabled = hospital?.IsRegistrationFeeEnableInOPD ?? false;
    const registrationFee = isFeeEnabled ? Number(hospital?.RegistrationCharge ?? 0) : 0;

    const dailyCount = await tx.oPD.count({
      where: { Created: { gte: startOfDay, lte: endOfDay } }
    });

    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const baseNo = hospital?.OpeningOPDNo || 1000;
    const opdNo = `OPD-${dateStr}-${baseNo + dailyCount + 1}`;

    // If height is provided, update patient record
    if (height) {
      await tx.patient.update({
        where: { PatientID: patientId },
        data: { Height: height }
      });
    }

    await tx.oPD.create({
      data: {
        OPDNo: opdNo,
        OPDDateTime: new Date(),
        TokenNo: tokenNo,
        Status: "WAITING",
        IsEmergency: isEmergency,
        IsFollowUpCase: isFollowUp,
        Description: description,
        PatientID: patientId,
        TreatedByDoctorID: doctorId,
        RegistrationFee: registrationFee,
        UserID: userId,
        Weight: weight,
        SpO2: spo2,
        Height: height
      },
    });
  });

  revalidatePath("/reception/dashboard");
  redirect("/reception/dashboard");
}

export async function finishConsultation(formData: FormData) {
  const userId = await getSession();
  if (!userId) throw new Error("Unauthorized");

  // Only doctors can finish consultations
  const caller = await prisma.user.findUnique({ where: { UserID: userId } });
  if (!caller || caller.Role !== "DOCTOR") throw new Error("Forbidden: Only doctors can finish consultations");

  const opdId = Number(formData.get("OPDID"));

  // Ownership check — look up doctor by UserID, then compare DoctorID on the OPD
  const doctorProfile = await prisma.doctor.findFirst({ where: { UserID: userId } });
  if (!doctorProfile) throw new Error("Doctor profile not found");

  const existing = await prisma.oPD.findUnique({ where: { OPDID: opdId } });
  if (!existing) throw new Error("OPD not found");
  if (existing.TreatedByDoctorID !== doctorProfile.DoctorID) throw new Error("Forbidden: This is not your patient");

  const description = String(formData.get("Description") ?? "");
  const diagnoses = formData.getAll("diagnoses").map(Number);

  const bpSystolic = formData.get("BP_Systolic") ? Number(formData.get("BP_Systolic")) : null;
  const bpDiastolic = formData.get("BP_Diastolic") ? Number(formData.get("BP_Diastolic")) : null;
  const temperature = formData.get("Temperature") ? Number(formData.get("Temperature")) : null;
  const pulse = formData.get("Pulse") ? Number(formData.get("Pulse")) : null;

  const followUpDateStr = formData.get("FollowUpDate") as string;
  const followUpDate = followUpDateStr ? new Date(followUpDateStr) : null;

  const isDraft = formData.get("isDraft") === "true";

  // Update OPD
  await prisma.oPD.update({
    where: { OPDID: opdId },
    data: {
      Status: isDraft ? "IN_CONSULTATION" : "COMPLETED",
      ConsultationEnd: isDraft ? null : new Date(),
      Description: description,
      BP_Systolic: bpSystolic,
      BP_Diastolic: bpDiastolic,
      Temperature: temperature,
      Pulse: pulse,
      FollowUpDate: followUpDate,
    },
  });

  // Clear existing diagnoses
  await prisma.oPDDiagnosisType.deleteMany({
    where: { OPDID: opdId },
  });

  // Add new diagnoses
  if (diagnoses.length > 0) {
    await prisma.oPDDiagnosisType.createMany({
      data: diagnoses.map((d) => ({
        OPDID: opdId,
        DiagnosisTypeID: d,
        UserID: userId,
      })),
    });
  }

  // Handle Prescription
  const prescriptionNotes = formData.get("PrescriptionNotes") as string;
  const medicineCount = Number(formData.get("medicine_count") || 0);

  if (medicineCount > 0 || prescriptionNotes) {
    // Create or update prescription
    const prescription = await prisma.prescription.upsert({
      where: { OPDID: opdId },
      create: {
        OPDID: opdId,
        Notes: prescriptionNotes,
      },
      update: {
        Notes: prescriptionNotes,
      },
    });

    // Clear existing medicines if any (for updates)
    await prisma.prescriptionMedicine.deleteMany({
      where: { PrescriptionID: prescription.PrescriptionID },
    });

    // Add medicines
    const medicinesData = [];
    for (let i = 0; i < medicineCount; i++) {
      const medName = String(formData.get(`med_name_${i}`) || "");
      if (medName) {
        medicinesData.push({
          PrescriptionID: prescription.PrescriptionID,
          MedicineName: medName,
          Dosage: String(formData.get(`med_dosage_${i}`) || ""),
          Frequency: String(formData.get(`med_freq_${i}`) || ""),
          Duration: String(formData.get(`med_dur_${i}`) || ""),
          Instructions: String(formData.get(`med_inst_${i}`) || ""),
        });
      }
    }

    if (medicinesData.length > 0) {
      await prisma.prescriptionMedicine.createMany({
        data: medicinesData,
      });
    }
  }

  revalidatePath("/doctor/dashboard");
  revalidatePath(`/doctor/opd/${opdId}`);
  
  redirect("/doctor/dashboard");
}
