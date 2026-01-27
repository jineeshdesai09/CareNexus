/*
  Warnings:

  - You are about to drop the column `Description` on the `Doctor` table. All the data in the column will be lost.
  - You are about to drop the column `DoctorName` on the `Doctor` table. All the data in the column will be lost.
  - You are about to drop the column `StaffID` on the `Doctor` table. All the data in the column will be lost.
  - You are about to drop the column `UserID` on the `Doctor` table. All the data in the column will be lost.
  - Added the required column `ConsultationFee` to the `Doctor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Department` to the `Doctor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Email` to the `Doctor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `FirstName` to the `Doctor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Gender` to the `Doctor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `LastName` to the `Doctor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `MobileNo` to the `Doctor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `RegistrationNo` to the `Doctor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Specialization` to the `Doctor` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Doctor" DROP COLUMN "Description",
DROP COLUMN "DoctorName",
DROP COLUMN "StaffID",
DROP COLUMN "UserID",
ADD COLUMN     "AboutDoctor" TEXT,
ADD COLUMN     "Address" TEXT,
ADD COLUMN     "ConsultationFee" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "DOB" TIMESTAMP(3),
ADD COLUMN     "Department" TEXT NOT NULL,
ADD COLUMN     "Email" VARCHAR(150) NOT NULL,
ADD COLUMN     "ExperienceYears" INTEGER,
ADD COLUMN     "FirstName" VARCHAR(100) NOT NULL,
ADD COLUMN     "Gender" VARCHAR(10) NOT NULL,
ADD COLUMN     "IsEmergencyAvailable" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "LastName" VARCHAR(100) NOT NULL,
ADD COLUMN     "MobileNo" VARCHAR(20) NOT NULL,
ADD COLUMN     "Qualification" TEXT,
ADD COLUMN     "RegistrationCouncil" TEXT,
ADD COLUMN     "RegistrationNo" VARCHAR(100) NOT NULL,
ADD COLUMN     "Specialization" TEXT NOT NULL;
