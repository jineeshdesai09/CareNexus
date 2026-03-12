import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/app/lib/auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import PrintReceiptButton from "../PrintReceiptButton";

export const runtime = "nodejs";

export default async function ReceiptSuccessPage({
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

    // Fetch Receipt details
    const receipt = await prisma.receipt.findFirst({
        where: { OPDID: id },
        include: {
            OPD: {
                include: {
                    Patient: true,
                },
            },
            ReceiptTrans: {
                include: {
                    SubTreatmentType: true,
                },
            },
        },
        orderBy: { Created: "desc" },
    });

    if (!receipt) {
        return <div className="p-4 bg-red-50 text-red-600 rounded">Receipt not found</div>;
    }

    const hospital = await prisma.hospital.findFirst();

    const printData = {
        hospital: {
            HospitalName: hospital?.HospitalName || "Hospital Name",
            Address: hospital?.Address || null,
            Phone: null,
        },
        receipt: {
            ReceiptNo: receipt.ReceiptNo || "N/A",
            ReceiptDate: receipt.ReceiptDate.toLocaleDateString(),
            AmountPaid: Number(receipt.AmountPaid.toString()),
            Description: receipt.Description,
        },
        patient: {
            PatientName: receipt.OPD.Patient.PatientName,
            PatientNo: receipt.OPD.Patient.PatientNo,
        },
        items: receipt.ReceiptTrans.map(rt => ({
            name: rt.SubTreatmentType.SubTreatmentTypeName,
            rate: Number(rt.Rate.toString()),
            quantity: rt.Quantity,
            amount: Number(rt.Amount.toString()),
        })),
        registrationFee: Number(receipt.OPD.RegistrationFee.toString()),
    };

    return (
        <div className="max-w-4xl mx-auto p-4 flex flex-col items-center justify-center mt-10 gap-8">
            <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-blue-600 p-10 text-center text-white">
                    <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="text-4xl text-white">💳</span>
                    </div>
                    <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
                    <p className="text-blue-100 text-lg">Receipt {receipt.ReceiptNo} has been generated successfully.</p>
                </div>

                <div className="p-10 space-y-10">
                    <div className="grid grid-cols-2 gap-10 border-b pb-10">
                        <div>
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Receipt Info</h3>
                            <div className="space-y-1">
                                <p className="text-xl font-bold text-gray-900">{receipt.ReceiptNo}</p>
                                <p className="text-gray-500">{receipt.ReceiptDate.toLocaleDateString()}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Total Collected</h3>
                            <div className="space-y-1">
                                <p className="text-3xl font-black text-blue-600">₹ {Number(receipt.AmountPaid.toString()).toFixed(2)}</p>
                                <p className="text-gray-400 text-sm italic">includes registration fee</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col items-center gap-6">
                        <PrintReceiptButton data={printData} />

                        <div className="flex gap-4">
                            <Link
                                href="/reception/opd/queue"
                                className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-semibold"
                            >
                                Back to Queue
                            </Link>
                            <Link
                                href="/reception/dashboard"
                                className="px-6 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition"
                            >
                                Dashboard
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <p className="text-gray-400 text-sm">
                If the patient requires a physical copy, please use the button above.
            </p>
        </div>
    );
}
