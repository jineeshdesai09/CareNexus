import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/app/lib/auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Users, CalendarClock, Activity } from "lucide-react";

export const runtime = "nodejs";

export default async function DoctorDashboard() {
  const user = await getCurrentUser();

  if (!user || user.Role !== "DOCTOR") {
    redirect("/login");
  }

  // Find the doctor record associated with this user (by UserID — reliable)
  const doctor = await prisma.doctor.findFirst({
    where: { UserID: user.UserID },
  });

  if (!doctor) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded">
        Error: No Doctor profile linked to your user account. Please contact admin.
      </div>
    );
  }

  // Today range — use local-time constructor to avoid UTC drift on cloud servers
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
  const endOfDay   = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

  const opds = await prisma.oPD.findMany({
    where: {
      TreatedByDoctorID: doctor.DoctorID,
      OPDDateTime: {
        gte: startOfDay,
        lte: endOfDay,
      },
      Status: {
        notIn: ["CLOSED", "CANCELLED", "BILLED", "COMPLETED"]
      }
    },
    orderBy: [
      { IsEmergency: "desc" },
      { TokenNo: "asc" },
      { OPDDateTime: "asc" }
    ],
    include: {
      Patient: {
        select: {
          PatientName: true,
          PatientNo: true,
          Age: true,
          Gender: true
        }
      }
    }
  });

  // Calculate Start and End of Current Month
  const startOfMonth = new Date(startOfDay.getFullYear(), startOfDay.getMonth(), 1);
  const endOfMonth = new Date(startOfDay.getFullYear(), startOfDay.getMonth() + 1, 0, 23, 59, 59, 999);

  // Total consultations completed this month
  const monthlyConsultations = await prisma.oPD.count({
      where: {
          TreatedByDoctorID: doctor.DoctorID,
          Status: { in: ["COMPLETED", "BILLED", "CLOSED"] },
          OPDDateTime: { gte: startOfMonth, lte: endOfMonth }
      }
  });

  // Calculate Start and End of Current Week (assuming week starts on Sunday)
  const currentDayOfWeek = startOfDay.getDay();
  const startOfWeek = new Date(startOfDay);
  startOfWeek.setDate(startOfDay.getDate() - currentDayOfWeek);
  
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  // Upcoming Follow-ups this week
  const weeklyFollowUps = await prisma.oPD.count({
      where: {
          TreatedByDoctorID: doctor.DoctorID,
          FollowUpDate: { gte: startOfWeek, lte: endOfWeek }
      }
  });

  return (
    <div className="max-w-6xl mx-auto p-4 flex flex-col gap-6">
      <div className="flex justify-between items-center border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Doctor Dashboard
          </h1>
          <p className="text-gray-500 mt-1">
            Welcome, Dr. {doctor.FirstName} {doctor.LastName}
          </p>
        </div>
      </div>

      {/* Analytics Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center shrink-0">
                  <Activity className="w-6 h-6" />
              </div>
              <div>
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Today's Queue</p>
                  <p className="text-2xl font-bold text-gray-900">{opds.length}</p>
              </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center shrink-0">
                  <Users className="w-6 h-6" />
              </div>
              <div>
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Treated This Month</p>
                  <p className="text-2xl font-bold text-gray-900">{monthlyConsultations}</p>
              </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
              <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center shrink-0">
                  <CalendarClock className="w-6 h-6" />
              </div>
              <div>
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Follow-ups This Week</p>
                  <p className="text-2xl font-bold text-gray-900">{weeklyFollowUps}</p>
              </div>
          </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-800">Today's Appointments</h2>
        </div>

        {opds.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No patients currently in your queue.
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Token</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Age/Sex</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {opds.map((opd) => (
                <tr key={opd.OPDID} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {opd.TokenNo ?? "-"}
                    {opd.IsEmergency && (
                      <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                        EMG
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {opd.Patient.PatientNo}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {opd.Patient.PatientName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {opd.Patient.Age} / {opd.Patient.Gender.charAt(0)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                    {opd.Status === 'WAITING' ? (
                      <span className="text-yellow-600">Waiting</span>
                    ) : opd.Status === 'IN_CONSULTATION' ? (
                      <span className="text-blue-600">In Progress</span>
                    ) : opd.Status === 'REGISTERED' ? (
                      <span className="text-gray-600">Registered</span>
                    ) : (
                      <span className="text-green-600">{opd.Status}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link
                      href={`/doctor/opd/${opd.OPDID}`}
                      className="text-blue-600 hover:text-blue-900 hover:underline"
                    >
                      {opd.Status === 'IN_CONSULTATION' ? 'Resume' : 'Start'} Consultation →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
