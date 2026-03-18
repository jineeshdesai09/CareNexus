"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/app/lib/auth";
import { recordAuditLog } from "@/app/lib/audit";

export async function createSubTreatment(formData: FormData) {
    const user = await getCurrentUser();
    if (!user || user.Role !== "ADMIN") {
        throw new Error("Unauthorized");
    }

    const name = String(formData.get("SubTreatmentTypeName"));

    await prisma.subTreatmentType.create({
        data: {
            SubTreatmentTypeName: name,
            TreatmentTypeID: Number(formData.get("TreatmentTypeID")),
            Rate: Number(formData.get("Rate")),
            IsActive: formData.get("IsActive") === "on",
            Description: formData.get("Description") ? String(formData.get("Description")) : null,
            UserID: user.UserID,
        },
    });

    await recordAuditLog({
        Action: "CREATE",
        Module: "SUB_TREATMENT_MASTER",
        UserID: user.UserID,
        Details: `Created sub-treatment: ${name}`
    });

    redirect("/admin/sub-treatments?success=1");
}
