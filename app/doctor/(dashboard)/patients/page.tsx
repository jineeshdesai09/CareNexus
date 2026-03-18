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
    <div className="max-w-7xl mx-auto p-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Patient Directory</h1>
          <p className="text-slate-500 font-medium">Search and manage your patient records and follow-ups.</p>
        </div>
      </div>

      {/* Advanced Filter Bar */}
      <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
        <form className="flex flex-col lg:flex-row items-center gap-4">
          <input type="hidden" name="tab" value={activeTab} />
          
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              name="q"
              defaultValue={q}
              placeholder="Search Name, ID, or Mobile..." 
              className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-none rounded-2xl text-slate-900 font-bold placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>

          <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
            <select 
              name="gender" 
              defaultValue={gender || "all"}
              className="flex-1 lg:flex-none px-6 py-3.5 bg-slate-50 border-none rounded-2xl text-slate-900 font-bold focus:ring-2 focus:ring-indigo-500 transition-all"
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
                className="w-full lg:w-24 px-4 py-3.5 bg-slate-50 border-none rounded-2xl text-slate-900 font-bold placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 transition-all"
              />
              <span className="text-slate-300 font-bold">-</span>
              <input 
                type="number" 
                name="ageMax"
                defaultValue={ageMax}
                placeholder="Max Age" 
                className="w-full lg:w-24 px-4 py-3.5 bg-slate-50 border-none rounded-2xl text-slate-900 font-bold placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>

            <button 
              type="submit"
              className="w-full lg:w-auto px-8 py-3.5 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <Filter className="w-5 h-5" />
              Apply Filters
            </button>

            {hasFilters && (
              <Link 
                href={`/doctor/patients?tab=${activeTab}`}
                className="p-3.5 bg-slate-100 text-slate-500 rounded-2xl hover:bg-red-50 hover:text-red-500 transition-all"
              >
                <X className="w-6 h-6" />
              </Link>
            )}
          </div>
        </form>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-100 w-fit rounded-2xl">
        <Link
          href={`/doctor/patients?tab=all${q ? `&q=${q}` : ''}${gender ? `&gender=${gender}` : ''}${ageMin ? `&ageMin=${ageMin}` : ''}${ageMax ? `&ageMax=${ageMax}` : ''}`}
          className={`px-6 py-2.5 rounded-xl text-sm font-black transition-all flex items-center gap-2 ${
            activeTab === "all"
              ? "bg-white text-indigo-600 shadow-sm"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          <ActivitySquare className="w-4 h-4" />
          Directory
        </Link>
        <Link
          href={`/doctor/patients?tab=followup${q ? `&q=${q}` : ''}${gender ? `&gender=${gender}` : ''}${ageMin ? `&ageMin=${ageMin}` : ''}${ageMax ? `&ageMax=${ageMax}` : ''}`}
          className={`px-6 py-2.5 rounded-xl text-sm font-black transition-all flex items-center gap-2 ${
            activeTab === "followup"
              ? "bg-white text-green-600 shadow-sm"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          <CalendarClock className="w-4 h-4" />
          Scheduled Follow-ups
        </Link>
      </div>

      {/* Patient List */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        {displayPatients.length === 0 ? (
          <div className="p-20 text-center flex flex-col items-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mb-6">
               <Search className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2">No Patients Found</h3>
            <p className="text-slate-400 font-medium max-w-xs mx-auto">
              We couldn't find any patients matching your current search or filter criteria.
            </p>
            {hasFilters && (
              <Link href="/doctor/patients" className="mt-6 text-indigo-600 font-black hover:underline">Clear all filters</Link>
            )}
          </div>
        ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                    <th className="px-8 py-5">Patient Information</th>
                    <th className="px-8 py-5">Contact Details</th>
                    <th className="px-8 py-5">Last Visit</th>
                    {activeTab === "followup" && <th className="px-8 py-5">Next Follow-up</th>}
                    <th className="px-8 py-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {displayPatients.map((patient) => (
                    <tr key={patient.PatientID} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center text-lg font-black shadow-sm">
                            {patient.PatientName[0]}
                          </div>
                          <div>
                            <p className="font-black text-slate-900 text-base">{patient.PatientName}</p>
                            <p className="text-xs text-slate-400 font-bold mt-0.5">
                              ID: #{patient.PatientNo} • {patient.Age}Y / {patient.Gender}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <p className="text-sm font-black text-slate-700">{patient.MobileNo || "—"}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Mobile Number</p>
                      </td>
                      <td className="px-8 py-6">
                        <p className="text-sm font-black text-slate-700">{patient.lastVisit.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Clinical Date</p>
                      </td>
                      {activeTab === "followup" && (
                          <td className="px-8 py-6">
                              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-black bg-green-50 text-green-700 border border-green-100">
                                  <CalendarClock className="w-4 h-4" />
                                  {patient.upcomingFollowUp.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                              </span>
                          </td>
                      )}
                      <td className="px-8 py-6 text-right">
                        <Link 
                          href={`/doctor/patients/${patient.PatientID}`}
                          className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-600 text-xs font-black rounded-xl hover:bg-slate-50 transition-all shadow-sm active:scale-95"
                        >
                          <User className="w-4 h-4" />
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

