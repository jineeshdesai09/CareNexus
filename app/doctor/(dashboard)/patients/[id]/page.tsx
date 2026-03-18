import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/app/lib/auth";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { 
    ArrowLeft, 
    User, 
    History, 
    Activity, 
    Stethoscope, 
    Calendar, 
    Hash, 
    Phone, 
    MapPin, 
    Droplet,
    Clock,
    ChevronRight,
    FileText
} from "lucide-react";
import { formatDate } from "@/app/lib/utils/date";

export const runtime = "nodejs";

export default async function DoctorPatientProfilePage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const user = await getCurrentUser();
    if (!user || user.Role !== "DOCTOR") {
        redirect("/login");
    }

    const { id } = await params;
    const patientId = Number(id);

    const patient = await prisma.patient.findUnique({
        where: { PatientID: patientId },
        include: {
            OPDs: {
                include: {
                    Doctor: true,
                    Diagnoses: {
                        include: { DiagnosisType: true }
                    }
                },
                orderBy: { OPDDateTime: "desc" }
            }
        }
    });

    if (!patient) {
        notFound();
    }

    // Get statistics
    const totalVisits = patient.OPDs.length;
    const lastVisit = patient.OPDs[0];
    const latestVitals = patient.OPDs.find(o => o.BP_Systolic || o.Weight || o.Temperature);

    return (
        <div className="max-w-7xl mx-auto p-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <Link 
                        href="/doctor/patients" 
                        className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors font-bold mb-2 group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Directory
                    </Link>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Patient Profile</h1>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left: Patient Info Card */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                        <div className="h-32 bg-indigo-600 relative">
                            <div className="absolute -bottom-12 left-8 w-24 h-24 rounded-3xl bg-white p-1 shadow-xl">
                                <div className="w-full h-full rounded-[1.2rem] bg-indigo-50 flex items-center justify-center text-indigo-600 text-3xl font-black">
                                    {patient.PatientName[0]}
                                </div>
                            </div>
                        </div>
                        <div className="pt-16 p-8 space-y-6">
                            <div>
                                <h2 className="text-2xl font-black text-slate-900">{patient.PatientName}</h2>
                                <p className="text-slate-400 font-bold flex items-center gap-1.5 mt-1">
                                    <Hash className="w-4 h-4" /> Patient ID: #{patient.PatientNo}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-slate-50 rounded-2xl">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Age</p>
                                    <p className="font-black text-slate-900">{patient.Age} Years</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-2xl">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Gender</p>
                                    <p className="font-black text-slate-900">{patient.Gender}</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-slate-600">
                                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400">
                                        <Phone className="w-4 h-4" />
                                    </div>
                                    <span className="font-bold">{patient.MobileNo || "—"}</span>
                                </div>
                                <div className="flex items-center gap-3 text-slate-600">
                                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400">
                                        <Droplet className="w-4 h-4 text-red-500" />
                                    </div>
                                    <span className="font-bold">Blood Group: {patient.BloodGroup || "Not Set"}</span>
                                </div>
                                <div className="flex items-start gap-3 text-slate-600">
                                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 mt-1">
                                        <MapPin className="w-4 h-4" />
                                    </div>
                                    <span className="font-bold leading-relaxed">{patient.Address || "No address recorded"}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="bg-slate-900 rounded-[2rem] p-8 text-white">
                        <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6">Medical Stats</h3>
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                                        <History className="w-5 h-5 text-indigo-400" />
                                    </div>
                                    <span className="font-bold text-slate-300">Total Visits</span>
                                </div>
                                <span className="text-xl font-black">{totalVisits}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                                        <Calendar className="w-5 h-5 text-green-400" />
                                    </div>
                                    <span className="font-bold text-slate-300">Last Visit</span>
                                </div>
                                <span className="font-black">{lastVisit ? formatDate(lastVisit.OPDDateTime) : "—"}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: History & Vitals */}
                <div className="lg:col-span-8 space-y-8">
                    {/* Latest Vitals Card */}
                    <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden p-8">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 bg-red-50 text-red-500 rounded-xl flex items-center justify-center">
                                <Activity className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-black text-slate-900">Latest Recorded Vitals</h3>
                        </div>

                        {latestVitals ? (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Blood Pressure</p>
                                    <p className="text-xl font-black text-slate-900">{latestVitals.BP_Systolic}/{latestVitals.BP_Diastolic || "—"}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Heart Rate</p>
                                    <p className="text-xl font-black text-slate-900">{latestVitals.Pulse || "—"} bpm</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Weight</p>
                                    <p className="text-xl font-black text-slate-900">{latestVitals.Weight?.toString() || "—"} kg</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Temperature</p>
                                    <p className="text-xl font-black text-slate-900">{latestVitals.Temperature?.toString() || "—"} °C</p>
                                </div>
                            </div>
                        ) : (
                            <div className="py-8 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                                <p className="text-slate-400 font-bold italic">No vitals recorded in recent visits.</p>
                            </div>
                        )}
                    </div>

                    {/* Visit History Timeline */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 px-2">
                            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                                <Clock className="w-6 h-6" />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900">Medical History Timeline</h3>
                        </div>

                        <div className="space-y-4">
                            {patient.OPDs.map((opd) => (
                                <div key={opd.OPDID} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 hover:border-indigo-100 transition-all group">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div className="flex items-center gap-6">
                                            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex flex-col items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                                                <Calendar className="w-6 h-6" />
                                                <span className="text-[10px] font-black uppercase mt-1">{opd.OPDDateTime.toLocaleDateString('en-US', { month: 'short' })}</span>
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-3 mb-1">
                                                    <h4 className="text-lg font-black text-slate-900">Dr. {opd.Doctor.FirstName} {opd.Doctor.LastName}</h4>
                                                    <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-widest">
                                                        {opd.Status}
                                                    </span>
                                                </div>
                                                <p className="text-sm font-bold text-slate-500">{formatDate(opd.OPDDateTime)} • {opd.Doctor.Specialization}</p>
                                                
                                                {opd.Diagnoses.length > 0 && (
                                                    <div className="flex flex-wrap gap-2 mt-3">
                                                        {opd.Diagnoses.map(d => (
                                                            <span key={d.OPDDiagnosisTypeID} className="text-[10px] font-bold px-2 py-0.5 bg-blue-50 text-blue-600 rounded-lg">
                                                                {d.DiagnosisType.DiagnosisTypeName}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        
                                        <Link 
                                            href={`/doctor/opd/${opd.OPDID}`}
                                            className="px-6 py-3 bg-slate-50 text-slate-600 font-black rounded-xl text-sm hover:bg-indigo-600 hover:text-white transition-all flex items-center justify-center gap-2"
                                        >
                                            <FileText className="w-4 h-4" />
                                            View Details
                                            <ChevronRight className="w-4 h-4" />
                                        </Link>
                                    </div>
                                </div>
                            ))}

                            {patient.OPDs.length === 0 && (
                                <div className="p-20 text-center bg-white rounded-[2rem] border border-slate-100">
                                    <p className="text-slate-400 font-bold italic">No visit history found for this patient.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
