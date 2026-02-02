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

      RegistrationFee: 0,
      UserID: userId,
    },
  });
}
