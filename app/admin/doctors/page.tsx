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
      <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Doctor Master</h1>

        <Link
          href="/admin/doctors/create"
          className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition font-medium text-sm shadow-sm"
        >
          + Add Doctor
        </Link>
      </div>

      {/* Empty state */}
      {doctors.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center shadow-sm">
          <p className="text-gray-500 font-medium">No doctors added yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-700 uppercase font-semibold text-xs tracking-wider">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4 text-center">Department</th>
                <th className="px-6 py-4 text-center">Specialization</th>
                <th className="px-6 py-4 text-center">Mobile</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {doctors.map((d) => (
                <tr key={d.DoctorID} className="hover:bg-gray-50 transition text-gray-800">
                  <td className="px-6 py-4 font-medium text-gray-900">
                    Dr. {d.FirstName} {d.LastName}
                  </td>
                  <td className="px-6 py-4 text-center text-gray-600">{d.Department}</td>
                  <td className="px-6 py-4 text-center text-gray-600">{d.Specialization}</td>
                  <td className="px-6 py-4 text-center font-medium text-gray-700">{d.MobileNo}</td>

                  {/* ✅ Actions */}
                  <td className="px-6 py-4 text-center space-x-4">
                    <Link
                      href={`/admin/doctors/edit/${d.DoctorID}`}
                      className="text-blue-600 hover:text-blue-800 font-medium transition"
                    >
                      Edit
                    </Link>

                    <Link
                      href={`/doctors/${d.DoctorID}/availability`}
                      className="text-green-600 hover:text-green-800 font-medium transition"
                    >
                      Availability
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
