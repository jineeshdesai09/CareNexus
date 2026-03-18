"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/app/lib/session";
import { recordAuditLog } from "@/app/lib/audit";
import { redirect } from "next/navigation";

export async function updateHospital(formData: FormData) {
  const userId = await getSession();
  const hospitalId = Number(formData.get("hospitalId"));

  await prisma.hospital.update({
    where: { HospitalID: hospitalId },
    data: {
      HospitalName: String(formData.get("HospitalName")),
      Address: String(formData.get("Address")),

      RegistrationCharge: Number(formData.get("RegistrationCharge")),
      RegistrationValidityMonths: Number(
        formData.get("RegistrationValidityMonths")
      ),

      OpeningPatientNo: Number(formData.get("OpeningPatientNo")),
      OpeningOPDNo: Number(formData.get("OpeningOPDNo")),
      OpeningReceiptNo: Number(formData.get("OpeningReceiptNo")),

      IsRateEnableInReceipt:
        formData.get("IsRateEnableInReceipt") === "on",

      IsRegistrationFeeEnableInOPD:
        formData.get("IsRegistrationFeeEnableInOPD") === "on",
    },
  });

  if (userId) {
    await recordAuditLog({
        Action: "UPDATE",
        Module: "HOSPITAL",
        UserID: userId,
        Details: `Updated Hospital Settings for: ${formData.get("HospitalName")}`
    });
  }

  redirect("/admin/hospital?success=1");
}
