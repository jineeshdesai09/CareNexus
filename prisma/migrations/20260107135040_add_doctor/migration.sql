-- CreateTable
CREATE TABLE "Doctor" (
    "DoctorID" SERIAL NOT NULL,
    "DoctorName" VARCHAR(250) NOT NULL,
    "StaffID" INTEGER,
    "HospitalID" INTEGER NOT NULL,
    "Description" VARCHAR(250),
    "UserID" INTEGER,
    "Created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "Modified" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Doctor_pkey" PRIMARY KEY ("DoctorID")
);

-- AddForeignKey
ALTER TABLE "Doctor" ADD CONSTRAINT "Doctor_HospitalID_fkey" FOREIGN KEY ("HospitalID") REFERENCES "Hospital"("HospitalID") ON DELETE RESTRICT ON UPDATE CASCADE;
