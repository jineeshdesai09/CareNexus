import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const categories = [
      {
        name: "Hematology",
        tests: [
          { name: "Complete Blood Count (CBC)", code: "CBC", price: 350.0 },
          { name: "Hemoglobin (Hb)", code: "HB", price: 150.0 },
          { name: "Erythrocyte Sedimentation Rate (ESR)", code: "ESR", price: 100.0 },
        ],
      },
      {
        name: "Biochemistry",
        tests: [
          { name: "Fasting Blood Sugar (FBS)", code: "FBS", price: 100.0 },
          { name: "Post Prandial Blood Sugar (PPBS)", code: "PPBS", price: 100.0 },
          { name: "Lipid Profile", code: "LIPID", price: 800.0 },
          { name: "Liver Function Test (LFT)", code: "LFT", price: 750.0 },
          { name: "Kidney Function Test (KFT)", code: "KFT", price: 700.0 },
        ],
      },
      {
        name: "Microbiology & Serology",
        tests: [
          { name: "Urine Routine & Microscopy", code: "URM", price: 150.0 },
          { name: "Widal Test (Typhoid)", code: "WIDAL", price: 250.0 },
          { name: "Dengue NS1 Antigen", code: "DENGUE", price: 600.0 },
          { name: "Malaria Parasite (MP) Smear", code: "MP", price: 150.0 },
        ],
      },
      {
        name: "Thyroid Profile",
        tests: [
          { name: "Thyroid Stimulating Hormone (TSH)", code: "TSH", price: 350.0 },
          { name: "T3, T4, TSH (Total Thyroid Profile)", code: "TFT", price: 800.0 },
        ],
      },
    ];

    let createdCategoriesCount = 0;
    let createdTestsCount = 0;

    for (const catData of categories) {
      let category = await prisma.labTestCategory.findFirst({
        where: { CategoryName: catData.name },
      });

      if (!category) {
        category = await prisma.labTestCategory.create({
          data: { CategoryName: catData.name },
        });
        createdCategoriesCount++;
      }

      for (const test of catData.tests) {
        const existingTest = await prisma.labTest.findUnique({
          where: { TestCode: test.code },
        });

        if (!existingTest) {
          await prisma.labTest.create({
            data: {
              TestName: test.name,
              TestCode: test.code,
              Price: test.price,
              CategoryID: category.CategoryID,
            },
          });
          createdTestsCount++;
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: `Successfully seeded ${createdCategoriesCount} categories and ${createdTestsCount} tests.`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
