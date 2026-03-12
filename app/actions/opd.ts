"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/app/lib/session";

export async function createOPD(formData: FormData) {
  const userId = await getSession();
  if (!userId) throw new Error("Unauthorized");

  const patientId = Number(formData.get("PatientID"));
  const doctorId = Number(formData.get("DoctorID"));
  const isEmergency = formData.get("IsEmergency") === "on";
  const isFollowUp = formData.get("IsFollowUpCase") === "on";
  const description = String(formData.get("Description") ?? "");

  if (!patientId || !doctorId) {
    throw new Error("Patient and Doctor required");
  }


  let tokenNo: number;

  if (isEmergency) {
    // Emergency always gets highest priority
    tokenNo = 0;
  } else {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const lastToken = await prisma.oPD.findFirst({
      where: {
        TreatedByDoctorID: doctorId,
        OPDDateTime: { gte: startOfDay },
        IsEmergency: false,
      },
      orderBy: { TokenNo: "desc" },
      select: { TokenNo: true },
    });

    tokenNo = lastToken?.TokenNo ? lastToken.TokenNo + 1 : 1;
  }

  const hospital = await prisma.hospital.findFirst();
  const registrationFee = hospital?.RegistrationCharge ? Number(hospital.RegistrationCharge) : 0;

  await prisma.oPD.create({
    data: {
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
    },
  });
}

export async function finishConsultation(formData: FormData) {
  const userId = await getSession();
  if (!userId) throw new Error("Unauthorized");

  const opdId = Number(formData.get("OPDID"));
  const description = String(formData.get("Description") ?? "");
  const diagnoses = formData.getAll("diagnoses").map(Number);

  const weight = formData.get("Weight") ? Number(formData.get("Weight")) : null;
  const height = formData.get("Height") ? Number(formData.get("Height")) : null;
  const temperature = formData.get("Temperature") ? Number(formData.get("Temperature")) : null;
  const pulse = formData.get("Pulse") ? Number(formData.get("Pulse")) : null;
  const bpSystolic = formData.get("BP_Systolic") ? Number(formData.get("BP_Systolic")) : null;
  const bpDiastolic = formData.get("BP_Diastolic") ? Number(formData.get("BP_Diastolic")) : null;
  const respRate = formData.get("RespRate") ? Number(formData.get("RespRate")) : null;
  const spO2 = formData.get("SpO2") ? Number(formData.get("SpO2")) : null;

  // Update OPD
  await prisma.oPD.update({
    where: { OPDID: opdId },
    data: {
      Status: "COMPLETED",
      ConsultationEnd: new Date(),
      Description: description,
      Weight: weight,
      Height: height,
      Temperature: temperature,
      Pulse: pulse,
      BP_Systolic: bpSystolic,
      BP_Diastolic: bpDiastolic,
      RespRate: respRate,
      SpO2: spO2,
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
      const medId = Number(formData.get(`med_id_${i}`));
      if (medId) {
        medicinesData.push({
          PrescriptionID: prescription.PrescriptionID,
          MedicineID: medId,
          Dosage: String(formData.get(`med_dosage_${i}`)),
          Frequency: String(formData.get(`med_freq_${i}`)),
          Duration: String(formData.get(`med_dur_${i}`)),
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
}
