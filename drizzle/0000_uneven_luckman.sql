CREATE TABLE "cash_rebuys" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"cash_session_id" bigint NOT NULL,
	"amount" numeric(10, 2) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cash_sessions" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"user_id" bigint NOT NULL,
	"start_datetime" timestamp with time zone NOT NULL,
	"end_datetime" timestamp with time zone NOT NULL,
	"small_blind" numeric(10, 2) NOT NULL,
	"big_blind" numeric(10, 2) NOT NULL,
	"starting_buyin" numeric(10, 2) NOT NULL,
	"cashout" numeric(10, 2) NOT NULL,
	"venue_name" varchar(150) NOT NULL,
	"venue_location" varchar(150),
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tournament_rebuys" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"tournament_session_id" bigint NOT NULL,
	"amount" numeric(10, 2) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tournament_sessions" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"user_id" bigint NOT NULL,
	"tournament_name" varchar(150) NOT NULL,
	"date_played" date NOT NULL,
	"starting_buyin" numeric(10, 2) NOT NULL,
	"finish_position" integer,
	"payout" numeric(10, 2) DEFAULT '0' NOT NULL,
	"venue_name" varchar(150) NOT NULL,
	"venue_location" varchar(150),
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"password_hash" varchar(255) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "cash_rebuys" ADD CONSTRAINT "cash_rebuys_cash_session_id_cash_sessions_id_fk" FOREIGN KEY ("cash_session_id") REFERENCES "public"."cash_sessions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cash_sessions" ADD CONSTRAINT "cash_sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tournament_rebuys" ADD CONSTRAINT "tournament_rebuys_tournament_session_id_tournament_sessions_id_fk" FOREIGN KEY ("tournament_session_id") REFERENCES "public"."tournament_sessions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tournament_sessions" ADD CONSTRAINT "tournament_sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "cash_sessions_user_start_idx" ON "cash_sessions" USING btree ("user_id","start_datetime");--> statement-breakpoint
CREATE INDEX "tournament_sessions_user_date_idx" ON "tournament_sessions" USING btree ("user_id","date_played");