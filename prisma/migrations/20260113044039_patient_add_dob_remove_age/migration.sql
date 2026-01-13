/*
  Warnings:

  - You are about to drop the column `Age` on the `Patient` table. All the data in the column will be lost.
  - Added the required column `DOB` to the `Patient` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Patient" DROP COLUMN "Age",
ADD COLUMN     "DOB" TIMESTAMP(3) NOT NULL;
