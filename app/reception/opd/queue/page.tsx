import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/app/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { 
  Clock, 
  CheckCircle2, 
  Wallet, 
  AlertCircle, 
  User, 
  Stethoscope, 
  ArrowRight,
  Search,
  Filter,
  ClipboardList
} from "lucide-react";

export const runtime = "nodejs";

export default async function OPDQueuePage({
  searchParams,
}: {
  searchParams?: Promise<{ status?: string }>;
}) {
  const user = await getCurrentUser();

  if (!user || user.Role !== "RECEPTIONIST") {
    redirect("/login");
  }

  const params = await searchParams;
  const currentTab = params?.status || "WAITING";

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  // Fetch OPDs for today
  const opds = await prisma.oPD.findMany({
    where: {
      OPDDateTime: { gte: startOfDay, lte: endOfDay },
      Status: currentTab as any,
    },
    orderBy: [
      { IsEmergency: "desc" },
      { TokenNo: "asc" },
    ],
    include: {
      Patient: {
        select: {
          PatientName: true,
          PatientNo: true,
          Gender: true,
          Age: true,
        },
      },
      Doctor: {
        select: {
          FirstName: true,
          LastName: true,
          Specialization: true,
        },
      },
    },
  });

  const tabs = [
    { id: "REGISTERED", label: "Appointments", icon: ClipboardList, color: "text-indigo-600", bg: "bg-indigo-50" },
    { id: "WAITING", label: "Waiting Room", icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
    { id: "IN_CONSULTATION", label: "In Consultation", icon: Stethoscope, color: "text-blue-600", bg: "bg-blue-50" },
    { id: "COMPLETED", label: "Ready for Billing", icon: Wallet, color: "text-green-600", bg: "bg-green-50" },
    { id: "BILLED", label: "Today's History", icon: CheckCircle2, color: "text-slate-600", bg: "bg-slate-50" },
  ];

  // Action for Check-In
  const checkInAction = async (formData: FormData) => {
    "use server";
    const opdId = Number(formData.get("opdId"));
    const { prisma } = await import("@/lib/prisma");
    const { revalidatePath } = await import("next/cache");
    
    await prisma.oPD.update({
        where: { OPDID: opdId },
        data: { Status: "WAITING" }
    });
    
    revalidatePath("/reception/opd/queue");
  };

  // Action for Calling Patient (Moving to IN_CONSULTATION)
  const callPatientAction = async (formData: FormData) => {
    "use server";
    const opdId = Number(formData.get("opdId"));
    const { prisma } = await import("@/lib/prisma");
    const { revalidatePath } = await import("next/cache");
    
    await prisma.oPD.update({
        where: { OPDID: opdId },
        data: { Status: "IN_CONSULTATION" }
    });
    
    revalidatePath("/reception/opd/queue");
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100 pb-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">OPD Operations</h1>
          <p className="text-gray-500 mt-1 font-medium">Manage patient flow and financial settlement</p>
        </div>
        <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition">
                <Search className="w-4 h-4" />
                Find Token
            </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 p-1 bg-gray-100 rounded-2xl w-fit">
        {tabs.map((tab) => (
          <Link
            key={tab.id}
            href={`/reception/opd/queue?status=${tab.id}`}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${
              currentTab === tab.id
                ? "bg-white text-gray-900 shadow-sm scale-105"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <tab.icon className={`w-4 h-4 ${currentTab === tab.id ? tab.color : ""}`} />
            {tab.label}
          </Link>
        ))}
      </div>

      {/* Queue Content */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-100 overflow-hidden">
        {opds.length === 0 ? (
          <div className="p-20 text-center space-y-4">
            <div className="w-20 h-20 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center mx-auto">
                <Clock className="w-10 h-10" />
            </div>
            <div>
                <p className="text-xl font-bold text-gray-900">Queue is Clear</p>
                <p className="text-gray-400">No patients are currently in the <span className="font-bold text-gray-600">{currentTab.toLowerCase().replace('_', ' ')}</span> status.</p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50/50 border-b border-gray-100">
                <tr>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Token Info</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Patient Details</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Doctor Assigned</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {opds.map((opd) => (
                  <tr key={opd.OPDID} className="group hover:bg-gray-50/50 transition-colors">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-2xl flex flex-col items-center justify-center border-2 ${
                            opd.IsEmergency ? "bg-red-50 border-red-200 text-red-600 animate-pulse" : "bg-white border-gray-100 text-gray-900"
                        }`}>
                            <span className="text-[10px] font-black uppercase leading-none mb-0.5">Tk</span>
                            <span className="text-xl font-black leading-none">{opd.TokenNo ?? "-"}</span>
                        </div>
                        {opd.IsEmergency && (
                            <div className="px-2 py-0.5 bg-red-600 text-[8px] font-black text-white rounded uppercase tracking-tighter">Emergency</div>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div>
                        <p className="font-black text-gray-900 group-hover:text-blue-600 transition-colors">{opd.Patient.PatientName}</p>
                        <p className="text-xs text-gray-500 font-medium mt-1">
                            {opd.Patient.PatientNo} • {opd.Patient.Age}Y • {opd.Patient.Gender.charAt(0)}
                        </p>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                            <Stethoscope className="w-4 h-4" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-900">Dr. {opd.Doctor.FirstName} {opd.Doctor.LastName}</p>
                            <p className="text-[10px] font-bold text-blue-500 uppercase tracking-wider">{opd.Doctor.Specialization}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      {opd.Status === 'REGISTERED' ? (
                        <form action={checkInAction}>
                            <input type="hidden" name="opdId" value={opd.OPDID} />
                            <button 
                                type="submit"
                                className="inline-flex items-center gap-2 bg-indigo-600 text-white px-5 py-2 rounded-xl text-sm font-black hover:bg-indigo-700 transition shadow-lg shadow-indigo-100 active:scale-95"
                            >
                                <CheckCircle2 className="w-4 h-4" />
                                Check In
                            </button>
                        </form>
                      ) : opd.Status === 'COMPLETED' ? (
                        <Link 
                          href={`/reception/billing/${opd.OPDID}`} 
                          className="inline-flex items-center gap-2 bg-green-600 text-white px-5 py-2 rounded-xl text-sm font-black hover:bg-green-700 transition shadow-lg shadow-green-100 active:scale-95"
                        >
                          <Wallet className="w-4 h-4" />
                          Process Bill
                        </Link>
                      ) : opd.Status === 'WAITING' ? (
                        <form action={callPatientAction}>
                            <input type="hidden" name="opdId" value={opd.OPDID} />
                            <button 
                                type="submit"
                                className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-xl text-sm font-black hover:bg-blue-700 transition shadow-lg shadow-blue-100 active:scale-95"
                            >
                                <Stethoscope className="w-4 h-4" />
                                Call Now
                            </button>
                        </form>
                      ) : opd.Status === 'BILLED' ? (
                        <div className="flex items-center justify-end gap-2 text-gray-400 font-bold text-xs uppercase">
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                            Settled
                        </div>
                      ) : (
                        <div className="flex items-center justify-end gap-2 text-slate-400 font-bold text-xs uppercase tracking-widest">
                            <Clock className="w-4 h-4" />
                            {opd.Status.replace('_', ' ')}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100 flex items-start gap-4">
              <AlertCircle className="text-blue-600 w-6 h-6 shrink-0 mt-1" />
              <div>
                  <p className="text-sm font-bold text-blue-900">Billing Notice</p>
                  <p className="text-xs text-blue-700 leading-relaxed mt-1">Patients in the "Ready for Billing" tab have finished their consultation. Ensure all treatments are added before printing the final receipt.</p>
              </div>
          </div>
          <div className="p-6 bg-slate-900 rounded-2xl text-white md:col-span-2 flex justify-between items-center">
              <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Currently Serving</p>
                  <p className="text-xl font-black mt-1">
                      {opds.find(o => o.Status === "IN_CONSULTATION")?.Patient.PatientName || "No active consultation"}
                  </p>
              </div>
              <ArrowRight className="text-slate-700 w-10 h-10" />
          </div>
      </div>
    </div>
  );
}
