/*
  Warnings:

  - You are about to drop the column `accountNo` on the `Bankdetails` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Bankdetails" DROP COLUMN "accountNo",
ADD COLUMN     "accountno" TEXT;
