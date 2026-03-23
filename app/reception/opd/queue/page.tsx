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
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
    { id: "REGISTERED", label: "Appointments", icon: ClipboardList, activeText: "text-teal-700 dark:text-teal-400" },
    { id: "WAITING", label: "Waiting Room", icon: Clock, activeText: "text-amber-700 dark:text-amber-400" },
    { id: "IN_CONSULTATION", label: "Consultation", icon: Stethoscope, activeText: "text-blue-700 dark:text-blue-400" },
    { id: "COMPLETED", label: "Ready for Billing", icon: Wallet, activeText: "text-emerald-700 dark:text-emerald-400" },
    { id: "BILLED", label: "Settled", icon: CheckCircle2, activeText: "text-slate-700 dark:text-slate-300" },
  ];

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

  const cancelOPDAction = async (formData: FormData) => {
    "use server";
    const opdId = Number(formData.get("opdId"));
    const { prisma } = await import("@/lib/prisma");
    const { revalidatePath } = await import("next/cache");
    
    await prisma.$transaction(async (tx) => {
        await tx.oPD.update({
            where: { OPDID: opdId },
            data: { Status: "CANCELLED" }
        });

        const receipt = await tx.receipt.findFirst({ where: { OPDID: opdId } });
        if (receipt) {
            await tx.receipt.update({
                where: { ReceiptID: receipt.ReceiptID },
                data: {
                    CancellationDateTime: new Date(),
                    CancellationRemarks: "OPD Cancelled - Automated Refund Request"
                }
            });
        }
    });
    
    revalidatePath("/reception/opd/queue");
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 dark:border-zinc-800 pb-6 pt-2">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-zinc-50 tracking-tight flex items-center gap-3">
              OPD Operations
          </h1>
          <p className="text-slate-500 dark:text-zinc-400 mt-1 font-medium text-sm">Manage patient flow and financial settlement</p>
        </div>
        <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-xl text-sm font-semibold text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800 transition shadow-sm target:ring-2 active:scale-95 focus:outline-none">
                <Search className="w-4 h-4" />
                Find Token
            </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-slate-100 dark:bg-zinc-800/50 rounded-2xl w-fit border border-slate-200 dark:border-zinc-800 shadow-inner">
        {tabs.map((tab) => {
            const isActive = currentTab === tab.id;
            return (
                <Link
                key={tab.id}
                href={`/reception/opd/queue?status=${tab.id}`}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                    isActive
                    ? `bg-white dark:bg-zinc-900 shadow-sm ${tab.activeText} ring-1 ring-slate-200 dark:ring-zinc-700`
                    : "text-slate-500 dark:text-zinc-400 hover:text-slate-700 dark:hover:text-zinc-200 hover:bg-slate-200/50 dark:hover:bg-zinc-800"
                }`}
                >
                <tab.icon className={`w-4 h-4 ${isActive ? "" : "opacity-70"}`} />
                {tab.label}
                </Link>
            )
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
            <Card className="border-none ring-1 ring-slate-200 dark:ring-zinc-800 shadow-md">
                {opds.length === 0 ? (
                <div className="p-20 text-center space-y-4">
                    <div className="w-16 h-16 bg-slate-50 dark:bg-zinc-800/50 text-slate-300 dark:text-zinc-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                        <Clock className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-lg font-bold text-slate-900 dark:text-zinc-100 tracking-tight">Queue is Clear</p>
                        <p className="text-sm font-medium text-slate-500 dark:text-zinc-400 mt-1">No patients are currently in the <span className="font-bold text-slate-700 dark:text-zinc-300">{currentTab.toLowerCase().replace('_', ' ')}</span> status.</p>
                    </div>
                </div>
                ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                    <thead className="bg-slate-50/80 dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-800">
                        <tr>
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-widest min-w-[120px]">Token</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-widest min-w-[200px]">Patient</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-widest">Doctor</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-widest text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
                        {opds.map((opd) => (
                        <tr key={opd.OPDID} className="group hover:bg-slate-50/50 dark:hover:bg-zinc-800/50 transition-colors">
                            <td className="px-6 py-5">
                            <div className="flex items-center gap-3">
                                <div className={`w-11 h-11 rounded-xl flex flex-col items-center justify-center border-2 shadow-sm ${
                                    opd.IsEmergency ? "bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-900/20 dark:border-rose-800/50 dark:text-rose-400 animate-pulse" : "bg-white dark:bg-zinc-950 border-slate-200 dark:border-zinc-700 text-slate-800 dark:text-zinc-200"
                                }`}>
                                    <span className="text-[9px] font-bold uppercase leading-none opacity-70 mb-0.5">Tk</span>
                                    <span className="text-lg font-black leading-none">{opd.TokenNo ?? "-"}</span>
                                </div>
                                {opd.IsEmergency && (
                                    <div className="px-2 py-0.5 bg-rose-600 text-[9px] font-bold text-white rounded uppercase tracking-wider shadow-sm">Emergency</div>
                                )}
                            </div>
                            </td>
                            <td className="px-6 py-5">
                            <div>
                                <p className="font-semibold text-sm text-slate-900 dark:text-zinc-100 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">{opd.Patient.PatientName}</p>
                                <p className="text-xs text-slate-500 dark:text-zinc-400 font-medium mt-1">
                                    #{opd.Patient.PatientNo} • {opd.Patient.Age}Y • {opd.Patient.Gender.charAt(0)}
                                </p>
                            </div>
                            </td>
                            <td className="px-6 py-5">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center border border-indigo-100 dark:border-indigo-800/50">
                                    <Stethoscope className="w-3.5 h-3.5" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-slate-900 dark:text-zinc-100">Dr. {opd.Doctor.LastName}</p>
                                    <p className="text-[10px] font-bold text-slate-500 dark:text-zinc-500 uppercase tracking-widest mt-0.5">{opd.Doctor.Specialization}</p>
                                </div>
                            </div>
                            </td>
                            <td className="px-6 py-5 text-right">
                            <div className="flex items-center justify-end gap-3">
                                {opd.Status === 'REGISTERED' ? (
                                    <form action={checkInAction}>
                                        <input type="hidden" name="opdId" value={opd.OPDID} />
                                        <button 
                                            type="submit"
                                            className="inline-flex items-center gap-2 bg-amber-500 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-amber-600 transition shadow-sm active:scale-95 border-b-[3px] border-amber-600 active:border-b-0"
                                        >
                                            <CheckCircle2 className="w-4 h-4" />
                                            Check In Patient
                                        </button>
                                    </form>
                                ) : opd.Status === 'COMPLETED' ? (
                                    <Link 
                                    href={`/reception/billing/${opd.OPDID}`} 
                                    className="inline-flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-emerald-700 transition shadow-sm active:scale-95 border-b-[3px] border-emerald-700 active:border-b-0"
                                    >
                                    <Wallet className="w-4 h-4" />
                                    Process Bill
                                    </Link>
                                ) : opd.Status === 'WAITING' ? (
                                    <form action={callPatientAction}>
                                        <input type="hidden" name="opdId" value={opd.OPDID} />
                                        <button 
                                            type="submit"
                                            className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-blue-700 transition shadow-sm active:scale-95 border-b-[3px] border-blue-700 active:border-b-0"
                                        >
                                            <Stethoscope className="w-4 h-4" />
                                            Call to Cabin
                                        </button>
                                    </form>
                                ) : opd.Status === 'BILLED' ? (
                                    <div className="flex items-center justify-end gap-2 text-slate-400 dark:text-zinc-500 font-bold text-[10px] uppercase tracking-widest">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                        Settled
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-end gap-2 text-slate-400 dark:text-zinc-500 font-bold text-[10px] uppercase tracking-widest">
                                        <Clock className="w-4 h-4" />
                                        {opd.Status.replace('_', ' ')}
                                    </div>
                                )}

                                {/* Cancel Button */}
                                {(opd.Status === 'REGISTERED' || opd.Status === 'WAITING' || opd.Status === 'COMPLETED') && (
                                    <form action={cancelOPDAction}>
                                        <input type="hidden" name="opdId" value={opd.OPDID} />
                                        <button 
                                            type="submit"
                                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 dark:hover:text-rose-400 rounded-lg transition-all"
                                            title="Cancel & Refund"
                                        >
                                            <AlertCircle className="w-4 h-4" />
                                        </button>
                                    </form>
                                )}
                            </div>
                            </td>
                        </tr>
                        ))}
                    </tbody>
                    </table>
                </div>
                )}
            </Card>
        </div>

        <div className="space-y-6">
            <Card className="bg-slate-900 dark:bg-zinc-950 border-none ring-1 ring-slate-800 dark:ring-zinc-800 shadow-xl shadow-slate-200 dark:shadow-none text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 dark:bg-teal-500/5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
                <CardContent className="p-6">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 relative z-10">Currently Serving</p>
                    <p className="text-xl font-black mt-1 text-zinc-50 leading-tight relative z-10">
                        {opds.find(o => o.Status === "IN_CONSULTATION")?.Patient.PatientName || "No active consultation"}
                    </p>
                    {opds.find(o => o.Status === "IN_CONSULTATION") && (
                        <div className="mt-4 flex items-center justify-between text-teal-400 relative z-10 border-t border-slate-800 dark:border-zinc-800 pt-4">
                            <span className="text-xs font-bold uppercase tracking-widest">In Progress</span>
                            <Stethoscope className="w-5 h-5 animate-pulse" />
                        </div>
                    )}
                </CardContent>
            </Card>

            <div className="p-5 bg-teal-50 dark:bg-teal-900/10 rounded-2xl border border-teal-100 dark:border-teal-900/30 flex items-start gap-3 shadow-sm">
                <AlertCircle className="text-teal-600 dark:text-teal-400 w-5 h-5 shrink-0 mt-0.5" />
                <div>
                    <p className="text-sm font-bold text-teal-900 dark:text-teal-300">Financial Notice</p>
                    <p className="text-xs font-medium text-teal-700/80 dark:text-teal-500/80 leading-relaxed mt-1.5">
                        Patients in the "Ready for Billing" tab have finished their consultation. Ensure all treatments are added before printing the final receipt.
                    </p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
