import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "../../lib/auth";
import Link from "next/link";
import { redirect } from "next/navigation";

export const runtime = "nodejs";

export default async function DoctorDashboard() {
  const user = await getCurrentUser();

  if (!user || user.Role !== "DOCTOR") {
    redirect("/login");
  }

  // Find the doctor record associated with this user
  const doctor = await prisma.doctor.findFirst({
    where: { Email: user.Email },
  });

  if (!doctor) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded">
        Error: No Doctor profile linked to your user account. Please contact admin.
      </div>
    );
  }

  // Today range
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(); endOfDay.setHours(23, 59, 59, 999);

  const opds = await prisma.oPD.findMany({
    where: {
      TreatedByDoctorID: doctor.DoctorID,
      OPDDateTime: {
        gte: startOfDay,
        lte: endOfDay,
      },
      Status: {
        notIn: ["CLOSED", "CANCELLED", "BILLED"]
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

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Doctor Dashboard
          </h1>
          <p className="text-gray-600">
            Welcome, Dr. {doctor.FirstName} {doctor.LastName}
          </p>
        </div>
        <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg font-medium">
          Queue Size: {opds.length}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b bg-gray-50">
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
