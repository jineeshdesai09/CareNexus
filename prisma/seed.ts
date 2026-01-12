import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../app/generated/prisma/client";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
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

    console.log("Hospital seeded");
  } else {
    console.log("Hospital already exists");
  }
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
