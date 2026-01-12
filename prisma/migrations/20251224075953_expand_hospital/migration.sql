-- AlterTable
ALTER TABLE "Hospital" ADD COLUMN     "DefaultPaymentModeID" INTEGER,
ADD COLUMN     "Description" VARCHAR(250),
ADD COLUMN     "IsRateEnableInReceipt" BOOLEAN DEFAULT false,
ADD COLUMN     "IsRegistrationFeeEnableInOPD" BOOLEAN DEFAULT false,
ADD COLUMN     "OpeningOPDNo" INTEGER,
ADD COLUMN     "OpeningPatientNo" INTEGER,
ADD COLUMN     "OpeningReceiptNo" INTEGER,
ADD COLUMN     "RegistrationCharge" DECIMAL(10,2),
ADD COLUMN     "RegistrationValidityMonths" INTEGER,
ADD COLUMN     "UserID" INTEGER;
