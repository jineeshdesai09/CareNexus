import { prisma } from "@/lib/prisma";
import DashboardClient from "./DashboardClient";
import { requireAdmin } from "@/app/lib/auth";

export default async function DashboardPage() {
  const user = await requireAdmin();

  const [patientCount, doctorCount, pendingUsers, recentLogs, totalRevenueResult] = await Promise.all([
    prisma.patient.count(),
    prisma.doctor.count(),
    prisma.user.findMany({
      where: { Status: "PENDING" },
      orderBy: { Created: "desc" },
    }),
    prisma.auditLog.findMany({
      take: 10,
      orderBy: { Created: "desc" },
      include: { User: { select: { Name: true } } }
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
      recentActivities={recentLogs.map((log) => ({
        name: log.User.Name,
        action: `${log.Action} on ${log.Module}`,
        time: new Date(log.Created).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }))}
    />
  );
}
