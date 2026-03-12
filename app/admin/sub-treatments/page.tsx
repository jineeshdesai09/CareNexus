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
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Sub-Treatment Master</h1>

        <Link
          href="/admin/sub-treatments/create"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          + Add Sub-Treatment
        </Link>
      </div>

      {params?.success && (
        <div className="mb-4 rounded-lg bg-green-100 text-green-800 px-4 py-2">
          Sub-Treatment added successfully
        </div>
      )}

      {subTreatments.length === 0 ? (
        <p className="text-gray-500">No sub-treatments added yet.</p>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sub-Treatment</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Parent Treatment</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Rate (₹)</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {subTreatments.map((st) => (
                <tr key={st.SubTreatmentTypeID} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {st.SubTreatmentTypeName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {st.TreatmentType.TreatmentTypeName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-medium">
                    {st.Rate.toString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${st.IsActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {st.IsActive ? "Active" : "Inactive"}
                    </span>
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
