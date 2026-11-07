CREATE TABLE "contacts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"subject" varchar(500) NOT NULL,
	"message" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "expenses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"round_id" uuid NOT NULL,
	"date" date NOT NULL,
	"category" text NOT NULL,
	"unit_value" numeric,
	"unit_cost" numeric(12, 2),
	"sack_size" integer,
	"total_amount" numeric(12, 2) NOT NULL,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
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
CREATE TABLE "password_reset_tokens" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"token" varchar(255) NOT NULL,
	"used" boolean DEFAULT false,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "password_reset_tokens_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "procurement_orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"round_id" uuid NOT NULL,
	"delivery_date" date NOT NULL,
	"supplier" varchar(255) NOT NULL,
	"supplier_location" varchar(255),
	"supplier_phone" varchar(50),
	"quantity_of_maize" numeric(12, 2) NOT NULL,
	"maize_purchase_cost" numeric(12, 2) NOT NULL,
	"transport_cost" numeric(12, 2) NOT NULL,
	"collection_labour" numeric(12, 2) DEFAULT '0' NOT NULL,
	"loading_labour" numeric(12, 2) DEFAULT '0' NOT NULL,
	"unloading_labour" numeric(12, 2) DEFAULT '0' NOT NULL,
	"transport_tax" numeric(12, 2) DEFAULT '0' NOT NULL,
	"rural_tax" numeric(12, 2) DEFAULT '0' NOT NULL,
	"total_cost" numeric(12, 2) NOT NULL,
	"average_cost_per_kg" numeric(12, 2) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "production_batches" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"round_id" uuid NOT NULL,
	"date" date NOT NULL,
	"maize_quantity" numeric(12, 2) NOT NULL,
	"flour_output" integer NOT NULL,
	"flour_sacks_5kg" integer DEFAULT 0 NOT NULL,
	"flour_sacks_10kg" integer DEFAULT 0 NOT NULL,
	"flour_sacks_25kg" integer DEFAULT 0 NOT NULL,
	"bran_quantity" numeric(12, 2) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sales" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"round_id" uuid NOT NULL,
	"date" date NOT NULL,
	"customer_name" varchar(100) NOT NULL,
	"customer_contact" varchar(50) NOT NULL,
	"delivery_address" varchar(255) NOT NULL,
	"product_type" varchar(20) NOT NULL,
	"sack_count" integer NOT NULL,
	"sack_size" integer,
	"price_per_sack" numeric(12, 2) NOT NULL,
	"delivery_cost" numeric(10, 2) NOT NULL,
	"total_amount" numeric(12, 2) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" varchar(50) NOT NULL,
	"email" varchar(100) NOT NULL,
	"password" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_round_user_fk" FOREIGN KEY ("round_id","user_id") REFERENCES "public"."operation_rounds"("id","user_id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "operation_rounds" ADD CONSTRAINT "operation_rounds_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "procurement_orders" ADD CONSTRAINT "procurement_orders_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "procurement_orders" ADD CONSTRAINT "procurement_orders_round_user_fk" FOREIGN KEY ("round_id","user_id") REFERENCES "public"."operation_rounds"("id","user_id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "production_batches" ADD CONSTRAINT "production_batches_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "production_batches" ADD CONSTRAINT "production_batches_round_user_fk" FOREIGN KEY ("round_id","user_id") REFERENCES "public"."operation_rounds"("id","user_id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sales" ADD CONSTRAINT "sales_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sales" ADD CONSTRAINT "sales_round_user_fk" FOREIGN KEY ("round_id","user_id") REFERENCES "public"."operation_rounds"("id","user_id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "operation_rounds_one_active_per_user" ON "operation_rounds" USING btree ("user_id") WHERE "operation_rounds"."is_active" = true;