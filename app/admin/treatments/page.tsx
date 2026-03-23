import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { requireAdmin } from "../../lib/auth";

export const runtime = "nodejs";

export default async function TreatmentsPage({
  searchParams,
}: {
  searchParams?: Promise<{ success?: string }>;
}) {
  await requireAdmin();
  const params = await searchParams;

  const treatments = await prisma.treatmentType.findMany({
    orderBy: { TreatmentTypeName: "asc" },
  });

  return (
    <div className="max-w-6xl mx-auto p-4 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 border-b border-gray-200 dark:border-zinc-800 pb-4">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-zinc-50 tracking-tight">Treatment Master</h1>

        <Link
          href="/admin/treatments/create"
          className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition font-medium text-sm shadow-sm"
        >
          + Add Treatment
        </Link>
      </div>

      {params?.success && (
        <div className="mb-4 rounded-lg bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 border border-green-200 dark:border-green-800/50 px-4 py-3 font-medium">
          Treatment added successfully
        </div>
      )}

      {/* Empty state */}
      {treatments.length === 0 ? (
        <div className="bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-800 p-12 text-center shadow-sm">
          <p className="text-gray-500 dark:text-zinc-400 font-medium">No treatments added yet.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 dark:bg-zinc-950/50 border-b border-gray-200 dark:border-zinc-800 text-gray-700 dark:text-zinc-400 uppercase font-bold text-xs tracking-wider">
                <tr>
                  <th className="px-6 py-4">Treatment Name</th>
                  <th className="px-6 py-4">Short Name</th>
                  <th className="px-6 py-4">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                {treatments.map((t) => (
                  <tr key={t.TreatmentTypeID} className="hover:bg-gray-50/50 dark:hover:bg-zinc-800/30 transition text-gray-800 dark:text-zinc-100">
                    <td className="px-6 py-4 whitespace-nowrap font-bold text-gray-900 dark:text-zinc-50">
                      {t.TreatmentTypeName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-zinc-400 font-medium">
                      {t.TreatmentTypeShortName || "-"}
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-zinc-400 font-medium truncate max-w-xs">
                      {t.Description || "-"}
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
