import { Heart, Activity, ShieldCheck, Lock } from "lucide-react";
import { getCurrentUser } from "@/app/lib/auth";
import { redirect } from "next/navigation";
import LoginForm from "./LoginForm";
import ThemeToggle from "@/app/components/ui/ThemeToggle";
import Link from "next/link";

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
    <main className="min-h-screen flex flex-col md:flex-row overflow-hidden bg-slate-50 dark:bg-zinc-950 font-sans text-slate-900 dark:text-zinc-50">
      {/* Left Side: Branding & Illustration */}
      <section className="hidden md:flex md:w-1/2 lg:w-3/5 relative flex-col justify-center items-center p-12 overflow-hidden bg-gradient-to-br from-teal-700 to-teal-900 dark:from-teal-900 dark:to-teal-950">
        {/* Background Abstract Patterns */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg height="100%" width="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern height="40" id="grid" patternUnits="userSpaceOnUse" width="40">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"></path>
              </pattern>
            </defs>
            <rect fill="url(#grid)" height="100%" width="100%"></rect>
          </svg>
        </div>
        
        {/* Content Container */}
        <div className="relative z-10 w-full max-w-xl">
          <div className="mb-12">
            <h1 className="font-extrabold text-5xl text-white tracking-tighter mb-4 flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md">
                <Heart className="w-8 h-8 text-white" fill="white" />
              </div>
              Care Nexus
            </h1>
            <p className="text-xl text-teal-50 font-medium leading-relaxed max-w-md">
              The Clinical Sanctuary for modern outpatient department management. Precision engineering for healthcare professionals.
            </p>
          </div>
          
          {/* Abstract Medical Illustration */}
          <div className="relative group">
            <div className="absolute -inset-4 bg-white/10 rounded-2xl blur-2xl group-hover:bg-white/20 transition duration-500"></div>
            <img 
              alt="Medical Concept" 
              className="relative rounded-2xl shadow-2xl transform group-hover:scale-[1.02] transition duration-500 w-full h-auto object-cover aspect-video" 
              src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2053&auto=format&fit=crop"
            />
            {/* Floating Stat Badge */}
            <div className="absolute -bottom-6 -right-6 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl p-6 rounded-2xl shadow-xl hidden lg:block border border-white/20 dark:border-zinc-800">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-teal-100 dark:bg-teal-900/40 flex items-center justify-center text-teal-700 dark:text-teal-400">
                  <Activity className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">Efficiency</div>
                  <div className="text-2xl font-black text-teal-700 dark:text-teal-400">+42%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Right Side: Auth Form */}
      <section className="flex-1 flex flex-col justify-center relative p-6 bg-white dark:bg-zinc-950">
        
        {/* Theme Toggle (Absolute Top Right) */}
        <div className="absolute top-6 right-6">
          <ThemeToggle />
        </div>

        <div className="w-full max-w-md mx-auto">
          {/* Branding for Mobile */}
          <div className="md:hidden text-center mb-8 flex flex-col items-center">
            <div className="w-12 h-12 bg-teal-600 dark:bg-teal-500 rounded-xl flex items-center justify-center mb-3">
              <Heart className="w-7 h-7 text-white" fill="white" />
            </div>
            <h1 className="font-extrabold text-3xl text-slate-900 dark:text-zinc-50 tracking-tighter">Care Nexus</h1>
          </div>
          
          <div className="bg-white dark:bg-zinc-950 rounded-2xl sm:shadow-none p-2 md:p-0">
            <div className="mb-10 text-center md:text-left">
              <h2 className="font-extrabold text-3xl text-slate-900 dark:text-zinc-50 mb-2 tracking-tight">Welcome Back</h2>
              <p className="text-slate-500 dark:text-zinc-400 font-medium">Login to Care Nexus OPD System</p>
            </div>

            {params?.error === "invalid" && (
              <div className="rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-4 py-3 text-sm mb-6 font-medium border border-red-100 dark:border-red-900/30">
                Invalid email or password
              </div>
            )}
            {params?.error === "role" && (
              <div className="rounded-xl bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 px-4 py-3 text-sm mb-6 font-medium border border-amber-100 dark:border-amber-900/30">
                Selected role does not match your account
              </div>
            )}
            {params?.error === "pending" && (
              <div className="rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-4 py-3 text-sm mb-6 font-medium border border-blue-100 dark:border-blue-900/30">
                Your account is pending admin approval. Please try again later.
              </div>
            )}
            {params?.message === "registered" && (
              <div className="rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 px-4 py-3 text-sm mb-6 font-medium border border-emerald-100 dark:border-emerald-900/30">
                Registration successful! Please wait for admin approval.
              </div>
            )}

            <LoginForm />

            {/* Footer Action */}
            <div className="mt-10 text-center">
              <p className="text-slate-500 dark:text-zinc-400 font-medium text-sm">
                Don't have an account? 
                <Link className="ml-1 text-teal-600 dark:text-teal-400 font-bold hover:text-teal-700 dark:hover:text-teal-300 transition-colors" href="/register">
                  Register for Access
                </Link>
              </p>
            </div>

            {/* HIPAA Compliance / Small Links */}
            <div className="mt-12 flex flex-wrap justify-center gap-6 md:justify-start">
              <div className="flex items-center gap-1.5 opacity-60">
                <ShieldCheck className="w-4 h-4 text-slate-500 dark:text-zinc-400" />
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 dark:text-zinc-400">HIPAA Compliant</span>
              </div>
              <div className="flex items-center gap-1.5 opacity-60">
                <Lock className="w-4 h-4 text-slate-500 dark:text-zinc-400" />
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 dark:text-zinc-400">256-bit Encrypted</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
