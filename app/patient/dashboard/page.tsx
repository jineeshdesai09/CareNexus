import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "../../lib/auth";
import { redirect } from "next/navigation";
import { 
  History, 
  Activity, 
  Stethoscope, 
  Clock, 
  Calendar,
  ChevronRight,
  User,
  AlertCircle
} from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/app/lib/utils/date";

export const runtime = "nodejs";

export default async function PatientDashboard() {
  const user = await getCurrentUser();

  if (!user || user.Role !== "PATIENT") {
    redirect("/login");
  }

  // Find the patient record associated with this user
  const patient = await prisma.patient.findFirst({
    where: { UserID: user.UserID },
  });

  if (!patient) {
    return (
      <div className="p-6 bg-yellow-50 dark:bg-amber-900/20 border border-yellow-200 dark:border-amber-800/50 rounded-2xl text-yellow-800 dark:text-amber-400">
        <h2 className="text-lg font-bold flex items-center gap-2 mb-2">
          <User className="w-5 h-5" />
          Profile Not Linked
        </h2>
        <p>Your user account is not yet linked to a patient profile. Please contact the hospital reception to link your account using your Patient ID.</p>
      </div>
    );
  }

  // Get the latest completed OPD visit for vitals
  const latestCompletedOPD = await prisma.oPD.findFirst({
    where: { 
      PatientID: patient.PatientID,
      Status: { in: ["COMPLETED", "BILLED", "CLOSED"] }
    },
    orderBy: [
      { OPDDateTime: "desc" },
      { OPDID: "desc" }
    ],
  });

  // Get upcoming appointments
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const upcomingAppointments = await prisma.oPD.findMany({
    where: {
      PatientID: patient.PatientID,
      OPDDateTime: { gte: today },
      Status: { in: ["REGISTERED", "WAITING"] }
    },
    include: { Doctor: true },
    orderBy: [
      { OPDDateTime: "asc" },
      { OPDID: "asc" }
    ],
    take: 2
  });

  // Get recent appointments (last 5, regardless of status, excluding upcoming)
  const recentAppointments = await prisma.oPD.findMany({
    where: {
      PatientID: patient.PatientID,
      NOT: {
        AND: [
          { Status: { in: ["REGISTERED", "WAITING"] } },
          { OPDDateTime: { gte: today } }
        ]
      }
    },
    include: { Doctor: true },
    orderBy: [
      { OPDDateTime: "desc" },
      { OPDID: "desc" }
    ],
    take: 5
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-zinc-50 mb-2">Welcome, {patient.PatientName}</h1>
          <p className="text-slate-500 dark:text-zinc-400">Your health overview and recent activity</p>
        </div>
        <div className="flex items-center gap-4 bg-white dark:bg-zinc-900 p-2 rounded-2xl shadow-sm border border-slate-100 dark:border-zinc-800">
          <div className="px-4 py-2 text-center border-r border-slate-100 dark:border-zinc-800">
            <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">Patient ID</p>
            <p className="text-sm font-bold text-slate-900 dark:text-zinc-100">#{patient.PatientNo}</p>
          </div>
          <div className="px-4 py-2 text-center">
            <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">Age / Gender</p>
            <p className="text-sm font-bold text-slate-900 dark:text-zinc-100">{patient.Age}y / {patient.Gender}</p>
          </div>
        </div>
      </div>

      {/* Stats/Quick Access */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm dark:shadow-none border border-slate-100 dark:border-zinc-800 hover:shadow-md dark:hover:border-zinc-700 transition-all">
          <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/20 rounded-xl flex items-center justify-center text-teal-600 dark:text-teal-400 mb-4 border border-teal-200 dark:border-teal-800/50">
            <History className="w-6 h-6" />
          </div>
          <p className="text-slate-500 dark:text-zinc-400 text-sm font-medium mb-1">Total Visits</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-zinc-50">
            {await prisma.oPD.count({ where: { PatientID: patient.PatientID } })}
          </p>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm dark:shadow-none border border-slate-100 dark:border-zinc-800 hover:shadow-md dark:hover:border-zinc-700 transition-all">
          <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-xl flex items-center justify-center text-green-600 dark:text-green-400 mb-4 border border-green-200 dark:border-green-800/50">
            <Stethoscope className="w-6 h-6" />
          </div>
          <p className="text-slate-500 dark:text-zinc-400 text-sm font-medium mb-1">Prescriptions</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-zinc-50">
            {await prisma.prescription.count({ where: { OPD: { PatientID: patient.PatientID } } })}
          </p>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm dark:shadow-none border border-slate-100 dark:border-zinc-800 hover:shadow-md dark:hover:border-zinc-700 transition-all">
          <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-xl flex items-center justify-center text-purple-600 dark:text-purple-400 mb-4 border border-purple-200 dark:border-purple-800/50">
            <Activity className="w-6 h-6" />
          </div>
          <p className="text-slate-500 dark:text-zinc-400 text-sm font-medium mb-1">Blood Group</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-zinc-50">{patient.BloodGroup || "Not Set"}</p>
        </div>
      </div>

      {/* Upcoming Appointments */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm dark:shadow-none border border-slate-100 dark:border-zinc-800 overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-zinc-800 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-zinc-50 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-teal-500 dark:text-teal-400" />
            Upcoming Appointments
          </h2>
          <Link href="/patient/appointments" className="text-sm font-bold text-teal-600 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-300 flex items-center gap-1">
            View All <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="p-6">
          {upcomingAppointments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {upcomingAppointments.map(apt => (
                <div key={apt.OPDID} className="p-4 border border-teal-100 dark:border-teal-900/50 bg-teal-50/50 dark:bg-teal-900/20 rounded-xl flex gap-4 items-center">
                  <div className="w-12 h-12 bg-white dark:bg-zinc-950 rounded-full flex items-center justify-center text-teal-600 dark:text-teal-400 shadow-sm border border-slate-100 dark:border-zinc-800 flex-shrink-0">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-zinc-100">Dr. {apt.Doctor.FirstName} {apt.Doctor.LastName}</h3>
                    <p className="text-sm text-slate-600 dark:text-zinc-400 mb-1">{apt.Doctor.Specialization}</p>
                    <div className="flex gap-3 text-xs font-medium text-slate-500 dark:text-zinc-500">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3"/> {formatDate(apt.OPDDateTime)}</span>
                      <span className="flex items-center gap-1"><AlertCircle className="w-3 h-3 text-teal-500 dark:text-teal-400"/> Token #{apt.TokenNo}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-slate-500 dark:text-zinc-500 mb-4">No upcoming appointments scheduled.</p>
              <Link href="/patient/appointments/book" className="inline-flex items-center justify-center gap-2 py-2 px-4 bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400 rounded-xl font-bold hover:bg-teal-100 dark:hover:bg-teal-900/40 transition-colors">
                Book an Appointment
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Appointments */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm dark:shadow-none border border-slate-100 dark:border-zinc-800 overflow-hidden lg:col-span-2">
          <div className="p-6 border-b border-slate-100 dark:border-zinc-800 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-zinc-50 flex items-center gap-2">
              <History className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
              Recent Appointments
            </h2>
            <Link href="/patient/history" className="text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 flex items-center gap-1">
              View History <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="p-0">
            {recentAppointments.length > 0 ? (
              <div className="divide-y divide-slate-50 dark:divide-zinc-800">
                {recentAppointments.map(apt => (
                  <div key={apt.OPDID} className="p-6 flex items-center justify-between group hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-100 dark:bg-zinc-800 rounded-xl flex items-center justify-center text-slate-400 dark:text-zinc-500 border border-transparent dark:border-zinc-700">
                        <User className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 dark:text-zinc-100 text-base">Dr. {apt.Doctor.FirstName} {apt.Doctor.LastName}</h3>
                        <p className="text-xs text-slate-500 dark:text-zinc-400 font-medium">{formatDate(apt.OPDDateTime)} • Token #{apt.TokenNo}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`hidden sm:inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        apt.Status === 'COMPLETED' ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400' : 'bg-teal-100 dark:bg-teal-900/20 text-teal-700 dark:text-teal-400'
                      }`}>
                        {apt.Status}
                      </span>
                      <Link 
                        href={`/patient/history/${apt.OPDID}`}
                        className="p-2 bg-slate-100 dark:bg-zinc-800 text-slate-400 dark:text-zinc-400 rounded-lg group-hover:bg-teal-600 dark:group-hover:bg-teal-500 group-hover:text-white transition-all"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-slate-400 dark:text-zinc-500">No recent activity found.</p>
              </div>
            )}
          </div>
        </div>

        {/* Medical Vitals */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm dark:shadow-none border border-slate-100 dark:border-zinc-800 overflow-hidden">
          <div className="p-6 border-b border-slate-100 dark:border-zinc-800">
            <h2 className="text-lg font-bold text-slate-900 dark:text-zinc-50 flex items-center gap-2">
              <Activity className="w-5 h-5 text-red-500 dark:text-red-400" />
              Latest Vitals
            </h2>
          </div>
          <div className="p-6">
            {latestCompletedOPD && (latestCompletedOPD.Weight || latestCompletedOPD.Height || (latestCompletedOPD.BP_Systolic && latestCompletedOPD.BP_Diastolic)) ? (
              <div className="grid grid-cols-1 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-zinc-950 rounded-2xl flex items-center justify-between border border-transparent dark:border-zinc-800">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Blood Pressure</p>
                  <p className="text-lg font-bold text-slate-900 dark:text-zinc-100">
                    {latestCompletedOPD.BP_Systolic && latestCompletedOPD.BP_Diastolic 
                      ? `${latestCompletedOPD.BP_Systolic}/${latestCompletedOPD.BP_Diastolic}` 
                      : "--"}
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-zinc-950 rounded-2xl flex items-center justify-between border border-transparent dark:border-zinc-800">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Weight</p>
                  <p className="text-lg font-bold text-slate-900 dark:text-zinc-100">{latestCompletedOPD.Weight ? `${latestCompletedOPD.Weight} kg` : "--"}</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-zinc-950 rounded-2xl flex items-center justify-between border border-transparent dark:border-zinc-800">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Height</p>
                  <p className="text-lg font-bold text-slate-900 dark:text-zinc-100">{latestCompletedOPD.Height ? `${latestCompletedOPD.Height} cm` : "--"}</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-zinc-950 rounded-2xl flex items-center justify-between border border-transparent dark:border-zinc-800">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">SpO2</p>
                  <p className="text-lg font-bold text-slate-900 dark:text-zinc-100">{latestCompletedOPD.SpO2 ? `${latestCompletedOPD.SpO2}%` : "--"}</p>
                </div>
                <p className="text-[10px] text-slate-400 dark:text-zinc-500 text-center mt-2 italic">
                  Last updated: {formatDate(latestCompletedOPD.OPDDateTime)}
                </p>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-12 h-12 bg-slate-50 dark:bg-zinc-800 rounded-full flex items-center justify-center text-slate-200 dark:text-zinc-600 mx-auto mb-3">
                  <Activity className="w-6 h-6" />
                </div>
                <p className="text-slate-400 dark:text-zinc-500 text-sm">No vitals recorded yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
