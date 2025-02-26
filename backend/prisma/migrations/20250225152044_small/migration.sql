/*
  Warnings:

  - A unique constraint covering the columns `[accountno]` on the table `BankDetails` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "BankDetails_accountno_key" ON "BankDetails"("accountno");
