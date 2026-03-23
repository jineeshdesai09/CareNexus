import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "../../lib/auth";
import { redirect } from "next/navigation";
import { 
  History, 
  Calendar, 
  ChevronRight,
  Stethoscope,
  Info
} from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/app/lib/utils/date";

export const runtime = "nodejs";

export default async function PatientHistory() {
  const user = await getCurrentUser();

  if (!user || user.Role !== "PATIENT") {
    redirect("/login");
  }

  const patient = await prisma.patient.findFirst({
    where: { UserID: user.UserID },
  });

  if (!patient) {
    redirect("/patient/dashboard");
  }

  const history = await prisma.oPD.findMany({
    where: { PatientID: patient.PatientID },
    orderBy: { OPDDateTime: "desc" },
    include: {
      Doctor: {
        select: {
          FirstName: true,
          LastName: true,
          Specialization: true
        }
      },
      Receipts: true
    }
  });

  return (
    <div className="space-y-8 animate-in mt-2 fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-zinc-50 mb-2">Medical History</h1>
          <p className="text-slate-500 dark:text-zinc-400">Your past consultations and medical records</p>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-sm dark:shadow-none border border-slate-100 dark:border-zinc-800 overflow-hidden">
        {history.length === 0 ? (
          <div className="p-20 text-center">
            <div className="w-16 h-16 bg-slate-50 dark:bg-zinc-950 rounded-full flex items-center justify-center text-slate-300 dark:text-zinc-700 mx-auto mb-4 border border-slate-100 dark:border-zinc-800">
              <History className="w-8 h-8" />
            </div>
            <p className="text-slate-500 dark:text-zinc-400 font-medium">No medical history found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-zinc-950/50 border-b border-slate-100 dark:border-zinc-800">
                  <th className="px-8 py-5 text-left text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest">Visit Date</th>
                  <th className="px-8 py-5 text-left text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest">Doctor</th>
                  <th className="px-8 py-5 text-left text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest">Token</th>
                  <th className="px-8 py-5 text-left text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest">Billed Amount</th>
                  <th className="px-8 py-5 text-center text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest">Status</th>
                  <th className="px-8 py-5 text-right text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-zinc-800">
                {history.map((visit) => {
                  const totalPaid = visit.Receipts.reduce((sum, r) => sum + Number(r.AmountPaid), 0);
                  
                  return (
                    <tr key={visit.OPDID} className="hover:bg-teal-50/30 dark:hover:bg-zinc-800/50 transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-slate-50 dark:bg-zinc-950 rounded-xl flex items-center justify-center text-slate-500 dark:text-zinc-500 group-hover:bg-white dark:group-hover:bg-zinc-900 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors border border-transparent dark:border-zinc-800">
                            <Calendar className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900 dark:text-zinc-100">
                              {formatDate(visit.OPDDateTime)}
                            </p>
                            <p className="text-xs text-slate-400 dark:text-zinc-500 font-medium">
                               {new Date(visit.OPDDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-teal-50 dark:bg-teal-900/20 rounded-full flex items-center justify-center text-teal-600 dark:text-teal-400 font-bold border border-teal-100 dark:border-teal-800/50">
                            {visit.Doctor.FirstName.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900 dark:text-zinc-100">Dr. {visit.Doctor.FirstName} {visit.Doctor.LastName}</p>
                            <p className="text-xs text-slate-400 dark:text-zinc-500 font-medium">{visit.Doctor.Specialization}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-sm font-bold text-slate-500 dark:text-zinc-400">#{visit.TokenNo}</span>
                      </td>
                      <td className="px-8 py-6">
                        {totalPaid > 0 ? (
                          <div className="flex flex-col">
                            <span className="text-sm font-black text-slate-800 dark:text-zinc-200">₹{totalPaid}</span>
                            <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-tight">{visit.Receipts[0].ReceiptNo}</span>
                          </div>
                        ) : (
                          <span className="text-sm font-medium text-slate-300 dark:text-zinc-600 italic">No bill</span>
                        )}
                      </td>
                      <td className="px-8 py-6 text-center">
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                          visit.Status === 'COMPLETED' 
                            ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800/50' 
                            : visit.Status === 'BILLED'
                            ? 'bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800/50'
                            : 'bg-teal-100 dark:bg-teal-900/20 text-teal-700 dark:text-teal-400 border-teal-200 dark:border-teal-800/50'
                        }`}>
                          {visit.Status}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <Link 
                          href={`/patient/history/${visit.OPDID}`}
                          className="inline-flex items-center gap-1 text-sm font-bold text-teal-600 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-300 transition-colors"
                        >
                          Details
                          <ChevronRight className="w-4 h-4" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
