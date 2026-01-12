-- CreateTable
CREATE TABLE "Hospital" (
    "HospitalID" SERIAL NOT NULL,
    "HospitalName" VARCHAR(250) NOT NULL,
    "Address" VARCHAR(500),
    "OpeningDate" TIMESTAMP(3) NOT NULL,
    "Created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "Modified" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Hospital_pkey" PRIMARY KEY ("HospitalID")
);
