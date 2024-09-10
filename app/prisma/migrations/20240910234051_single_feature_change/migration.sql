/*
  Warnings:

  - You are about to drop the column `calculatedData` on the `Prediction` table. All the data in the column will be lost.
  - You are about to drop the column `percentages` on the `Prediction` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Prediction" DROP COLUMN "calculatedData",
DROP COLUMN "percentages",
ADD COLUMN     "dataChange" JSONB;
