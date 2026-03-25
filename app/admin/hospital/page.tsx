import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/app/lib/auth";
import Link from "next/link";
import { Building2, Plus, Edit, MapPin } from "lucide-react";

export const runtime = "nodejs";

export default async function HospitalListPage() {
  await requireAdmin();

  const hospitals = await prisma.hospital.findMany({
    orderBy: { HospitalName: "asc" },
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 pt-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-zinc-50 tracking-tight flex items-center gap-3">
            <Building2 className="w-8 h-8 text-blue-600 dark:text-blue-500" />
            Hospital Branches
          </h1>
          <p className="text-slate-500 dark:text-zinc-400 mt-1 font-medium">
            Manage hospital configurations and branches
          </p>
        </div>
      </div>

      {hospitals.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-zinc-900 rounded-3xl border border-dashed border-slate-300 dark:border-zinc-700 flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-4">
            <Building2 className="w-8 h-8 text-blue-500 dark:text-blue-400" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-zinc-100 mb-2">No Hospitals Found</h3>
          <p className="text-slate-500 dark:text-zinc-400 max-w-sm">
            There are no hospital branches configured in the system. Please run the initial setup script.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hospitals.map((hospital) => (
            <div key={hospital.HospitalID} className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden flex flex-col min-h-[220px]">
              {/* Decorative Background blur */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 dark:bg-blue-400/5 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none group-hover:bg-blue-500/10 transition-colors"></div>
              
              <div className="flex items-start justify-between mb-4 relative z-10">
                <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-inner">
                  <Building2 className="w-6 h-6" />
                </div>
                <div className="px-3 py-1 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-xs font-bold uppercase tracking-wider rounded-lg border border-green-200 dark:border-green-800/30">
                  Active
                </div>
              </div>

              <div className="relative z-10 flex-1">
                <h2 className="text-xl font-bold text-slate-900 dark:text-zinc-100 mb-2 line-clamp-1">{hospital.HospitalName}</h2>
                <div className="flex items-start gap-2 text-slate-500 dark:text-zinc-400 text-sm font-medium">
                  <MapPin className="w-4 h-4 shrink-0 mt-0.5 opacity-70" />
                  <span className="line-clamp-2">{hospital.Address || "No address provided"}</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-zinc-800/60 relative z-10 flex items-center justify-between">
                <div className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest">
                  ID: #{hospital.HospitalID}
                </div>
                <Link
                  href={`/admin/hospital/${hospital.HospitalID}/edit`}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-zinc-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-slate-700 dark:text-zinc-300 hover:text-blue-700 dark:hover:text-blue-400 rounded-lg text-sm font-bold transition-all border border-slate-200 dark:border-zinc-700 shadow-sm"
                >
                  <Edit className="w-4 h-4" />
                  Configure
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
