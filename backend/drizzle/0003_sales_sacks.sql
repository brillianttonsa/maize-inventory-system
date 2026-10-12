ALTER TABLE "sales" ADD COLUMN "sack_count" integer;
--> statement-breakpoint
ALTER TABLE "sales" ADD COLUMN "sack_size" integer;
--> statement-breakpoint
ALTER TABLE "sales" ADD CONSTRAINT "sales_sack_size_allowed" CHECK ("sack_size" IS NULL OR "sack_size" IN (5, 10, 25));
