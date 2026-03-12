import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/app/lib/auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import BillingForm from "./BillingForm";

export const runtime = "nodejs";

export default async function BillingPage({
    params,
}: {
    params: Promise<{ opdId: string }>;
}) {
    const user = await getCurrentUser();
    if (!user || user.Role !== "RECEPTIONIST") {
        redirect("/login");
    }

    const { opdId } = await params;
    const id = Number(opdId);

    // Fetch OPD details
    const opd = await prisma.oPD.findUnique({
        where: { OPDID: id },
        include: {
            Patient: true,
            Doctor: true,
            Diagnoses: {
                include: {
                    DiagnosisType: true,
                },
            },
        },
    });

    if (!opd) {
        return <div className="p-4 bg-red-50 text-red-600 rounded">OPD not found</div>;
    }

    if (opd.Status === "BILLED") {
        return (
            <div className="max-w-4xl mx-auto p-4 flex flex-col items-center justify-center mt-20">
                <div className="bg-green-50 p-6 rounded-xl border border-green-200 text-center space-y-4">
                    <div className="text-green-600 text-4xl mb-4">✓</div>
                    <h2 className="text-xl font-bold text-green-900">Already Billed</h2>
                    <p className="text-green-700">A receipt has already been generated for this OPD visit.</p>
                    <Link href="/reception/opd/queue" className="inline-block mt-4 bg-green-600 text-white px-6 py-2 rounded font-medium hover:bg-green-700">
                        Return to Queue
                    </Link>
                </div>
            </div>
        );
    }

    const treatmentsData = await prisma.treatmentType.findMany({
        include: {
            SubTreatmentTypes: {
                where: { IsActive: true },
                orderBy: { SubTreatmentTypeName: "asc" },
            },
        },
        orderBy: { TreatmentTypeName: "asc" },
    });

    // Serialize treatments for client component
    const treatments = treatmentsData.map(t => ({
        TreatmentTypeID: t.TreatmentTypeID,
        TreatmentTypeName: t.TreatmentTypeName,
        SubTreatmentTypes: t.SubTreatmentTypes.map(st => ({
            SubTreatmentTypeID: st.SubTreatmentTypeID,
            SubTreatmentTypeName: st.SubTreatmentTypeName,
            Rate: st.Rate.toNumber()
        }))
    }));

    // Calculate base total (Registration fee)
    const baseTotal = opd.RegistrationFee.toNumber();

    return (
        <div className="max-w-6xl mx-auto p-4 flex flex-col gap-6">
            <div className="flex items-center justify-between border-b pb-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Billing & Receipt generation</h1>
                    <p className="text-gray-500">OPD No: {opd.TokenNo ?? "-"} | Patient: {opd.Patient.PatientName}</p>
                </div>
                <Link href="/reception/opd/queue" className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-50">
                    Cancel
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Consultation Info */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit space-y-6">
                    <div>
                        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Doctor Notes</h2>
                        <div className="bg-gray-50 p-4 rounded text-gray-800 whitespace-pre-wrap min-h-[100px]">
                            {opd.Description || "No notes provided by doctor."}
                        </div>
                    </div>

                    <div>
                        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Diagnoses Recorded</h2>
                        {opd.Diagnoses.length === 0 ? (
                            <p className="text-gray-500 italic">No diagnoses checked.</p>
                        ) : (
                            <ul className="list-disc pl-5 space-y-1 text-gray-800">
                                {opd.Diagnoses.map(d => (
                                    <li key={d.OPDDiagnosisTypeID}>{d.DiagnosisType.DiagnosisTypeName}</li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                {/* Right Column: Billing Form Component */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <BillingForm
                        opdId={opd.OPDID}
                        baseTotal={baseTotal}
                        treatments={treatments}
                    />
                </div>
            </div>
        </div>
    );
}
