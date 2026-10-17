-- Preserve the preferred active request and retain duplicates as cancelled history.
WITH ranked AS (
  SELECT id, ROW_NUMBER() OVER (
    PARTITION BY "consumerId", "farmerId", "slotStart"
    ORDER BY CASE WHEN status = 'CONFIRMED' THEN 0 ELSE 1 END, "createdAt", id
  ) AS position
  FROM "pickup_delivery_requests"
  WHERE status IN ('PENDING', 'CONFIRMED')
)
UPDATE "pickup_delivery_requests" AS request
SET status = 'CANCELLED', "updatedAt" = CURRENT_TIMESTAMP
FROM ranked WHERE request.id = ranked.id AND ranked.position > 1;

-- Across both pickup and delivery; other consumers may request the same slot.
CREATE UNIQUE INDEX "pickup_delivery_requests_active_customer_slot_key"
ON "pickup_delivery_requests" ("consumerId", "farmerId", "slotStart")
WHERE status IN ('PENDING', 'CONFIRMED');
