"use client";

import { Download } from "lucide-react";

interface ExportReportsButtonProps {
  data: {
    totalOpds: number;
    totalRevenue: number;
    doctorWiseData: any[];
    diagnosisData: any[];
  };
}

export default function ExportReportsButton({ data }: ExportReportsButtonProps) {
  const downloadCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    
    // Summary
    csvContent += "Report Summary\n";
    csvContent += `Total Consultations,${data.totalOpds}\n`;
    csvContent += `Total Revenue,${data.totalRevenue}\n\n`;

    // Doctor Performance
    csvContent += "Doctor-wise Performance\n";
    csvContent += "Doctor Name,Specialization,Total OPDs\n";
    data.doctorWiseData.forEach(doc => {
      csvContent += `${doc.FirstName} ${doc.LastName},${doc.Specialization},${doc._count.OPDs}\n`;
    });
    csvContent += "\n";

    // Diagnosis
    csvContent += "Top Diagnosis\n";
    csvContent += "Diagnosis Name,Total Cases\n";
    data.diagnosisData.forEach(diag => {
      csvContent += `${diag.DiagnosisTypeName},${diag._count.OPDs}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `hospital_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button
      onClick={downloadCSV}
      className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-200 font-bold rounded-xl hover:bg-slate-200 dark:hover:bg-zinc-700 transition-all active:scale-95 text-sm"
    >
      <Download className="w-4 h-4" />
      Export CSV
    </button>
  );
}
