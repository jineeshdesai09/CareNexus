import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "../../../lib/auth";
import { redirect } from "next/navigation";

export const runtime = "nodejs";

export default async function CreateOPDPage() {
  const user = await getCurrentUser();

  if (!user || user.Role !== "RECEPTIONIST") {
    redirect("/dashboard");
  }

  const patients = await prisma.patient.findMany({
    orderBy: { Created: "desc" },
    select: {
      PatientID: true,
      PatientName: true,
      MobileNo: true,
    },
  });

  const doctors = await prisma.doctor.findMany({
    orderBy: { DoctorName: "asc" },
    select: {
      DoctorID: true,
      DoctorName: true,
    },
  });

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl text-gray-900 font-bold mb-6">Create OPD</h1>

      <form className="bg-white p-6 rounded-lg shadow space-y-6">
        {/* Patient */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">Patient</label>
          <select
            name="PatientID"
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg 
                  focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder:text-gray-400"
            required
          >
            <option value="">Select patient</option>
            {patients.map((p) => (
              <option key={p.PatientID} value={p.PatientID}>
                {p.PatientName} ({p.MobileNo})
              </option>
            ))}
          </select>
        </div>

        {/* Doctor */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">Doctor</label>
          <select
            name="DoctorID"
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg 
                  focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder:text-gray-400"
            required
          >
            <option value="">Select doctor</option>
            {doctors.map((d) => (
              <option key={d.DoctorID} value={d.DoctorID}>
                {d.DoctorName}
              </option>
            ))}
          </select>
        </div>

        {/* Flags */}
        <div className="flex gap-6">
          <label className="flex items-center gap-2">
            <input type="checkbox" />
            <span className="block text-sm font-medium text-gray-900">Emergency</span>
          </label>

          <label className="flex items-center gap-2">
            <input type="checkbox" />
            <span className="block text-sm font-medium text-gray-900" >Follow-up</span>
          </label>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Notes / Description
          </label>
          <textarea
            rows={3}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg 
                  focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder:text-gray-400"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
        >
          Create OPD
        </button>
      </form>
    </div>
  );
}
