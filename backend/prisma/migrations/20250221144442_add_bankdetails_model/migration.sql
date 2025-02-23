/*
  Warnings:

  - You are about to drop the column `date` on the `Quotation` table. All the data in the column will be lost.
  - You are about to drop the column `itemId` on the `Quotation` table. All the data in the column will be lost.
  - You are about to drop the `Bankdetails` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `brand` on table `Item` required. This step will fail if there are existing NULL values in that column.
  - Made the column `quantity` on table `Item` required. This step will fail if there are existing NULL values in that column.
  - Made the column `rate` on table `Item` required. This step will fail if there are existing NULL values in that column.
  - Made the column `tax` on table `Item` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Quotation" DROP CONSTRAINT "Quotation_bankdetailsId_fkey";

-- DropForeignKey
ALTER TABLE "Quotation" DROP CONSTRAINT "Quotation_itemId_fkey";

-- DropIndex
DROP INDEX "Item_name_key";

-- AlterTable
ALTER TABLE "Item" ALTER COLUMN "brand" SET NOT NULL,
ALTER COLUMN "quantity" SET NOT NULL,
ALTER COLUMN "rate" SET NOT NULL,
ALTER COLUMN "tax" SET NOT NULL,
ALTER COLUMN "tax" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Quotation" DROP COLUMN "date",
DROP COLUMN "itemId";

-- DropTable
DROP TABLE "Bankdetails";

-- CreateTable
CREATE TABLE "QuotationItem" (
    "id" TEXT NOT NULL,
    "quotationId" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,

    CONSTRAINT "QuotationItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BankDetails" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "ifsccode" TEXT NOT NULL,
    "accountno" TEXT NOT NULL,
    "bank" TEXT NOT NULL,
    "upid" TEXT NOT NULL,

    CONSTRAINT "BankDetails_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "QuotationItem_quotationId_itemId_key" ON "QuotationItem"("quotationId", "itemId");

-- AddForeignKey
ALTER TABLE "Quotation" ADD CONSTRAINT "Quotation_bankdetailsId_fkey" FOREIGN KEY ("bankdetailsId") REFERENCES "BankDetails"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuotationItem" ADD CONSTRAINT "QuotationItem_quotationId_fkey" FOREIGN KEY ("quotationId") REFERENCES "Quotation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuotationItem" ADD CONSTRAINT "QuotationItem_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;
