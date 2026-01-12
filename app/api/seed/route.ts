import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET() {
  const count = await prisma.hospital.count();

  if (count === 0) {
    await prisma.hospital.create({
      data: {
        HospitalName: "Demo Hospital",
        Address: "Main Road",
        OpeningDate: new Date(),
        RegistrationCharge: 100,
        RegistrationValidityMonths: 6,
        OpeningPatientNo: 1,
        OpeningOPDNo: 1,
        OpeningReceiptNo: 1,
        IsRateEnableInReceipt: true,
        IsRegistrationFeeEnableInOPD: true,
      },
    });

    return NextResponse.json({ message: "Hospital seeded" });
  }

  return NextResponse.json({ message: "Hospital already exists" });
}
