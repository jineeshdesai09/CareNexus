import { prisma } from "@/lib/prisma";
import { requireAdmin } from "../../../../lib/auth";
import { createDoctorAvailability } from "@/app/actions/doctorAvailability";
import { notFound } from "next/navigation";

export const runtime = "nodejs";

// Helper for day names
const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export default async function DoctorAvailabilityPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();

  // await params
  const { id } = await params;

  const doctorId = Number(id);
  if (!id || isNaN(doctorId)) {
    notFound();
  }

  const doctor = await prisma.doctor.findUnique({
    where: { DoctorID: doctorId },
    include: { Availabilities: true },
  });

  if (!doctor) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto mt-6">
      <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          Availability – Dr. {doctor.FirstName} {doctor.LastName}
        </h1>
        <a href="/doctors" className="text-gray-500 hover:text-gray-900 font-medium transition">← Back to Master</a>
      </div>

      {/* Existing availability */}
      {doctor.Availabilities.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center text-gray-500 mb-8 shadow-sm">
          No availability added yet.
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-8">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-700 uppercase font-semibold text-xs tracking-wider">
              <tr>
                <th className="px-6 py-4">Day</th>
                <th className="px-6 py-4">From</th>
                <th className="px-6 py-4">To</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {doctor.Availabilities.map((a) => (
                <tr key={a.AvailabilityID} className="hover:bg-gray-50 transition text-gray-800">
                  <td className="px-6 py-4 font-medium text-gray-900">{DAYS[a.DayOfWeek]}</td>
                  <td className="px-6 py-4">{a.FromTime}</td>
                  <td className="px-6 py-4">{a.ToTime}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${a.IsAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {a.IsAvailable ? "Available" : "Unavailable"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add availability */}
      <form
        action={createDoctorAvailability}
        className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 space-y-6"
      >
        <h2 className="text-xl font-bold text-gray-800 border-b border-gray-100 pb-3">Add New Availability</h2>
        <input type="hidden" name="DoctorID" value={doctor.DoctorID} />

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Days</label>
          <div className="flex flex-wrap gap-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
            {[1, 2, 3, 4, 5, 6, 0].map((day) => (
              <label key={day} className="flex items-center gap-2 cursor-pointer text-gray-800 font-medium">
                <input
                  type="checkbox"
                  name="DayOfWeek"
                  value={day}
                  defaultChecked
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 rounded"
                />
                {DAYS[day]}
              </label>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <input
            type="number"
            name="MaxPatients"
            placeholder="Max patients"
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">From Time</label>
            <input
              type="time"
              name="FromTime"
              required
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">To Time</label>
            <input
              type="time"
              name="ToTime"
              required
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <label className="flex items-center gap-3 text-gray-700 font-medium cursor-pointer">
          <input type="checkbox" name="IsEmergencyOnly" className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />
          <span>Emergency only</span>
        </label>

        <button type="submit" className="w-full md:w-auto bg-blue-600 font-medium text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition shadow-sm mt-4">
          Save Availability
        </button>
      </form>
    </div>
  );
}
