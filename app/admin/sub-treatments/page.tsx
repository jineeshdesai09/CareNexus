import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { requireAdmin } from "../../lib/auth";

export const runtime = "nodejs";

export default async function SubTreatmentsPage({
  searchParams,
}: {
  searchParams?: Promise<{ success?: string }>;
}) {
  await requireAdmin();
  const params = await searchParams;

  const subTreatments = await prisma.subTreatmentType.findMany({
    include: {
      TreatmentType: true,
    },
    orderBy: { SubTreatmentTypeName: "asc" },
  });

  return (
    <div className="max-w-6xl mx-auto p-4 animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-6 border-b border-gray-200 dark:border-zinc-800 pb-4">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-zinc-50 tracking-tight">Sub-Treatment Master</h1>

        <Link
          href="/admin/sub-treatments/create"
          className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition font-medium text-sm shadow-sm"
        >
          + Add Sub-Treatment
        </Link>
      </div>

      {params?.success && (
        <div className="mb-4 rounded-lg bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 border border-green-200 dark:border-green-800/50 px-4 py-3 font-medium">
          Sub-Treatment added successfully
        </div>
      )}

      {subTreatments.length === 0 ? (
        <div className="bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-800 p-12 text-center shadow-sm">
          <p className="text-gray-500 dark:text-zinc-400 font-medium">No sub-treatments added yet.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 dark:bg-zinc-950/50 border-b border-gray-200 dark:border-zinc-800 text-gray-700 dark:text-zinc-400 uppercase font-bold text-xs tracking-wider">
                <tr>
                  <th className="px-6 py-4">Sub-Treatment</th>
                  <th className="px-6 py-4">Parent Treatment</th>
                  <th className="px-6 py-4 text-right">Rate (₹)</th>
                  <th className="px-6 py-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                {subTreatments.map((st) => (
                  <tr key={st.SubTreatmentTypeID} className="hover:bg-gray-50/50 dark:hover:bg-zinc-800/30 transition text-gray-800 dark:text-zinc-100">
                    <td className="px-6 py-4 whitespace-nowrap font-bold text-gray-900 dark:text-zinc-50">
                      {st.SubTreatmentTypeName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-zinc-400 font-medium">
                      {st.TreatmentType.TreatmentTypeName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-zinc-50 text-right font-black">
                      ₹{st.Rate.toString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className={`px-3 py-1 inline-flex text-xs font-bold rounded-full border ${st.IsActive ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800/50' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800/50'}`}>
                        {st.IsActive ? "Active" : "Inactive"}
                      </span>
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
