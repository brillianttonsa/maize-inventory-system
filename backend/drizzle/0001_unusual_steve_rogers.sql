CREATE TABLE "operational_costs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"round_id" uuid NOT NULL,
	"date" date NOT NULL,
	"operation" varchar(255) NOT NULL,
	"starting_units" numeric(12, 2) NOT NULL,
	"remaining_units" numeric(12, 2) NOT NULL,
	"units_used" numeric(12, 2) NOT NULL,
	"total_amount" numeric(12, 2) NOT NULL,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "round_sack_opening_balances" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"round_id" uuid NOT NULL,
	"source_round_name" varchar(100) NOT NULL,
	"sack_size" integer NOT NULL,
	"quantity" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "round_sack_opening_balances_round_size_unique" UNIQUE("round_id","sack_size")
);
--> statement-breakpoint
ALTER TABLE "operational_costs" ADD CONSTRAINT "operational_costs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "operational_costs" ADD CONSTRAINT "operational_costs_round_user_fk" FOREIGN KEY ("round_id","user_id") REFERENCES "public"."operation_rounds"("id","user_id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "round_sack_opening_balances" ADD CONSTRAINT "round_sack_opening_balances_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "round_sack_opening_balances" ADD CONSTRAINT "round_sack_opening_balances_round_user_fk" FOREIGN KEY ("round_id","user_id") REFERENCES "public"."operation_rounds"("id","user_id") ON DELETE restrict ON UPDATE no action;