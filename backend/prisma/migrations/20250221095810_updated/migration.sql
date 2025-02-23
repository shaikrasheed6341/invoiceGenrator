/*
  Warnings:

  - Made the column `bankdetailsId` on table `Quotation` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Quotation" DROP CONSTRAINT "Quotation_bankdetailsId_fkey";

-- AlterTable
ALTER TABLE "Quotation" ALTER COLUMN "bankdetailsId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Quotation" ADD CONSTRAINT "Quotation_bankdetailsId_fkey" FOREIGN KEY ("bankdetailsId") REFERENCES "Bankdetails"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
