"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/app/lib/session";

export async function startConsultation(opdId: number) {
  const userId = await getSession();
  if (!userId) throw new Error("Unauthorized");

  await prisma.oPD.update({
    where: { OPDID: opdId },
    data: {
      Status: "IN_CONSULTATION", 
      ConsultationStart: new Date(),
      UserID: userId,
    },
  });
}

export async function endConsultation(opdId: number) {
  const userId = await getSession();
  if (!userId) throw new Error("Unauthorized");

  await prisma.oPD.update({
    where: { OPDID: opdId },
    data: {
      Status: "COMPLETED",
      ConsultationEnd: new Date(),
      UserID: userId,
    },
  });
}
