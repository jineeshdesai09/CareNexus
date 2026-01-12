import { getCurrentUser } from "../../lib/auth";

export default async function DoctorDashboard() {
  const user = await getCurrentUser();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">
        Doctor Dashboard
      </h1>

      <p className="text-gray-600">
        Welcome Dr. {user?.Name}
      </p>

      <p className="mt-4 text-sm text-gray-500">
        Assigned OPD and patient list will appear here.
      </p>
    </div>
  );
}
