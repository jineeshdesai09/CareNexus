"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/app/lib/auth";

export async function createDiagnosis(formData: FormData) {
    const user = await getCurrentUser();
    if (!user || user.Role !== "ADMIN") {
        throw new Error("Unauthorized");
    }

    const hospital = await prisma.hospital.findFirst();
    if (!hospital) {
        throw new Error("No hospital found");
    }

    await prisma.diagnosisType.create({
        data: {
            DiagnosisTypeName: String(formData.get("DiagnosisTypeName")),
            DiagnosisTypeShortName: formData.get("DiagnosisTypeShortName") ? String(formData.get("DiagnosisTypeShortName")) : null,
            IsActive: formData.get("IsActive") === "on",
            Description: formData.get("Description") ? String(formData.get("Description")) : null,
            HospitalID: hospital.HospitalID,
            UserID: user.UserID,
        },
    });

    redirect("/admin/diagnosis?success=1");
}
