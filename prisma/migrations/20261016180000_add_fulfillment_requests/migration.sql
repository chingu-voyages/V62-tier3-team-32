CREATE TYPE "FulfillmentMethod" AS ENUM ('PICKUP', 'DELIVERY');
CREATE TYPE "FulfillmentStatus" AS ENUM ('PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED');
CREATE TABLE "fulfillment_requests" (
  "id" TEXT NOT NULL,
  "consumerId" TEXT NOT NULL,
  "farmerId" TEXT NOT NULL,
  "method" "FulfillmentMethod" NOT NULL,
  "status" "FulfillmentStatus" NOT NULL DEFAULT 'PENDING',
  "consumerName" TEXT NOT NULL,
  "address" TEXT,
  "slotStart" TIMESTAMP(3) NOT NULL,
  "slotEnd" TIMESTAMP(3) NOT NULL,
  "timeZone" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "fulfillment_requests_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "fulfillment_requests_consumerId_fkey" FOREIGN KEY ("consumerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "fulfillment_requests_farmerId_fkey" FOREIGN KEY ("farmerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE INDEX "fulfillment_requests_farmerId_status_slotStart_idx" ON "fulfillment_requests"("farmerId", "status", "slotStart");
CREATE INDEX "fulfillment_requests_consumerId_idx" ON "fulfillment_requests"("consumerId");
