CREATE TABLE "operation_rounds" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"name" varchar(100) NOT NULL,
	"is_active" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "operation_rounds_user_name_unique" UNIQUE("user_id","name"),
	CONSTRAINT "operation_rounds_id_user_unique" UNIQUE("id","user_id")
);
--> statement-breakpoint
ALTER TABLE "subscription_payments" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "subscription_plans" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "subscriptions" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "subscription_payments" CASCADE;--> statement-breakpoint
DROP TABLE "subscription_plans" CASCADE;--> statement-breakpoint
DROP TABLE "subscriptions" CASCADE;--> statement-breakpoint
ALTER TABLE "contacts" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "expenses" ALTER COLUMN "created_at" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "expenses" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "expenses" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "expenses" ALTER COLUMN "updated_at" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "expenses" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "expenses" ALTER COLUMN "updated_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "password_reset_tokens" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "procurement_orders" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "procurement_orders" ALTER COLUMN "updated_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "production_batches" ALTER COLUMN "maize_quantity" SET DATA TYPE numeric(12, 2);--> statement-breakpoint
ALTER TABLE "production_batches" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "sales" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "sales" ALTER COLUMN "updated_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "expenses" ADD COLUMN "round_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "expenses" ADD COLUMN "unit_cost" numeric(12, 2);--> statement-breakpoint
ALTER TABLE "expenses" ADD COLUMN "sack_size" integer;--> statement-breakpoint
ALTER TABLE "expenses" ADD COLUMN "total_amount" numeric(12, 2) NOT NULL;--> statement-breakpoint
ALTER TABLE "procurement_orders" ADD COLUMN "round_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "procurement_orders" ADD COLUMN "supplier_location" varchar(255);--> statement-breakpoint
ALTER TABLE "procurement_orders" ADD COLUMN "supplier_phone" varchar(50);--> statement-breakpoint
ALTER TABLE "procurement_orders" ADD COLUMN "quantity_of_maize" numeric(12, 2) NOT NULL;--> statement-breakpoint
ALTER TABLE "procurement_orders" ADD COLUMN "maize_purchase_cost" numeric(12, 2) NOT NULL;--> statement-breakpoint
ALTER TABLE "procurement_orders" ADD COLUMN "collection_labour" numeric(12, 2) DEFAULT '0' NOT NULL;--> statement-breakpoint
ALTER TABLE "procurement_orders" ADD COLUMN "loading_labour" numeric(12, 2) DEFAULT '0' NOT NULL;--> statement-breakpoint
ALTER TABLE "procurement_orders" ADD COLUMN "unloading_labour" numeric(12, 2) DEFAULT '0' NOT NULL;--> statement-breakpoint
ALTER TABLE "procurement_orders" ADD COLUMN "transport_tax" numeric(12, 2) DEFAULT '0' NOT NULL;--> statement-breakpoint
ALTER TABLE "procurement_orders" ADD COLUMN "rural_tax" numeric(12, 2) DEFAULT '0' NOT NULL;--> statement-breakpoint
ALTER TABLE "procurement_orders" ADD COLUMN "average_cost_per_kg" numeric(12, 2) NOT NULL;--> statement-breakpoint
ALTER TABLE "production_batches" ADD COLUMN "round_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "production_batches" ADD COLUMN "flour_sacks_5kg" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "production_batches" ADD COLUMN "flour_sacks_10kg" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "production_batches" ADD COLUMN "flour_sacks_25kg" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "production_batches" ADD COLUMN "bran_quantity" numeric(12, 2) NOT NULL;--> statement-breakpoint
ALTER TABLE "production_batches" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "sales" ADD COLUMN "round_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "sales" ADD COLUMN "sack_count" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "sales" ADD COLUMN "sack_size" integer;--> statement-breakpoint
ALTER TABLE "sales" ADD COLUMN "price_per_sack" numeric(12, 2);--> statement-breakpoint
ALTER TABLE "operation_rounds" ADD CONSTRAINT "operation_rounds_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "operation_rounds_one_active_per_user" ON "operation_rounds" USING btree ("user_id") WHERE "operation_rounds"."is_active" = true;--> statement-breakpoint
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_round_user_fk" FOREIGN KEY ("round_id","user_id") REFERENCES "public"."operation_rounds"("id","user_id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "procurement_orders" ADD CONSTRAINT "procurement_orders_round_user_fk" FOREIGN KEY ("round_id","user_id") REFERENCES "public"."operation_rounds"("id","user_id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "production_batches" ADD CONSTRAINT "production_batches_round_user_fk" FOREIGN KEY ("round_id","user_id") REFERENCES "public"."operation_rounds"("id","user_id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sales" ADD CONSTRAINT "sales_round_user_fk" FOREIGN KEY ("round_id","user_id") REFERENCES "public"."operation_rounds"("id","user_id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "expenses" DROP COLUMN "amount";--> statement-breakpoint
ALTER TABLE "expenses" DROP COLUMN "paid_by";--> statement-breakpoint
ALTER TABLE "expenses" DROP COLUMN "method";--> statement-breakpoint
ALTER TABLE "expenses" DROP COLUMN "description";--> statement-breakpoint
ALTER TABLE "procurement_orders" DROP COLUMN "quantity";--> statement-breakpoint
ALTER TABLE "procurement_orders" DROP COLUMN "price_per_kg";--> statement-breakpoint
ALTER TABLE "procurement_orders" DROP COLUMN "notes";--> statement-breakpoint
ALTER TABLE "production_batches" DROP COLUMN "bran_output";--> statement-breakpoint
ALTER TABLE "production_batches" DROP COLUMN "water_usage";--> statement-breakpoint
ALTER TABLE "production_batches" DROP COLUMN "electricity_usage";--> statement-breakpoint
ALTER TABLE "production_batches" DROP COLUMN "sacks_used";--> statement-breakpoint
ALTER TABLE "production_batches" DROP COLUMN "notes";--> statement-breakpoint
ALTER TABLE "sales" DROP COLUMN "price_per_kg";--> statement-breakpoint
ALTER TABLE "sales" DROP COLUMN "payment_method";--> statement-breakpoint
ALTER TABLE "sales" DROP COLUMN "notes";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "name";--> statement-breakpoint
DROP TYPE "public"."billing_cycle";--> statement-breakpoint
DROP TYPE "public"."payment_method";--> statement-breakpoint
DROP TYPE "public"."subscription_status";