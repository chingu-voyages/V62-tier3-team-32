ALTER TABLE "pickup_delivery_requests"
ADD COLUMN "saleAmount" DECIMAL(10,2),
ADD COLUMN "completedAt" TIMESTAMP(3);

ALTER TABLE "pickup_delivery_requests"
ADD CONSTRAINT "pickup_delivery_requests_sale_amount_check"
CHECK ("saleAmount" IS NULL OR ("saleAmount" >= 0 AND "completedAt" IS NOT NULL AND "status" = 'COMPLETED'));

CREATE INDEX "pickup_delivery_requests_farmerId_status_completedAt_idx"
ON "pickup_delivery_requests"("farmerId", "status", "completedAt");
