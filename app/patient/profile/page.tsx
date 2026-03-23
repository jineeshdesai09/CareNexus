import { getCurrentUser } from "@/app/lib/auth";
import { prisma } from "@/lib/prisma";
import ProfileEditForm from "./ProfileEditForm";
import { redirect } from "next/navigation";

export const runtime = "nodejs";

export default async function PatientProfilePage() {
    const user = await getCurrentUser();
    if (!user) redirect("/login");

    const patient = await prisma.patient.findFirst({
        where: { UserID: user.UserID }
    });

    if (!patient) return <div>Profile not found.</div>;

    // Serialize Decimal height
    const serializedPatient = {
        ...patient,
        Height: patient.Height ? Number(patient.Height) : null
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in mt-2 fade-in slide-in-from-bottom-4 duration-700">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-zinc-50">My Profile</h1>
            <ProfileEditForm patient={serializedPatient as any} />
        </div>
    );
}
