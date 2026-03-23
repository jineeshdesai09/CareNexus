import { prisma } from "@/lib/prisma";
import { requireAdmin } from "../../lib/auth";
import { updateHospital } from "@/app/actions/hospital";
import { Building2, MapPin, CreditCard, Hash, Settings2, CheckCircle2, Save } from "lucide-react";

export const runtime = "nodejs";

export default async function HospitalPage({
  searchParams,
}: {
  searchParams?: Promise<{ success?: string }>;
}) {
  await requireAdmin();

  const params = await searchParams;
  const hospital = await prisma.hospital.findFirst();

  if (!hospital) {
    return (
        <div className="p-8 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-3xl border border-red-100 dark:border-red-800/50 font-bold">
            No hospital configuration found. Please run the seed script.
        </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-zinc-50 tracking-tight">Hospital Configuration</h1>
        <p className="text-slate-500 dark:text-zinc-400 mt-1 font-medium">Manage global settings, branding, and financial rules</p>
      </div>

      {params?.success && (
        <div className="flex items-center gap-3 p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/50 text-emerald-700 dark:text-emerald-400 rounded-2xl animate-in slide-in-from-top-2">
          <CheckCircle2 className="w-5 h-5" />
          <p className="font-bold">Hospital configuration updated successfully</p>
        </div>
      )}

      <form action={updateHospital} className="space-y-8">
        <input type="hidden" name="hospitalId" value={hospital.HospitalID} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Branding & Identity */}
            <div className="bg-white dark:bg-zinc-900 p-8 rounded-[2rem] border border-slate-100 dark:border-zinc-800 shadow-xl shadow-slate-100 dark:shadow-none space-y-6">
                <h3 className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.2em] flex items-center gap-2 mb-4">
                    <Building2 className="w-4 h-4" />
                    Identity & Branding
                </h3>
                
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-wider">Hospital Name</label>
                        <input
                            name="HospitalName"
                            type="text"
                            defaultValue={hospital.HospitalName}
                            required
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-blue-500 font-bold text-slate-900 dark:text-zinc-100 transition-all placeholder:text-slate-400 dark:placeholder:text-zinc-600"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-wider">Physical Address</label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-3.5 w-4 h-4 text-slate-400 dark:text-zinc-500" />
                            <textarea
                                name="Address"
                                defaultValue={hospital.Address ?? ""}
                                rows={2}
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-blue-500 font-bold text-slate-900 dark:text-zinc-100 transition-all resize-none placeholder:text-slate-400 dark:placeholder:text-zinc-600"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Financial Rules */}
            <div className="bg-white dark:bg-zinc-900 p-8 rounded-[2rem] border border-slate-100 dark:border-zinc-800 shadow-xl shadow-slate-100 dark:shadow-none space-y-6">
                <h3 className="text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.2em] flex items-center gap-2 mb-4">
                    <CreditCard className="w-4 h-4" />
                    Financial Policy
                </h3>
                
                <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-wider">OPD Registration Charge (₹)</label>
                        <input
                            name="RegistrationCharge"
                            type="number"
                            defaultValue={hospital.RegistrationCharge?.toNumber() ?? 0}
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-blue-500 font-bold text-slate-900 dark:text-zinc-100"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-wider">Validity Period (Months)</label>
                        <input
                            name="RegistrationValidityMonths"
                            type="number"
                            defaultValue={hospital.RegistrationValidityMonths ?? 0}
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-blue-500 font-bold text-slate-900 dark:text-zinc-100"
                        />
                    </div>
                </div>
            </div>

            {/* Sequential Numbering */}
            <div className="md:col-span-2 bg-white dark:bg-zinc-900 p-8 rounded-[2rem] border border-slate-100 dark:border-zinc-800 shadow-xl shadow-slate-100 dark:shadow-none">
                <h3 className="text-xs font-black text-slate-400 dark:text-zinc-500 uppercase tracking-[0.2em] flex items-center gap-2 mb-8 border-b border-slate-50 dark:border-zinc-800/50 pb-4">
                    <Hash className="w-4 h-4" />
                    System Numbering (Opening Balance)
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-wider">Start Patient ID at</label>
                        <input
                            name="OpeningPatientNo"
                            type="number"
                            defaultValue={hospital.OpeningPatientNo ?? 0}
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-blue-500 font-bold text-lg text-slate-900 dark:text-zinc-100"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-wider">Start OPD No at</label>
                        <input
                            name="OpeningOPDNo"
                            type="number"
                            defaultValue={hospital.OpeningOPDNo ?? 0}
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-blue-500 font-bold text-lg text-slate-900 dark:text-zinc-100"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-wider">Start Receipt No at</label>
                        <input
                            name="OpeningReceiptNo"
                            type="number"
                            defaultValue={hospital.OpeningReceiptNo ?? 0}
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-blue-500 font-bold text-lg text-slate-900 dark:text-zinc-100"
                        />
                    </div>
                </div>
            </div>

            {/* Feature Toggles */}
            <div className="md:col-span-2 bg-slate-900 dark:bg-zinc-950 border border-transparent dark:border-zinc-800/50 p-8 rounded-[2rem] text-white flex flex-col md:flex-row justify-between items-center gap-8 shadow-inner">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/10 dark:bg-blue-500/10 rounded-2xl">
                        <Settings2 className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                        <p className="text-lg font-black tracking-tight dark:text-zinc-50">Operation Controls</p>
                        <p className="text-sm text-slate-400 dark:text-zinc-400 font-medium">Enable or disable specific system modules</p>
                    </div>
                </div>

                <div className="flex flex-wrap gap-6">
                    <label className="flex items-center gap-3 cursor-pointer group">
                        <input
                            type="checkbox"
                            name="IsRateEnableInReceipt"
                            defaultChecked={hospital.IsRateEnableInReceipt ?? false}
                            className="w-6 h-6 rounded-lg bg-white/5 border-white/10 text-blue-500 focus:ring-0 transition-all cursor-pointer dark:bg-zinc-900"
                        />
                        <span className="font-bold text-sm group-hover:text-blue-400 transition-colors">Show Rates in Receipts</span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer group">
                        <input
                            type="checkbox"
                            name="IsRegistrationFeeEnableInOPD"
                            defaultChecked={hospital.IsRegistrationFeeEnableInOPD ?? false}
                            className="w-6 h-6 rounded-lg bg-white/5 border-white/10 text-blue-500 focus:ring-0 transition-all cursor-pointer dark:bg-zinc-900"
                        />
                        <span className="font-bold text-sm group-hover:text-blue-400 transition-colors">Automated Reg Fee</span>
                    </label>
                </div>
            </div>
        </div>

        <div className="flex justify-end pt-4">
            <button
                type="submit"
                className="px-10 py-5 bg-blue-600 dark:bg-blue-500 text-white font-black text-xl rounded-[2rem] hover:bg-blue-700 dark:hover:bg-blue-600 transition-all flex items-center gap-3 shadow-2xl shadow-blue-200 dark:shadow-blue-900/20 active:scale-95 border-b-[4px] border-blue-800 dark:border-blue-700 active:border-b-0"
            >
                <Save className="w-6 h-6" />
                Commit Configuration
            </button>
        </div>
      </form>
    </div>
  );
}
