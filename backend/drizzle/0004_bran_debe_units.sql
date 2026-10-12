ALTER TABLE "production_batches" ADD COLUMN "bran_debe_quantity" numeric(12, 2);
--> statement-breakpoint
ALTER TABLE "production_batches" ADD COLUMN "bran_unit" varchar(20);
--> statement-breakpoint
ALTER TABLE "sales" ADD COLUMN "bran_debe_quantity" numeric(12, 2);
--> statement-breakpoint
ALTER TABLE "sales" ADD COLUMN "bran_unit_count" numeric(12, 2);
--> statement-breakpoint
ALTER TABLE "sales" ADD COLUMN "bran_unit" varchar(20);
--> statement-breakpoint
ALTER TABLE "production_batches" ADD CONSTRAINT "production_bran_unit_allowed" CHECK ("bran_unit" IS NULL OR "bran_unit" IN ('half_debe', 'debe', 'kisado', 'gunia'));
--> statement-breakpoint
ALTER TABLE "sales" ADD CONSTRAINT "sales_bran_unit_allowed" CHECK ("bran_unit" IS NULL OR "bran_unit" IN ('half_debe', 'debe', 'kisado', 'gunia'));
