/*
  Warnings:

  - You are about to drop the column `waterfallSV` on the `Prediction` table. All the data in the column will be lost.
  - Added the required column `tornadoSV` to the `Prediction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Prediction" DROP COLUMN "waterfallSV",
ADD COLUMN     "tornadoSV" JSONB NOT NULL;
