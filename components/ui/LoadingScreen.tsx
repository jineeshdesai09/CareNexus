import { Loader2, LayoutGrid } from "lucide-react";

export default function LoadingScreen() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] w-full animate-in fade-in duration-500">
            <div className="relative flex items-center justify-center">
                {/* Outer pulsing ring */}
                <div className="absolute inset-0 rounded-full w-24 h-24 bg-teal-500/10 dark:bg-teal-500/5 animate-ping mx-auto"></div>
                
                {/* Inner spinner box */}
                <div className="relative w-16 h-16 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-xl shadow-teal-500/10 rounded-2xl flex items-center justify-center z-10 mx-auto">
                    <Loader2 className="w-8 h-8 text-teal-600 dark:text-teal-400 animate-spin" />
                </div>
            </div>
            
            <div className="mt-8 text-center space-y-2 relative z-10">
                <h3 className="text-lg font-bold text-slate-900 dark:text-zinc-100 flex items-center justify-center gap-2">
                    <LayoutGrid className="w-5 h-5 text-teal-500 mt-0.5" />
                    Loading Dashboard
                </h3>
                <p className="text-sm font-medium text-slate-500 dark:text-zinc-500">
                    Preparing your workspace securely...
                </p>
            </div>
        </div>
    );
}
