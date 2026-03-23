import { updateDoctor } from "@/app/actions/doctor";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export const runtime = "nodejs";

export default async function EditDoctorPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const doctor = await prisma.doctor.findUnique({
        where: { DoctorID: Number(id) },
    });

    if (!doctor) {
        redirect("/doctors");
    }

    // Format DOB to YYYY-MM-DD for the date input
    const dobString = doctor.DOB ? doctor.DOB.toISOString().split("T")[0] : "";

    return (
        <form action={updateDoctor} className="max-w-5xl bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-slate-100 dark:border-zinc-800 shadow-sm dark:shadow-none space-y-8">
            <input type="hidden" name="DoctorID" value={doctor.DoctorID} />

            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-zinc-50">Edit Doctor Profile</h1>
                <a href="/admin/doctors" className="text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-zinc-100 transition-colors">← Back</a>
            </div>

            <section>
                <h2 className="font-semibold mb-4 text-gray-800 dark:text-zinc-100 border-b border-gray-200 dark:border-zinc-800 pb-2">Personal Information</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <input name="FirstName" defaultValue={doctor.FirstName} placeholder="First name" required className="w-full rounded-2xl border border-gray-300 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-5 py-3 text-gray-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition placeholder:text-gray-400 dark:placeholder:text-zinc-600" />
                    <input name="LastName" defaultValue={doctor.LastName} placeholder="Last name" required className="w-full rounded-2xl border border-gray-300 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-5 py-3 text-gray-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition placeholder:text-gray-400 dark:placeholder:text-zinc-600" />
                    <input type="date" name="DOB" defaultValue={dobString} className="w-full rounded-2xl border border-gray-300 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-5 py-3 text-gray-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition" />
                    <select name="Gender" defaultValue={doctor.Gender} required className="w-full rounded-2xl border border-gray-300 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-5 py-3 text-gray-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition">
                        <option value="">Select gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                    <input name="MobileNo" defaultValue={doctor.MobileNo} placeholder="Contact number" required className="w-full rounded-2xl border border-gray-300 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-5 py-3 text-gray-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition placeholder:text-gray-400 dark:placeholder:text-zinc-600" />
                    <input name="Email" type="email" defaultValue={doctor.Email} placeholder="Email" required className="w-full rounded-2xl border border-gray-300 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-5 py-3 text-gray-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition placeholder:text-gray-400 dark:placeholder:text-zinc-600" />
                </div>
            </section>

            <section>
                <h2 className="font-semibold mb-4 text-gray-800 dark:text-zinc-100 border-b border-gray-200 dark:border-zinc-800 pb-2">Professional Information</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <input name="RegistrationNo" defaultValue={doctor.RegistrationNo} placeholder="Medical Registration No" required className="w-full rounded-2xl border border-gray-300 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-5 py-3 text-gray-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition placeholder:text-gray-400 dark:placeholder:text-zinc-600" />
                    <input name="RegistrationCouncil" defaultValue={doctor.RegistrationCouncil || ""} placeholder="Registration Council" className="w-full rounded-2xl border border-gray-300 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-5 py-3 text-gray-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition placeholder:text-gray-400 dark:placeholder:text-zinc-600" />
                    <input name="Specialization" defaultValue={doctor.Specialization} placeholder="Specialization" required className="w-full rounded-2xl border border-gray-300 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-5 py-3 text-gray-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition placeholder:text-gray-400 dark:placeholder:text-zinc-600" />
                    <input name="Department" defaultValue={doctor.Department} placeholder="Department" required className="w-full rounded-2xl border border-gray-300 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-5 py-3 text-gray-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition placeholder:text-gray-400 dark:placeholder:text-zinc-600" />
                    <input name="Qualification" defaultValue={doctor.Qualification || ""} placeholder="Qualification" className="w-full rounded-2xl border border-gray-300 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-5 py-3 text-gray-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition placeholder:text-gray-400 dark:placeholder:text-zinc-600" />
                    <input name="ExperienceYears" type="number" defaultValue={doctor.ExperienceYears !== null ? doctor.ExperienceYears.toString() : ""} placeholder="Experience (Years)" className="w-full rounded-2xl border border-gray-300 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-5 py-3 text-gray-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition placeholder:text-gray-400 dark:placeholder:text-zinc-600" />
                    <input name="ConsultationFee" type="number" defaultValue={doctor.ConsultationFee !== null ? doctor.ConsultationFee.toString() : ""} placeholder="Consultation Fee" className="w-full rounded-2xl border border-gray-300 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-5 py-3 text-gray-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition placeholder:text-gray-400 dark:placeholder:text-zinc-600" />
                </div>

                <textarea
                    name="AboutDoctor"
                    rows={3}
                    defaultValue={doctor.AboutDoctor || ""}
                    placeholder="About doctor"
                    className="w-full mt-4 rounded-2xl border border-gray-300 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-5 py-3 text-gray-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition placeholder:text-gray-400 dark:placeholder:text-zinc-600"
                />
            </section>

            <button type="submit" className="w-full md:w-auto bg-slate-900 dark:bg-slate-800 hover:bg-black dark:hover:bg-slate-700 text-white px-8 py-3.5 rounded-2xl font-bold flex items-center justify-center gap-3 shadow-lg shadow-slate-200 dark:shadow-none transition-all active:scale-[0.98]">
                Save Changes
            </button>
        </form>
    );
}
