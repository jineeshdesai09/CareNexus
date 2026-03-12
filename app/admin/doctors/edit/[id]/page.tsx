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
        <form action={updateDoctor} className="max-w-5xl bg-white p-8 rounded-lg space-y-8">
            <input type="hidden" name="DoctorID" value={doctor.DoctorID} />

            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Edit Doctor Profile</h1>
                <a href="/doctors" className="text-gray-500 hover:text-gray-900">← Back</a>
            </div>

            <section>
                <h2 className="font-semibold mb-4 text-gray-800 border-b pb-2">Personal Information</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <input name="FirstName" defaultValue={doctor.FirstName} placeholder="First name" required className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 focus:ring-2 focus:ring-blue-500" />
                    <input name="LastName" defaultValue={doctor.LastName} placeholder="Last name" required className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 focus:ring-2 focus:ring-blue-500" />
                    <input type="date" name="DOB" defaultValue={dobString} className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 focus:ring-2 focus:ring-blue-500" />
                    <select name="Gender" defaultValue={doctor.Gender} required className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 focus:ring-2 focus:ring-blue-500">
                        <option value="">Select gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                    <input name="MobileNo" defaultValue={doctor.MobileNo} placeholder="Contact number" required className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 focus:ring-2 focus:ring-blue-500" />
                    <input name="Email" type="email" defaultValue={doctor.Email} placeholder="Email" required className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 focus:ring-2 focus:ring-blue-500" />
                </div>
            </section>

            <section>
                <h2 className="font-semibold mb-4 text-gray-800 border-b pb-2">Professional Information</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <input name="RegistrationNo" defaultValue={doctor.RegistrationNo} placeholder="Medical Registration No" required className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 focus:ring-2 focus:ring-blue-500" />
                    <input name="RegistrationCouncil" defaultValue={doctor.RegistrationCouncil || ""} placeholder="Registration Council" className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 focus:ring-2 focus:ring-blue-500" />
                    <input name="Specialization" defaultValue={doctor.Specialization} placeholder="Specialization" required className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 focus:ring-2 focus:ring-blue-500" />
                    <input name="Department" defaultValue={doctor.Department} placeholder="Department" required className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 focus:ring-2 focus:ring-blue-500" />
                    <input name="Qualification" defaultValue={doctor.Qualification || ""} placeholder="Qualification" className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 focus:ring-2 focus:ring-blue-500" />
                    <input name="ExperienceYears" type="number" defaultValue={doctor.ExperienceYears !== null ? doctor.ExperienceYears.toString() : ""} placeholder="Experience (Years)" className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 focus:ring-2 focus:ring-blue-500" />
                    <input name="ConsultationFee" type="number" defaultValue={doctor.ConsultationFee !== null ? doctor.ConsultationFee.toString() : ""} placeholder="Consultation Fee" className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 focus:ring-2 focus:ring-blue-500" />
                </div>

                <textarea
                    name="AboutDoctor"
                    rows={3}
                    defaultValue={doctor.AboutDoctor || ""}
                    placeholder="About doctor"
                    className="w-full mt-4 rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500"
                />
            </section>

            <button type="submit" className="w-full md:w-auto bg-blue-600 font-medium text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition">
                Save Changes
            </button>
        </form>
    );
}
