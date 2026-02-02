import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/app/lib/auth";
import { redirect } from "next/navigation";
import { startConsultation, endConsultation } from "@/app/actions/opdStatus";

export const runtime = "nodejs";

export default async function DoctorTodayOPDPage() {
  const user = await getCurrentUser();
  if (!user || user.Role !== "DOCTOR") redirect("/dashboard");

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  const opds = await prisma.oPD.findMany({
    where: {
      TreatedByDoctorID: user.UserID,
      OPDDateTime: { gte: startOfDay, lte: endOfDay },
    },
    orderBy: [{ IsEmergency: "desc" }, { TokenNo: "asc" }],
    include: {
      Patient: { select: { PatientName: true, PatientNo: true } },
    },
  });

  return (
    <div className="max-w-5xl">
      <h1 className="text-2xl font-bold mb-6">Today’s OPDs</h1>

      {opds.length === 0 ? (
        <p className="text-gray-500">No OPDs today.</p>
      ) : (
        <table className="w-full border bg-white rounded">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">Token</th>
              <th className="p-2">Patient</th>
              <th className="p-2">Emergency</th>
              <th className="p-2">Status</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {opds.map((o) => (
              <tr key={o.OPDID} className="border-t">
                <td className="p-2">{o.TokenNo}</td>
                <td className="p-2">
                  {o.Patient.PatientNo} – {o.Patient.PatientName}
                </td>
                <td className="p-2 text-center">
                  {o.IsEmergency ? "🚨" : "-"}
                </td>
                <td className="p-2 text-center font-medium">{o.Status}</td>
                <td className="p-2 text-center">
                  {o.Status === "REGISTERED" && (
                    <form
                      action={async () => {
                        "use server";
                        await startConsultation(o.OPDID);
                      }}
                    >
                      <button className="bg-blue-600 text-white px-3 py-1 rounded">
                        Start
                      </button>
                    </form>
                  )}

                  {o.Status === "IN_CONSULTATION" && (
                    <form
                      action={async () => {
                        "use server";
                        await endConsultation(o.OPDID);
                      }}
                    >
                      <button className="bg-green-600 text-white px-3 py-1 rounded" >
                        End
                      </button>
                    </form>
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
