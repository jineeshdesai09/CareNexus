"use client";

import { useState, useEffect, useCallback } from "react";
import { searchPatients } from "@/app/actions/patient";
import { Search, User, Phone, Hash, X } from "lucide-react";

interface Patient {
    PatientID: number;
    PatientName: string;
    PatientNo: number;
    MobileNo: string;
    Age: number;
    Gender: string;
    Height: number | null;
}

export default function PatientSearch({ onSelect }: { onSelect?: (p: Patient | null) => void }) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<Patient[]>([]);
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
    const [isSearching, setIsSearching] = useState(false);

    const performSearch = useCallback(async (q: string) => {
        if (q.length < 2) {
            setResults([]);
            return;
        }
        setIsSearching(true);
        try {
            const data = await searchPatients(q);
            setResults(data as any as Patient[]);
        } catch (error) {
            console.error("Search failed:", error);
        } finally {
            setIsSearching(false);
        }
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (!selectedPatient) {
                performSearch(query);
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [query, performSearch, selectedPatient]);

    const handleSelect = (patient: Patient) => {
        setSelectedPatient(patient);
        setResults([]);
        setQuery("");
        if (onSelect) onSelect(patient);
    };

    const handleClear = () => {
        setSelectedPatient(null);
        setQuery("");
        if (onSelect) onSelect(null);
    };

    return (
        <div className="space-y-4">
            <input type="hidden" name="PatientID" value={selectedPatient?.PatientID || ""} required />

            <div className="relative">
                <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">
                    Search Patient (Name, Mobile, or ID)
                </label>

                {!selectedPatient ? (
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400 dark:text-zinc-500" />
                        </div>
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-zinc-700 rounded-xl leading-5 bg-white dark:bg-zinc-950 placeholder-gray-500 dark:placeholder-zinc-500 text-gray-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out"
                            placeholder="Type to search..."
                            disabled={!!selectedPatient}
                        />
                        {isSearching && (
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 dark:border-blue-500"></div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50 rounded-xl flex items-center justify-between animate-in fade-in zoom-in duration-200">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                {selectedPatient.PatientName[0]}
                            </div>
                            <div>
                                <h3 className="font-bold text-blue-900 dark:text-blue-100">{selectedPatient.PatientName}</h3>
                                <div className="flex gap-3 text-sm text-blue-700 dark:text-blue-400 mt-1">
                                    <span className="flex items-center gap-1"><Hash className="w-3 h-3" /> {selectedPatient.PatientNo}</span>
                                    <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {selectedPatient.MobileNo}</span>
                                    <span>{selectedPatient.Age}Y / {selectedPatient.Gender}</span>
                                </div>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={handleClear}
                            className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded-full text-blue-600 dark:text-blue-400 transition"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                )}

                {results.length > 0 && !selectedPatient && (
                    <div className="absolute z-10 mt-1 w-full bg-white dark:bg-zinc-900 shadow-xl dark:shadow-none max-h-60 rounded-xl border border-gray-200 dark:border-zinc-800 overflow-auto py-1 animate-in slide-in-from-top-2 duration-200">
                        {results.map((p) => (
                            <button
                                key={p.PatientID}
                                type="button"
                                onClick={() => handleSelect(p)}
                                className="w-full text-left px-4 py-3 hover:bg-blue-50 dark:hover:bg-zinc-800/50 flex items-center justify-between group transition"
                            >
                                <div className="flex flex-col">
                                    <span className="font-semibold text-gray-900 dark:text-zinc-100 group-hover:text-blue-700 dark:group-hover:text-blue-400">{p.PatientName}</span>
                                    <span className="text-xs text-gray-500 dark:text-zinc-400 flex items-center gap-2 mt-1">
                                        <Phone className="w-3 h-3" /> {p.MobileNo} | <Hash className="w-3 h-3" /> {p.PatientNo}
                                    </span>
                                </div>
                                <div className="text-xs bg-gray-100 dark:bg-zinc-800 px-2 py-1 rounded text-gray-600 dark:text-zinc-300 group-hover:bg-blue-100 dark:group-hover:bg-zinc-700 transition">
                                    {p.Age}Y / {p.Gender}
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
