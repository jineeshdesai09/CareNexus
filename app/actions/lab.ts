"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "../lib/auth";

export async function getLabTestCatalog() {
  const user = await getCurrentUser();
  if (!user || user.Role !== "DOCTOR") {
    throw new Error("Unauthorized");
  }

  // Fetch all categories and their active tests
  const categories = await prisma.labTestCategory.findMany({
    include: {
      LabTests: {
        where: { IsActive: true },
        orderBy: { TestName: "asc" },
      },
    },
    orderBy: { CategoryName: "asc" },
  });

  // Filter out empty categories and serialize Decimal fields to plain JS values
  return categories
    .filter(c => c.LabTests.length > 0)
    .map(category => ({
      ...category,
      LabTests: category.LabTests.map(test => ({
        ...test,
        Price: Number(test.Price), // Decimal → number (safe to pass to Client Components)
      })),
    }));
}

export async function createLabOrder(data: {
  opdId: number;
  testIds: number[];
  notes?: string;
}) {
  const user = await getCurrentUser();
  if (!user || user.Role !== "DOCTOR") {
    throw new Error("Unauthorized");
  }

  if (!data.testIds || data.testIds.length === 0) {
    throw new Error("No tests selected");
  }

  // Get Doctor info
  const doctor = await prisma.doctor.findFirst({
    where: { Email: user.Email }
  });

  if (!doctor) {
    throw new Error("Doctor profile not found");
  }

  // Verify OPD
  const opd = await prisma.oPD.findUnique({
    where: { OPDID: data.opdId },
  });

  if (!opd || opd.TreatedByDoctorID !== doctor.DoctorID) {
    throw new Error("Invalid OPD or unauthorized");
  }

  // Fetch tests to calculate amount
  const tests = await prisma.labTest.findMany({
    where: { TestID: { in: data.testIds } }
  });

  let totalAmount = 0;
  tests.forEach(t => { 
    totalAmount += Number(t.Price); 
  });

  // Create the Order
  const order = await prisma.labOrder.create({
    data: {
      OPDID: opd.OPDID,
      PatientID: opd.PatientID,
      DoctorID: doctor.DoctorID,
      TotalAmount: totalAmount,
      Notes: data.notes,
      Items: {
        create: tests.map(t => ({
          TestID: t.TestID,
          Price: t.Price
        }))
      }
    }
  });

  return order;
}
