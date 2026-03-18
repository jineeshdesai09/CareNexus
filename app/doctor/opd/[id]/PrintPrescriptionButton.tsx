"use client";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Printer } from "lucide-react";

interface PrintPrescriptionButtonProps {
    data: {
        hospital: {
            HospitalName: string;
            Address: string | null;
            Description: string | null;
        };
        patient: {
            PatientName: string;
            PatientNo: number;
            Age: number;
            Gender: string;
        };
        doctor: {
            FirstName: string;
            LastName: string;
            Specialization: string;
            RegistrationNo: string;
        };
        vitals?: {
            Weight: number | null;
            Height: number | null;
            BP: string | null;
            Temp: number | null;
            Pulse: number | null;
            SpO2: number | null;
        };
        medicines: Array<{
            name: string;
            dosage: string;
            frequency: string;
            duration: string;
            instructions: string | null;
        }>;
        notes: string | null;
        date: string;
    };
}

export default function PrintPrescriptionButton({ data }: PrintPrescriptionButtonProps) {
    const generatePDF = () => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();

        // 1. Hospital Header
        doc.setFontSize(22);
        doc.setFont("helvetica", "bold");
        doc.text(data.hospital.HospitalName.toUpperCase(), pageWidth / 2, 20, { align: "center" });

        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text(data.hospital.Address || "", pageWidth / 2, 27, { align: "center" });
        doc.text(data.hospital.Description || "", pageWidth / 2, 32, { align: "center" });

        doc.setLineWidth(0.5);
        doc.line(15, 38, pageWidth - 15, 38);

        // 2. Doctor Info (Right aligned)
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text(`Dr. ${data.doctor.FirstName} ${data.doctor.LastName}`, pageWidth - 15, 48, { align: "right" });
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text(data.doctor.Specialization, pageWidth - 15, 53, { align: "right" });
        doc.text(`Reg No: ${data.doctor.RegistrationNo}`, pageWidth - 15, 58, { align: "right" });

        // 3. Patient Info (Left aligned)
        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        doc.text(`PATIENT: ${data.patient.PatientName}`, 15, 48);
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text(`ID: ${data.patient.PatientNo}`, 15, 54);
        doc.text(`Age/Sex: ${data.patient.Age}Y / ${data.patient.Gender}`, 15, 60);
        doc.text(`Date: ${data.date}`, 15, 66);

        doc.line(15, 72, pageWidth - 15, 72);

        // 4. Vitals
        let vitalsYOffset = 0;
        if (data.vitals) {
            doc.setFontSize(12);
            doc.setFont("helvetica", "bold");
            doc.text("VITALS", 15, 82);

            const vitalsText = [
                data.vitals.Weight ? `Weight: ${data.vitals.Weight}kg` : "",
                data.vitals.Height ? `Height: ${data.vitals.Height}cm` : "",
                data.vitals.BP ? `BP: ${data.vitals.BP}` : "",
                data.vitals.Temp ? `Temp: ${data.vitals.Temp}°C` : "",
                data.vitals.Pulse ? `Pulse: ${data.vitals.Pulse}bpm` : "",
                data.vitals.SpO2 ? `SpO2: ${data.vitals.SpO2}%` : "",
            ].filter(Boolean).join("  |  ");

            doc.setFontSize(10);
            doc.setFont("helvetica", "normal");
            doc.text(vitalsText || "N/A", 15, 88);
            vitalsYOffset = 20;
        }

        // 5. Prescription (RX)
        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.text("Rx", 15, 85 + vitalsYOffset);

        let finalY = 90 + vitalsYOffset;
        if (data.medicines.length > 0) {
            const result = autoTable(doc, {
                startY: 90 + vitalsYOffset,
                head: [['Medicine', 'Dosage', 'Frequency', 'Duration', 'Instructions']],
                body: data.medicines.map(m => [
                    m.name,
                    m.dosage,
                    m.frequency,
                    m.duration,
                    m.instructions || "-"
                ]),
                theme: 'striped',
                headStyles: { fillColor: [41, 128, 185] },
                margin: { left: 15, right: 15 }
            });
            finalY = (result as any).lastAutoTable?.finalY || (90 + vitalsYOffset);
        } else {
            doc.setFontSize(10);
            doc.text("No medications prescribed.", 15, 115);
            finalY = 120;
        }

        // 6. Notes
        if (data.notes) {
            doc.setFontSize(12);
            doc.setFont("helvetica", "bold");
            doc.text("Clinical Notes / Advice:", 15, finalY + 15);
            doc.setFontSize(10);
            doc.setFont("helvetica", "normal");
            const splitNotes = doc.splitTextToSize(data.notes, pageWidth - 30);
            doc.text(splitNotes, 15, finalY + 22);
            finalY += 22 + (splitNotes.length * 5);
        }

        // 7. Footer
        doc.setFontSize(10);
        doc.setFont("helvetica", "italic");
        doc.text("Generated by OPD Management System", pageWidth / 2, doc.internal.pageSize.getHeight() - 10, { align: "center" });

        // Save
        doc.save(`Prescription_${data.patient.PatientName.replace(/\s+/g, '_')}_${data.date}.pdf`);
    };

    return (
        <button
            onClick={generatePDF}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition font-semibold shadow-md active:scale-95"
        >
            <Printer className="w-5 h-5" />
            Print Prescription (PDF)
        </button>
    );
}
