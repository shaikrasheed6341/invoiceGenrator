/*
  Warnings:

  - You are about to drop the column `items` on the `Quotation` table. All the data in the column will be lost.
  - You are about to drop the column `subtotal` on the `Quotation` table. All the data in the column will be lost.
  - You are about to drop the column `totalAmount` on the `Quotation` table. All the data in the column will be lost.
  - You are about to drop the column `totalTax` on the `Quotation` table. All the data in the column will be lost.
  - Added the required column `itemId` to the `Quotation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Quotation" DROP COLUMN "items",
DROP COLUMN "subtotal",
DROP COLUMN "totalAmount",
DROP COLUMN "totalTax",
ADD COLUMN     "itemId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Quotation" ADD CONSTRAINT "Quotation_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
