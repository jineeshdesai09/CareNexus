import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/app/lib/auth";
import { updateMyAvailability } from "@/app/actions/doctorAvailability";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const runtime = "nodejs";

const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export default async function EditSchedulePage() {
  const user = await getCurrentUser();
  if (!user || user.Role !== "DOCTOR") {
    redirect("/login");
  }

  const doctor = await prisma.doctor.findFirst({
    where: { Email: user.Email },
  });

  if (!doctor) {
    return <div className="p-4 text-rose-600 dark:text-rose-400">Doctor profile not found.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12 pt-2">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-zinc-800 pb-6">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-zinc-50 tracking-tight">
          Update Schedule
        </h1>
        <Link 
          href="/doctor/schedule" 
          className="text-sm font-semibold text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100 transition-colors"
        >
          ← Back to Schedule
        </Link>
      </div>

      <Card className="border-none ring-1 ring-slate-200 dark:ring-zinc-800 shadow-md bg-white dark:bg-zinc-900">
        <CardHeader className="border-b border-slate-100 dark:border-zinc-800/50 pb-5">
            <CardTitle className="text-xl font-bold text-slate-800 dark:text-zinc-100">
                Add New Availability Slot
            </CardTitle>
            <p className="text-sm font-medium text-slate-500 dark:text-zinc-400 mt-2 leading-relaxed max-w-2xl">
                Note: This will override existing slots for the selected days. Adding availability makes you bookable for appointments on those days.
            </p>
        </CardHeader>
        <CardContent className="pt-6">
            <form action={updateMyAvailability} className="space-y-8">
            <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-widest mb-3">Select Days</label>
                <div className="flex flex-wrap gap-4 bg-slate-50 dark:bg-zinc-950 p-5 rounded-xl border border-slate-200 dark:border-zinc-800">
                {[1, 2, 3, 4, 5, 6, 0].map((day) => (
                    <label key={day} className="flex items-center gap-2.5 cursor-pointer">
                    <input
                        type="checkbox"
                        name="DayOfWeek"
                        value={day}
                        defaultChecked
                        className="w-4 h-4 text-teal-600 bg-white dark:bg-zinc-900 border-slate-300 dark:border-zinc-700 rounded focus:ring-teal-500 dark:focus:ring-teal-400 dark:focus:ring-offset-zinc-900 transition-shadow"
                    />
                    <span className="text-sm font-bold text-slate-700 dark:text-zinc-300">{DAYS[day]}</span>
                    </label>
                ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5 w-full">
                    <label className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-widest leading-none">Max Patients <span className="text-slate-400 font-medium normal-case tracking-normal">(Optional)</span></label>
                    <input
                        type="number"
                        name="MaxPatients"
                        placeholder="e.g. 50"
                        className="flex h-10 w-full rounded-lg border bg-white px-3 py-2 text-sm transition-shadow placeholder:text-slate-400 focus-visible:outline-none focus-visible:border-teal-500 focus-visible:ring-1 focus-visible:ring-teal-500 dark:border-zinc-700 dark:bg-zinc-950 dark:placeholder:text-zinc-600 dark:focus-visible:border-teal-500 dark:focus-visible:ring-teal-400 dark:text-zinc-100 font-medium border-slate-300"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5 w-full">
                    <label className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-widest leading-none">From Time</label>
                    <input
                        type="time"
                        name="FromTime"
                        required
                        className="flex h-10 w-full rounded-lg border bg-white px-3 py-2 text-sm transition-shadow focus-visible:outline-none focus-visible:border-teal-500 focus-visible:ring-1 focus-visible:ring-teal-500 dark:border-zinc-700 dark:bg-zinc-950 dark:focus-visible:border-teal-500 dark:focus-visible:ring-teal-400 dark:text-zinc-100 font-medium border-slate-300"
                    />
                </div>
                <div className="space-y-1.5 w-full">
                    <label className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-widest leading-none">To Time</label>
                    <input
                        type="time"
                        name="ToTime"
                        required
                        className="flex h-10 w-full rounded-lg border bg-white px-3 py-2 text-sm transition-shadow focus-visible:outline-none focus-visible:border-teal-500 focus-visible:ring-1 focus-visible:ring-teal-500 dark:border-zinc-700 dark:bg-zinc-950 dark:focus-visible:border-teal-500 dark:focus-visible:ring-teal-400 dark:text-zinc-100 font-medium border-slate-300"
                    />
                </div>
            </div>

            <div className="pt-2">
                <label className="flex items-center gap-3 cursor-pointer w-fit">
                    <input 
                        type="checkbox" 
                        name="IsEmergencyOnly" 
                        className="w-5 h-5 text-rose-500 bg-white dark:bg-zinc-900 border-slate-300 dark:border-zinc-700 rounded focus:ring-rose-500 dark:focus:ring-rose-500 dark:focus:ring-offset-zinc-900 transition-shadow" 
                    />
                    <span className="text-sm font-bold text-slate-700 dark:text-zinc-300">Set as Emergency Only slot</span>
                </label>
            </div>

            <div className="pt-6 border-t border-slate-100 dark:border-zinc-800">
                <Button type="submit" size="lg" className="w-full sm:w-auto min-w-[200px] shadow-md border-b-[3px] border-teal-700 active:border-b-0 py-6">
                    Save Availability Settings
                </Button>
            </div>
            </form>
        </CardContent>
      </Card>
    </div>
  );
}
