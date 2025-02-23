-- DropForeignKey
ALTER TABLE "Quotation" DROP CONSTRAINT "Quotation_bankdetailsId_fkey";

-- AlterTable
ALTER TABLE "Quotation" ALTER COLUMN "bankdetailsId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Quotation" ADD CONSTRAINT "Quotation_bankdetailsId_fkey" FOREIGN KEY ("bankdetailsId") REFERENCES "BankDetails"("id") ON DELETE SET NULL ON UPDATE CASCADE;
