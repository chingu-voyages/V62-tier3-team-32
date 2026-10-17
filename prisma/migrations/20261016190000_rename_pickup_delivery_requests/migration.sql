ALTER TYPE "FulfillmentMethod" RENAME TO "PickupDeliveryMethod";
ALTER TYPE "FulfillmentStatus" RENAME TO "PickupDeliveryStatus";
ALTER TABLE "fulfillment_requests" RENAME TO "pickup_delivery_requests";
ALTER TABLE "pickup_delivery_requests" RENAME CONSTRAINT "fulfillment_requests_pkey" TO "pickup_delivery_requests_pkey";
ALTER TABLE "pickup_delivery_requests" RENAME CONSTRAINT "fulfillment_requests_consumerId_fkey" TO "pickup_delivery_requests_consumerId_fkey";
ALTER TABLE "pickup_delivery_requests" RENAME CONSTRAINT "fulfillment_requests_farmerId_fkey" TO "pickup_delivery_requests_farmerId_fkey";
ALTER INDEX "fulfillment_requests_farmerId_status_slotStart_idx" RENAME TO "pickup_delivery_requests_farmerId_status_slotStart_idx";
ALTER INDEX "fulfillment_requests_consumerId_idx" RENAME TO "pickup_delivery_requests_consumerId_idx";
