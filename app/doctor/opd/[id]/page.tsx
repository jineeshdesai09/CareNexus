import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/app/lib/auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { finishConsultation } from "@/app/actions/opd";
import PrescriptionForm from "./PrescriptionForm";
import PrintPrescriptionButton from "./PrintPrescriptionButton";

export const runtime = "nodejs";

export default async function ConsultationPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const user = await getCurrentUser();
    if (!user || user.Role !== "DOCTOR") {
        redirect("/login");
    }

    const { id } = await params;
    const opdId = Number(id);

    // Fetch OPD details with everything needed for summary/print
    const opd = await prisma.oPD.findUnique({
        where: { OPDID: opdId },
        include: {
            Patient: true,
            Doctor: true,
            Diagnoses: {
                include: {
                    DiagnosisType: true,
                },
            },
            prescription: {
                include: {
                    Medicines: {
                        include: { Medicine: true }
                    }
                }
            },
        },
    });

    if (!opd) {
        return <div className="p-4 bg-red-50 text-red-600 rounded">OPD not found</div>;
    }

    // Authorize doctor
    if (opd.Doctor.Email !== user.Email) {
        return <div className="p-4 bg-red-50 text-red-600 rounded">Not authorized to view this patient</div>;
    }

    const hospital = await prisma.hospital.findFirst();

    // If status is still REGISTERED or WAITING, we should mark as IN_CONSULTATION
    if (opd.Status === "REGISTERED" || opd.Status === "WAITING") {
        await prisma.oPD.update({
            where: { OPDID: opd.OPDID },
            data: { Status: "IN_CONSULTATION", ConsultationStart: new Date() },
        });
    }

    const allDiagnoses = await prisma.diagnosisType.findMany({
        where: { IsActive: true },
        orderBy: { DiagnosisTypeName: "asc" },
    });

    const medicines = await prisma.medicine.findMany({
        orderBy: { Name: "asc" },
    });

    // If completed, show summary and print button
    if (opd.Status === "COMPLETED" || opd.Status === "BILLED" || opd.Status === "CLOSED") {
        const prescription = opd.prescription;

        const printData = {
            hospital: {
                HospitalName: hospital?.HospitalName || "Hospital Name",
                Address: hospital?.Address || null,
                Description: hospital?.Description || null,
            },
            patient: {
                PatientName: opd.Patient.PatientName,
                PatientNo: opd.Patient.PatientNo,
                Age: opd.Patient.Age,
                Gender: opd.Patient.Gender,
            },
            doctor: {
                FirstName: opd.Doctor.FirstName,
                LastName: opd.Doctor.LastName,
                Specialization: opd.Doctor.Specialization,
                RegistrationNo: opd.Doctor.RegistrationNo,
            },
            vitals: {
                Weight: opd.Weight ? Number(opd.Weight.toString()) : null,
                Height: opd.Height ? Number(opd.Height.toString()) : null,
                BP: opd.BP_Systolic ? `${opd.BP_Systolic}/${opd.BP_Diastolic}` : null,
                Temp: opd.Temperature ? Number(opd.Temperature.toString()) : null,
                Pulse: opd.Pulse,
                RespRate: opd.RespRate,
                SpO2: opd.SpO2,
            },
            medicines: prescription?.Medicines.map(m => ({
                name: m.Medicine.Name,
                dosage: m.Dosage,
                frequency: m.Frequency,
                duration: m.Duration,
                instructions: m.Instructions,
            })) || [],
            notes: prescription?.Notes || opd.Description,
            date: opd.OPDDateTime.toLocaleDateString(),
        };

        return (
            <div className="max-w-4xl mx-auto p-4 flex flex-col gap-8">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/doctor/dashboard" className="text-gray-500 hover:text-gray-900">
                            ← Back to Dashboard
                        </Link>
                        <h1 className="text-2xl font-bold text-gray-900">Consultation Summary</h1>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="bg-green-600 p-8 text-center text-white">
                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-3xl">✓</span>
                        </div>
                        <h2 className="text-2xl font-bold mb-2">Consultation Finished</h2>
                        <p className="opacity-90">Medical record has been saved. Please provide the prescription to the patient.</p>
                    </div>

                    <div className="p-8 space-y-8">
                        <div className="grid grid-cols-2 gap-8 border-b pb-8">
                            <div>
                                <h3 className="text-sm font-bold text-gray-400 uppercase mb-2">Patient</h3>
                                <p className="text-lg font-bold text-gray-900">{opd.Patient.PatientName}</p>
                                <p className="text-gray-500">{opd.Patient.Age}Y / {opd.Patient.Gender}</p>
                            </div>
                            <div className="text-right">
                                <h3 className="text-sm font-bold text-gray-400 uppercase mb-2">Visit Date</h3>
                                <p className="text-lg font-bold text-gray-900">{opd.OPDDateTime.toLocaleDateString()}</p>
                                <p className="text-gray-500">Token: {opd.TokenNo}</p>
                            </div>
                        </div>

                        <div className="flex justify-center gap-4 py-4">
                            <PrintPrescriptionButton data={printData} />
                            <Link
                                href="/doctor/dashboard"
                                className="bg-gray-100 text-gray-700 px-6 py-2.5 rounded-lg hover:bg-gray-200 transition font-semibold active:scale-95"
                            >
                                Done
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto p-4 flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/doctor/dashboard" className="text-gray-500 hover:text-gray-900">
                        ← Dashboard
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900">Consultation Room</h1>
                </div>
                <div className="text-sm px-3 py-1 bg-blue-100 text-blue-800 rounded-full font-medium">
                    Status: {opd.Status}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Patient Profile */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Patient Details</h2>
                    <div className="space-y-4">
                        <div>
                            <p className="text-sm text-gray-500">Name</p>
                            <p className="font-medium text-gray-900">{opd.Patient.PatientName}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-500">Age / Sex</p>
                                <p className="font-medium text-gray-900">
                                    {opd.Patient.Age} / {opd.Patient.Gender}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Blood Group</p>
                                <p className="font-medium text-gray-900">{opd.Patient.BloodGroup || "N/A"}</p>
                            </div>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Patient ID</p>
                            <p className="font-medium text-gray-900">{opd.Patient.PatientNo}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Token</p>
                            <p className="font-medium text-gray-900">{opd.TokenNo ?? "-"}</p>
                        </div>
                    </div>
                </div>

                {/* Right Column: Consultation Form */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <form action={finishConsultation} className="p-6 space-y-8">
                        <input type="hidden" name="OPDID" value={opd.OPDID} />

                        {/* Vitals Section */}
                        <div className="bg-blue-50/50 p-6 rounded-xl border border-blue-100">
                            <h2 className="text-lg font-semibold text-blue-900 mb-4 flex items-center gap-2">
                                <span className="p-1.5 bg-blue-100 rounded-lg">💓</span>
                                Patient Vitals
                            </h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                <div>
                                    <label className="block text-xs font-semibold text-blue-700 uppercase mb-1">Weight (kg)</label>
                                    <input name="Weight" type="number" step="0.01" defaultValue={opd.Weight?.toString()} className="w-full rounded-lg border-blue-200 focus:ring-blue-500 focus:border-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-blue-700 uppercase mb-1">Height (cm)</label>
                                    <input name="Height" type="number" step="0.01" defaultValue={opd.Height?.toString()} className="w-full rounded-lg border-blue-200 focus:ring-blue-500 focus:border-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-blue-700 uppercase mb-1">Temp (°F)</label>
                                    <input name="Temperature" type="number" step="0.1" defaultValue={opd.Temperature?.toString()} className="w-full rounded-lg border-blue-200 focus:ring-blue-500 focus:border-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-blue-700 uppercase mb-1">Pulse (bpm)</label>
                                    <input name="Pulse" type="number" defaultValue={opd.Pulse?.toString()} className="w-full rounded-lg border-blue-200 focus:ring-blue-500 focus:border-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-blue-700 uppercase mb-1">BP (Systolic)</label>
                                    <input name="BP_Systolic" type="number" defaultValue={opd.BP_Systolic?.toString()} className="w-full rounded-lg border-blue-200 focus:ring-blue-500 focus:border-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-blue-700 uppercase mb-1">BP (Diastolic)</label>
                                    <input name="BP_Diastolic" type="number" defaultValue={opd.BP_Diastolic?.toString()} className="w-full rounded-lg border-blue-200 focus:ring-blue-500 focus:border-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-blue-700 uppercase mb-1">Resp Rate</label>
                                    <input name="RespRate" type="number" defaultValue={opd.RespRate?.toString()} className="w-full rounded-lg border-blue-200 focus:ring-blue-500 focus:border-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-blue-700 uppercase mb-1">SpO2 (%)</label>
                                    <input name="SpO2" type="number" defaultValue={opd.SpO2?.toString()} className="w-full rounded-lg border-blue-200 focus:ring-blue-500 focus:border-blue-500" />
                                </div>
                            </div>
                        </div>

                        {/* Diagnoses Section */}
                        <div>
                            <h2 className="text-lg font-semibold text-gray-800 mb-4">Diagnosis</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {allDiagnoses.map((diag) => (
                                    <label key={diag.DiagnosisTypeID} className="flex items-start gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name="diagnoses"
                                            value={diag.DiagnosisTypeID}
                                            defaultChecked={opd.Diagnoses.some(d => d.DiagnosisTypeID === diag.DiagnosisTypeID)}
                                            className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500"
                                        />
                                        <div>
                                            <p className="font-medium text-gray-900">{diag.DiagnosisTypeName}</p>
                                            {diag.DiagnosisTypeShortName && (
                                                <p className="text-sm text-gray-500">{diag.DiagnosisTypeShortName}</p>
                                            )}
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>


                        {/* Prescription Section */}
                        <div className="pt-8 border-t border-gray-100">
                            <PrescriptionForm medicines={medicines} />
                        </div>



                        {/* Clinical Notes */}
                        <div>
                            <h2 className="text-lg font-semibold text-gray-800 mb-4">Clinical Notes & Follow-up</h2>
                            <textarea
                                name="Description"
                                rows={4}
                                defaultValue={opd.Description || ""}
                                placeholder="Enter instructions, prescriptions, or summary..."
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Action Buttons */}
                        <div className="pt-6 border-t flex gap-4 justify-end">
                            <button
                                type="submit"
                                className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 font-medium tracking-wide transition shadow-sm"
                            >
                                Finish Consultation
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
