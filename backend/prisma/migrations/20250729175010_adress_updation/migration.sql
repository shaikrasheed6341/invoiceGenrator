/*
  Warnings:

  - You are about to drop the column `address` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the column `address` on the `Owner` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Customer" DROP COLUMN "address",
ADD COLUMN     "city" TEXT,
ADD COLUMN     "houseNumber" TEXT,
ADD COLUMN     "locality" TEXT,
ADD COLUMN     "pinCode" TEXT,
ADD COLUMN     "recipientName" TEXT,
ADD COLUMN     "state" TEXT,
ADD COLUMN     "streetName" TEXT;

-- AlterTable
ALTER TABLE "Owner" DROP COLUMN "address",
ADD COLUMN     "city" TEXT,
ADD COLUMN     "houseNumber" TEXT,
ADD COLUMN     "locality" TEXT,
ADD COLUMN     "pinCode" TEXT,
ADD COLUMN     "recipientName" TEXT,
ADD COLUMN     "state" TEXT,
ADD COLUMN     "streetName" TEXT;
