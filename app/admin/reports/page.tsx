import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/app/lib/auth";
import Link from "next/link";
import { BarChart3, TrendingUp, Users, Calendar, ArrowRight, Stethoscope, Wallet, Activity } from "lucide-react";
import ExportReportsButton from "./ExportReportsButton";

export const runtime = "nodejs";

export default async function ReportsPage({
  searchParams,
}: {
  searchParams?: Promise<{ start?: string; end?: string }>;
}) {
  await requireAdmin();

  const params = await searchParams;
  const startDate = params?.start ? new Date(params.start) : new Date(new Date().setDate(new Date().getDate() - 30));
  const endDate = params?.end ? new Date(params.end) : new Date();

  // Aggregate Data for Dashboard
  const [totalOpds, totalRevenueResult, doctorWiseData, recentOpds, diagnosisData, dailyRevenue] = await Promise.all([
    prisma.oPD.count({
      where: {
        OPDDateTime: { gte: startDate, lte: endDate },
        Status: { not: "CANCELLED" }
      }
    }),
    prisma.receipt.aggregate({
      where: { ReceiptDate: { gte: startDate, lte: endDate } },
      _sum: { AmountPaid: true }
    }),
    prisma.doctor.findMany({
      select: {
        DoctorID: true,
        FirstName: true,
        LastName: true,
        Specialization: true,
        _count: {
          select: {
            OPDs: {
              where: {
                OPDDateTime: { gte: startDate, lte: endDate },
                Status: { not: "CANCELLED" }
              }
            }
          }
        }
      }
    }),
    prisma.oPD.findMany({
        where: { OPDDateTime: { gte: startDate, lte: endDate } },
        take: 10,
        orderBy: { OPDDateTime: "desc" },
        include: {
            Patient: { select: { PatientName: true } },
            Doctor: { select: { FirstName: true, LastName: true } }
        }
    }),
    prisma.diagnosisType.findMany({
        select: {
            DiagnosisTypeName: true,
            _count: {
                select: {
                    OPDs: {
                        where: {
                            OPD: {
                                OPDDateTime: { gte: startDate, lte: endDate }
                            }
                        }
                    }
                }
            }
        },
        orderBy: {
            OPDs: { _count: 'desc' }
        },
        take: 10
    }),
    prisma.receipt.groupBy({
        by: ['ReceiptDate'],
        _sum: {
            AmountPaid: true
        },
        where: {
            ReceiptDate: { gte: startDate, lte: endDate }
        },
        orderBy: {
            ReceiptDate: 'asc'
        }
    })
  ]);

  const totalRevenue = Number(totalRevenueResult._sum.AmountPaid || 0);

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Header & Filters */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-zinc-50 flex items-center gap-3">
            <BarChart3 className="text-blue-600 dark:text-blue-500 w-8 h-8" />
            Hospital Analytics
          </h1>
          <p className="text-gray-500 dark:text-zinc-400 mt-1">Monitor performance and revenue across departments</p>
        </div>

        <div className="flex items-center gap-3">
          <ExportReportsButton data={{ totalOpds, totalRevenue, doctorWiseData, diagnosisData }} />
          <form className="flex items-center gap-3 bg-white dark:bg-zinc-900 p-2 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm">
            <div className="flex items-center gap-2 px-3">
              <Calendar className="w-4 h-4 text-gray-400 dark:text-zinc-500" />
              <input 
                type="date" 
                name="start" 
                defaultValue={startDate.toISOString().split("T")[0]}
                className="text-sm font-medium focus:outline-none bg-transparent dark:text-zinc-100" 
                style={{ colorScheme: 'dark light' }}
              />
            </div>
            <div className="h-4 w-px bg-gray-200 dark:bg-zinc-800"></div>
            <div className="flex items-center gap-2 px-3">
              <input 
                type="date" 
                name="end" 
                defaultValue={endDate.toISOString().split("T")[0]}
                className="text-sm font-medium focus:outline-none bg-transparent dark:text-zinc-100" 
                style={{ colorScheme: 'dark light' }}
              />
            </div>
            <button className="bg-blue-600 dark:bg-blue-500 text-white px-4 py-1.5 rounded-lg text-sm font-bold hover:bg-blue-700 dark:hover:bg-blue-600 transition">
              Filter
            </button>
          </form>
        </div>
      </div>

      {/* Key Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-sm hover:shadow-md dark:shadow-none transition-shadow">
          <div className="flex justify-between items-center mb-4">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl border border-blue-100 dark:border-blue-800/50">
              <Users className="w-6 h-6" />
            </div>
            <TrendingUp className="w-4 h-4 text-green-500 dark:text-green-400" />
          </div>
          <p className="text-sm font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Total Consultations</p>
          <p className="text-3xl font-black text-gray-900 dark:text-zinc-50 mt-1">{totalOpds.toLocaleString()}</p>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-sm hover:shadow-md dark:shadow-none transition-shadow">
          <div className="flex justify-between items-center mb-4">
            <div className="p-3 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-xl border border-green-100 dark:border-green-800/50">
              <Wallet className="w-6 h-6" />
            </div>
            <TrendingUp className="w-4 h-4 text-green-500 dark:text-green-400" />
          </div>
          <p className="text-sm font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Total Revenue</p>
          <p className="text-3xl font-black text-gray-900 dark:text-zinc-50 mt-1">₹{totalRevenue.toLocaleString()}</p>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-sm hover:shadow-md dark:shadow-none transition-shadow">
          <div className="flex justify-between items-center mb-4">
            <div className="p-3 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-xl border border-purple-100 dark:border-purple-800/50">
              <Stethoscope className="w-6 h-6" />
            </div>
          </div>
          <p className="text-sm font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Average Ticket</p>
          <p className="text-3xl font-black text-gray-900 dark:text-zinc-50 mt-1">
            ₹{totalOpds > 0 ? Math.round(totalRevenue / totalOpds).toLocaleString() : 0}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Diagnosis Distribution */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-sm dark:shadow-none overflow-hidden">
          <div className="p-6 border-b border-gray-100 dark:border-zinc-800/50">
            <h2 className="text-xl font-bold text-gray-900 dark:text-zinc-100 flex items-center gap-2">
              <Activity className="text-red-600 dark:text-red-500 w-6 h-6" />
              Top Diagnoses
            </h2>
          </div>
          <div className="p-6 space-y-4">
            {diagnosisData.filter(d => d._count.OPDs > 0).map((diag, idx) => (
                <div key={idx} className="space-y-2">
                    <div className="flex justify-between text-sm font-bold">
                        <span className="text-gray-700 dark:text-zinc-300">{diag.DiagnosisTypeName}</span>
                        <span className="text-blue-600 dark:text-blue-400">{diag._count.OPDs} cases</span>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-zinc-800 rounded-full h-2">
                        <div 
                            className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full" 
                            style={{ width: `${(diag._count.OPDs / (totalOpds || 1)) * 100}%` }}
                        ></div>
                    </div>
                </div>
            ))}
            {diagnosisData.filter(d => d._count.OPDs > 0).length === 0 && (
                <p className="text-center text-gray-400 dark:text-zinc-500 py-8 font-medium">No diagnosis data available</p>
            )}
          </div>
        </div>

        {/* Daily Revenue Pattern */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-sm dark:shadow-none overflow-hidden">
          <div className="p-6 border-b border-gray-100 dark:border-zinc-800/50">
            <h2 className="text-xl font-bold text-gray-900 dark:text-zinc-100 flex items-center gap-2">
              <TrendingUp className="text-green-600 dark:text-green-500 w-6 h-6" />
              Daily Revenue Pattern
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
                {dailyRevenue.slice(-7).map((day, idx) => (
                    <div key={idx} className="flex items-center gap-4">
                        <span className="text-xs font-bold text-gray-500 dark:text-zinc-400 w-24">
                            {new Date(day.ReceiptDate).toLocaleDateString(undefined, { weekday: 'short', day: 'numeric' })}
                        </span>
                        <div className="flex-1 bg-gray-50 dark:bg-zinc-950 rounded-lg h-8 relative overflow-hidden border border-gray-100 dark:border-zinc-800">
                            <div 
                                className="absolute inset-y-0 left-0 bg-green-100 dark:bg-green-900/30 border-r-2 border-green-500 dark:border-green-600 transition-all duration-1000"
                                style={{ width: `${(Number(day._sum.AmountPaid || 0) / (Math.max(...dailyRevenue.map(d => Number(d._sum.AmountPaid || 0))) || 1)) * 100}%` }}
                            ></div>
                            <span className="absolute inset-0 flex items-center px-3 text-xs font-black text-green-800 dark:text-green-400">
                                ₹{Number(day._sum.AmountPaid).toLocaleString()}
                            </span>
                        </div>
                    </div>
                ))}
                {dailyRevenue.length === 0 && (
                    <p className="text-center text-gray-400 dark:text-zinc-500 py-8 font-medium">No revenue data for this period</p>
                )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Doctor-wise OPD Counts */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-sm dark:shadow-none overflow-hidden">
          <div className="p-6 border-b border-gray-100 dark:border-zinc-800/50 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900 dark:text-zinc-100 flex items-center gap-2">
              <Stethoscope className="text-blue-600 dark:text-blue-500 w-6 h-6" />
              Doctor-wise Performance
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 dark:bg-zinc-950/50 text-gray-600 dark:text-zinc-400 text-xs font-black uppercase tracking-widest border-b border-gray-100 dark:border-zinc-800">
                <tr>
                  <th className="px-6 py-4">Doctor</th>
                  <th className="px-6 py-4">Specialization</th>
                  <th className="px-6 py-4 text-right">OPDs</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-zinc-800/50">
                {doctorWiseData.sort((a,b) => b._count.OPDs - a._count.OPDs).map((doc) => (
                  <tr key={doc.DoctorID} className="hover:bg-gray-50/50 dark:hover:bg-zinc-800/20 transition">
                    <td className="px-6 py-4">
                      <p className="font-bold text-gray-900 dark:text-zinc-100">Dr. {doc.FirstName} {doc.LastName}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-zinc-400 font-medium">{doc.Specialization}</td>
                    <td className="px-6 py-4 text-right font-black text-blue-600 dark:text-blue-400">{doc._count.OPDs}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent OPD Log */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-sm dark:shadow-none overflow-hidden">
          <div className="p-6 border-b border-gray-100 dark:border-zinc-800/50 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900 dark:text-zinc-100 flex items-center gap-2">
              <TrendingUp className="text-green-600 dark:text-green-500 w-6 h-6" />
              Latest Activities
            </h2>
          </div>
          <div className="p-2">
            {recentOpds.length === 0 ? (
                <div className="p-8 text-center text-gray-400 dark:text-zinc-500 font-medium">No records found for this period</div>
            ) : (
                <div className="divide-y divide-gray-100 dark:divide-zinc-800/50">
                    {recentOpds.map((opd) => (
                        <div key={opd.OPDID} className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-zinc-800/20 rounded-xl transition">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50 text-blue-700 dark:text-blue-400 rounded-full flex items-center justify-center font-bold">
                                    {opd.Patient.PatientName.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900 dark:text-zinc-100">{opd.Patient.PatientName}</p>
                                    <p className="text-xs text-gray-500 dark:text-zinc-400">Dr. {opd.Doctor.FirstName} {opd.Doctor.LastName} • {new Date(opd.OPDDateTime).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className={`text-[10px] font-black uppercase px-2 py-1 rounded border ${
                                    opd.Status === "COMPLETED" ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800/50" :
                                    opd.Status === "BILLED" ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800/50" :
                                    "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/50"
                                }`}>
                                    {opd.Status}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
