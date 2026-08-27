ALTER TABLE "expenses" ADD COLUMN "sack_size" integer;
--> statement-breakpoint
ALTER TABLE "production_batches" ADD COLUMN "sack_size" integer;
--> statement-breakpoint
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_sack_size_allowed" CHECK ("sack_size" IS NULL OR "sack_size" IN (5, 10, 25));
--> statement-breakpoint
ALTER TABLE "production_batches" ADD CONSTRAINT "production_batches_sack_size_allowed" CHECK ("sack_size" IS NULL OR "sack_size" IN (5, 10, 25));
--> statement-breakpoint
