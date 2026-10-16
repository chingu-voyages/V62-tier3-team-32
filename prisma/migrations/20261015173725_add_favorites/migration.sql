/*
  Warnings:

  - Added the required column `city` to the `consumer_profiles` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "OfferingCategory" AS ENUM ('PROTEIN', 'PRODUCE', 'OTHER');

-- AlterTable
ALTER TABLE "consumer_profiles" ADD COLUMN     "city" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "offerings" ADD COLUMN     "category" "OfferingCategory" NOT NULL DEFAULT 'OTHER';

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "disclaimerAccepted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "disclaimerAcceptedAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "favorites" (
    "id" TEXT NOT NULL,
    "consumerId" TEXT NOT NULL,
    "farmerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "favorites_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "favorites_consumerId_idx" ON "favorites"("consumerId");

-- CreateIndex
CREATE INDEX "favorites_farmerId_idx" ON "favorites"("farmerId");

-- CreateIndex
CREATE UNIQUE INDEX "favorites_consumerId_farmerId_key" ON "favorites"("consumerId", "farmerId");

-- AddForeignKey
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_consumerId_fkey" FOREIGN KEY ("consumerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_farmerId_fkey" FOREIGN KEY ("farmerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
