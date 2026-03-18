import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/app/lib/auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { finishConsultation } from "@/app/actions/opd";
import PrescriptionForm from "./PrescriptionForm";
import PrintPrescriptionButton from "./PrintPrescriptionButton";
import MedicalHistoryDrawer from "./MedicalHistoryDrawer";
import OrderLabTestForm from "./OrderLabTestForm";
import PrintDraftButton from "./PrintDraftButton";
import ConsultationFooter from "./ConsultationFooter";
import { getLabTestCatalog } from "@/app/actions/lab";
import { getPrescriptionTemplates } from "@/app/actions/prescriptionTemplate";
import VitalsChart from "./VitalsChart";

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

    // Fetch lab catalog
    const labCategories = await getLabTestCatalog();

    // Fetch current lab orders for this OPD
    const labOrders = await prisma.labOrder.findMany({
        where: { OPDID: opdId },
        include: {
            Items: {
                include: { Test: true }
            }
        },
        orderBy: { OrderDate: 'desc' }
    });

    // Fetch past completed OPDs for this patient
    const pastOpds = await prisma.oPD.findMany({
        where: {
            PatientID: opd.PatientID,
            OPDID: { not: opdId }, // Exclude current OPD
            Status: { in: ["COMPLETED", "BILLED", "CLOSED"] }
        },
        orderBy: { OPDDateTime: "desc" },
        include: {
            Diagnoses: {
                include: { DiagnosisType: true }
            },
            prescription: {
                include: {
                    Medicines: {
                        include: { Medicine: true }
                    }
                }
            }
        }
    });

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

    const medicines = await prisma.medicine.findMany({
        orderBy: { Name: "asc" },
    });

    const templates = await getPrescriptionTemplates(opd.TreatedByDoctorID);

    // Prepare Vitals History for Graphing
    const vitalsHistory = [...serializedPastOpds.map(p => ({
        OPDDateTime: p.OPDDateTime,
        Weight: p.Weight,
        BP_Systolic: p.BP_Systolic,
    })), {
        OPDDateTime: opd.OPDDateTime,
        Weight: opd.Weight ? Number(opd.Weight) : null,
        BP_Systolic: opd.BP_Systolic,
    }].sort((a, b) => new Date(a.OPDDateTime).getTime() - new Date(b.OPDDateTime).getTime());

    const weightTrend = vitalsHistory.map(v => ({
        date: new Date(v.OPDDateTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        value: v.Weight
    }));

    const bpTrend = vitalsHistory.map(v => ({
        date: new Date(v.OPDDateTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        value: v.BP_Systolic ? Number(v.BP_Systolic) : null
    }));

    // Serialize pastOpds to handle Prisma Decimal types
    const serializedPastOpdsForDrawer = pastOpds.map(p => ({
        ...p,
        Weight: p.Weight ? Number(p.Weight) : null,
        Temperature: p.Temperature ? Number(p.Temperature) : null,
        Height: p.Height ? Number(p.Height) : null,
        RegistrationFee: Number(p.RegistrationFee),
    }));

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
            medicines: prescription?.Medicines.map(m => ({
                name: m.Medicine?.Name || m.MedicineName || "Unknown",
                dosage: m.Dosage,
                frequency: m.Frequency,
                duration: m.Duration,
                instructions: m.Instructions,
            })) || [],
            notes: prescription?.Notes || opd.Description,
            date: opd.OPDDateTime.toLocaleDateString(),
        };

        return (
            <div className="min-h-full bg-slate-50 relative pb-32">
                <div className="max-w-4xl mx-auto p-4 pt-12 flex flex-col gap-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link href="/doctor/dashboard" className="text-slate-500 hover:text-slate-900 transition-colors font-medium flex items-center gap-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M10 19l-7-7m0 0l7-7m-7 7h18" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
                                Back to Dashboard
                            </Link>
                            <h1 className="text-2xl font-bold text-slate-900 border-l-2 border-slate-300 pl-4">Consultation Summary</h1>
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                        <div className="bg-emerald-600 p-10 text-center text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full -ml-12 -mb-12 blur-xl"></div>

                            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-md">
                                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3"></path></svg>
                            </div>
                            <h2 className="text-3xl font-extrabold mb-3">Consultation Completed</h2>
                            <p className="text-emerald-50 text-lg max-w-md mx-auto">The medical record has been securely saved. You can now print the prescription for the patient.</p>
                        </div>

                        <div className="p-10 space-y-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 border-b border-slate-100 pb-10">
                                <div className="space-y-1">
                                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Patient Information</h3>
                                    <p className="text-2xl font-bold text-slate-900">{opd.Patient.PatientName}</p>
                                    <p className="text-slate-500 font-medium text-lg">{opd.Patient.Age} Years • {opd.Patient.Gender}</p>
                                    <p className="text-slate-400 font-medium">ID: {opd.Patient.PatientNo}</p>
                                </div>
                                <div className="md:text-right space-y-1">
                                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Visit Details</h3>
                                    <p className="text-2xl font-bold text-slate-900">{opd.OPDDateTime.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                                    <p className="text-slate-500 font-medium text-lg">Token No: {opd.TokenNo}</p>
                                    <p className="text-slate-400 font-medium">OPD ID: #{opd.OPDID}</p>
                                </div>
                            </div>

                            <div className="flex flex-wrap justify-center gap-6 py-4">
                                <PrintPrescriptionButton data={printData} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer for Summary Page - FULL WIDTH */}
                <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 py-5 px-8 z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
                    <div className="max-w-7xl mx-auto flex items-center justify-between">
                        <Link href="/doctor/dashboard" className="px-8 py-3 border border-slate-200 rounded-2xl text-base font-bold text-slate-600 hover:bg-slate-50 transition-all flex items-center gap-3 shadow-sm active:scale-95">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M10 19l-7-7m0 0l7-7m-7 7h18" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"></path></svg>
                            Back to Dashboard
                        </Link>
                        <div className="hidden sm:block text-slate-400 font-medium text-sm">
                            Session ID: {opd.OPDID}
                        </div>
                    </div>
                </footer>
            </div>
        );
    }

    return (
        <form action={finishConsultation} className="min-h-full pb-32 bg-slate-50 font-inter relative">
            <input type="hidden" name="OPDID" value={opd.OPDID} />

            {/* BEGIN: MainHeader */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        {/* Doctor Info */}
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xl uppercase">
                                {opd.Doctor.FirstName[0]}{opd.Doctor.LastName[0]}
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-slate-900 leading-tight">
                                    Dr. {opd.Doctor.FirstName} {opd.Doctor.LastName}
                                </h1>
                                <div className="flex items-center gap-2 text-sm text-slate-500">
                                    <span>{opd.Doctor.Specialization}</span>
                                    <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                    <span>{opd.Doctor.Department}</span>
                                </div>
                            </div>
                        </div>
                        {/* Status and Timing */}
                        <div className="flex items-center gap-6">
                            <div className="text-right hidden sm:block">
                                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Appointment</p>
                                <p className="text-sm font-semibold text-slate-700">
                                    {opd.OPDDateTime.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} • {opd.OPDDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                                <span className="w-2 h-2 mr-2 rounded-full bg-amber-500 animate-pulse"></span>
                                In Progress
                            </span>
                        </div>
                    </div>
                </div>
            </header>
            {/* END: MainHeader */}

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* BEGIN: LeftColumn - Patient Profile */}
                    <aside className="lg:col-span-3 space-y-6">
                        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
                            <div className="flex flex-col items-center text-center">
                                <div className="w-24 h-24 rounded-full border-4 border-blue-50 mb-4 bg-blue-100 flex items-center justify-center text-blue-600 text-3xl font-bold uppercase">
                                    {opd.Patient.PatientName[0]}
                                </div>
                                <h2 className="text-lg font-bold text-slate-900">{opd.Patient.PatientName}</h2>
                                <p className="text-sm text-slate-500 font-medium">ID: {opd.Patient.PatientNo}</p>
                                <div className="mt-4 flex flex-wrap justify-center gap-2">
                                    <span className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded-md">{opd.Patient.Age} / {opd.Patient.Gender}</span>
                                    <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md">Token: {opd.TokenNo}</span>
                                </div>
                                <div className="mt-4 w-full pt-4 border-t border-slate-50 text-left">
                                    <p className="text-xs text-slate-400 uppercase font-bold mb-2">Chief Complaint</p>
                                    <span className="inline-block w-full px-3 py-2 bg-red-50 text-red-700 text-sm font-semibold rounded-lg border border-red-100">
                                        {opd.Description || "No complaint recorded"}
                                    </span>
                                </div>
                                <div className="mt-6 w-full space-y-3 text-left">
                                    <div>
                                        <p className="text-xs text-slate-400 uppercase font-bold">Contact</p>
                                        <p className="text-sm text-slate-700">{opd.Patient.MobileNo}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-400 uppercase font-bold">Blood Group</p>
                                        <p className="text-sm text-slate-700">{opd.Patient.BloodGroup || "N/A"}</p>
                                    </div>
                                </div>

                                <div className="mt-6 w-full pt-6 border-t border-slate-100 space-y-3">
                                    <MedicalHistoryDrawer patientName={opd.Patient.PatientName} pastOpds={serializedPastOpds as any} />
                                    <OrderLabTestForm opdId={opd.OPDID} categories={labCategories as any} />
                                </div>
                            </div>
                        </div>

                        {/* Lab Orders Section */}
                        {labOrders.length > 0 && (
                            <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
                                <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                                    <span className="p-1 bg-teal-100 rounded text-teal-600">🧪</span>
                                    Recent Lab Orders
                                </h3>
                                <div className="space-y-4">
                                    {labOrders.map(order => (
                                        <div key={order.OrderID} className="text-sm border-l-2 border-teal-500 pl-3 py-1">
                                            <div className="flex justify-between items-start mb-1">
                                                <span className="font-semibold text-slate-800">Order #{order.OrderID}</span>
                                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-teal-50 text-teal-700 font-bold uppercase">
                                                    {order.Status.replace('_', ' ')}
                                                </span>
                                            </div>
                                            <ul className="text-xs text-slate-500 list-disc list-inside">
                                                {order.Items.slice(0, 2).map(item => (
                                                    <li key={item.OrderItemID} className="truncate">{item.Test.TestName}</li>
                                                ))}
                                                {order.Items.length > 2 && <li>+ {order.Items.length - 2} more</li>}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </aside>
                    {/* END: LeftColumn */}

                    {/* BEGIN: RightColumn - Main Content */}
                    <div className="lg:col-span-9 space-y-6">

                        {/* Vitals Trends */}
                        {(weightTrend.filter(d => d.value !== null).length >= 2 || bpTrend.filter(d => d.value !== null).length >= 2) && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <VitalsChart data={weightTrend} label="Weight Analysis" unit="kg" color="#10b981" />
                                <VitalsChart data={bpTrend} label="BP Systolic Analysis" unit="mmHg" color="#ef4444" />
                            </div>
                        )}

                        {/* Prescription Section */}
                        <section className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                            <PrescriptionForm
                                medicines={medicines}
                                doctorID={opd.TreatedByDoctorID}
                                templates={templates}
                                defaultFollowUpDate={opd.FollowUpDate ? opd.FollowUpDate.toISOString().split("T")[0] : ""}
                                defaultVitals={{
                                    BP_Systolic: opd.BP_Systolic,
                                    BP_Diastolic: opd.BP_Diastolic,
                                    Temperature: opd.Temperature ? Number(opd.Temperature) : null,
                                    Pulse: opd.Pulse,
                                    Weight: opd.Weight ? Number(opd.Weight) : null,
                                    SpO2: opd.SpO2,
                                    Height: (opd.Height ? Number(opd.Height) : null) || (opd.Patient.Height ? Number(opd.Patient.Height) : null)
                                }} initialMedicines={opd.prescription?.Medicines.map(m => ({
                                    MedicineName: m.Medicine?.Name || m.MedicineName || "",
                                    Dosage: m.Dosage,
                                    Frequency: m.Frequency,
                                    Duration: m.Duration,
                                    Instructions: m.Instructions || "After Food"
                                }))}
                                initialNotes={opd.prescription?.Notes || ""}
                            />
                        </section>
                    </div>
                    {/* END: RightColumn */}
                </div>
            </main>

            {/* BEGIN: Sticky Action Bar - FULL WIDTH */}
            <ConsultationFooter />
            {/* END: Sticky Action Bar */}
        </form>
    );
}
