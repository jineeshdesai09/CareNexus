"use client";

export default function PrintDraftButton() {
    return (
        <button 
            type="button"
            onClick={() => window.print()}
            className="flex-1 sm:flex-none px-6 py-2 border border-slate-200 dark:border-zinc-700 rounded-lg text-sm font-semibold text-slate-600 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800 transition shadow-sm"
        >
            Print Draft
        </button>
    );
}
