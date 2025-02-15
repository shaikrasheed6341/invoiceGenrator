/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Item` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Item" ADD COLUMN     "brand" TEXT,
ALTER COLUMN "quantity" DROP NOT NULL,
ALTER COLUMN "rate" DROP NOT NULL,
ALTER COLUMN "tax" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Item_name_key" ON "Item"("name");
