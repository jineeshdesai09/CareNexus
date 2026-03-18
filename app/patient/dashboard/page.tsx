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
      <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-2xl text-yellow-800">
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
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome, {patient.PatientName}</h1>
          <p className="text-slate-500">Your health overview and recent activity</p>
        </div>
        <div className="flex items-center gap-4 bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
          <div className="px-4 py-2 text-center border-r border-slate-100">
            <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">Patient ID</p>
            <p className="text-sm font-bold text-slate-900">#{patient.PatientNo}</p>
          </div>
          <div className="px-4 py-2 text-center">
            <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">Age / Gender</p>
            <p className="text-sm font-bold text-slate-900">{patient.Age}y / {patient.Gender}</p>
          </div>
        </div>
      </div>

      {/* Stats/Quick Access */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-4">
            <History className="w-6 h-6" />
          </div>
          <p className="text-slate-500 text-sm font-medium mb-1">Total Visits</p>
          <p className="text-2xl font-bold text-slate-900">
            {await prisma.oPD.count({ where: { PatientID: patient.PatientID } })}
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600 mb-4">
            <Stethoscope className="w-6 h-6" />
          </div>
          <p className="text-slate-500 text-sm font-medium mb-1">Prescriptions</p>
          <p className="text-2xl font-bold text-slate-900">
            {await prisma.prescription.count({ where: { OPD: { PatientID: patient.PatientID } } })}
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 mb-4">
            <Activity className="w-6 h-6" />
          </div>
          <p className="text-slate-500 text-sm font-medium mb-1">Blood Group</p>
          <p className="text-2xl font-bold text-slate-900">{patient.BloodGroup || "Not Set"}</p>
        </div>
      </div>

      {/* Upcoming Appointments */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-500" />
            Upcoming Appointments
          </h2>
          <Link href="/patient/appointments" className="text-sm font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1">
            View All <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="p-6">
          {upcomingAppointments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {upcomingAppointments.map(apt => (
                <div key={apt.OPDID} className="p-4 border border-blue-100 bg-blue-50/50 rounded-xl flex gap-4 items-center">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-blue-600 shadow-sm flex-shrink-0">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">Dr. {apt.Doctor.FirstName} {apt.Doctor.LastName}</h3>
                    <p className="text-sm text-slate-600 mb-1">{apt.Doctor.Specialization}</p>
                    <div className="flex gap-3 text-xs font-medium text-slate-500">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3"/> {formatDate(apt.OPDDateTime)}</span>
                      <span className="flex items-center gap-1"><AlertCircle className="w-3 h-3 text-blue-500"/> Token #{apt.TokenNo}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-slate-500 mb-4">No upcoming appointments scheduled.</p>
              <Link href="/patient/appointments/book" className="inline-flex items-center justify-center gap-2 py-2 px-4 bg-blue-50 text-blue-600 rounded-xl font-bold hover:bg-blue-100 transition-colors">
                Book an Appointment
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Appointments */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden lg:col-span-2">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <History className="w-5 h-5 text-indigo-500" />
              Recent Appointments
            </h2>
            <Link href="/patient/history" className="text-sm font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
              View History <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="p-0">
            {recentAppointments.length > 0 ? (
              <div className="divide-y divide-slate-50">
                {recentAppointments.map(apt => (
                  <div key={apt.OPDID} className="p-6 flex items-center justify-between group hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400">
                        <User className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-base">Dr. {apt.Doctor.FirstName} {apt.Doctor.LastName}</h3>
                        <p className="text-xs text-slate-500 font-medium">{formatDate(apt.OPDDateTime)} • Token #{apt.TokenNo}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`hidden sm:inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        apt.Status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {apt.Status}
                      </span>
                      <Link 
                        href={`/patient/history/${apt.OPDID}`}
                        className="p-2 bg-slate-100 text-slate-400 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-all"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-slate-400">No recent activity found.</p>
              </div>
            )}
          </div>
        </div>

        {/* Medical Vitals */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-red-500" />
              Latest Vitals
            </h2>
          </div>
          <div className="p-6">
            {latestCompletedOPD && (latestCompletedOPD.Weight || latestCompletedOPD.Height || (latestCompletedOPD.BP_Systolic && latestCompletedOPD.BP_Diastolic)) ? (
              <div className="grid grid-cols-1 gap-4">
                <div className="p-4 bg-slate-50 rounded-2xl flex items-center justify-between">
                  <p className="text-xs font-bold text-slate-400 uppercase">Blood Pressure</p>
                  <p className="text-lg font-bold text-slate-900">
                    {latestCompletedOPD.BP_Systolic && latestCompletedOPD.BP_Diastolic 
                      ? `${latestCompletedOPD.BP_Systolic}/${latestCompletedOPD.BP_Diastolic}` 
                      : "--"}
                  </p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl flex items-center justify-between">
                  <p className="text-xs font-bold text-slate-400 uppercase">Weight</p>
                  <p className="text-lg font-bold text-slate-900">{latestCompletedOPD.Weight ? `${latestCompletedOPD.Weight} kg` : "--"}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl flex items-center justify-between">
                  <p className="text-xs font-bold text-slate-400 uppercase">Height</p>
                  <p className="text-lg font-bold text-slate-900">{latestCompletedOPD.Height ? `${latestCompletedOPD.Height} cm` : "--"}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl flex items-center justify-between">
                  <p className="text-xs font-bold text-slate-400 uppercase">SpO2</p>
                  <p className="text-lg font-bold text-slate-900">{latestCompletedOPD.SpO2 ? `${latestCompletedOPD.SpO2}%` : "--"}</p>
                </div>
                <p className="text-[10px] text-slate-400 text-center mt-2 italic">
                  Last updated: {formatDate(latestCompletedOPD.OPDDateTime)}
                </p>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mx-auto mb-3">
                  <Activity className="w-6 h-6" />
                </div>
                <p className="text-slate-400 text-sm">No vitals recorded yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
