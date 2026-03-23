import { searchDoctorPatients } from "@/app/actions/doctor";
import { getCurrentUser } from "@/app/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { CalendarClock, ActivitySquare, Search, Filter, X, User } from "lucide-react";

export const runtime = "nodejs";

export default async function DoctorPatientsPage({
  searchParams,
}: {
  searchParams: Promise<{ 
    tab?: string;
    q?: string;
    gender?: string;
    ageMin?: string;
    ageMax?: string;
  }>;
}) {
  const user = await getCurrentUser();
  if (!user || user.Role !== "DOCTOR") {
    redirect("/login");
  }

  const { tab, q, gender, ageMin, ageMax } = await searchParams;
  const activeTab = tab === "followup" ? "followup" : "all";

  // Use the advanced search action
  const patients = await searchDoctorPatients({
    query: q,
    gender: gender,
    ageMin: ageMin ? Number(ageMin) : undefined,
    ageMax: ageMax ? Number(ageMax) : undefined,
  });

  // Filter based on tab (Follow-up)
  const displayPatients =
    activeTab === "followup"
      ? patients.filter((p) => p.upcomingFollowUp !== null).sort((a,b) => new Date(a.upcomingFollowUp).getTime() - new Date(b.upcomingFollowUp).getTime())
      : patients;

  const hasFilters = q || (gender && gender !== "all") || ageMin || ageMax;

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pt-2">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-zinc-50 tracking-tight mb-2">Patient Directory</h1>
          <p className="text-slate-500 dark:text-zinc-400 font-medium text-sm">Search and manage your patient records and follow-ups.</p>
        </div>
      </div>

      {/* Advanced Filter Bar */}
      <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-zinc-800">
        <form className="flex flex-col lg:flex-row items-center gap-4">
          <input type="hidden" name="tab" value={activeTab} />
          
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-zinc-500" />
            <input 
              type="text" 
              name="q"
              defaultValue={q}
              placeholder="Search Name, ID, or Mobile..." 
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl text-sm text-slate-900 dark:text-zinc-100 font-medium placeholder:text-slate-400 focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <select 
              name="gender" 
              defaultValue={gender || "all"}
              className="px-4 py-2.5 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl text-sm text-slate-900 dark:text-zinc-100 font-medium focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all appearance-none"
            >
              <option value="all">All Genders</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>

            <div className="flex items-center gap-2 flex-1 lg:flex-none">
              <input 
                type="number" 
                name="ageMin"
                defaultValue={ageMin}
                placeholder="Min Age" 
                className="w-full lg:w-24 px-3 py-2.5 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl text-sm text-slate-900 dark:text-zinc-100 font-medium placeholder:text-slate-400 focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all"
              />
              <span className="text-slate-400 dark:text-zinc-600 font-bold">-</span>
              <input 
                type="number" 
                name="ageMax"
                defaultValue={ageMax}
                placeholder="Max Age" 
                className="w-full lg:w-24 px-3 py-2.5 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl text-sm text-slate-900 dark:text-zinc-100 font-medium placeholder:text-slate-400 focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all"
              />
            </div>

            <button 
              type="submit"
              className="w-full lg:w-auto px-6 py-2.5 bg-teal-600 text-white font-semibold text-sm rounded-xl hover:bg-teal-700 shadow-md shadow-teal-500/20 transition-all active:scale-95 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-2 dark:focus:ring-offset-zinc-900"
            >
              <Filter className="w-4 h-4" />
              Apply Filters
            </button>

            {hasFilters && (
              <Link 
                href={`/doctor/patients?tab=${activeTab}`}
                className="p-2.5 bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400 rounded-xl hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-900/30 dark:hover:text-rose-400 transition-all focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                <X className="w-5 h-5" />
              </Link>
            )}
          </div>
        </form>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-zinc-800/50 w-fit rounded-xl border border-slate-200 dark:border-zinc-800">
        <Link
          href={`/doctor/patients?tab=all${q ? `&q=${q}` : ''}${gender ? `&gender=${gender}` : ''}${ageMin ? `&ageMin=${ageMin}` : ''}${ageMax ? `&ageMax=${ageMax}` : ''}`}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
            activeTab === "all"
              ? "bg-white dark:bg-zinc-700 text-teal-700 dark:text-teal-400 shadow-sm border border-slate-200 dark:border-zinc-600"
              : "text-slate-500 dark:text-zinc-400 hover:text-slate-700 dark:hover:text-zinc-200"
          }`}
        >
          <ActivitySquare className="w-4 h-4" />
          Directory
        </Link>
        <Link
          href={`/doctor/patients?tab=followup${q ? `&q=${q}` : ''}${gender ? `&gender=${gender}` : ''}${ageMin ? `&ageMin=${ageMin}` : ''}${ageMax ? `&ageMax=${ageMax}` : ''}`}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
            activeTab === "followup"
              ? "bg-white dark:bg-zinc-700 text-emerald-600 dark:text-emerald-400 shadow-sm border border-slate-200 dark:border-zinc-600"
              : "text-slate-500 dark:text-zinc-400 hover:text-slate-700 dark:hover:text-zinc-200"
          }`}
        >
          <CalendarClock className="w-4 h-4" />
          Scheduled Follow-ups
        </Link>
      </div>

      {/* Patient List */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-slate-200 dark:border-zinc-800 overflow-hidden">
        {displayPatients.length === 0 ? (
          <div className="p-16 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-slate-50 dark:bg-zinc-800/50 rounded-full flex items-center justify-center text-slate-300 dark:text-zinc-600 mb-4">
               <Search className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-zinc-100 mb-1">No Patients Found</h3>
            <p className="text-sm text-slate-500 dark:text-zinc-400 font-medium max-w-xs mx-auto">
              We couldn't find any patients matching your current search or filter criteria.
            </p>
            {hasFilters && (
              <Link href="/doctor/patients" className="mt-4 text-sm text-teal-600 dark:text-teal-400 font-bold hover:underline">Clear all filters</Link>
            )}
          </div>
        ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-zinc-950/50 border-b border-slate-200 dark:border-zinc-800 text-slate-500 dark:text-zinc-400 text-[10px] font-bold uppercase tracking-widest">
                    <th className="px-6 py-4">Patient Information</th>
                    <th className="px-6 py-4">Contact Details</th>
                    <th className="px-6 py-4">Last Visit</th>
                    {activeTab === "followup" && <th className="px-6 py-4">Next Follow-up</th>}
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
                  {displayPatients.map((patient) => (
                    <tr key={patient.PatientID} className="hover:bg-slate-50/80 dark:hover:bg-zinc-800/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-teal-50 dark:bg-teal-900/40 text-teal-700 dark:text-teal-400 rounded-full flex items-center justify-center text-sm font-bold shadow-sm border border-teal-100 dark:border-teal-800/30">
                            {patient.PatientName[0]}
                          </div>
                          <div>
                            <p className="font-semibold text-sm text-slate-900 dark:text-zinc-100">{patient.PatientName}</p>
                            <p className="text-xs text-slate-500 dark:text-zinc-400 font-medium mt-0.5">
                              ID: #{patient.PatientNo} • {patient.Age}Y / {patient.Gender}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-slate-700 dark:text-zinc-300">{patient.MobileNo || "—"}</p>
                        <p className="text-[10px] text-slate-400 dark:text-zinc-500 font-bold uppercase tracking-wider mt-0.5">Mobile Number</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-slate-700 dark:text-zinc-300">{patient.lastVisit.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                        <p className="text-[10px] text-slate-400 dark:text-zinc-500 font-bold uppercase tracking-wider mt-0.5">Clinical Date</p>
                      </td>
                      {activeTab === "followup" && (
                          <td className="px-6 py-4">
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-900/20 dark:border-emerald-800/50 dark:text-emerald-400">
                                  <CalendarClock className="w-3.5 h-3.5" />
                                  {patient.upcomingFollowUp.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                              </span>
                          </td>
                      )}
                      <td className="px-6 py-4 text-right">
                        <Link 
                          href={`/doctor/patients/${patient.PatientID}`}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-300 text-xs font-semibold rounded-lg hover:bg-slate-50 dark:hover:bg-zinc-800 transition-all shadow-sm active:scale-95 focus:outline-none focus:ring-2 focus:ring-teal-500"
                        >
                          <User className="w-3.5 h-3.5" />
                          View Profile
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
