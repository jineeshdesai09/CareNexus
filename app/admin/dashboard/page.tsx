import { prisma } from "@/lib/prisma";
import DashboardClient from "./DashboardClient";
import { requireAdmin } from "@/app/lib/auth";

export default async function DashboardPage() {
  const user = await requireAdmin();

  const [patientCount, doctorCount, pendingUsers, recentOPDs, totalRevenueResult] = await Promise.all([
    prisma.patient.count(),
    prisma.doctor.count(),
    prisma.user.findMany({
      where: { Status: "PENDING" },
      orderBy: { Created: "desc" },
    }),
    prisma.oPD.findMany({
      take: 5,
      orderBy: { Created: "desc" },
      include: {
        Patient: { select: { PatientName: true } },
      },
    }),
    prisma.receipt.aggregate({
      _sum: {
        AmountPaid: true,
      },
    }),
  ]);

  const totalRevenue = Number(totalRevenueResult._sum.AmountPaid || 0);

  return (
    <DashboardClient
      userName={user.Name}
      stats={{
        patientCount,
        doctorCount,
        totalRevenue,
      }}
      pendingUsers={pendingUsers}
      recentActivities={recentOPDs.map((opd) => ({
        name: opd.Patient.PatientName,
        action: `OPD #${opd.OPDNo || opd.OPDID} created`,
        time: new Date(opd.Created).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }))}
    />
  );
}
