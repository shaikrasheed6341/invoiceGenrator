/*
  Warnings:

  - You are about to drop the column `tax` on the `Item` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Item" DROP COLUMN "tax";

-- AlterTable
ALTER TABLE "QuotationItem" ADD COLUMN     "tax" DOUBLE PRECISION NOT NULL DEFAULT 0;
