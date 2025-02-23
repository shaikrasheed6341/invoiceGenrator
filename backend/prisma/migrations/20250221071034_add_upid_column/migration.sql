/*
  Warnings:

  - You are about to drop the column `paymentId` on the `Quotation` table. All the data in the column will be lost.
  - You are about to drop the `Payment` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[name]` on the table `Bankdetails` will be added. If there are existing duplicate values, this will fail.
  - Made the column `name` on table `Bankdetails` required. This step will fail if there are existing NULL values in that column.
  - Made the column `bank` on table `Bankdetails` required. This step will fail if there are existing NULL values in that column.
  - Made the column `ifsccode` on table `Bankdetails` required. This step will fail if there are existing NULL values in that column.
  - Made the column `accountno` on table `Bankdetails` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Quotation" DROP CONSTRAINT "Quotation_paymentId_fkey";

-- AlterTable
ALTER TABLE "Bankdetails" ADD COLUMN     "upid" TEXT,
ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "bank" SET NOT NULL,
ALTER COLUMN "ifsccode" SET NOT NULL,
ALTER COLUMN "accountno" SET NOT NULL;

-- AlterTable
ALTER TABLE "Quotation" DROP COLUMN "paymentId";

-- DropTable
DROP TABLE "Payment";

-- CreateIndex
CREATE UNIQUE INDEX "Bankdetails_name_key" ON "Bankdetails"("name");
