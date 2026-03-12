import { requireAdmin } from "../../../lib/auth";
import { createDiagnosis } from "@/app/actions/diagnosis";
import Link from "next/link";

export const runtime = "nodejs";

export default async function CreateDiagnosisPage() {
    await requireAdmin();

    return (
        <div className="max-w-2xl mx-auto p-4">
            <div className="flex items-center gap-4 mb-6">
                <Link href="/admin/diagnosis" className="text-gray-500 hover:text-gray-900">
                    ← Back
                </Link>
                <h1 className="text-2xl font-bold text-gray-900">Add Diagnosis</h1>
            </div>

            <form
                action={createDiagnosis}
                className="bg-white p-6 rounded-lg shadow-sm space-y-6"
            >
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Diagnosis Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        name="DiagnosisTypeName"
                        type="text"
                        required
                        placeholder="e.g. Viral Fever"
                        className="w-full rounded-lg border border-gray-300 px-4 py-2.5 
                       text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Short Name
                    </label>
                    <input
                        name="DiagnosisTypeShortName"
                        type="text"
                        placeholder="e.g. VF"
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
                        rows={3}
                        placeholder="Additional details..."
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
                        Save Diagnosis
                    </button>
                    <Link
                        href="/admin/diagnosis"
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
