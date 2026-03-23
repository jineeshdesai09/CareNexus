import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { requireAdmin } from "../../lib/auth";

export default async function DoctorListPage() {
  await requireAdmin();

  const doctors = await prisma.doctor.findMany({
    orderBy: { Created: "desc" },
  });

  return (
    <div className="max-w-6xl animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 border-b border-gray-200 dark:border-zinc-800 pb-4">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-zinc-50 tracking-tight">Doctor Master</h1>

        <Link
          href="/admin/doctors/create"
          className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition font-medium text-sm shadow-sm"
        >
          + Add Doctor
        </Link>
      </div>

      {/* Empty state */}
      {doctors.length === 0 ? (
        <div className="bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-800 p-12 text-center shadow-sm">
          <p className="text-gray-500 dark:text-zinc-400 font-medium">No doctors added yet.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 dark:bg-zinc-950/50 border-b border-gray-200 dark:border-zinc-800 text-gray-700 dark:text-zinc-400 uppercase font-bold text-xs tracking-wider">
                <tr>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4 text-center">Department</th>
                  <th className="px-6 py-4 text-center">Specialization</th>
                  <th className="px-6 py-4 text-center">Mobile</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                {doctors.map((d) => (
                  <tr key={d.DoctorID} className="hover:bg-gray-50/50 dark:hover:bg-zinc-800/30 transition text-gray-800 dark:text-zinc-100">
                    <td className="px-6 py-4 font-bold text-gray-900 dark:text-zinc-50">
                      Dr. {d.FirstName} {d.LastName}
                    </td>
                    <td className="px-6 py-4 text-center text-gray-600 dark:text-zinc-400 font-medium">{d.Department}</td>
                    <td className="px-6 py-4 text-center text-gray-600 dark:text-zinc-400 font-medium">{d.Specialization}</td>
                    <td className="px-6 py-4 text-center font-bold text-gray-700 dark:text-zinc-300">{d.MobileNo}</td>

                    {/* ✅ Actions */}
                    <td className="px-6 py-4 text-center space-x-4">
                      <Link
                        href={`/admin/doctors/edit/${d.DoctorID}`}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-bold transition"
                      >
                        Edit
                      </Link>

                      <Link
                        href={`/admin/doctors/${d.DoctorID}/schedule`}
                        className="text-green-600 dark:text-green-500 hover:text-green-800 dark:hover:text-green-400 font-bold transition"
                      >
                        View Schedule
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
