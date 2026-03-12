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
  User 
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

  // Get the latest OPD visit
  const latestOPD = await prisma.oPD.findFirst({
    where: { PatientID: patient.PatientID },
    orderBy: { OPDDateTime: "desc" },
    include: {
      Doctor: true,
    },
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Latest Visit */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-500" />
              Latest Consultation
            </h2>
            {latestOPD && (
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                latestOPD.Status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
              }`}>
                {latestOPD.Status}
              </span>
            )}
          </div>
          <div className="p-6">
            {latestOPD ? (
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400">
                    <User className="w-8 h-8" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">Treated By</p>
                    <p className="text-lg font-bold text-slate-900">Dr. {latestOPD.Doctor.FirstName} {latestOPD.Doctor.LastName}</p>
                    <p className="text-sm text-slate-500">{latestOPD.Doctor.Specialization}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 py-4 border-t border-slate-50">
                  <div>
                    <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">Date</p>
                    <p className="font-bold text-slate-900">{formatDate(latestOPD.OPDDateTime)}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Token No</p>
                    <p className="font-bold text-slate-900">#{latestOPD.TokenNo}</p>
                  </div>
                </div>

                <Link 
                  href={`/patient/history/${latestOPD.OPDID}`}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors"
                >
                  View Full Summary
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-slate-400">No consultation records found.</p>
              </div>
            )}
          </div>
        </div>

        {/* Medical Vitals (if available from last visit) */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-red-500" />
              Latest Vitals
            </h2>
          </div>
          <div className="p-6">
            {latestOPD && (latestOPD.Weight || latestOPD.Height || (latestOPD.BP_Systolic && latestOPD.BP_Diastolic)) ? (
              <div className="grid grid-cols-2 gap-6">
                <div className="p-4 bg-slate-50 rounded-2xl">
                  <p className="text-xs font-bold text-slate-400 uppercase mb-1">BP</p>
                  <p className="text-lg font-bold text-slate-900">
                    {latestOPD.BP_Systolic && latestOPD.BP_Diastolic 
                      ? `${latestOPD.BP_Systolic}/${latestOPD.BP_Diastolic}` 
                      : "--"}
                  </p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl">
                  <p className="text-xs font-bold text-slate-400 uppercase mb-1">Weight</p>
                  <p className="text-lg font-bold text-slate-900">{latestOPD.Weight ? `${latestOPD.Weight} kg` : "--"}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl">
                  <p className="text-xs font-bold text-slate-400 uppercase mb-1">Height</p>
                  <p className="text-lg font-bold text-slate-900">{latestOPD.Height ? `${latestOPD.Height} cm` : "--"}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl">
                  <p className="text-xs font-bold text-slate-400 uppercase mb-1">SpO2</p>
                  <p className="text-lg font-bold text-slate-900">{latestOPD.SpO2 ? `${latestOPD.SpO2}%` : "--"}</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-slate-400">No vitals recorded in your latest visit.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
