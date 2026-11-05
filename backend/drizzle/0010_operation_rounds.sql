CREATE TABLE "operation_rounds" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "name" varchar(100) NOT NULL,
  "is_active" boolean DEFAULT false NOT NULL,
  "created_at" timestamp DEFAULT now(),
  CONSTRAINT "operation_rounds_user_name_unique" UNIQUE("user_id", "name")
);

INSERT INTO "operation_rounds" ("user_id", "name", "is_active")
SELECT "id", 'Round 1', true FROM "users";

ALTER TABLE "procurement_orders" ADD COLUMN "round_id" uuid;
ALTER TABLE "production_batches" ADD COLUMN "round_id" uuid;
ALTER TABLE "sales" ADD COLUMN "round_id" uuid;
ALTER TABLE "expenses" ADD COLUMN "round_id" uuid;

UPDATE "procurement_orders" AS record
SET "round_id" = rounds."id"
FROM "operation_rounds" AS rounds
WHERE rounds."user_id" = record."user_id" AND rounds."name" = 'Round 1';
UPDATE "production_batches" AS record
SET "round_id" = rounds."id"
FROM "operation_rounds" AS rounds
WHERE rounds."user_id" = record."user_id" AND rounds."name" = 'Round 1';
UPDATE "sales" AS record
SET "round_id" = rounds."id"
FROM "operation_rounds" AS rounds
WHERE rounds."user_id" = record."user_id" AND rounds."name" = 'Round 1';
UPDATE "expenses" AS record
SET "round_id" = rounds."id"
FROM "operation_rounds" AS rounds
WHERE rounds."user_id" = record."user_id" AND rounds."name" = 'Round 1';

ALTER TABLE "procurement_orders" ALTER COLUMN "round_id" SET NOT NULL;
ALTER TABLE "production_batches" ALTER COLUMN "round_id" SET NOT NULL;
ALTER TABLE "sales" ALTER COLUMN "round_id" SET NOT NULL;
ALTER TABLE "expenses" ALTER COLUMN "round_id" SET NOT NULL;

ALTER TABLE "procurement_orders" ADD CONSTRAINT "procurement_orders_round_id_operation_rounds_id_fk" FOREIGN KEY ("round_id") REFERENCES "operation_rounds"("id") ON DELETE CASCADE;
ALTER TABLE "production_batches" ADD CONSTRAINT "production_batches_round_id_operation_rounds_id_fk" FOREIGN KEY ("round_id") REFERENCES "operation_rounds"("id") ON DELETE CASCADE;
ALTER TABLE "sales" ADD CONSTRAINT "sales_round_id_operation_rounds_id_fk" FOREIGN KEY ("round_id") REFERENCES "operation_rounds"("id") ON DELETE CASCADE;
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_round_id_operation_rounds_id_fk" FOREIGN KEY ("round_id") REFERENCES "operation_rounds"("id") ON DELETE CASCADE;

CREATE UNIQUE INDEX "operation_rounds_one_active_per_user" ON "operation_rounds" ("user_id") WHERE "is_active" = true;
CREATE INDEX "procurement_orders_round_id_idx" ON "procurement_orders" ("round_id");
CREATE INDEX "production_batches_round_id_idx" ON "production_batches" ("round_id");
CREATE INDEX "sales_round_id_idx" ON "sales" ("round_id");
CREATE INDEX "expenses_round_id_idx" ON "expenses" ("round_id");
