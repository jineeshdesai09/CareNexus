import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "../../../lib/auth";
import { redirect, notFound } from "next/navigation";
import { 
  Activity, 
  Stethoscope, 
  FileText, 
  Receipt,
  ArrowLeft,
  Calendar,
  ClipboardList,
  Info,
  Clock,
  CheckCircle2,
  AlertCircle,
  Heart,
  Thermometer,
  Scale,
  Ruler,
  Droplets,
  Wind,
  MessageSquare,
  FlaskConical
} from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/app/lib/utils/date";
import PrintPrescriptionButton from "@/app/doctor/opd/[id]/PrintPrescriptionButton";
import PrintReceiptButton from "@/app/reception/billing/[opdId]/PrintReceiptButton";

export const runtime = "nodejs";

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; icon: React.ReactNode; description: string }> = {
  REGISTERED: {
    label: "Appointment Confirmed",
    color: "text-teal-700 dark:text-teal-400",
    bg: "bg-teal-50 dark:bg-teal-900/20 border-teal-200 dark:border-teal-800/50",
    icon: <Clock className="w-5 h-5" />,
    description: "Your appointment is confirmed. Please arrive at the hospital on the scheduled date. Medical summary will be available after your consultation.",
  },
  WAITING: {
    label: "In Queue",
    color: "text-amber-700 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800/50",
    icon: <Clock className="w-5 h-5" />,
    description: "You are currently in the waiting queue. Please wait to be called in.",
  },
  IN_CONSULTATION: {
    label: "Consultation In Progress",
    color: "text-indigo-700 dark:text-indigo-400",
    bg: "bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800/50",
    icon: <Stethoscope className="w-5 h-5" />,
    description: "Your consultation is currently in progress.",
  },
  COMPLETED: {
    label: "Consultation Completed",
    color: "text-green-700 dark:text-green-400",
    bg: "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800/50",
    icon: <CheckCircle2 className="w-5 h-5" />,
    description: "Your consultation is complete. See your medical summary below.",
  },
  BILLED: {
    label: "Billed & Complete",
    color: "text-emerald-700 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800/50",
    icon: <CheckCircle2 className="w-5 h-5" />,
    description: "Consultation complete and payment received.",
  },
  CLOSED: {
    label: "Closed",
    color: "text-slate-700 dark:text-zinc-400",
    bg: "bg-slate-50 dark:bg-zinc-800 border-slate-200 dark:border-zinc-700",
    icon: <CheckCircle2 className="w-5 h-5" />,
    description: "This visit has been closed.",
  },
  CANCELLED: {
    label: "Appointment Cancelled",
    color: "text-rose-700 dark:text-rose-400",
    bg: "bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-800/50",
    icon: <AlertCircle className="w-5 h-5" />,
    description: "This appointment was cancelled. Please book a new appointment if needed.",
  },
};

const isCompleted = (status: string) =>
  ["COMPLETED", "BILLED", "CLOSED"].includes(status);

export default async function PatientVisitDetails({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const user = await getCurrentUser();
  const id = (await params).id;

  if (!user || user.Role !== "PATIENT") {
    redirect("/login");
  }

  const patient = await prisma.patient.findFirst({
    where: { UserID: user.UserID },
  });

  if (!patient) {
    redirect("/patient/dashboard");
  }

  const opd = await prisma.oPD.findUnique({
    where: { OPDID: Number(id) },
    include: {
      Doctor: true,
      prescription: {
        include: {
          Medicines: {
            include: { Medicine: true }
          }
        }
      },
      Diagnoses: {
        include: { DiagnosisType: true }
      },
      Receipts: {
        include: {
          ReceiptTrans: {
            include: { SubTreatmentType: true }
          }
        }
      },
      LabOrders: {
        include: {
          Items: {
            include: { Test: true }
          }
        }
      }
    }
  });

  if (!opd || opd.PatientID !== patient.PatientID) {
    notFound();
  }

  const hospital = await prisma.hospital.findFirst();
  const latestReceipt = opd.Receipts[0];
  const statusConfig = STATUS_CONFIG[opd.Status] ?? STATUS_CONFIG.CLOSED;
  const completed = isCompleted(opd.Status);

  return (
    <div className="space-y-8 animate-in mt-2 fade-in slide-in-from-bottom-4 duration-700 pb-20">
      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <Link 
            href="/patient/history" 
            className="inline-flex items-center gap-2 text-slate-500 dark:text-zinc-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors font-bold mb-2 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Medical History
          </Link>
          <h1 className="text-3xl font-black text-slate-900 dark:text-zinc-50 tracking-tight">Visit Details</h1>
        </div>
        
        {completed && (
          <div className="flex flex-wrap gap-3">
            {opd.prescription && (
               <PrintPrescriptionButton 
                 data={{
                   hospital: {
                      HospitalName: hospital?.HospitalName || "Hospital",
                      Address: hospital?.Address || "",
                      Description: hospital?.Description || ""
                   },
                   patient: patient,
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
                      SpO2: opd.SpO2,
                   },
                   medicines: opd.prescription.Medicines.map(m => ({
                      name: m.Medicine?.Name || m.MedicineName || "Unknown Medicine",
                      dosage: m.Dosage,
                      frequency: m.Frequency,
                      duration: m.Duration,
                      instructions: m.Instructions
                   })),
                   notes: opd.prescription.Notes || opd.Description,
                   date: formatDate(opd.OPDDateTime)
                 }} 
               />
            )}
            {latestReceipt && (
              <PrintReceiptButton 
                 data={{
                   hospital: {
                     HospitalName: hospital?.HospitalName || "Hospital",
                     Address: hospital?.Address || null,
                     Phone: "N/A"
                   },
                   receipt: {
                     ReceiptNo: latestReceipt.ReceiptNo || "N/A",
                     ReceiptDate: formatDate(latestReceipt.ReceiptDate),
                     AmountPaid: Number(latestReceipt.AmountPaid.toString()),
                     Description: latestReceipt.Description
                   },
                   patient: {
                     PatientName: patient.PatientName,
                     PatientNo: patient.PatientNo
                   },
                   items: latestReceipt.ReceiptTrans.map(tr => ({
                     name: tr.SubTreatmentType.SubTreatmentTypeName,
                     rate: Number(tr.Amount.toString()),
                     quantity: 1,
                     amount: Number(tr.Amount.toString())
                   })),
                   registrationFee: Number(opd.RegistrationFee?.toString() || "0")
                 }}
              />
            )}
          </div>
        )}
      </div>

      {/* Status Banner */}
      <div className={`flex items-start gap-4 p-6 rounded-3xl border shadow-sm ${statusConfig.bg}`}>
        <div className={`p-3 rounded-2xl bg-white dark:bg-zinc-950/20 shadow-sm ${statusConfig.color}`}>{statusConfig.icon}</div>
        <div>
          <p className={`font-black text-lg ${statusConfig.color}`}>{statusConfig.label}</p>
          <p className={`text-sm mt-1 font-medium ${statusConfig.color} opacity-80 leading-relaxed`}>{statusConfig.description}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Consultant Information */}
          <div className="bg-white dark:bg-zinc-900 p-8 rounded-[2rem] shadow-sm dark:shadow-none border border-slate-100 dark:border-zinc-800 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-teal-50 dark:bg-teal-900/10 rounded-full -mr-24 -mt-24 opacity-50" />
            <div className="flex flex-col md:flex-row md:items-center gap-8 relative z-10">
              <div className="w-24 h-24 bg-teal-600 dark:bg-teal-500 rounded-3xl flex items-center justify-center text-white shadow-lg shadow-teal-200 dark:shadow-none">
                <Stethoscope className="w-12 h-12" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-[0.2em] mb-2">Primary Consultant</p>
                <h2 className="text-3xl font-black text-slate-900 dark:text-zinc-50 mb-1">Dr. {opd.Doctor.FirstName} {opd.Doctor.LastName}</h2>
                <p className="text-lg text-slate-500 dark:text-zinc-400 font-bold mb-6">{opd.Doctor.Specialization}</p>
                
                <div className="flex flex-wrap gap-3">
                  <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-zinc-950 rounded-2xl text-slate-700 dark:text-zinc-300 text-sm font-bold border border-slate-100 dark:border-zinc-800 border-[0.5px]">
                    <Calendar className="w-4 h-4 text-teal-500 dark:text-teal-400" />
                    {formatDate(opd.OPDDateTime)}
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-zinc-950 rounded-2xl text-slate-700 dark:text-zinc-300 text-sm font-bold border border-slate-100 dark:border-zinc-800 border-[0.5px]">
                    <Clock className="w-4 h-4 text-teal-500 dark:text-teal-400" />
                    Token #{opd.TokenNo ?? "—"}
                  </div>
                  {opd.OPDNo && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-zinc-950 rounded-2xl text-slate-700 dark:text-zinc-300 text-sm font-bold border border-slate-100 dark:border-zinc-800 border-[0.5px]">
                      ID: {opd.OPDNo}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {completed && (
            <>
              {/* Clinical Items / Vitals */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 px-2">
                  <Activity className="w-5 h-5 text-red-500 dark:text-red-400" />
                  <h3 className="text-xl font-black text-slate-900 dark:text-zinc-100">Clinical Vitals</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: "Blood Pressure", value: opd.BP_Systolic && opd.BP_Diastolic ? `${opd.BP_Systolic}/${opd.BP_Diastolic}` : "—", unit: "mmHg", icon: Heart, color: "text-red-500 dark:text-red-400", bg: "bg-red-50 dark:bg-red-900/10" },
                    { label: "Temperature", value: opd.Temperature ? opd.Temperature.toString() : "—", unit: "°C", icon: Thermometer, color: "text-orange-500 dark:text-orange-400", bg: "bg-orange-50 dark:bg-orange-900/10" },
                    { label: "Pulse Rate", value: opd.Pulse ? opd.Pulse.toString() : "—", unit: "bpm", icon: Activity, color: "text-emerald-500 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-900/10" },
                    { label: "Weight", value: opd.Weight ? opd.Weight.toString() : "—", unit: "kg", icon: Scale, color: "text-teal-500 dark:text-teal-400", bg: "bg-teal-50 dark:bg-teal-900/10" },
                    { label: "Oxygen SpO2", value: opd.SpO2 ? opd.SpO2.toString() : "—", unit: "%", icon: Droplets, color: "text-cyan-500 dark:text-cyan-400", bg: "bg-cyan-50 dark:bg-cyan-900/10" },
                    { label: "Height", value: (opd.Height || patient.Height) ? (opd.Height || patient.Height)?.toString() : "—", unit: "cm", icon: Ruler, color: "text-indigo-500 dark:text-indigo-400", bg: "bg-indigo-50 dark:bg-indigo-900/10" },
                  ].map((stat) => (
                    <div key={stat.label} className="bg-white dark:bg-zinc-900 p-5 rounded-3xl border border-slate-100 dark:border-zinc-800 hover:border-slate-200 dark:hover:border-zinc-700 transition-colors shadow-sm dark:shadow-none flex flex-col items-center text-center group">
                      <div className={`w-10 h-10 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center mb-3`}>
                        <stat.icon className="w-5 h-5" />
                      </div>
                      <p className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest mb-1">{stat.label}</p>
                      <p className="text-xl font-black text-slate-900 dark:text-zinc-100 leading-none">{stat.value}</p>
                      {stat.value !== "—" && <p className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 mt-1">{stat.unit}</p>}
                    </div>
                  ))}
                </div>
              </div>

              {/* Medical Assessment Section */}
              <div className="bg-white dark:bg-zinc-900 rounded-[2rem] shadow-sm dark:shadow-none border border-slate-100 dark:border-zinc-800 overflow-hidden">
                <div className="p-8 border-b border-slate-50 dark:border-zinc-800 flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center">
                    <FileText className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-zinc-100">Clinical Assessment</h3>
                </div>
                
                <div className="p-8 space-y-10">
                  {/* Doctor's Notes */}
                  {opd.Description && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-slate-400 dark:text-zinc-500">
                        <MessageSquare className="w-4 h-4" />
                        <h4 className="text-xs font-bold uppercase tracking-[0.2em]">Consultation Summary</h4>
                      </div>
                      <div className="bg-slate-50 dark:bg-zinc-950 rounded-3xl p-6 relative border border-transparent dark:border-zinc-800">
                        <span className="absolute top-4 left-4 text-4xl text-slate-200 dark:text-zinc-800 font-serif font-black leading-none">“</span>
                        <p className="text-slate-700 dark:text-zinc-300 text-base font-bold leading-relaxed relative z-10 pl-4">{opd.Description}</p>
                      </div>
                    </div>
                  )}

                  {/* Diagnoses */}
                  {opd.Diagnoses.length > 0 && (
                    <div className="space-y-4">
                      <h4 className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-[0.2em]">Confirmed Diagnoses</h4>
                      <div className="flex flex-wrap gap-2">
                        {opd.Diagnoses.map((d) => (
                          <span key={d.OPDDiagnosisTypeID} className="px-5 py-2.5 bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-400 rounded-2xl text-sm font-black border border-teal-100 dark:border-teal-800/50">
                            {d.DiagnosisType.DiagnosisTypeName}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Prescription List */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-[0.2em]">Medication Plan</h4>
                    {opd.prescription ? (
                      <div className="space-y-6">
                        <div className="overflow-x-auto border border-slate-100 dark:border-zinc-800 rounded-[2rem]">
                          <table className="w-full min-w-[600px]">
                            <thead>
                              <tr className="bg-slate-50 dark:bg-zinc-950 border-b border-slate-100 dark:border-zinc-800">
                                <th className="px-6 py-5 text-left text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest">Medicine</th>
                                <th className="px-6 py-5 text-center text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest">Dosage</th>
                                <th className="px-6 py-5 text-center text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest">Frequency</th>
                                <th className="px-6 py-5 text-center text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest">Duration</th>
                                <th className="px-6 py-5 text-right text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest">Instructions</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 dark:divide-zinc-800/50">
                              {opd.prescription.Medicines.map((m) => (
                                <tr key={m.ID} className="hover:bg-slate-50/50 dark:hover:bg-zinc-800/30 transition-colors">
                                  <td className="px-6 py-6">
                                    <p className="text-sm font-black text-slate-900 dark:text-zinc-100">
                                      {m.Medicine?.Name || m.MedicineName || "Unknown Medicine"}
                                    </p>
                                  </td>
                                  <td className="px-6 py-6 text-center">
                                    <span className="inline-block text-xs font-bold text-slate-600 dark:text-zinc-400 bg-slate-100 dark:bg-zinc-800 px-3 py-1.5 rounded-xl border border-transparent dark:border-zinc-700">
                                      {m.Dosage}
                                    </span>
                                  </td>
                                  <td className="px-6 py-6 text-center">
                                    <span className="inline-block text-xs font-bold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/10 px-3 py-1.5 rounded-xl border border-teal-100 dark:border-teal-900/50">
                                      {m.Frequency}
                                    </span>
                                  </td>
                                  <td className="px-6 py-6 text-center">
                                    <span className="inline-block text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/10 px-3 py-1.5 rounded-xl border border-amber-100 dark:border-amber-900/50">
                                      {m.Duration}
                                    </span>
                                  </td>
                                  <td className="px-6 py-6 text-right">
                                    <span className="inline-block text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/10 px-4 py-2 rounded-2xl border border-emerald-100 dark:border-emerald-900/50">
                                      {m.Instructions || "As directed"}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        {opd.prescription.Notes && (
                          <div className="bg-amber-50 dark:bg-amber-900/10 rounded-2xl p-5 border border-amber-100 dark:border-amber-900/50 flex items-start gap-3">
                            <Info className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-amber-800 dark:text-amber-200 font-bold leading-relaxed">{opd.prescription.Notes}</p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="p-10 text-center bg-slate-50 dark:bg-zinc-950 rounded-3xl border border-dashed border-slate-200 dark:border-zinc-800">
                        <p className="text-slate-400 dark:text-zinc-500 font-bold italic">No medications prescribed for this visit.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Lab Investigations Section */}
              {opd.LabOrders.length > 0 && (
                <div className="bg-white dark:bg-zinc-900 rounded-[2rem] shadow-sm dark:shadow-none border border-slate-100 dark:border-zinc-800 overflow-hidden">
                  <div className="p-8 border-b border-slate-50 dark:border-zinc-800 flex items-center gap-3">
                    <div className="w-10 h-10 bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400 rounded-xl flex items-center justify-center">
                      <FlaskConical className="w-5 h-5" />
                    </div>
                    <h3 className="text-xl font-black text-slate-900 dark:text-zinc-100">Lab Investigations</h3>
                  </div>
                  <div className="p-8 space-y-10">
                    {opd.LabOrders.map((order) => (
                      <div key={order.OrderID} className="space-y-6">
                        <div className="flex items-center justify-between px-2">
                          <h4 className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-[0.2em]">Order #{order.OrderID} • {formatDate(order.OrderDate)}</h4>
                          <span className={`px-4 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-widest border ${
                            order.Status === 'COMPLETED' ? 'bg-green-50 dark:bg-green-900/10 text-green-700 dark:text-green-400 border-green-100 dark:border-green-800/50' : 'bg-amber-50 dark:bg-amber-900/10 text-amber-700 dark:text-amber-400 border-amber-100 dark:border-amber-800/50'
                          }`}>
                            {order.Status.replace('_', ' ')}
                          </span>
                        </div>
                        <div className="overflow-x-auto border border-slate-100 dark:border-zinc-800 rounded-[2rem]">
                          <table className="w-full min-w-[500px]">
                            <thead>
                              <tr className="bg-slate-50 dark:bg-zinc-950 border-b border-slate-100 dark:border-zinc-800">
                                <th className="px-6 py-5 text-left text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest">Test Name</th>
                                <th className="px-6 py-5 text-center text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest">Status</th>
                                <th className="px-6 py-5 text-right text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest">Result</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 dark:divide-zinc-800/50">
                              {order.Items.map((item) => (
                                <tr key={item.OrderItemID} className="hover:bg-slate-50/50 dark:hover:bg-zinc-800/30 transition-colors">
                                  <td className="px-6 py-6">
                                    <p className="text-sm font-black text-slate-900 dark:text-zinc-100">{item.Test.TestName}</p>
                                  </td>
                                  <td className="px-6 py-6 text-center">
                                    <span className={`inline-block text-[10px] font-black px-3 py-1.5 rounded-xl border ${
                                      item.Status === 'COMPLETED' ? 'bg-green-50 dark:bg-green-900/10 text-green-600 dark:text-green-400 border-green-100 dark:border-green-800/50' : 'bg-slate-50 dark:bg-zinc-800 text-slate-400 dark:text-zinc-400 border-slate-100 dark:border-zinc-700'
                                    }`}>
                                      {item.Status.replace('_', ' ')}
                                    </span>
                                  </td>
                                  <td className="px-6 py-6 text-right">
                                    {item.ResultValue ? (
                                      <p className="text-sm font-black text-teal-600 dark:text-teal-400">{item.ResultValue}</p>
                                    ) : (
                                      <p className="text-xs text-slate-400 dark:text-zinc-500 font-bold italic">Pending</p>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        {order.Notes && (
                          <div className="bg-slate-50 dark:bg-zinc-950 rounded-2xl p-4 border border-slate-100 dark:border-zinc-800">
                             <p className="text-xs text-slate-500 dark:text-zinc-400 font-bold"><span className="text-slate-400 dark:text-zinc-500 uppercase tracking-widest mr-2">Clinician Note:</span> {order.Notes}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Sidebar content */}
        <div className="space-y-8">
          {/* Billing Card */}
          <div className="bg-slate-900 dark:bg-zinc-900 rounded-[2.5rem] p-10 text-white shadow-2xl dark:shadow-none dark:border dark:border-zinc-800 relative overflow-hidden">
            <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-teal-500 dark:bg-teal-600 rounded-full opacity-20 dark:opacity-10 blur-3xl" />
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-500 to-transparent dark:from-teal-600 opacity-50 dark:opacity-30" />
            
            <Receipt className="w-12 h-12 text-teal-400 dark:text-teal-500 mb-8" />
            <h2 className="text-xl font-black mb-8 tracking-tight">Financial Summary</h2>
            
            {latestReceipt ? (
              <div className="space-y-8">
                <div className="pb-6 border-b border-white/10 dark:border-zinc-800">
                  <span className="text-slate-400 dark:text-zinc-500 text-xs font-black uppercase tracking-widest block mb-2">Grand Total</span>
                  <span className="text-4xl font-black text-teal-400 dark:text-teal-500 tracking-tight">₹{latestReceipt.AmountPaid.toString()}</span>
                </div>
                
                <div className="space-y-5 flex-1">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400 dark:text-zinc-400 font-bold">Registration</span>
                    <span className="font-black text-zinc-100">₹{opd.RegistrationFee?.toString()}</span>
                  </div>
                  {latestReceipt.ReceiptTrans.map((tr) => (
                    <div key={tr.ReceiptTranID} className="flex justify-between items-center text-sm">
                      <span className="text-slate-400 dark:text-zinc-400 font-bold whitespace-nowrap overflow-hidden text-ellipsis mr-4">{tr.SubTreatmentType.SubTreatmentTypeName}</span>
                      <span className="font-black text-zinc-100">₹{tr.Amount.toString()}</span>
                    </div>
                  ))}
                </div>
                
                <div className="pt-6 mt-6 border-t border-white/10 dark:border-zinc-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
                    <span className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-[0.2em]">Transaction Success</span>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-slate-500 dark:text-zinc-600 space-y-4">
                <div className="w-16 h-16 bg-white/5 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto border border-transparent dark:border-zinc-700">
                  <Clock className="w-8 h-8 opacity-20 dark:opacity-40" />
                </div>
                <p className="text-sm font-bold opacity-50 dark:opacity-100">Settlement in progress...</p>
              </div>
            )}
          </div>

          {/* Help Card */}
          <div className="bg-white dark:bg-zinc-900 rounded-[2rem] p-8 border border-slate-100 dark:border-zinc-800 shadow-sm dark:shadow-none">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-slate-50 dark:bg-zinc-950 rounded-2xl flex items-center justify-center text-slate-400 dark:text-zinc-500 shadow-inner dark:shadow-none dark:border dark:border-zinc-800">
                <Info className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900 dark:text-zinc-100 tracking-tight">Visit Support</h3>
            </div>
            <p className="text-sm text-slate-500 dark:text-zinc-400 leading-relaxed mb-8 font-bold">
              If you notice any discrepancies in your prescription or need clarification on the diagnosis, our medical support team is here to help.
            </p>
            <button className="w-full py-4 bg-slate-50 dark:bg-zinc-950 hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-900 dark:text-zinc-100 font-black rounded-2xl transition-colors text-sm shadow-sm dark:shadow-none border border-slate-100 dark:border-zinc-800">
              Contact Hospital
            </button>
          </div>
        </div>
      </div>

      {!completed && (
        /* Pending state placeholder */
        <div className="bg-white dark:bg-zinc-900 rounded-[3rem] p-20 text-center border border-slate-100 dark:border-zinc-800 shadow-sm dark:shadow-none relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-teal-600 dark:bg-teal-500 opacity-10 dark:opacity-20" />
          <div className="w-24 h-24 bg-slate-50 dark:bg-zinc-950 rounded-full flex items-center justify-center text-slate-200 dark:text-zinc-700 mx-auto mb-8 shadow-inner border border-transparent dark:border-zinc-800">
            <FileText className="w-12 h-12" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-zinc-50 mb-3">Record Generation in Progress</h2>
          <p className="text-slate-500 dark:text-zinc-400 max-w-md mx-auto text-base font-bold leading-relaxed mb-10">
            Your clinical summary, including vitals and prescriptions, is being finalized and will appear here shortly after the doctor signs off.
          </p>
          {opd.Status === "REGISTERED" && (
            <Link
              href="/patient/appointments"
              className="inline-flex items-center gap-3 px-10 py-4 bg-teal-600 dark:bg-teal-500 text-white font-black rounded-[1.5rem] hover:bg-teal-700 dark:hover:bg-teal-400 transition-all shadow-xl dark:shadow-none shadow-teal-100 active:scale-95"
            >
              <Calendar className="w-5 h-5" />
              Manage Appointments
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
