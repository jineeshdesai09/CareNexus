import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { requireAdmin } from "../../lib/auth";

export default async function DoctorListPage() {
  await requireAdmin();

  const doctors = await prisma.doctor.findMany({
    orderBy: { Created: "desc" },
  });

  return (
    <div className="max-w-6xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Doctor Master</h1>

        <Link
          href="/doctors/create"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Add Doctor
        </Link>
      </div>

      {/* Empty state */}
      {doctors.length === 0 ? (
        <p className="text-gray-500">No doctors added yet.</p>
      ) : (
        <table className="w-full border rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3">Department</th>
              <th className="p-3">Specialization</th>
              <th className="p-3">Mobile</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {doctors.map((d) => (
              <tr key={d.DoctorID} className="border-t">
                <td className="p-3">
                  Dr. {d.FirstName} {d.LastName}
                </td>
                <td className="p-3 text-center">{d.Department}</td>
                <td className="p-3 text-center">{d.Specialization}</td>
                <td className="p-3 text-center">{d.MobileNo}</td>

                {/* ✅ Actions */}
                <td className="p-3 text-center space-x-4">
                  <Link
                    href={`/doctors/edit/${d.DoctorID}`}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </Link>

                  <Link
                    href={`/doctors/${d.DoctorID}/availability`}
                    className="text-green-600 hover:underline"
                  >
                    Availability
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
