/*
  Warnings:

  - Added the required column `updatedAt` to the `BankDetails` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Customer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Owner` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Quotation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `QuotationItem` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PAID', 'PARTIAL', 'OVERDUE', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('CASH', 'BANK_TRANSFER', 'UPI', 'CHEQUE', 'CARD', 'OTHER');

-- CreateEnum
CREATE TYPE "ReminderType" AS ENUM ('DUE_DATE', 'OVERDUE', 'FOLLOW_UP');

-- CreateEnum
CREATE TYPE "ReminderStatus" AS ENUM ('SENT', 'DELIVERED', 'FAILED');

-- AlterTable
ALTER TABLE "BankDetails" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Update existing BankDetails records
UPDATE "BankDetails" SET "updatedAt" = CURRENT_TIMESTAMP WHERE "updatedAt" IS NULL;

-- AlterTable
ALTER TABLE "Customer" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Update existing Customer records
UPDATE "Customer" SET "updatedAt" = CURRENT_TIMESTAMP WHERE "updatedAt" IS NULL;

-- AlterTable
ALTER TABLE "Item" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Update existing Item records
UPDATE "Item" SET "updatedAt" = CURRENT_TIMESTAMP WHERE "updatedAt" IS NULL;

-- AlterTable
ALTER TABLE "Owner" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Update existing Owner records
UPDATE "Owner" SET "updatedAt" = CURRENT_TIMESTAMP WHERE "updatedAt" IS NULL;

-- AlterTable
ALTER TABLE "Quotation" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Update existing Quotation records
UPDATE "Quotation" SET "updatedAt" = CURRENT_TIMESTAMP WHERE "updatedAt" IS NULL;

-- AlterTable
ALTER TABLE "QuotationItem" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Update existing QuotationItem records
UPDATE "QuotationItem" SET "updatedAt" = CURRENT_TIMESTAMP WHERE "updatedAt" IS NULL;

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "quotationId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "paymentMethod" "PaymentMethod" NOT NULL,
    "transactionId" TEXT,
    "paidAt" TIMESTAMP(3),
    "dueDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentReminder" (
    "id" TEXT NOT NULL,
    "paymentId" TEXT NOT NULL,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" "ReminderType" NOT NULL,
    "status" "ReminderStatus" NOT NULL DEFAULT 'SENT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PaymentReminder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserAnalytics" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "totalQuotationsCreated" INTEGER NOT NULL DEFAULT 0,
    "totalRevenueGenerated" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalAmountCollected" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalAmountPending" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalCustomersAdded" INTEGER NOT NULL DEFAULT 0,
    "totalItemsAdded" INTEGER NOT NULL DEFAULT 0,
    "lastQuotationCreated" TIMESTAMP(3),
    "lastPaymentReceived" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserAnalytics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MonthlyRevenue" (
    "id" TEXT NOT NULL,
    "analyticsId" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "totalRevenue" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalCollected" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalPending" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "quotationsCreated" INTEGER NOT NULL DEFAULT 0,
    "quotationsPaid" INTEGER NOT NULL DEFAULT 0,
    "quotationsPending" INTEGER NOT NULL DEFAULT 0,
    "newCustomersAdded" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MonthlyRevenue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OwnerDashboard" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "totalRevenue" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalCollected" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalPending" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalQuotations" INTEGER NOT NULL DEFAULT 0,
    "totalCustomers" INTEGER NOT NULL DEFAULT 0,
    "totalItems" INTEGER NOT NULL DEFAULT 0,
    "lastQuotationDate" TIMESTAMP(3),
    "lastPaymentDate" TIMESTAMP(3),
    "lastCustomerAdded" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OwnerDashboard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MonthlyOwnerRevenue" (
    "id" TEXT NOT NULL,
    "dashboardId" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "revenue" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "collected" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "pending" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "quotationsCreated" INTEGER NOT NULL DEFAULT 0,
    "quotationsPaid" INTEGER NOT NULL DEFAULT 0,
    "customersAdded" INTEGER NOT NULL DEFAULT 0,
    "itemsAdded" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MonthlyOwnerRevenue_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Payment_quotationId_key" ON "Payment"("quotationId");

-- CreateIndex
CREATE UNIQUE INDEX "UserAnalytics_userId_key" ON "UserAnalytics"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "MonthlyRevenue_analyticsId_year_month_key" ON "MonthlyRevenue"("analyticsId", "year", "month");

-- CreateIndex
CREATE UNIQUE INDEX "OwnerDashboard_ownerId_key" ON "OwnerDashboard"("ownerId");

-- CreateIndex
CREATE UNIQUE INDEX "MonthlyOwnerRevenue_dashboardId_year_month_key" ON "MonthlyOwnerRevenue"("dashboardId", "year", "month");

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_quotationId_fkey" FOREIGN KEY ("quotationId") REFERENCES "Quotation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentReminder" ADD CONSTRAINT "PaymentReminder_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "Payment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAnalytics" ADD CONSTRAINT "UserAnalytics_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MonthlyRevenue" ADD CONSTRAINT "MonthlyRevenue_analyticsId_fkey" FOREIGN KEY ("analyticsId") REFERENCES "UserAnalytics"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OwnerDashboard" ADD CONSTRAINT "OwnerDashboard_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Owner"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MonthlyOwnerRevenue" ADD CONSTRAINT "MonthlyOwnerRevenue_dashboardId_fkey" FOREIGN KEY ("dashboardId") REFERENCES "OwnerDashboard"("id") ON DELETE CASCADE ON UPDATE CASCADE;
