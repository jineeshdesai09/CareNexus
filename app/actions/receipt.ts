"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/app/lib/session";
import { redirect } from "next/navigation";

export async function createReceipt(formData: FormData) {
    const userId = await getSession();
    if (!userId) throw new Error("Unauthorized");

    const opdId = Number(formData.get("OPDID"));
    const amountPaid = Number(formData.get("AmountPaid"));
    const description = formData.get("Description") ? String(formData.get("Description")) : null;
    const paymentMode = 1; // Assuming default 1 for Cash

    // Gather SubTreatments dynamically from form (format: subtreatment_ID)
    const prefix = "subtreatment_";
    const lineItems: Array<{ SubTreatmentTypeID: number; Rate: number; Quantity: number; Amount: number }> = [];

    for (const [key, value] of formData.entries()) {
        if (key.startsWith(prefix) && value === "on") {
            const stId = Number(key.replace(prefix, ""));
            const quantityMapName = `quantity_${stId}`;
            const quantity = Number(formData.get(quantityMapName) || 1);

            // Fetch rate securely from DB
            const subThM = await prisma.subTreatmentType.findUnique({ where: { SubTreatmentTypeID: stId } });
            if (subThM) {
                const amount = subThM.Rate.toNumber() * quantity;
                lineItems.push({ SubTreatmentTypeID: stId, Rate: subThM.Rate.toNumber(), Quantity: quantity, Amount: amount });
            }
        }
    }

    // Create Document Number
    const hospital = await prisma.hospital.findFirst();
    const receiptNo = hospital ? hospital.OpeningReceiptNo ? (hospital.OpeningReceiptNo + 1).toString() : "1" : "1";
    if (hospital) {
        await prisma.hospital.update({
            where: { HospitalID: hospital.HospitalID },
            data: { OpeningReceiptNo: Number(receiptNo) }
        });
    }

    // Get Registration Fee
    const opd = await prisma.oPD.findUnique({
        where: { OPDID: opdId },
        select: { RegistrationFee: true }
    });
    const regFee = opd?.RegistrationFee ? opd.RegistrationFee.toNumber() : 0;
    const servicesTotal = lineItems.reduce((sum, li) => sum + li.Amount, 0);
    const finalTotal = regFee + servicesTotal;

    await prisma.receipt.create({
        data: {
            ReceiptNo: `REC-${receiptNo}`,
            ReceiptDate: new Date(),
            AmountPaid: finalTotal,
            PaymentModeID: paymentMode,
            Description: description,
            OPDID: opdId,
            UserID: userId,

            ReceiptTrans: {
                create: lineItems.map((li) => ({
                    SubTreatmentTypeID: li.SubTreatmentTypeID,
                    Rate: li.Rate,
                    Quantity: li.Quantity,
                    Amount: li.Amount,
                    UserID: userId,
                })),
            },
        },
    });

    await prisma.oPD.update({
        where: { OPDID: opdId },
        data: { Status: "BILLED" },
    });

    redirect(`/reception/billing/${opdId}/success`);
}
