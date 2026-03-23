import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/app/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { CalendarDays, Clock, Users, ArrowRight, AlertCircle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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

export default async function DoctorSchedulePage() {
  const user = await getCurrentUser();
  if (!user || user.Role !== "DOCTOR") {
    redirect("/login");
  }

  const doctor = await prisma.doctor.findFirst({
    where: { Email: user.Email },
    include: {
      Availabilities: {
        orderBy: { DayOfWeek: "asc" }
      }
    },
  });

  if (!doctor) {
    return <div className="p-4 text-rose-600">Doctor profile not found.</div>;
  }

  // Create a map for all 7 days for calendar view
  const scheduleMap = new Map();
  DAYS.forEach((day, index) => scheduleMap.set(index, null));
  
  doctor.Availabilities.forEach((avail) => {
    scheduleMap.set(avail.DayOfWeek, avail);
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12 pt-2">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-zinc-800 pb-6">
        <div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-zinc-50 tracking-tight flex items-center gap-3">
                My Weekly Schedule
            </h1>
            <p className="text-slate-500 dark:text-zinc-400 mt-1 font-medium text-sm">
                View and manage your consultation days and patient limits.
            </p>
        </div>
        <Link 
            href="/doctor/schedule/edit" 
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-600 text-white rounded-xl text-sm font-bold shadow-sm hover:bg-teal-700 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 target:ring-2 active:scale-95"
        >
            <CalendarDays className="w-4 h-4" />
            Update Schedule
        </Link>
      </div>

      <Card className="border-none ring-1 ring-slate-200 dark:ring-zinc-800 shadow-md overflow-hidden bg-white dark:bg-zinc-900">
        <div className="grid grid-cols-1 lg:grid-cols-7 border-b border-slate-100 dark:border-zinc-800/50 bg-slate-50 dark:bg-zinc-950 hidden lg:grid">
          {DAYS.map((day, idx) => {
            const isToday = new Date().getDay() === idx;
            return (
              <div key={day} className={`p-4 text-center border-r last:border-r-0 border-slate-100 dark:border-zinc-800/50 ${isToday ? 'bg-teal-50 dark:bg-teal-900/10' : ''}`}>
                <span className={`text-xs font-bold uppercase tracking-widest ${isToday ? 'text-teal-600 dark:text-teal-400' : 'text-slate-500 dark:text-zinc-500'}`}>
                  {day.slice(0,3)}
                </span>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-7 divide-y lg:divide-y-0 lg:divide-x divide-slate-100 dark:divide-zinc-800/50">
          {DAYS.map((dayText, idx) => {
            const avail = scheduleMap.get(idx);
            const isToday = new Date().getDay() === idx;
            
            return (
              <div key={idx} className={`p-5 lg:p-4 lg:min-h-[180px] flex flex-col transition-colors hover:bg-slate-50/50 dark:hover:bg-zinc-800/30 ${isToday ? 'bg-teal-50/30 dark:bg-teal-900/5 lg:border-b-2 lg:border-teal-500 ring-inset' : ''} ${!avail || !avail.IsAvailable ? 'bg-slate-50/30 dark:bg-zinc-950/30' : ''}`}>
                {/* Mobile Day Header */}
                <div className="lg:hidden flex items-center justify-between mb-4 pb-2 border-b border-slate-100 dark:border-zinc-800">
                    <span className={`text-sm font-bold uppercase tracking-widest ${isToday ? 'text-teal-600 dark:text-teal-400' : 'text-slate-600 dark:text-zinc-400'}`}>{dayText}</span>
                    {isToday && <span className="px-2 py-0.5 bg-teal-100 text-teal-700 text-[9px] font-bold uppercase tracking-wider rounded">Today</span>}
                </div>

                {avail && avail.IsAvailable ? (
                  <div className="flex flex-col h-full justify-start space-y-4">
                    <div className="flex flex-wrap gap-2">
                        <span className="inline-block px-2.5 py-1 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800/50 text-[10px] font-bold uppercase tracking-widest rounded-md shadow-sm">
                        Available
                        </span>
                        {avail.IsEmergencyOnly && (
                        <span className="inline-block px-2.5 py-1 bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 border border-rose-100 dark:border-rose-800/50 text-[10px] font-bold uppercase tracking-widest rounded-md shadow-sm">
                            Emg Only
                        </span>
                        )}
                    </div>

                    <div className="space-y-2 mt-auto">
                        <div className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-zinc-950 rounded-lg border border-slate-100 dark:border-zinc-800">
                            <Clock className="w-3.5 h-3.5 text-teal-500 shrink-0" />
                            <span className="text-xs font-bold text-slate-700 dark:text-zinc-300 tracking-tight leading-none pt-0.5">{avail.FromTime} - {avail.ToTime}</span>
                        </div>
                        <div className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-zinc-950 rounded-lg border border-slate-100 dark:border-zinc-800">
                            <Users className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                            <span className="text-xs font-bold text-slate-700 dark:text-zinc-300 tracking-tight leading-none pt-0.5">Cap: {avail.MaxPatients}</span>
                        </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col h-full items-center justify-center text-slate-400 dark:text-zinc-600 py-6 lg:py-0">
                     <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center mb-2">
                         <span className="block w-2 h-0.5 bg-slate-300 dark:bg-zinc-600 rounded-full"></span>
                     </div>
                     <span className="text-[10px] font-bold uppercase tracking-widest">Off Duty</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>
      
      <div className="flex justify-end">
          <p className="text-xs text-slate-500 dark:text-zinc-500 font-medium italic flex items-center gap-2">
             <AlertCircle className="w-3.5 h-3.5" />
             Appointments map dynamically to this weekly rotation.
          </p>
      </div>
    </div>
  );
}
