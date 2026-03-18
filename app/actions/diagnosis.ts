"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/app/lib/auth";
import { recordAuditLog } from "@/app/lib/audit";

export async function createDiagnosis(formData: FormData) {
    const user = await getCurrentUser();
    if (!user || user.Role !== "ADMIN") {
        throw new Error("Unauthorized");
    }

    const hospital = await prisma.hospital.findFirst();
    if (!hospital) {
        throw new Error("No hospital found");
    }

    const name = String(formData.get("DiagnosisTypeName"));

    await prisma.diagnosisType.create({
        data: {
            DiagnosisTypeName: name,
            DiagnosisTypeShortName: formData.get("DiagnosisTypeShortName") ? String(formData.get("DiagnosisTypeShortName")) : null,
            IsActive: formData.get("IsActive") === "on",
            Description: formData.get("Description") ? String(formData.get("Description")) : null,
            HospitalID: hospital.HospitalID,
            UserID: user.UserID,
        },
    });

    await recordAuditLog({
        Action: "CREATE",
        Module: "DIAGNOSIS_MASTER",
        UserID: user.UserID,
        Details: `Created diagnosis type: ${name}`
    });

    redirect("/admin/diagnosis?success=1");
}
