"use client";

import { createDoctor } from "@/app/actions/doctor";

export default function CreateDoctorPage() {
  return (
    <form action={createDoctor} className="max-w-5xl mx-auto bg-white p-8 rounded-xl space-y-8 shadow-sm border border-gray-200 mt-6 text-sm">

      <div className="flex justify-between items-center border-b pb-4 border-gray-200">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Add New Doctor</h1>
        <a href="/admin/doctors" className="text-gray-500 hover:text-gray-900 font-medium transition">← Back to Master</a>
      </div>

      <section>
        <h2 className="font-semibold mb-4 text-gray-800 border-b border-gray-100 pb-2">Personal Information</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input name="FirstName" placeholder="First name" required className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5
                       text-gray-900 placeholder:text-gray-400
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"/>
          <input name="LastName" placeholder="Last name" required className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5
                       text-gray-900 placeholder:text-gray-400
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />

          <input type="date" name="DOB" className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5
                       text-gray-900 placeholder:text-gray-400
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"/>
          <select name="Gender" required className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            <option value="">Select gender</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>

          <input name="MobileNo" placeholder="Contact number" required className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5
                       text-gray-900 placeholder:text-gray-400
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
          <input name="Email" type="email" placeholder="Email" required className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5
                       text-gray-900 placeholder:text-gray-400
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"/>
        </div>
      </section>

      <section>
        <h2 className="font-semibold mb-4 text-gray-800 border-b border-gray-100 pb-2">Professional Information</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input name="RegistrationNo" placeholder="Medical Registration No" required className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5
                       text-gray-900 placeholder:text-gray-400
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"/>
          <input name="RegistrationCouncil" placeholder="Registration Council" className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5
                       text-gray-900 placeholder:text-gray-400
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"/>

          <input name="Specialization" placeholder="Specialization" required className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5
                       text-gray-900 placeholder:text-gray-400
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"/>
          <input name="Department" placeholder="Department" required className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5
                       text-gray-900 placeholder:text-gray-400
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />

          <input name="Qualification" placeholder="Qualification" className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5
                       text-gray-900 placeholder:text-gray-400
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"/>
          <input name="ExperienceYears" type="number" placeholder="Experience (Years)" className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5
                       text-gray-900 placeholder:text-gray-400
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"/>

          <input name="ConsultationFee" type="number" placeholder="Consultation Fee" className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5
                       text-gray-900 placeholder:text-gray-400
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"/>
        </div>

        <textarea
          name="AboutDoctor"
          rows={3}
          placeholder="About doctor"
          className="w-full mt-4 rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-gray-400"
        />
      </section>

      <button type="submit" className="w-full md:w-auto bg-blue-600 font-medium text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition shadow-sm">
        Save Doctor Profile
      </button>
    </form>
  );
}
