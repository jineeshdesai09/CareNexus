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
      <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
          <CalendarDays className="w-8 h-8 text-indigo-600" />
          Schedule – Dr. {doctor.FirstName} {doctor.LastName}
        </h1>
        <Link href="/admin/doctors" className="text-gray-500 hover:text-gray-900 font-medium transition flex items-center gap-2">
          ← Back to Master
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-8">
        <div className="grid grid-cols-1 md:grid-cols-7 border-b border-gray-100 bg-gray-50/50 hidden md:grid">
          {DAYS.map((day, idx) => {
            const isToday = new Date().getDay() === idx;
            return (
              <div key={day} className={`p-4 text-center border-r border-gray-100 last:border-r-0 ${isToday ? 'bg-indigo-50 border-b-2 border-b-indigo-500' : ''}`}>
                <span className={`text-sm font-bold uppercase tracking-wider ${isToday ? 'text-indigo-700' : 'text-gray-500'}`}>
                  {day.slice(0,3)}
                </span>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-7 divide-y md:divide-y-0 md:divide-x divide-gray-100">
          {DAYS.map((dayText, idx) => {
            const avail = scheduleMap.get(idx);
            const isToday = new Date().getDay() === idx;
            
            return (
              <div key={idx} className={`p-4 md:min-h-[160px] flex flex-col ${isToday ? 'bg-indigo-50/30' : ''} ${!avail || !avail.IsAvailable ? 'bg-gray-50/50' : ''}`}>
                {/* Mobile Day Header */}
                <div className="md:hidden font-bold text-gray-700 mb-2">{dayText}</div>

                {avail && avail.IsAvailable ? (
                  <div className="flex flex-col h-full justify-center space-y-3">
                    <div className="inline-block px-2.5 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-lg self-start">
                      Available
                    </div>
                    {avail.IsEmergencyOnly && (
                      <div className="inline-block px-2.5 py-1 bg-red-100 text-red-800 text-xs font-bold rounded-lg self-start">
                        Emergency Only
                      </div>
                    )}
                    <div className="space-y-1.5 mt-2">
                        <div className="flex items-center gap-2 text-sm text-gray-700 font-medium">
                            <Clock className="w-4 h-4 text-gray-400" />
                            {avail.FromTime} - {avail.ToTime}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-700 font-medium">
                            <Users className="w-4 h-4 text-gray-400" />
                            Max: {avail.MaxPatients} patients
                        </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col h-full items-center justify-center text-gray-400 py-4 md:py-0">
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
