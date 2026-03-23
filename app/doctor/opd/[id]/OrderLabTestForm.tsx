"use client";

import { useState } from "react";
import { createLabOrder } from "@/app/actions/lab";
import { useRouter } from "next/navigation";
import { Check, FlaskConical, Search, X } from "lucide-react";

type LabTest = {
  TestID: number;
  TestName: string;
  Price: any; // Prisma Decimal
};

type Category = {
  CategoryID: number;
  CategoryName: string;
  LabTests: LabTest[];
};

export default function OrderLabTestForm({
  opdId,
  categories,
}: {
  opdId: number;
  categories: Category[];
}) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTests, setSelectedTests] = useState<Map<number, LabTest>>(new Map());
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleTest = (test: LabTest) => {
    const next = new Map(selectedTests);
    if (next.has(test.TestID)) {
      next.delete(test.TestID);
    } else {
      next.set(test.TestID, test);
    }
    setSelectedTests(next);
  };

  const removeTest = (testId: number) => {
    const next = new Map(selectedTests);
    next.delete(testId);
    setSelectedTests(next);
  };

  const calculateTotal = () => {
    let total = 0;
    selectedTests.forEach((t) => { total += Number(t.Price); });
    return total;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedTests.size === 0) return;

    setIsSubmitting(true);
    setError(null);
    try {
      await createLabOrder({
        opdId,
        testIds: Array.from(selectedTests.keys()),
        notes: notes.trim() ? notes : undefined,
      });
      setIsOpen(false);
      setSelectedTests(new Map());
      setNotes("");
      router.refresh();
      alert("Lab order successfully placed!");
    } catch (err: any) {
      setError(err.message || "Failed to create lab order");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredCategories = categories.map(c => ({
    ...c,
    LabTests: c.LabTests.filter(t => t.TestName.toLowerCase().includes(searchTerm.toLowerCase()))
  })).filter(c => c.LabTests.length > 0);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="w-full mt-4 bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-400 border border-teal-200 dark:border-teal-800/30 py-2 rounded-lg font-medium hover:bg-teal-100 dark:hover:bg-teal-900/40 transition flex items-center justify-center gap-2 text-sm"
      >
        <FlaskConical className="w-4 h-4" />
        Order Lab Test
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-gray-900/50 dark:bg-black/60 backdrop-blur-sm transition-opacity">
          <div className="w-full max-w-lg bg-white dark:bg-zinc-950 h-full shadow-2xl flex flex-col animate-slide-in-right border-l border-transparent dark:border-zinc-800">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 dark:border-zinc-800 flex justify-between items-center bg-gray-50 dark:bg-zinc-900">
              <h2 className="text-lg font-bold text-gray-800 dark:text-zinc-100 flex items-center gap-2">
                <FlaskConical className="w-5 h-5 text-teal-600 dark:text-teal-500" />
                Select Lab Tests
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-gray-500 dark:text-zinc-400 hover:text-gray-700 dark:hover:text-zinc-200 hover:bg-gray-200 dark:hover:bg-zinc-800 rounded-full transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-zinc-950/50 p-4 space-y-4">
               {error && (
                 <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-lg border border-red-200 dark:border-red-900/50">
                   {error}
                 </div>
               )}

               {/* Cart Summary */}
               {selectedTests.size > 0 && (
                 <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-teal-200 dark:border-teal-800/50 shadow-sm mb-4">
                   <h3 className="text-sm font-semibold text-gray-700 dark:text-zinc-300 mb-3 border-b border-gray-100 dark:border-zinc-800 pb-2">Selected Tests ({selectedTests.size})</h3>
                   <div className="space-y-2 mb-3 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                     {Array.from(selectedTests.values()).map(test => (
                        <div key={test.TestID} className="flex justify-between items-center text-sm bg-gray-50 dark:bg-zinc-800 p-2 rounded-lg">
                            <span className="font-medium text-gray-800 dark:text-zinc-200">{test.TestName}</span>
                            <div className="flex items-center gap-3">
                                <span className="text-teal-600 dark:text-teal-400 font-semibold">₹{Number(test.Price).toFixed(2)}</span>
                                <button onClick={() => removeTest(test.TestID)} className="text-red-400 hover:text-red-600 dark:hover:text-red-300">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                     ))}
                   </div>
                   <div className="flex justify-between items-center font-bold text-lg text-gray-900 dark:text-zinc-100 pt-2 border-t border-gray-100 dark:border-zinc-800">
                      <span>Total Estimated Cost</span>
                      <span>₹{calculateTotal().toFixed(2)}</span>
                   </div>
                 </div>
               )}

               {/* Search */}
               <div className="relative">
                 <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400 dark:text-zinc-500" />
                 <input
                   type="text"
                   placeholder="Search test name..."
                   className="w-full pl-9 pr-4 py-2 bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-teal-500 text-sm text-gray-900 dark:text-zinc-100 placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none transition-shadow"
                   value={searchTerm}
                   onChange={e => setSearchTerm(e.target.value)}
                 />
               </div>

               {/* Catalog */}
               <div className="space-y-6 pb-6">
                 {filteredCategories.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 dark:text-zinc-500 text-sm">No tests found matching "{searchTerm}"</div>
                 ) : (
                    filteredCategories.map(cat => (
                        <div key={cat.CategoryID} className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl shadow-sm overflow-hidden">
                            <div className="bg-gray-100 dark:bg-zinc-800/80 px-4 py-2 text-xs font-bold text-gray-600 dark:text-zinc-400 uppercase tracking-wider border-b border-gray-200 dark:border-zinc-800">
                                {cat.CategoryName}
                            </div>
                            <div className="divide-y divide-gray-100 dark:divide-zinc-800">
                                {cat.LabTests.map(test => {
                                    const isSelected = selectedTests.has(test.TestID);
                                    return (
                                        <div 
                                            key={test.TestID} 
                                            onClick={() => toggleTest(test)}
                                            className={`p-3 flex justify-between items-center cursor-pointer transition-colors ${isSelected ? 'bg-teal-50/50 dark:bg-teal-900/20' : 'hover:bg-gray-50 dark:hover:bg-zinc-800'}`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isSelected ? 'bg-teal-600 border-teal-600 dark:bg-teal-500 dark:border-teal-500' : 'border-gray-300 dark:border-zinc-600'}`}>
                                                    {isSelected && <Check className="w-3.5 h-3.5 text-white dark:text-zinc-900" />}
                                                </div>
                                                <span className={`text-sm font-medium ${isSelected ? 'text-teal-900 dark:text-teal-300' : 'text-gray-800 dark:text-zinc-300'}`}>{test.TestName}</span>
                                            </div>
                                            <span className="text-sm font-semibold text-gray-500 dark:text-zinc-500">₹{Number(test.Price).toFixed(0)}</span>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    ))
                 )}
               </div>
            </div>

            {/* Footer / Actions */}
            <div className="p-4 border-t border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 space-y-4">
               <div>
                  <label className="block text-xs font-bold text-gray-600 dark:text-zinc-400 uppercase tracking-wider mb-2">Instructions for Lab (Optional)</label>
                  <textarea
                    className="w-full bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-800 rounded-lg p-3 text-sm text-gray-900 dark:text-zinc-100 focus:ring-2 focus:ring-teal-500 focus:outline-none resize-none placeholder-gray-400 dark:placeholder-zinc-600"
                    rows={2}
                    placeholder="e.g. Fasting required, urgent..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
               </div>
               
               <div className="flex gap-3">
                   <button
                        onClick={() => setIsOpen(false)}
                        className="flex-1 px-4 py-2.5 bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-zinc-300 font-medium rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-800 transition"
                   >
                       Cancel
                   </button>
                   <button
                        onClick={handleSubmit}
                        disabled={selectedTests.size === 0 || isSubmitting}
                        className="flex-1 px-4 py-2.5 bg-teal-600 dark:bg-teal-500 text-white dark:text-zinc-950 font-bold rounded-xl hover:bg-teal-700 dark:hover:bg-teal-400 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm flex items-center justify-center"
                   >
                       {isSubmitting ? "Placing Order..." : `Confirm Order (${selectedTests.size})`}
                   </button>
               </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
