/*
  Warnings:

  - A unique constraint covering the columns `[ownerId,accountno]` on the table `BankDetails` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[ownerId,phone]` on the table `Customer` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[ownerId,name]` on the table `Item` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[ownerId,number]` on the table `Quotation` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "BankDetails_accountno_key";

-- DropIndex
DROP INDEX "Customer_phone_key";

-- DropIndex
DROP INDEX "Item_name_key";

-- DropIndex
DROP INDEX "Quotation_number_key";

-- CreateIndex
CREATE UNIQUE INDEX "BankDetails_ownerId_accountno_key" ON "BankDetails"("ownerId", "accountno");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_ownerId_phone_key" ON "Customer"("ownerId", "phone");

-- CreateIndex
CREATE UNIQUE INDEX "Item_ownerId_name_key" ON "Item"("ownerId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Quotation_ownerId_number_key" ON "Quotation"("ownerId", "number");
