import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/app/lib/auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Users, CalendarClock, Activity } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const runtime = "nodejs";

export default async function DoctorDashboard() {
  const user = await getCurrentUser();

  if (!user || user.Role !== "DOCTOR") {
    redirect("/login");
  }

  // Find the doctor record associated with this user (by UserID — reliable)
  const doctor = await prisma.doctor.findFirst({
    where: { UserID: user.UserID },
  });

  if (!doctor) {
    return (
      <div className="p-4 bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-xl border border-rose-100 dark:border-rose-800">
        Error: No Doctor profile linked to your user account. Please contact admin.
      </div>
    );
  }

  // Today range — use local-time constructor to avoid UTC drift on cloud servers
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
  const endOfDay   = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

  const opds = await prisma.oPD.findMany({
    where: {
      TreatedByDoctorID: doctor.DoctorID,
      OPDDateTime: {
        gte: startOfDay,
        lte: endOfDay,
      },
      Status: {
        notIn: ["CLOSED", "CANCELLED", "BILLED", "COMPLETED"]
      }
    },
    orderBy: [
      { IsEmergency: "desc" },
      { TokenNo: "asc" },
      { OPDDateTime: "asc" }
    ],
    include: {
      Patient: {
        select: {
          PatientName: true,
          PatientNo: true,
          Age: true,
          Gender: true
        }
      }
    }
  });

  // Calculate Start and End of Current Month
  const startOfMonth = new Date(startOfDay.getFullYear(), startOfDay.getMonth(), 1);
  const endOfMonth = new Date(startOfDay.getFullYear(), startOfDay.getMonth() + 1, 0, 23, 59, 59, 999);

  // Total consultations completed this month
  const monthlyConsultations = await prisma.oPD.count({
      where: {
          TreatedByDoctorID: doctor.DoctorID,
          Status: { in: ["COMPLETED", "BILLED", "CLOSED"] },
          OPDDateTime: { gte: startOfMonth, lte: endOfMonth }
      }
  });

  // Upcoming Follow-ups this week (Next 7 Days)
  const upcomingFollowUps = await prisma.oPD.findMany({
      where: {
          TreatedByDoctorID: doctor.DoctorID,
          FollowUpDate: { 
            gte: startOfDay, 
            lte: new Date(startOfDay.getTime() + 7 * 24 * 60 * 60 * 1000) 
          }
      },
      include: {
        Patient: {
          select: {
            PatientName: true,
            PatientNo: true,
            MobileNo: true
          }
        }
      },
      orderBy: { FollowUpDate: "asc" }
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12 pt-2">
      <div className="flex justify-between items-center border-b border-slate-200 dark:border-zinc-800 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-zinc-50 tracking-tight">
            Doctor Dashboard
          </h1>
          <p className="text-slate-500 dark:text-zinc-400 mt-1 font-medium text-sm">
            Welcome, Dr. {doctor.FirstName} {doctor.LastName}
          </p>
        </div>
      </div>

      {/* Analytics Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-none ring-1 ring-slate-200 dark:ring-zinc-800 shadow-sm bg-white dark:bg-zinc-900 hover:ring-teal-500/50 transition-all group">
              <CardContent className="p-6 !pt-6 flex flex-row items-center gap-5">
                  <div className="w-14 h-14 bg-teal-50 dark:bg-teal-900/40 text-teal-600 dark:text-teal-400 rounded-2xl flex items-center justify-center shrink-0 border border-teal-100 dark:border-teal-800/50 shadow-sm transition-transform group-hover:scale-105">
                      <Activity className="w-6 h-6" />
                  </div>
                  <div className="flex flex-col gap-0.5 justify-center mt-1">
                      <p className="text-[11px] font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-widest leading-none">Today's Queue</p>
                      <p className="text-3xl font-black text-slate-900 dark:text-zinc-50 leading-none">{opds.length}</p>
                  </div>
              </CardContent>
          </Card>
          
          <Card className="border-none ring-1 ring-slate-200 dark:ring-zinc-800 shadow-sm bg-white dark:bg-zinc-900 hover:ring-blue-500/50 transition-all group">
              <CardContent className="p-6 !pt-6 flex flex-row items-center gap-5">
                  <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center shrink-0 border border-blue-100 dark:border-blue-800/50 shadow-sm transition-transform group-hover:scale-105">
                      <Users className="w-6 h-6" />
                  </div>
                  <div className="flex flex-col gap-0.5 justify-center mt-1">
                      <p className="text-[11px] font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-widest leading-none">Treated This Month</p>
                      <p className="text-3xl font-black text-slate-900 dark:text-zinc-50 leading-none">{monthlyConsultations}</p>
                  </div>
              </CardContent>
          </Card>

          <Card className="border-none ring-1 ring-slate-200 dark:ring-zinc-800 shadow-sm bg-white dark:bg-zinc-900 hover:ring-emerald-500/50 transition-all group">
              <CardContent className="p-6 !pt-6 flex flex-row items-center gap-5">
                  <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center shrink-0 border border-emerald-100 dark:border-emerald-800/50 shadow-sm transition-transform group-hover:scale-105">
                      <CalendarClock className="w-6 h-6" />
                  </div>
                  <div className="flex flex-col gap-0.5 justify-center mt-1">
                      <p className="text-[11px] font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-widest leading-none">Follow-ups (7D)</p>
                      <p className="text-3xl font-black text-slate-900 dark:text-zinc-50 leading-none">{upcomingFollowUps.length}</p>
                  </div>
              </CardContent>
          </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border-none ring-1 ring-slate-200 dark:ring-zinc-800 shadow-md bg-white dark:bg-zinc-900 overflow-hidden">
          <div className="p-5 border-b border-slate-100 dark:border-zinc-800/50 bg-slate-50/50 dark:bg-zinc-950/50">
            <h2 className="text-lg font-bold text-slate-800 dark:text-zinc-100">Today's Appointments</h2>
          </div>
          <div className="p-6">
             {opds.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-sm font-medium text-slate-500 dark:text-zinc-400">No pending appointments for today.</p>
                </div>
             ) : (
                <div className="space-y-4">
                    {opds.slice(0, 5).map(opd => (
                        <div key={opd.OPDID} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 dark:border-zinc-800 bg-white dark:bg-zinc-950/20">
                            <div>
                                <p className="font-bold text-slate-900 dark:text-zinc-100">{opd.Patient.PatientName}</p>
                                <p className="text-xs font-medium text-slate-500 dark:text-zinc-500 mt-1">TK: {opd.TokenNo} • {opd.Patient.Age}Y • {opd.Patient.Gender.charAt(0)}</p>
                            </div>
                            <Link href={`/doctor/opd/${opd.OPDID}`} className="px-4 py-2 bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 rounded-lg text-xs font-bold shadow-sm border border-teal-100 dark:border-teal-800/50 hover:bg-teal-100 dark:hover:bg-teal-900/50 transition-colors">
                                Consult
                            </Link>
                        </div>
                    ))}
                    {opds.length > 5 && (
                        <Link href="/doctor/dashboard" className="block text-center text-sm font-bold text-teal-600 dark:text-teal-400 pt-2 hover:underline">
                            View all {opds.length} appointments
                        </Link>
                    )}
                </div>
             )}
          </div>
        </Card>

        <Card className="border-none ring-1 ring-slate-200 dark:ring-zinc-800 shadow-md bg-white dark:bg-zinc-900 overflow-hidden">
          <div className="p-5 border-b border-slate-100 dark:border-zinc-800/50 bg-slate-50/50 dark:bg-zinc-950/50 flex items-center gap-2">
            <CalendarClock className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            <h2 className="text-lg font-bold text-slate-800 dark:text-zinc-100">Upcoming Follow-ups (Next 7 Days)</h2>
          </div>

          <div className="p-0">
              {upcomingFollowUps.length === 0 ? (
                <div className="p-12 text-center flex flex-col items-center">
                  <div className="w-12 h-12 bg-slate-50 dark:bg-zinc-800 rounded-full flex items-center justify-center text-slate-300 dark:text-zinc-600 mb-4">
                      <CalendarClock className="w-6 h-6" />
                  </div>
                  <span className="text-sm font-medium text-slate-500 dark:text-zinc-400">
                      No follow-ups scheduled for the next 7 days.
                  </span>
                </div>
              ) : (
                <div className="overflow-x-auto">
                    <table className="w-full">
                    <thead className="bg-slate-50 dark:bg-zinc-950/50 border-b border-slate-100 dark:border-zinc-800 text-[10px] font-bold text-slate-500 dark:text-zinc-500 uppercase tracking-widest">
                        <tr>
                        <th className="px-6 py-4 text-left">Follow-up Date</th>
                        <th className="px-6 py-4 text-left">Patient Details</th>
                        <th className="px-6 py-4 text-right">Contact</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/50">
                        {upcomingFollowUps.map((opd) => (
                        <tr key={opd.OPDID} className="hover:bg-slate-50/50 dark:hover:bg-zinc-800/30 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-teal-600 dark:text-teal-400">
                            {opd.FollowUpDate?.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm font-bold text-slate-900 dark:text-zinc-100 block">
                                {opd.Patient.PatientName}
                            </span>
                            <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 tracking-wider">
                                #{opd.Patient.PatientNo}
                            </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-slate-600 dark:text-zinc-400">
                            {opd.Patient.MobileNo || "—"}
                            </td>
                        </tr>
                        ))}
                    </tbody>
                    </table>
                </div>
              )}
          </div>
        </Card>
      </div>
    </div>
  );
}
