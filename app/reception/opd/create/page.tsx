import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "../../../lib/auth";
import { redirect } from "next/navigation";

export const runtime = "nodejs";

export default async function CreateOPDPage() {
  const user = await getCurrentUser();

  if (!user || user.Role !== "RECEPTIONIST") {
    redirect("/dashboard");
  }

  const todayDay = new Date().getDay();

  const doctors = await prisma.doctor.findMany({
    where: {
      Availabilities: {
        some: {
          DayOfWeek: todayDay,
          IsAvailable: true,
        },
      },
    },
    select: {
      DoctorID: true,
      FirstName: true,
      LastName: true,
    },
  });

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">Create OPD</h1>

      <form className="bg-white p-6 rounded-lg shadow space-y-6">
        {/* Doctor dropdown */}
        <div>
          <label className="block text-sm font-medium mb-2">Doctor</label>
          <select
            name="DoctorID"
            required
            className="w-full px-4 py-3 bg-gray-50 border rounded-lg"
          >
            <option value="">Select available doctor</option>
            {doctors.map((doc) => (
              <option key={doc.DoctorID} value={doc.DoctorID}>
                Dr. {doc.FirstName} {doc.LastName}
              </option>
            ))}
          </select>

          {doctors.length === 0 && (
            <p className="text-sm text-red-600 mt-2">
              No doctors available today
            </p>
          )}
        </div>

        {/* (Patient dropdown comes next) */}

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
