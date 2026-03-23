"use client";

import { Save, CheckCircle, ArrowLeft } from "lucide-react";
import PrintDraftButton from "./PrintDraftButton";

export default function ConsultationFooter() {
    return (
        <footer className="fixed bottom-0 left-0 right-0 bg-white dark:bg-zinc-950 border-t border-slate-200 dark:border-zinc-800 py-5 px-8 z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] dark:shadow-none">
            <input type="hidden" name="isDraft" id="isDraftInput" value="false" />
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <button 
                        type="submit"
                        onClick={() => {
                            const input = document.getElementById('isDraftInput') as HTMLInputElement;
                            if (input) input.value = "true";
                        }}
                        className="px-8 py-3 border border-slate-200 dark:border-zinc-700 rounded-2xl text-base font-bold text-slate-600 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-900 transition-all flex items-center gap-3 shadow-sm active:scale-95"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Save & Exit
                    </button>
                </div>
                <div className="flex items-center gap-4 w-full sm:w-auto">
                    <PrintDraftButton />
                    <button 
                        type="submit"
                        onClick={() => {
                            const input = document.getElementById('isDraftInput') as HTMLInputElement;
                            if (input) input.value = "false";
                        }}
                        className="flex-1 sm:flex-none px-12 py-3.5 bg-blue-600 dark:bg-blue-500 rounded-2xl text-lg font-bold text-white hover:bg-blue-700 dark:hover:bg-blue-600 shadow-xl shadow-blue-200 dark:shadow-none transition-all active:scale-95 flex items-center justify-center gap-3"
                    >
                        <CheckCircle className="w-6 h-6" />
                        Complete Consultation
                    </button>
                </div>
            </div>
        </footer>
    );
}
