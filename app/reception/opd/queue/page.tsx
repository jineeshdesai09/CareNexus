import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/app/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export const runtime = "nodejs";

export default async function OPDQueuePage() {
  const user = await getCurrentUser();

  if (!user || user.Role !== "RECEPTIONIST") {
    redirect("/login");
  }

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  const opds = await prisma.oPD.findMany({
    where: {
      OPDDateTime: {
        gte: startOfDay,
        lte: endOfDay,
      },
    },
    orderBy: [
      { IsEmergency: "desc" },
      { TokenNo: "asc" },
    ],
    include: {
      Patient: {
        select: {
          PatientName: true,
          PatientNo: true,
        },
      },
      Doctor: {
        select: {
          FirstName: true,
          LastName: true,
        },
      },
    },
  });

  return (
    <div className="max-w-6xl">
      <h1 className="text-2xl font-bold mb-6">OPD Queue (Today)</h1>

      {opds.length === 0 ? (
        <p className="text-gray-500">No OPDs created today.</p>
      ) :
        (
          <table className="w-full border rounded bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left">Token</th>
                <th className="p-2 text-left">Patient</th>
                <th className="p-2 text-left">Doctor</th>
                <th className="p-2 text-center">Emergency</th>
                <th className="p-2 text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {opds.map((opd) => (
                <tr key={opd.OPDID} className="border-t">
                  <td className="p-2">{opd.TokenNo ?? "-"}</td>
                  <td className="p-2">
                    {opd.Patient.PatientNo} – {opd.Patient.PatientName}
                  </td>
                  <td className="p-2">
                    Dr. {opd.Doctor.FirstName} {opd.Doctor.LastName}
                  </td>
                  <td className="p-2 text-center">
                    {opd.IsEmergency ? " Yes" : "No"}
                  </td>
                  <td className="p-2 text-center font-medium">
                    {opd.Status === 'COMPLETED' ? (
                      <Link href={`/reception/billing/${opd.OPDID}`} className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700">
                        Bill Patient
                      </Link>
                    ) : opd.Status === 'BILLED' ? (
                      <span className="text-gray-500">Billed</span>
                    ) : (
                      opd.Status
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
    </div>
  );
}
