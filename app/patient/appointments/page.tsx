import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "../../lib/auth";
import { redirect } from "next/navigation";
import { Calendar, Clock, User, ChevronRight, History } from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/app/lib/utils/date";
import CancelButton from "./CancelButton";

export const runtime = "nodejs";

export default async function AppointmentsPage() {
  const user = await getCurrentUser();

  if (!user || user.Role !== "PATIENT") {
    redirect("/login");
  }

  const patient = await prisma.patient.findFirst({
    where: { UserID: user.UserID },
  });

  if (!patient) {
    return (
      <div className="p-8 text-center bg-red-50 text-red-600 rounded-2xl border border-red-100">
        Patient profile not found. Please contact support.
      </div>
    );
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Fetch upcoming appointments (REGISTERED/WAITING in future or today)
  const upcomingAppointments = await prisma.oPD.findMany({
    where: {
      PatientID: patient.PatientID,
      OPDDateTime: {
        gte: today,
      },
      Status: {
        in: ["REGISTERED", "WAITING"]
      }
    },
    include: {
      Doctor: true,
    },
    orderBy: [
      { OPDDateTime: "asc" },
      { OPDID: "asc" }
    ]
  });

  // Fetch recent appointments (last 10, regardless of status, excluding upcoming)
  const recentAppointments = await prisma.oPD.findMany({
    where: {
      PatientID: patient.PatientID,
      NOT: {
        AND: [
          { Status: { in: ["REGISTERED", "WAITING"] } },
          { OPDDateTime: { gte: today } }
        ]
      }
    },
    include: {
      Doctor: true,
    },
    orderBy: [
      { OPDDateTime: "desc" },
      { OPDID: "desc" }
    ],
    take: 10
  });

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">My Appointments</h1>
          <p className="text-slate-500">Manage and track your doctor visits</p>
        </div>
        <Link
          href="/patient/appointments/book"
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-95"
        >
          <Calendar className="w-5 h-5" />
          Book New Appointment
        </Link>
      </div>

      {/* Upcoming Section */}
      <section className="space-y-6">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-500" />
          Upcoming Visits
        </h2>
        
        {upcomingAppointments.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm flex flex-col items-center justify-center min-h-[250px]">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-4">
              <Calendar className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">No Upcoming Visits</h3>
            <p className="text-slate-500 max-w-sm mx-auto mb-6 text-sm">
              You don&apos;t have any scheduled appointments.
            </p>
            <Link
              href="/patient/appointments/book"
              className="px-6 py-2 bg-blue-50 text-blue-600 rounded-xl font-bold hover:bg-blue-100 transition-colors text-sm"
            >
               Schedule Now
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingAppointments.map((apt) => (
              <AppointmentCard key={apt.OPDID} apt={apt} isUpcoming={true} />
            ))}
          </div>
        )}
      </section>

      {/* Recent Section */}
      {recentAppointments.length > 0 && (
        <section className="space-y-6">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <History className="w-5 h-5 text-indigo-500" />
            Recent Activity
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentAppointments.map((apt) => (
              <AppointmentCard key={apt.OPDID} apt={apt} isUpcoming={false} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function AppointmentCard({ apt, isUpcoming }: { apt: any, isUpcoming: boolean }) {
  const statusColors: any = {
    REGISTERED: "bg-blue-50 text-blue-700",
    WAITING: "bg-amber-50 text-amber-700",
    IN_CONSULTATION: "bg-purple-50 text-purple-700",
    COMPLETED: "bg-emerald-50 text-emerald-700",
    CANCELLED: "bg-red-50 text-red-700",
    BILLED: "bg-slate-50 text-slate-700"
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
      <div className={`absolute top-0 left-0 w-2 h-full ${isUpcoming ? 'bg-blue-500' : 'bg-slate-300'}`}></div>
      
      <div className="flex justify-between items-start mb-6">
        <div>
          <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold mb-3 uppercase tracking-wider ${statusColors[apt.Status] || 'bg-slate-100'}`}>
            {apt.Status.replace('_', ' ')}
          </span>
          <h3 className="font-bold text-lg text-slate-900 mb-1">Dr. {apt.Doctor.FirstName} {apt.Doctor.LastName}</h3>
          <p className="text-sm text-slate-500">{apt.Doctor.Specialization}</p>
        </div>
        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
          <User className="w-6 h-6" />
        </div>
      </div>

      <div className="space-y-3 mb-6">
        <div className="flex items-center gap-3 text-slate-600">
          <Calendar className="w-5 h-5 text-blue-500" />
          <span className="font-semibold text-sm">{formatDate(apt.OPDDateTime)}</span>
        </div>
        <div className="flex items-center gap-3 text-slate-600">
          <Clock className="w-5 h-5 text-blue-500" />
          <span className="font-semibold text-sm">Token #{apt.TokenNo}</span>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-50 space-y-2">
        <Link 
          href={`/patient/history/${apt.OPDID}`}
          className="w-full py-3 bg-slate-50 text-slate-700 font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-blue-600 hover:text-white transition-all active:scale-95"
        >
          View Details
        </Link>

        {isUpcoming && ["REGISTERED", "WAITING"].includes(apt.Status) && (
          <CancelButton
            opdId={apt.OPDID}
            doctorName={`Dr. ${apt.Doctor.FirstName} ${apt.Doctor.LastName}`}
            appointmentDate={formatDate(apt.OPDDateTime)}
          />
        )}
      </div>
    </div>
  );
}
