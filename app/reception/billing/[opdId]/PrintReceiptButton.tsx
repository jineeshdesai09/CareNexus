"use client";

import jsPDF from "jspdf";
import "jspdf-autotable";
import { Printer } from "lucide-react";

interface PrintReceiptButtonProps {
    data: {
        hospital: {
            HospitalName: string;
            Address: string | null;
            Phone: string | null;
        };
        receipt: {
            ReceiptNo: string;
            ReceiptDate: string;
            AmountPaid: number;
            Description: string | null;
        };
        patient: {
            PatientName: string;
            PatientNo: number;
        };
        items: Array<{
            name: string;
            rate: number;
            quantity: number;
            amount: number;
        }>;
        registrationFee: number;
    };
}

export default function PrintReceiptButton({ data }: PrintReceiptButtonProps) {
    const generatePDF = () => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();

        // 1. Hospital Header
        doc.setFontSize(20);
        doc.setFont("helvetica", "bold");
        doc.text(data.hospital.HospitalName, pageWidth / 2, 20, { align: "center" });

        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text(data.hospital.Address || "", pageWidth / 2, 27, { align: "center" });
        if (data.hospital.Phone) {
            doc.text(`Phone: ${data.hospital.Phone}`, pageWidth / 2, 32, { align: "center" });
        }

        doc.setLineWidth(0.5);
        doc.line(15, 38, pageWidth - 15, 38);

        // 2. Receipt Info
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("PAYMENT RECEIPT", pageWidth / 2, 48, { align: "center" });

        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text(`Receipt No: ${data.receipt.ReceiptNo}`, 15, 58);
        doc.text(`Date: ${data.receipt.ReceiptDate}`, pageWidth - 15, 58, { align: "right" });

        doc.text(`Patient Name: ${data.patient.PatientName}`, 15, 65);
        doc.text(`Patient ID: ${data.patient.PatientNo}`, pageWidth - 15, 65, { align: "right" });

        doc.line(15, 70, pageWidth - 15, 70);

        // 3. Items Table
        const tableBody = [];

        // Add Registration Fee if > 0
        if (data.registrationFee > 0) {
            tableBody.push(['OPD Registration Fee', '-', '1', data.registrationFee.toFixed(2)]);
        }

        // Add services
        data.items.forEach(item => {
            tableBody.push([
                item.name,
                item.rate.toFixed(2),
                item.quantity.toString(),
                item.amount.toFixed(2)
            ]);
        });

        (doc as any).autoTable({
            startY: 75,
            head: [['Service Description', 'Rate', 'Qty', 'Amount']],
            body: tableBody,
            theme: 'grid',
            headStyles: { fillColor: [52, 73, 94] },
            columnStyles: {
                3: { halign: 'right' }
            },
            margin: { left: 15, right: 15 }
        });

        let finalY = (doc as any).lastAutoTable.finalY + 10;

        // 4. Totals
        doc.setFont("helvetica", "bold");
        doc.text("GRAND TOTAL:", pageWidth - 60, finalY);
        doc.text(`INR ${data.receipt.AmountPaid.toFixed(2)}`, pageWidth - 15, finalY, { align: "right" });

        // 5. Amount in Words (Optional simplified)
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.text(`Notes: ${data.receipt.Description || "N/A"}`, 15, finalY + 10);

        // 6. Signatures
        doc.setFontSize(10);
        doc.text("Authorized Signatory", pageWidth - 15, finalY + 40, { align: "right" });
        doc.line(pageWidth - 60, finalY + 35, pageWidth - 15, finalY + 35);

        // 7. Footer
        doc.setFontSize(8);
        doc.text("This is a computer generated receipt.", pageWidth / 2, doc.internal.pageSize.getHeight() - 10, { align: "center" });

        // Save
        doc.save(`Receipt_${data.receipt.ReceiptNo}.pdf`);
    };

    return (
        <button
            onClick={generatePDF}
            className="flex items-center gap-2 bg-green-600 text-white px-8 py-3 rounded-xl font-bold text-lg hover:bg-green-700 transition shadow-lg active:scale-95"
        >
            <Printer className="w-5 h-5" />
            Download & Print Receipt
        </button>
    );
}
