-- CreateTable
CREATE TABLE "DoctorAvailability" (
    "AvailabilityID" SERIAL NOT NULL,
    "DoctorID" INTEGER NOT NULL,
    "DayOfWeek" INTEGER NOT NULL,
    "FromTime" VARCHAR(10) NOT NULL,
    "ToTime" VARCHAR(10) NOT NULL,
    "MaxPatients" INTEGER NOT NULL,
    "IsAvailable" BOOLEAN NOT NULL DEFAULT true,
    "IsEmergencyOnly" BOOLEAN NOT NULL DEFAULT false,
    "Created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "Modified" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DoctorAvailability_pkey" PRIMARY KEY ("AvailabilityID")
);

-- CreateIndex
CREATE UNIQUE INDEX "DoctorAvailability_DoctorID_DayOfWeek_key" ON "DoctorAvailability"("DoctorID", "DayOfWeek");

-- AddForeignKey
ALTER TABLE "DoctorAvailability" ADD CONSTRAINT "DoctorAvailability_DoctorID_fkey" FOREIGN KEY ("DoctorID") REFERENCES "Doctor"("DoctorID") ON DELETE RESTRICT ON UPDATE CASCADE;
