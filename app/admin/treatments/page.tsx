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
    <div className="max-w-6xl mx-auto p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Treatment Master</h1>

        <Link
          href="/admin/treatments/create"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          + Add Treatment
        </Link>
      </div>

      {params?.success && (
        <div className="mb-4 rounded-lg bg-green-100 text-green-800 px-4 py-2">
          Treatment added successfully
        </div>
      )}

      {/* Empty state */}
      {treatments.length === 0 ? (
        <p className="text-gray-500">No treatments added yet.</p>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Treatment Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Short Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {treatments.map((t) => (
                <tr key={t.TreatmentTypeID} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {t.TreatmentTypeName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {t.TreatmentTypeShortName || "-"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 truncate max-w-xs">
                    {t.Description || "-"}
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
