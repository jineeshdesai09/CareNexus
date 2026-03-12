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
      }
    }
  });

  return (
    <div className="space-y-8 animate-in mt-2 fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Medical History</h1>
          <p className="text-slate-500">Your past consultations and medical records</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        {history.length === 0 ? (
          <div className="p-20 text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mx-auto mb-4">
              <History className="w-8 h-8" />
            </div>
            <p className="text-slate-500 font-medium">No medical history found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-8 py-5 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Visit Date</th>
                  <th className="px-8 py-5 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Doctor</th>
                  <th className="px-8 py-5 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Token</th>
                  <th className="px-8 py-5 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="px-8 py-5 text-right text-[10px] font-bold text-slate-400 uppercase tracking-widest">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {history.map((visit) => (
                  <tr key={visit.OPDID} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-500 group-hover:bg-white group-hover:text-blue-600 transition-colors">
                          <Calendar className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">
                            {formatDate(visit.OPDDateTime)}
                          </p>
                          <p className="text-xs text-slate-400 font-medium">
                             {new Date(visit.OPDDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 font-bold">
                          {visit.Doctor.FirstName.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">Dr. {visit.Doctor.FirstName} {visit.Doctor.LastName}</p>
                          <p className="text-xs text-slate-400 font-medium">{visit.Doctor.Specialization}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-sm font-bold text-slate-500">#{visit.TokenNo}</span>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        visit.Status === 'COMPLETED' 
                          ? 'bg-green-100 text-green-700' 
                          : visit.Status === 'BILLED'
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {visit.Status}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <Link 
                        href={`/patient/history/${visit.OPDID}`}
                        className="inline-flex items-center gap-1 text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        Details
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
