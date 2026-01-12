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
      <h1 className="text-2xl font-bold mb-6">Hospital Master</h1>

      {params?.success && (
        <div className="mb-4 rounded bg-green-100 text-green-800 px-4 py-2">
          Hospital details updated successfully
        </div>
      )}
      <form
  action={updateHospital}
  className="bg-white p-6 rounded shadow space-y-4"
>
  <input
    type="hidden"
    name="hospitalId"
    value={hospital.HospitalID}
  />

  {/* Hospital Name */}
  <div>
    <label className="block text-sm font-medium">Hospital Name</label>
    <input
      name="HospitalName"
      type="text"
      defaultValue={hospital.HospitalName}
      className="mt-1 w-full border rounded p-2"
      required
    />
  </div>

  {/* Address */}
  <div>
    <label className="block text-sm font-medium">Address</label>
    <input
      name="Address"
      type="text"
      defaultValue={hospital.Address ?? ""}
      className="mt-1 w-full border rounded p-2"
    />
  </div>

  {/* Registration Charge */}
  <div>
    <label className="block text-sm font-medium">
      Registration Charge
    </label>
    <input
      name="RegistrationCharge"
      type="number"
      defaultValue={hospital.RegistrationCharge?.toNumber() ?? 0}
      className="mt-1 w-full border rounded p-2"
    />
  </div>

  {/* Registration Validity Months */}
  <div>
    <label className="block text-sm font-medium">
      Registration Validity (Months)
    </label>
    <input
      name="RegistrationValidityMonths"
      type="number"
      defaultValue={hospital.RegistrationValidityMonths ?? 0}
      className="mt-1 w-full border rounded p-2"
    />
  </div>

  {/* Opening Numbers */}
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    <div>
      <label className="block text-sm font-medium">
        Opening Patient No
      </label>
      <input
        name="OpeningPatientNo"
        type="number"
        defaultValue={hospital.OpeningPatientNo ?? 0}
        className="mt-1 w-full border rounded p-2"
      />
    </div>

    <div>
      <label className="block text-sm font-medium">
        Opening OPD No
      </label>
      <input
        name="OpeningOPDNo"
        type="number"
        defaultValue={hospital.OpeningOPDNo ?? 0}
        className="mt-1 w-full border rounded p-2"
      />
    </div>

    <div>
      <label className="block text-sm font-medium">
        Opening Receipt No
      </label>
      <input
        name="OpeningReceiptNo"
        type="number"
        defaultValue={hospital.OpeningReceiptNo ?? 0}
        className="mt-1 w-full border rounded p-2"
      />
    </div>
  </div>

  {/* Flags */}
  <div className="space-y-2">
    <label className="flex items-center gap-2">
      <input
        type="checkbox"
        name="IsRateEnableInReceipt"
        defaultChecked={hospital.IsRateEnableInReceipt ?? false}
      />
      <span className="text-sm">
        Enable Rate in Receipt
      </span>
    </label>

    <label className="flex items-center gap-2">
      <input
        type="checkbox"
        name="IsRegistrationFeeEnableInOPD"
        defaultChecked={hospital.IsRegistrationFeeEnableInOPD ?? false}
      />
      <span className="text-sm">
        Enable Registration Fee in OPD
      </span>
    </label>
  </div>

  <button
    type="submit"
    className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
  >
    Update Hospital
  </button>
</form>


        </div>
  );
}
