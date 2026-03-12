"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/app/lib/auth";

export async function createTreatment(formData: FormData) {
    const user = await getCurrentUser();
    if (!user || user.Role !== "ADMIN") {
        throw new Error("Unauthorized");
    }

    const hospital = await prisma.hospital.findFirst();
    if (!hospital) {
        throw new Error("No hospital found");
    }

    await prisma.treatmentType.create({
        data: {
            TreatmentTypeName: String(formData.get("TreatmentTypeName")),
            TreatmentTypeShortName: formData.get("TreatmentTypeShortName") ? String(formData.get("TreatmentTypeShortName")) : null,
            Description: formData.get("Description") ? String(formData.get("Description")) : null,
            HospitalID: hospital.HospitalID,
            UserID: user.UserID,
        },
    });

    redirect("/admin/treatments?success=1");
}
