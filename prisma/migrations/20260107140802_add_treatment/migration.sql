-- CreateTable
CREATE TABLE "TreatmentType" (
    "TreatmentTypeID" SERIAL NOT NULL,
    "TreatmentTypeName" VARCHAR(250) NOT NULL,
    "TreatmentTypeShortName" VARCHAR(50),
    "HospitalID" INTEGER NOT NULL,
    "Description" VARCHAR(250),
    "UserID" INTEGER,
    "Created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "Modified" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TreatmentType_pkey" PRIMARY KEY ("TreatmentTypeID")
);

-- CreateTable
CREATE TABLE "SubTreatmentType" (
    "SubTreatmentTypeID" SERIAL NOT NULL,
    "SubTreatmentTypeName" VARCHAR(250) NOT NULL,
    "TreatmentTypeID" INTEGER NOT NULL,
    "Rate" DECIMAL(10,2) NOT NULL,
    "IsActive" BOOLEAN NOT NULL DEFAULT true,
    "Description" VARCHAR(250),
    "UserID" INTEGER,
    "AccountID" INTEGER,
    "Created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "Modified" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SubTreatmentType_pkey" PRIMARY KEY ("SubTreatmentTypeID")
);

-- AddForeignKey
ALTER TABLE "TreatmentType" ADD CONSTRAINT "TreatmentType_HospitalID_fkey" FOREIGN KEY ("HospitalID") REFERENCES "Hospital"("HospitalID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubTreatmentType" ADD CONSTRAINT "SubTreatmentType_TreatmentTypeID_fkey" FOREIGN KEY ("TreatmentTypeID") REFERENCES "TreatmentType"("TreatmentTypeID") ON DELETE RESTRICT ON UPDATE CASCADE;
