import { getCurrentUser } from "../../lib/auth";

export default async function ReceptionDashboard() {
  const user = await getCurrentUser();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">
        Reception Dashboard
      </h1>

      <p className="text-gray-600 mb-6">
        Welcome, {user?.Name}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <a
          href="/reception/patients"
          className="block bg-white p-4 rounded shadow hover:bg-gray-50"
        >
          Patient Registration
        </a>

        <a
          href="/reception/opd"
          className="block bg-white p-4 rounded shadow hover:bg-gray-50"
        >
          Create OPD / Assign Doctor
        </a>

        <a
          href="/reception/status"
          className="block bg-white p-4 rounded shadow hover:bg-gray-50"
        >
          OPD Status
        </a>

        <a
          href="/reception/billing"
          className="block bg-white p-4 rounded shadow hover:bg-gray-50"
        >
          Billing / Receipt
        </a>
      </div>
    </div>
  );
}
