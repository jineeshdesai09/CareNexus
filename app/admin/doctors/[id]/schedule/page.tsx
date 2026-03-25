import { prisma } from "@/lib/prisma";
import { requireAdmin } from "../../../../lib/auth";
import { notFound } from "next/navigation";
import Link from "next/link";
import { CalendarDays, Clock, Users } from "lucide-react";

export const runtime = "nodejs";

const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export default async function AdminDoctorSchedulePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;

  const doctorId = Number(id);
  if (!id || isNaN(doctorId)) {
    notFound();
  }

  const doctor = await prisma.doctor.findUnique({
    where: { DoctorID: doctorId },
    include: {
      Availabilities: {
        orderBy: { DayOfWeek: "asc" }
      }
    },
  });

  if (!doctor) {
    notFound();
  }

  const scheduleMap = new Map();
  DAYS.forEach((day, index) => scheduleMap.set(index, null));
  
  doctor.Availabilities.forEach((avail) => {
    scheduleMap.set(avail.DayOfWeek, avail);
  });

  return (
    <div className="max-w-5xl mx-auto mt-6">
      <div className="flex justify-between items-center mb-6 border-b border-slate-200 dark:border-zinc-800 pb-4">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-zinc-50 tracking-tight flex items-center gap-3">
          <CalendarDays className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
          Schedule – Dr. {doctor.FirstName} {doctor.LastName}
        </h1>
        <Link href="/admin/doctors" className="text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100 font-medium transition flex items-center gap-2">
          ← Back to Master
        </Link>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-slate-200 dark:border-zinc-800 overflow-hidden mb-8">
        <div className="grid grid-cols-1 md:grid-cols-7 border-b border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/50 hidden md:grid">
          {DAYS.map((day, idx) => {
            const isToday = new Date().getDay() === idx;
            return (
              <div key={day} className={`p-4 text-center border-r border-slate-100 dark:border-zinc-800 last:border-r-0 ${isToday ? 'bg-indigo-50 dark:bg-indigo-900/20 border-b-2 border-b-indigo-500' : ''}`}>
                <span className={`text-sm font-bold uppercase tracking-wider ${isToday ? 'text-indigo-700 dark:text-indigo-400' : 'text-slate-500 dark:text-zinc-400'}`}>
                  {day.slice(0,3)}
                </span>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-7 divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-zinc-800">
          {DAYS.map((dayText, idx) => {
            const avail = scheduleMap.get(idx);
            const isToday = new Date().getDay() === idx;
            
            return (
              <div key={idx} className={`p-4 md:min-h-[160px] flex flex-col ${isToday ? 'bg-indigo-50/30 dark:bg-indigo-900/10' : ''} ${!avail || !avail.IsAvailable ? 'bg-slate-50/50 dark:bg-zinc-950/50' : ''}`}>
                {/* Mobile Day Header */}
                <div className="md:hidden font-bold text-slate-700 dark:text-zinc-300 mb-2">{dayText}</div>

                {avail && avail.IsAvailable ? (
                  <div className="flex flex-col h-full justify-center space-y-3">
                    <div className="inline-block px-2.5 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 border border-green-200 dark:border-green-800/50 text-xs font-bold rounded-lg self-start">
                      Available
                    </div>
                    {avail.IsEmergencyOnly && (
                      <div className="inline-block px-2.5 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 border border-red-200 dark:border-red-800/50 text-xs font-bold rounded-lg self-start">
                        Emergency Only
                      </div>
                    )}
                    <div className="space-y-1.5 mt-2">
                        <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-zinc-300 font-medium">
                            <Clock className="w-4 h-4 text-slate-400 dark:text-zinc-500" />
                            {avail.FromTime} - {avail.ToTime}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-zinc-300 font-medium">
                            <Users className="w-4 h-4 text-slate-400 dark:text-zinc-500" />
                            Max: {avail.MaxPatients}
                        </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col h-full items-center justify-center text-slate-400 dark:text-zinc-600 py-4 md:py-0">
                     <span className="text-sm font-medium">Off Duty</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      
    </div>
  );
}
