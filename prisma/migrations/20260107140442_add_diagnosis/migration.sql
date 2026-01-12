-- CreateTable
CREATE TABLE "DiagnosisType" (
    "DiagnosisTypeID" SERIAL NOT NULL,
    "DiagnosisTypeName" VARCHAR(250) NOT NULL,
    "DiagnosisTypeShortName" VARCHAR(50),
    "IsActive" BOOLEAN NOT NULL DEFAULT true,
    "HospitalID" INTEGER NOT NULL,
    "Description" VARCHAR(250),
    "UserID" INTEGER,
    "Created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "Modified" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DiagnosisType_pkey" PRIMARY KEY ("DiagnosisTypeID")
);

-- CreateTable
CREATE TABLE "OPDDiagnosisType" (
    "OPDDiagnosisTypeID" SERIAL NOT NULL,
    "OPDID" INTEGER NOT NULL,
    "DiagnosisTypeID" INTEGER NOT NULL,
    "Description" VARCHAR(250),
    "UserID" INTEGER,
    "Created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "Modified" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OPDDiagnosisType_pkey" PRIMARY KEY ("OPDDiagnosisTypeID")
);

-- AddForeignKey
ALTER TABLE "DiagnosisType" ADD CONSTRAINT "DiagnosisType_HospitalID_fkey" FOREIGN KEY ("HospitalID") REFERENCES "Hospital"("HospitalID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OPDDiagnosisType" ADD CONSTRAINT "OPDDiagnosisType_OPDID_fkey" FOREIGN KEY ("OPDID") REFERENCES "OPD"("OPDID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OPDDiagnosisType" ADD CONSTRAINT "OPDDiagnosisType_DiagnosisTypeID_fkey" FOREIGN KEY ("DiagnosisTypeID") REFERENCES "DiagnosisType"("DiagnosisTypeID") ON DELETE RESTRICT ON UPDATE CASCADE;
