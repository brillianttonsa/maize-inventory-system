ALTER TABLE "procurement_orders" RENAME COLUMN "price_per_kg" TO "maize_purchase_cost";

UPDATE "procurement_orders"
SET "maize_purchase_cost" = "maize_purchase_cost" * "quantity";
