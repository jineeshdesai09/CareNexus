import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/app/lib/auth";
import { redirect } from "next/navigation";
import { createOPD } from "@/app/actions/opd";

export const runtime = "nodejs";

export default async function CreateOPDPage() {
  const user = await getCurrentUser();

  if (!user || user.Role !== "RECEPTIONIST") {
    redirect("/dashboard");
  }

  const patients = await prisma.patient.findMany({
    orderBy: { Created: "desc" },
    select: { PatientID: true, PatientName: true, PatientNo: true },
  });

  const doctors = await prisma.doctor.findMany({
    orderBy: { FirstName: "asc" },
    select: { DoctorID: true, FirstName: true, LastName: true },
  });

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">Create OPD</h1>

      <form
        action={createOPD}
        className="bg-white p-6 rounded-lg shadow space-y-6"
      >
        {/* Patient */}
        <div>
          <label className="block text-sm font-medium mb-2">Patient</label>
          <select
            name="PatientID"
            required
            className="w-full px-4 py-3 bg-gray-50 border rounded-lg"
          >
            <option value="">Select patient</option>
            {patients.map((p) => (
              <option key={p.PatientID} value={p.PatientID}>
                {p.PatientNo} – {p.PatientName}
              </option>
            ))}
          </select>
        </div>

        {/* Doctor */}
        <div>
          <label className="block text-sm font-medium mb-2">Doctor</label>
          <select
            name="DoctorID"
            required
            className="w-full px-4 py-3 bg-gray-50 border rounded-lg"
          >
            <option value="">Select doctor</option>
            {doctors.map((d) => (
              <option key={d.DoctorID} value={d.DoctorID}>
                Dr. {d.FirstName} {d.LastName}
              </option>
            ))}
          </select>
        </div>

        {/* Flags */}
        <div className="flex gap-6">
          <label className="flex items-center gap-2">
            <input type="checkbox" name="IsEmergency" />
            <span>Emergency</span>
          </label>

          <label className="flex items-center gap-2">
            <input type="checkbox" name="IsFollowUpCase" />
            <span>Follow-up</span>
          </label>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium mb-2">Notes</label>
          <textarea
            name="Description"
            rows={3}
            className="w-full px-4 py-3 bg-gray-50 border rounded-lg"
          />
        </div>

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
