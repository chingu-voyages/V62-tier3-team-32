-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "completedAt" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "orders_farmerId_status_completedAt_idx" ON "orders"("farmerId", "status", "completedAt");
