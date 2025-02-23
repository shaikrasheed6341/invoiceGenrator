/*
  Warnings:

  - You are about to drop the column `AccountNo` on the `Bankdetails` table. All the data in the column will be lost.
  - You are about to drop the column `IFSCCode` on the `Bankdetails` table. All the data in the column will be lost.
  - You are about to alter the column `tax` on the `Item` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.

*/
-- AlterTable
ALTER TABLE "Bankdetails" DROP COLUMN "AccountNo",
DROP COLUMN "IFSCCode",
ADD COLUMN     "accountNo" TEXT,
ADD COLUMN     "ifsccode" TEXT;

-- AlterTable
ALTER TABLE "Item" ALTER COLUMN "tax" SET DATA TYPE INTEGER;
