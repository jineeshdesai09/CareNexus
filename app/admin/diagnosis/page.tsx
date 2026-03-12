import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { requireAdmin } from "../../lib/auth";

export const runtime = "nodejs";

export default async function DiagnosisPage({
  searchParams,
}: {
  searchParams?: Promise<{ success?: string }>;
}) {
  await requireAdmin();
  const params = await searchParams;

  const diagnoses = await prisma.diagnosisType.findMany({
    orderBy: { DiagnosisTypeName: "asc" },
  });

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Diagnosis Master</h1>

        <Link
          href="/admin/diagnosis/create"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          + Add Diagnosis
        </Link>
      </div>

      {params?.success && (
        <div className="mb-4 rounded-lg bg-green-100 text-green-800 px-4 py-2">
          Diagnosis added successfully
        </div>
      )}

      {/* Empty state */}
      {diagnoses.length === 0 ? (
        <p className="text-gray-500">No diagnoses added yet.</p>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Diagnosis Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Short Name</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {diagnoses.map((d) => (
                <tr key={d.DiagnosisTypeID} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {d.DiagnosisTypeName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {d.DiagnosisTypeShortName || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${d.IsActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {d.IsActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 truncate max-w-xs">
                    {d.Description || "-"}
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
