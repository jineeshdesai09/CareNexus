"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function savePrescriptionTemplate(data: {
    TemplateName: string;
    Description?: string;
    DoctorID: number;
    Medicines: {
        MedicineName: string;
        Dosage: string;
        Frequency: string;
        Duration: string;
        Instructions?: string;
    }[];
}) {
    try {
        const template = await prisma.prescriptionTemplate.create({
            data: {
                TemplateName: data.TemplateName,
                Description: data.Description,
                DoctorID: data.DoctorID,
                Medicines: {
                    create: data.Medicines.map(m => ({
                        MedicineName: m.MedicineName,
                        Dosage: m.Dosage,
                        Frequency: m.Frequency,
                        Duration: m.Duration,
                        Instructions: m.Instructions
                    })),
                },
            },
        });
        revalidatePath("/doctor/opd/[id]", "page");
        return { success: true, template };
    } catch (error) {
        console.error("Failed to save template:", error);
        return { success: false, error: "Failed to save template" };
    }
}

export async function getPrescriptionTemplates(doctorID: number) {
    try {
        return await prisma.prescriptionTemplate.findMany({
            where: { DoctorID: doctorID },
            include: { Medicines: true },
            orderBy: { TemplateName: "asc" },
        });
    } catch (error) {
        console.error("Failed to get templates:", error);
        return [];
    }
}

export async function deletePrescriptionTemplate(templateID: number) {
    try {
        // We'll delete medicines first or rely on cascade if configured
        await prisma.prescriptionTemplateMedicine.deleteMany({
            where: { TemplateID: templateID }
        });
        await prisma.prescriptionTemplate.delete({
            where: { TemplateID: templateID },
        });
        revalidatePath("/doctor/opd/[id]", "page");
        return { success: true };
    } catch (error) {
        console.error("Failed to delete template:", error);
        return { success: false, error: "Failed to delete template" };
    }
}
