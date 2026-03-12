import { prisma } from "@/lib/prisma";
import { requireAdmin } from "../../lib/auth";
import { updateHospital } from "@/app/actions/hospital";

export const runtime = "nodejs";

export default async function HospitalPage({
  searchParams,
}: {
  searchParams?: Promise<{ success?: string }>;
}) {
  await requireAdmin();

  const params = await searchParams;
  const hospital = await prisma.hospital.findFirst();

  if (!hospital) {
    return <p>No hospital found</p>;
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold mb-6 text-gray-900">
        Hospital Master
      </h1>

      {params?.success && (
        <div className="mb-4 rounded-lg bg-green-100 text-green-800 px-4 py-2">
          Hospital details updated successfully
        </div>
      )}

      <form
        action={updateHospital}
        className="bg-white p-6 rounded-lg shadow space-y-5"
      >
        <input
          type="hidden"
          name="hospitalId"
          value={hospital.HospitalID}
        />

        {/* Hospital Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Hospital Name
          </label>
          <input
            name="HospitalName"
            type="text"
            defaultValue={hospital.HospitalName}
            required
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5
                       text-gray-900 placeholder:text-gray-400
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Address
          </label>
          <input
            name="Address"
            type="text"
            defaultValue={hospital.Address ?? ""}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5
                       text-gray-900 placeholder:text-gray-400
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Registration Charge */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Registration Charge
          </label>
          <input
            name="RegistrationCharge"
            type="number"
            defaultValue={hospital.RegistrationCharge?.toNumber() ?? 0}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5
                       text-gray-900
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Registration Validity Months */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Registration Validity (Months)
          </label>
          <input
            name="RegistrationValidityMonths"
            type="number"
            defaultValue={hospital.RegistrationValidityMonths ?? 0}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5
                       text-gray-900
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Opening Numbers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Opening Patient No
            </label>
            <input
              name="OpeningPatientNo"
              type="number"
              defaultValue={hospital.OpeningPatientNo ?? 0}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5
                         text-gray-900
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Opening OPD No
            </label>
            <input
              name="OpeningOPDNo"
              type="number"
              defaultValue={hospital.OpeningOPDNo ?? 0}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5
                         text-gray-900
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Opening Receipt No
            </label>
            <input
              name="OpeningReceiptNo"
              type="number"
              defaultValue={hospital.OpeningReceiptNo ?? 0}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5
                         text-gray-900
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Flags */}
        <div className="space-y-3 pt-2">
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              name="IsRateEnableInReceipt"
              defaultChecked={hospital.IsRateEnableInReceipt ?? false}
              className="h-4 w-4 accent-blue-600"
            />
            Enable Rate in Receipt
          </label>

          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              name="IsRegistrationFeeEnableInOPD"
              defaultChecked={hospital.IsRegistrationFeeEnableInOPD ?? false}
              className="h-4 w-4 accent-blue-600"
            />
            Enable Registration Fee in OPD
          </label>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="mt-6 w-full rounded-lg bg-blue-600 px-4 py-2.5
                     text-white font-medium hover:bg-blue-700 transition"
        >
          Update Hospital
        </button>
      </form>
    </div>
  );
}
