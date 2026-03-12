"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/app/lib/auth";

export async function createSubTreatment(formData: FormData) {
    const user = await getCurrentUser();
    if (!user || user.Role !== "ADMIN") {
        throw new Error("Unauthorized");
    }

    await prisma.subTreatmentType.create({
        data: {
            SubTreatmentTypeName: String(formData.get("SubTreatmentTypeName")),
            TreatmentTypeID: Number(formData.get("TreatmentTypeID")),
            Rate: Number(formData.get("Rate")),
            IsActive: formData.get("IsActive") === "on",
            Description: formData.get("Description") ? String(formData.get("Description")) : null,
            UserID: user.UserID,
        },
    });

    redirect("/admin/sub-treatments?success=1");
}
