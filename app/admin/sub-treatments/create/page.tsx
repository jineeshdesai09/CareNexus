import { requireAdmin } from "../../../lib/auth";
import { createSubTreatment } from "@/app/actions/subTreatment";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const runtime = "nodejs";

export default async function CreateSubTreatmentPage() {
    await requireAdmin();

    const treatments = await prisma.treatmentType.findMany({
        orderBy: { TreatmentTypeName: "asc" },
    });

    return (
        <div className="max-w-2xl mx-auto p-4">
            <div className="flex items-center gap-4 mb-6">
                <Link href="/admin/sub-treatments" className="text-gray-500 hover:text-gray-900">
                    ← Back
                </Link>
                <h1 className="text-2xl font-bold text-gray-900">Add Sub-Treatment</h1>
            </div>

            <form
                action={createSubTreatment}
                className="bg-white p-6 rounded-lg shadow-sm space-y-6"
            >
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Parent Treatment <span className="text-red-500">*</span>
                    </label>
                    <select
                        name="TreatmentTypeID"
                        required
                        className="w-full rounded-lg border border-gray-300 px-4 py-2.5 
                       text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                        <option value="">Select Treatment...</option>
                        {treatments.map((t) => (
                            <option key={t.TreatmentTypeID} value={t.TreatmentTypeID}>
                                {t.TreatmentTypeName}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Sub-Treatment Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        name="SubTreatmentTypeName"
                        type="text"
                        required
                        placeholder="e.g. General Consultation"
                        className="w-full rounded-lg border border-gray-300 px-4 py-2.5 
                       text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Rate/Price (₹) <span className="text-red-500">*</span>
                    </label>
                    <input
                        name="Rate"
                        type="number"
                        step="0.01"
                        min="0"
                        required
                        placeholder="0.00"
                        className="w-full rounded-lg border border-gray-300 px-4 py-2.5 
                       text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                    </label>
                    <textarea
                        name="Description"
                        rows={2}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2.5 
                       text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        name="IsActive"
                        id="IsActive"
                        defaultChecked
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="IsActive" className="text-sm font-medium text-gray-700">
                        Active
                    </label>
                </div>

                <div className="pt-4 border-t flex gap-4">
                    <button
                        type="submit"
                        className="flex-1 bg-blue-600 text-white px-4 py-2.5 rounded-lg 
                       hover:bg-blue-700 font-medium transition"
                    >
                        Save Sub-Treatment
                    </button>
                    <Link
                        href="/admin/sub-treatments"
                        className="flex-1 bg-gray-100 text-gray-700 px-4 py-2.5 rounded-lg 
                       font-medium text-center hover:bg-gray-200 transition"
                    >
                        Cancel
                    </Link>
                </div>
            </form>
        </div>
    );
}
