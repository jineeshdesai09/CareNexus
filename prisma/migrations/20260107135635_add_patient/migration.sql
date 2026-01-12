-- CreateTable
CREATE TABLE "Patient" (
    "PatientID" SERIAL NOT NULL,
    "PatientName" VARCHAR(250) NOT NULL,
    "PatientNo" INTEGER NOT NULL,
    "RegistrationDateTime" TIMESTAMP(3) NOT NULL,
    "Age" INTEGER,
    "BloodGroup" VARCHAR(20),
    "Gender" VARCHAR(10) NOT NULL,
    "Occupation" VARCHAR(100),
    "Address" VARCHAR(250),
    "StateID" INTEGER,
    "CityID" INTEGER,
    "PinCode" VARCHAR(10),
    "MobileNo" VARCHAR(20) NOT NULL,
    "EmergencyContactNo" VARCHAR(20),
    "ReferredBy" VARCHAR(250),
    "Description" VARCHAR(250),
    "HospitalID" INTEGER NOT NULL,
    "UserID" INTEGER,
    "Created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "Modified" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Patient_pkey" PRIMARY KEY ("PatientID")
);

-- AddForeignKey
ALTER TABLE "Patient" ADD CONSTRAINT "Patient_HospitalID_fkey" FOREIGN KEY ("HospitalID") REFERENCES "Hospital"("HospitalID") ON DELETE RESTRICT ON UPDATE CASCADE;
