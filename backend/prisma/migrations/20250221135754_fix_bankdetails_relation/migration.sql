/*
  Warnings:

  - A unique constraint covering the columns `[bankdetailsId]` on the table `Quotation` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Quotation_bankdetailsId_key" ON "Quotation"("bankdetailsId");
