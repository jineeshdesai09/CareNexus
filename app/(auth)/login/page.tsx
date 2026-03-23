import { Heart, ArrowLeft } from "lucide-react";
import { getCurrentUser } from "@/app/lib/auth";
import { redirect } from "next/navigation";
import LoginForm from "./LoginForm";
import ThemeToggle from "@/app/components/ui/ThemeToggle";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string }>;
}) {
  const user = await getCurrentUser();
  if (user) {
    if (user.Role === "ADMIN") redirect("/admin/dashboard");
    if (user.Role === "DOCTOR") redirect("/doctor/dashboard");
    if (user.Role === "RECEPTIONIST") redirect("/reception/dashboard");
    if (user.Role === "PATIENT") redirect("/patient/dashboard");
    redirect("/"); // Fallback
  }

  const params = await searchParams;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-zinc-950 dark:to-zinc-900">
      {/* Header */}
      <header className="bg-white dark:bg-zinc-950 shadow-sm border-b border-transparent dark:border-zinc-800 transition-colors">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 dark:bg-blue-500 rounded-xl flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" fill="white" />
            </div>
            <span className="text-xl font-semibold text-gray-900 dark:text-zinc-50">
              TechCare
            </span>
          </div>
          
          <div className="flex flex-row gap-4 items-center">
            <ThemeToggle />
            <a
                href="/"
                className="flex items-center gap-2 text-gray-700 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors"
            >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">Back</span>
            </a>
          </div>
        </div>
      </header>

      {/* Login Form Container */}
      <div className="flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl dark:shadow-none p-8 dark:border dark:border-zinc-800">

            {params?.error === "invalid" && (
              <div className="rounded bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-400 px-4 py-2 text-sm mb-4 font-medium dark:border dark:border-red-800/50">
                Invalid email or password
              </div>
            )}

            {params?.error === "role" && (
              <div className="rounded bg-yellow-100 dark:bg-amber-900/40 text-yellow-800 dark:text-amber-400 px-4 py-2 text-sm mb-4 font-medium dark:border dark:border-amber-800/50">
                Selected role does not match your account
              </div>
            )}

            {params?.error === "pending" && (
              <div className="rounded bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-400 px-4 py-2 text-sm mb-4 font-medium dark:border dark:border-blue-800/50">
                Your account is pending admin approval. Please try again later.
              </div>
            )}

            {/* Registration success message */}
            {(await searchParams).message === "registered" && (
              <div className="rounded bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-400 px-4 py-2 text-sm mb-4 font-medium dark:border dark:border-green-800/50">
                Registration successful! Please wait for admin approval.
              </div>
            )}

            <div>
                <LoginForm />
            </div>

            {/* Demo Access */}
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800/50 space-y-3">
              <p className="text-sm font-bold text-gray-800 dark:text-zinc-300 border-b pb-1 border-blue-200 dark:border-blue-800/50">
                Support / Demo Credentials:
              </p>

              <div className="text-[10px] text-gray-600 dark:text-zinc-400 space-y-2">
                <p>Email: <span className="font-semibold text-blue-600 dark:text-blue-400">admin@hospital.com</span> (Pass: admin123)</p>
                <p>Email: <span className="font-semibold text-blue-600 dark:text-blue-400">reception@hospital.com</span> (Pass: reception123)</p>
                <p>Email: <span className="font-semibold text-blue-600 dark:text-blue-400">sarah.jenkins@hospital.com</span> (Pass: doctor123)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
