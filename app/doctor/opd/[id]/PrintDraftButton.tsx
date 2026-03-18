"use client";

export default function PrintDraftButton() {
    return (
        <button 
            type="button"
            onClick={() => window.print()}
            className="flex-1 sm:flex-none px-6 py-2 border border-slate-200 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50 transition"
        >
            Print Draft
        </button>
    );
}
