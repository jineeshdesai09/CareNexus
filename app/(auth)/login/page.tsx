import { login } from "@/app/actions/auth";
import { getSession } from "../../lib/session";
import { redirect } from "next/navigation";

export default async function LoginPage({
  searchParams,
}: {
  searchParams?: Promise<{ error?: string }>;
}) {
  const session = await getSession();
  if (session) {
    redirect("/dashboard");
  }

  const params = await searchParams;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        action={login}
        className="bg-white p-6 rounded shadow w-96 space-y-4"
      >
        <h1 className="text-xl font-bold text-center">Login</h1>

        {params?.error === "invalid" && (
          <div className="rounded bg-red-100 text-red-800 px-4 py-2 text-sm">
            Invalid email or password
          </div>
        )}

        {params?.error === "role" && (
          <div className="rounded bg-yellow-100 text-yellow-800 px-4 py-2 text-sm">
            Selected role does not match your account
          </div>
        )}

        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            name="email"
            type="email"
            className="mt-1 w-full border rounded p-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Password</label>
          <input
            name="password"
            type="password"
            className="mt-1 w-full border rounded p-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Login As</label>
          <select
            name="role"
            className="mt-1 w-full border rounded p-2"
            required
          >
            <option value="">Select role</option>
            <option value="ADMIN">Admin</option>
            <option value="DOCTOR">Doctor</option>
            <option value="RECEPTIONIST">Receptionist</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Login
        </button>
      </form>
    </div>
  );
}
