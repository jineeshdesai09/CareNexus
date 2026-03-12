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
  Info
} from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/app/lib/utils/date";
import PrintPrescriptionButton from "@/app/doctor/opd/[id]/PrintPrescriptionButton";
import PrintReceiptButton from "@/app/reception/billing/[opdId]/PrintReceiptButton";

export const runtime = "nodejs";

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
      }
    }
  });

  if (!opd || opd.PatientID !== patient.PatientID) {
    notFound();
  }

  const hospital = await prisma.hospital.findFirst();
  const latestReceipt = opd.Receipts[0];

  return (
    <div className="space-y-8 animate-in mt-2 fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <Link 
          href="/patient/history" 
          className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-bold"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to History
        </Link>
        
        <div className="flex gap-3">
          {opd.prescription && (
             <PrintPrescriptionButton 
               data={{
                 hospital: {
                    HospitalName: hospital?.HospitalName || "Hospital",
                    Address: hospital?.Address || "",
                    Description: hospital?.Description || ""
                 },
                 patient: patient,
                 doctor: opd.Doctor,
                 vitals: {
                    Weight: opd.Weight ? Number(opd.Weight.toString()) : null,
                    Height: opd.Height ? Number(opd.Height.toString()) : null,
                    BP: opd.BP_Systolic ? `${opd.BP_Systolic}/${opd.BP_Diastolic}` : null,
                    Temp: opd.Temperature ? Number(opd.Temperature.toString()) : null,
                    Pulse: opd.Pulse,
                    RespRate: opd.RespRate,
                    SpO2: opd.SpO2,
                 },
                 medicines: opd.prescription.Medicines.map(m => ({
                    name: m.Medicine.Name,
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
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Clinical Info */}
        <div className="lg:col-span-2 space-y-8">
          {/* Header Info */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -z-0 opacity-50" />
            <div className="flex items-start gap-6 relative z-10">
              <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600">
                <Stethoscope className="w-10 h-10" />
              </div>
              <div>
                <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">Consulting Physician</p>
                <h1 className="text-2xl font-black text-slate-900">Dr. {opd.Doctor.FirstName} {opd.Doctor.LastName}</h1>
                <p className="text-slate-500 font-medium mb-4">{opd.Doctor.Specialization}</p>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 px-3 py-1 bg-slate-50 rounded-lg text-slate-600 text-xs font-bold">
                    <Calendar className="w-4 h-4" />
                    {formatDate(opd.OPDDateTime)}
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-slate-50 rounded-lg text-slate-600 text-xs font-bold">
                    <ClipboardList className="w-4 h-4" />
                    Token #{opd.TokenNo}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Vitals Summary */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
             <div className="p-6 border-b border-slate-100 flex items-center gap-2 font-bold text-slate-900">
                <Activity className="w-5 h-5 text-red-500" />
                Clinical Vitals
             </div>
             <div className="p-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                {[
                  { label: "BP", value: opd.BP_Systolic && opd.BP_Diastolic ? `${opd.BP_Systolic}/${opd.BP_Diastolic}` : "--" },
                  { label: "Pulse", value: opd.Pulse || "--" },
                  { label: "Weight", value: opd.Weight ? `${opd.Weight} kg` : "--" },
                  { label: "SpO2", value: opd.SpO2 ? `${opd.SpO2}%` : "--" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">{stat.label}</p>
                    <p className="text-xl font-black text-slate-900">{stat.value}</p>
                  </div>
                ))}
             </div>
          </div>

          {/* Diagnosis & Prescription */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
             <div className="p-6 border-b border-slate-100 flex items-center gap-2 font-bold text-slate-900">
                <FileText className="w-5 h-5 text-blue-500" />
                Medical Assessment
             </div>
             <div className="p-8 space-y-8">
                {opd.Diagnoses.length > 0 && (
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Diagnosis</h3>
                    <div className="flex flex-wrap gap-2">
                      {opd.Diagnoses.map((d) => (
                        <span key={d.OPDDiagnosisTypeID} className="px-4 py-2 bg-blue-50 text-blue-700 rounded-xl text-sm font-bold">
                          {d.DiagnosisType.DiagnosisTypeName}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {opd.prescription ? (
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Prescribed Medicines</h3>
                    <div className="overflow-hidden border border-slate-50 rounded-2xl">
                      <table className="w-full">
                        <thead className="bg-slate-50">
                          <tr>
                            <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase">Medicine</th>
                            <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase">Dosage</th>
                            <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase">Instruction</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          {opd.prescription.Medicines.map((m) => (
                            <tr key={m.ID}>
                              <td className="px-6 py-4 text-sm font-bold text-slate-900">{m.Medicine.Name}</td>
                              <td className="px-6 py-4 text-sm text-slate-500">{m.Dosage} ({m.Duration})</td>
                              <td className="px-6 py-4 text-sm text-slate-400 font-medium italic">{m.Instructions || "N/A"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <p className="text-center py-8 text-slate-400 italic font-medium">No prescription record for this visit.</p>
                )}
             </div>
          </div>
        </div>

        {/* Financial Info Sidebar */}
        <div className="space-y-8">
          <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
            <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-blue-500 rounded-full opacity-10 blur-3xl" />
            <Receipt className="w-10 h-10 text-blue-400 mb-6" />
            <h2 className="text-lg font-bold mb-6">Billing Receipt</h2>
            
            {latestReceipt ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between py-2 border-b border-white/10">
                  <span className="text-slate-400 text-sm font-bold">Grand Total</span>
                  <span className="text-2xl font-black text-blue-400">₹{latestReceipt.AmountPaid.toString()}</span>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Reg. Fee</span>
                    <span className="font-bold">₹{opd.RegistrationFee?.toString()}</span>
                  </div>
                  {latestReceipt.ReceiptTrans.map((tr) => (
                    <div key={tr.ReceiptTranID} className="flex justify-between text-sm">
                      <span className="text-slate-400 whitespace-nowrap overflow-hidden text-ellipsis mr-4">{tr.SubTreatmentType.SubTreatmentTypeName}</span>
                      <span className="font-bold">₹{tr.Amount.toString()}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-4">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 text-center">Status: Paid</p>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-slate-500">
                <p className="text-sm font-bold">Billing not yet generated.</p>
              </div>
            )}
          </div>

          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
             <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                   <Info className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900">Need Help?</h3>
             </div>
             <p className="text-sm text-slate-500 leading-relaxed mb-6 font-medium">
               If you have any questions regarding your prescription or medical reports, please contact the hospital admin.
             </p>
             <button className="w-full py-4 bg-slate-100 text-slate-900 rounded-2xl font-black text-sm hover:bg-slate-200 transition-colors uppercase tracking-widest">
               Contact Support
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}
