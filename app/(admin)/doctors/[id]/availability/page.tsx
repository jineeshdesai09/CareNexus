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
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">
        Availability – Dr. {doctor.FirstName} {doctor.LastName}
      </h1>

      {/* Existing availability */}
      {doctor.Availabilities.length === 0 ? (
        <p className="text-gray-500 mb-6">No availability added yet.</p>
      ) : (
        <table className="w-full border rounded mb-8">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Day</th>
              <th className="p-2 border">From</th>
              <th className="p-2 border">To</th>
              <th className="p-2 border">Status</th>
            </tr>
          </thead>
          <tbody>
            {doctor.Availabilities.map((a) => (
              <tr key={a.AvailabilityID}>
                <td className="p-2 border">{DAYS[a.DayOfWeek]}</td>
                <td className="p-2 border">{a.FromTime}</td>
                <td className="p-2 border">{a.ToTime}</td>
                <td className="p-2 border">
                  {a.IsAvailable ? "Available" : "Unavailable"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Add availability */}
      <form
        action={createDoctorAvailability}
        className="bg-white p-6 rounded shadow space-y-4"
      >
        <input type="hidden" name="DoctorID" value={doctor.DoctorID} />

        <select name="DayOfWeek" required className="w-full border p-2 rounded">
          <option value="">Select day</option>
          <option value="1">Monday</option>
          <option value="2">Tuesday</option>
          <option value="3">Wednesday</option>
          <option value="4">Thursday</option>
          <option value="5">Friday</option>
          <option value="6">Saturday</option>
        </select>

        <div className="flex gap-4">
          <input
            type="time"
            name="FromTime"
            required
            className="border p-2 rounded w-full"
          />
          <input
            type="time"
            name="ToTime"
            required
            className="border p-2 rounded w-full"
          />
        </div>

        <input
          type="number"
          name="MaxPatients"
          placeholder="Max patients"
          className="border p-2 rounded w-full"
        />

        <label className="flex items-center gap-2">
          <input type="checkbox" name="IsEmergencyOnly" />
          <span>Emergency only</span>
        </label>

        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Save Availability
        </button>
      </form>
    </div>
  );
}
