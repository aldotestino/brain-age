/*
  Warnings:

  - You are about to drop the column `email` on the `Patient` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[taxIdCode]` on the table `Patient` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `taxIdCode` to the `Patient` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Patient_email_key";

-- AlterTable
ALTER TABLE "Patient" DROP COLUMN "email",
ADD COLUMN     "taxIdCode" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Patient_taxIdCode_key" ON "Patient"("taxIdCode");
