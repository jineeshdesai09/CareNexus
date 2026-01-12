-- CreateTable
CREATE TABLE "Receipt" (
    "ReceiptID" SERIAL NOT NULL,
    "ReceiptNo" VARCHAR(250),
    "ReceiptDate" TIMESTAMP(3) NOT NULL,
    "OPDID" INTEGER NOT NULL,
    "AmountPaid" DECIMAL(10,2) NOT NULL,
    "PaymentModeID" INTEGER NOT NULL,
    "ReferenceNo" VARCHAR(250),
    "ReferenceDate" TIMESTAMP(3),
    "CancellationDateTime" TIMESTAMP(3),
    "CancellationByUserID" INTEGER,
    "CancellationRemarks" VARCHAR(500),
    "Description" VARCHAR(250),
    "UserID" INTEGER,
    "Created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "Modified" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Receipt_pkey" PRIMARY KEY ("ReceiptID")
);

-- CreateTable
CREATE TABLE "ReceiptTran" (
    "ReceiptTranID" SERIAL NOT NULL,
    "ReceiptID" INTEGER NOT NULL,
    "SubTreatmentTypeID" INTEGER NOT NULL,
    "Rate" DECIMAL(10,2) NOT NULL,
    "Quantity" INTEGER NOT NULL DEFAULT 1,
    "Amount" DECIMAL(10,2) NOT NULL,
    "Description" VARCHAR(250),
    "UserID" INTEGER,
    "Created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "Modified" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReceiptTran_pkey" PRIMARY KEY ("ReceiptTranID")
);

-- AddForeignKey
ALTER TABLE "Receipt" ADD CONSTRAINT "Receipt_OPDID_fkey" FOREIGN KEY ("OPDID") REFERENCES "OPD"("OPDID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReceiptTran" ADD CONSTRAINT "ReceiptTran_ReceiptID_fkey" FOREIGN KEY ("ReceiptID") REFERENCES "Receipt"("ReceiptID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReceiptTran" ADD CONSTRAINT "ReceiptTran_SubTreatmentTypeID_fkey" FOREIGN KEY ("SubTreatmentTypeID") REFERENCES "SubTreatmentType"("SubTreatmentTypeID") ON DELETE RESTRICT ON UPDATE CASCADE;
