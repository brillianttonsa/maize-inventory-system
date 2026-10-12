ALTER TABLE "procurement_orders" DROP COLUMN "notes";
--> statement-breakpoint
ALTER TABLE "production_batches" DROP COLUMN "notes";
--> statement-breakpoint
ALTER TABLE "sales" DROP COLUMN "notes";
--> statement-breakpoint
ALTER TABLE "production_batches" ADD COLUMN "flour_sacks_5kg" integer DEFAULT 0 NOT NULL;
--> statement-breakpoint
ALTER TABLE "production_batches" ADD COLUMN "flour_sacks_10kg" integer DEFAULT 0 NOT NULL;
--> statement-breakpoint
ALTER TABLE "production_batches" ADD COLUMN "flour_sacks_25kg" integer DEFAULT 0 NOT NULL;
