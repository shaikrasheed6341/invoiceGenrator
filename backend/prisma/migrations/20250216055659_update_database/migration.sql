/*
  Warnings:

  - You are about to alter the column `subtotal` on the `Quotation` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.
  - You are about to alter the column `totalTax` on the `Quotation` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.
  - You are about to alter the column `totalAmount` on the `Quotation` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.
  - You are about to drop the `QuotationItem` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `items` to the `Quotation` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "QuotationItem" DROP CONSTRAINT "QuotationItem_itemId_fkey";

-- DropForeignKey
ALTER TABLE "QuotationItem" DROP CONSTRAINT "QuotationItem_quotationId_fkey";

-- AlterTable
ALTER TABLE "Quotation" ADD COLUMN     "items" JSONB NOT NULL,
ALTER COLUMN "subtotal" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "totalTax" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "totalAmount" SET DATA TYPE DECIMAL(65,30);

-- DropTable
DROP TABLE "QuotationItem";
