import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/app/lib/auth";
import { updateMyAvailability } from "@/app/actions/doctorAvailability";
import { redirect } from "next/navigation";
import Link from "next/link";

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

export default async function EditSchedulePage() {
  const user = await getCurrentUser();
  if (!user || user.Role !== "DOCTOR") {
    redirect("/login");
  }

  const doctor = await prisma.doctor.findFirst({
    where: { Email: user.Email },
  });

  if (!doctor) {
    return <div className="p-4 text-red-600">Doctor profile not found.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          Update Schedule
        </h1>
        <Link href="/doctor/schedule" className="text-gray-500 hover:text-gray-900 font-medium transition">
          ← Back to Schedule
        </Link>
      </div>

      <form
        action={updateMyAvailability}
        className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 space-y-6"
      >
        <h2 className="text-xl font-bold text-gray-800 border-b border-gray-100 pb-3">
          Add New Availability Slot
        </h2>
        <p className="text-sm text-gray-500">
          Note: This will override existing slots for the selected days. Adding availability makes you bookable for appointments on those days.
        </p>

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
                  className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500 rounded"
                />
                {DAYS[day]}
              </label>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Max Patients (Optional)</label>
            <input
                type="number"
                name="MaxPatients"
                placeholder="Ex. 50"
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">From Time</label>
            <input
              type="time"
              name="FromTime"
              required
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">To Time</label>
            <input
              type="time"
              name="ToTime"
              required
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        <label className="flex items-center gap-3 text-gray-700 font-medium cursor-pointer">
          <input type="checkbox" name="IsEmergencyOnly" className="w-5 h-5 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500" />
          <span>Emergency only</span>
        </label>

        <button type="submit" className="w-full md:w-auto bg-indigo-600 font-medium text-white px-8 py-3 rounded-lg hover:bg-indigo-700 transition shadow-sm mt-4">
          Save Settings
        </button>
      </form>
    </div>
  );
}
