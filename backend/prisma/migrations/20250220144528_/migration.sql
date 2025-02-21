/*
  Warnings:

  - The `quantity` column on the `Item` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `rate` column on the `Item` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `tax` column on the `Item` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Item" DROP COLUMN "quantity",
ADD COLUMN     "quantity" INTEGER,
DROP COLUMN "rate",
ADD COLUMN     "rate" DOUBLE PRECISION,
DROP COLUMN "tax",
ADD COLUMN     "tax" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Owner" ADD COLUMN     "address" TEXT NOT NULL DEFAULT 'not provided',
ADD COLUMN     "compneyname" TEXT NOT NULL DEFAULT 'unknown';

-- AlterTable
ALTER TABLE "Quotation" ADD COLUMN     "bankdetailsId" TEXT,
ADD COLUMN     "paymentId" TEXT;

-- CreateTable
CREATE TABLE "Bankdetails" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "IFSCCode" TEXT,
    "AccountNo" TEXT,
    "bank" TEXT,

    CONSTRAINT "Bankdetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "upid" TEXT NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Payment_upid_key" ON "Payment"("upid");

-- AddForeignKey
ALTER TABLE "Quotation" ADD CONSTRAINT "Quotation_bankdetailsId_fkey" FOREIGN KEY ("bankdetailsId") REFERENCES "Bankdetails"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quotation" ADD CONSTRAINT "Quotation_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "Payment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
