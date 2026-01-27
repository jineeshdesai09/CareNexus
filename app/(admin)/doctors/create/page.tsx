"use client";

import { createDoctor } from "@/app/actions/doctor";

export default function CreateDoctorPage() {
  return (
    <form action={createDoctor} className="max-w-5xl bg-white p-8 rounded-lg space-y-8">

      <h1 className="text-2xl font-bold">Doctor Master</h1>

      <section>
        <h2 className="font-semibold mb-4">Personal Information</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input name="FirstName" placeholder="First name" required className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5
                       text-gray-900 placeholder:text-gray-400
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"/>
          <input name="LastName" placeholder="Last name" required className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5
                       text-gray-900 placeholder:text-gray-400
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />

          <input type="date" name="DOB"  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5
                       text-gray-900 placeholder:text-gray-400
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"/>
          <select name="Gender" required>
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
        <h2 className="font-semibold mb-4">Professional Information</h2>

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
          className="w-full mt-4"
        />
      </section>

      <button className="bg-blue-600 text-white px-6 py-3 rounded">
        Save Doctor Profile
      </button>
    </form>
  );
}
