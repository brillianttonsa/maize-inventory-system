ALTER TABLE "procurement_orders" ADD COLUMN "supplier_location" varchar(255);
--> statement-breakpoint
ALTER TABLE "procurement_orders" ADD COLUMN "supplier_phone" varchar(50);
--> statement-breakpoint
ALTER TABLE "procurement_orders" ADD COLUMN "collection_labour" numeric(12, 2) DEFAULT 0 NOT NULL;
--> statement-breakpoint
ALTER TABLE "procurement_orders" ADD COLUMN "loading_labour" numeric(12, 2) DEFAULT 0 NOT NULL;
--> statement-breakpoint
ALTER TABLE "procurement_orders" ADD COLUMN "unloading_labour" numeric(12, 2) DEFAULT 0 NOT NULL;
--> statement-breakpoint
ALTER TABLE "procurement_orders" ADD COLUMN "transport_tax" numeric(12, 2) DEFAULT 0 NOT NULL;
--> statement-breakpoint
ALTER TABLE "procurement_orders" ADD COLUMN "rural_tax" numeric(12, 2) DEFAULT 0 NOT NULL;
--> statement-breakpoint
ALTER TABLE "sales" ALTER COLUMN "payment_method" DROP NOT NULL;
