import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/app/lib/auth";
import { redirect } from "next/navigation";
import { createOPD } from "@/app/actions/opd";
import PatientSearch from "./PatientSearch";
import { Calendar, UserCircle, Stethoscope, AlertCircle, FileText } from "lucide-react";
import Link from "next/link";

export const runtime = "nodejs";

export default async function CreateOPDPage() {
  const user = await getCurrentUser();

  if (!user || user.Role !== "RECEPTIONIST") {
    redirect("/login");
  }

  const doctors = await prisma.doctor.findMany({
    orderBy: { FirstName: "asc" },
    select: { DoctorID: true, FirstName: true, LastName: true, Specialization: true },
  });

  return (
    <div className="max-w-4xl mx-auto p-4 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Create New OPD</h1>
          <p className="text-gray-500 mt-1">Register a patient for doctor consultation</p>
        </div>
        <Link href="/reception/dashboard" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition">
          ← Back to Dashboard
        </Link>
      </div>

      <form action={createOPD} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Patient & Doctor Selection */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-8">
            {/* Patient Search Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <span className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                  <UserCircle className="w-5 h-5" />
                </span>
                <h2 className="text-xl font-bold text-gray-800">Patient Selection</h2>
              </div>
              <PatientSearch />
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex items-center justify-between">
                <span className="text-sm text-gray-500 italic">New patient? Register them first.</span>
                <Link
                  href="/reception/patients/create"
                  className="text-sm font-bold text-blue-600 hover:text-blue-700 underline"
                >
                  Register New Patient
                </Link>
              </div>
            </div>

            {/* Doctor Selection Section */}
            <div className="space-y-4 pt-6 border-t border-gray-50">
              <div className="flex items-center gap-2 mb-4">
                <span className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                  <Stethoscope className="w-5 h-5" />
                </span>
                <h2 className="text-xl font-bold text-gray-800">Consulting Doctor</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {doctors.map((d) => (
                  <label key={d.DoctorID} className="relative flex items-center p-4 border rounded-xl cursor-pointer hover:bg-indigo-50/50 transition border-gray-200 has-[:checked]:border-indigo-600 has-[:checked]:bg-indigo-50 group">
                    <input
                      type="radio"
                      name="DoctorID"
                      value={d.DoctorID}
                      required
                      className="sr-only"
                    />
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold">
                        {d.FirstName[0]}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 group-hover:text-indigo-900 transition">Dr. {d.FirstName} {d.LastName}</p>
                        <p className="text-xs text-gray-500">{d.Specialization}</p>
                      </div>
                    </div>
                    <div className="absolute top-4 right-4 h-4 w-4 rounded-full border border-gray-300 group-hover:border-indigo-400 group-has-[:checked]:border-4 group-has-[:checked]:border-indigo-600 transition-all"></div>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Configuration & Action */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-4 h-4 text-orange-500" />
              <h3 className="font-bold text-gray-800">Visit Info</h3>
            </div>

            <div className="space-y-4">
              <label className="flex items-center justify-between p-4 bg-red-50/50 border border-red-100 rounded-xl cursor-pointer hover:bg-red-50 transition group">
                <div className="flex items-center gap-3">
                  <span className="text-xl">🚨</span>
                  <span className="font-bold text-red-900">Emergency</span>
                </div>
                <input type="checkbox" name="IsEmergency" className="h-5 w-5 rounded border-red-300 text-red-600 focus:ring-red-500" />
              </label>

              <label className="flex items-center justify-between p-4 bg-blue-50/50 border border-blue-100 rounded-xl cursor-pointer hover:bg-blue-50 transition group">
                <div className="flex items-center gap-3">
                  <span className="text-xl">🔄</span>
                  <span className="font-bold text-blue-900">Follow-up Visit</span>
                </div>
                <input type="checkbox" name="IsFollowUpCase" className="h-5 w-5 rounded border-blue-300 text-blue-600 focus:ring-blue-500" />
              </label>
            </div>

            <div className="pt-4">
              <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-1">
                <FileText className="w-3 h-3" /> Brief Complaints
              </label>
              <textarea
                name="Description"
                rows={3}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                placeholder="Enter patient complaints..."
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white px-6 py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition shadow-lg shadow-blue-200 active:scale-[0.98]"
            >
              Confirm Registration
            </button>
          </div>

          <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
            <p className="text-xs text-amber-800 leading-relaxed font-medium">
              * Tokens are automatically generated based on the current queue and emergency status.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
