CREATE TABLE "expertise" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"how" text NOT NULL,
	"why" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "expertise_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "expertise_images" (
	"id" serial PRIMARY KEY NOT NULL,
	"expertise_id" integer NOT NULL,
	"url" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "expertise_portfolio" (
	"expertise_id" integer NOT NULL,
	"portfolio_id" integer NOT NULL,
	CONSTRAINT "expertise_portfolio_expertise_id_portfolio_id_pk" PRIMARY KEY("expertise_id","portfolio_id")
);
--> statement-breakpoint
CREATE TABLE "portfolio" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"project_name" text NOT NULL,
	"client" text NOT NULL,
	"short_description" text NOT NULL,
	"long_description_p1" text,
	"long_description_p2" text,
	"location" text NOT NULL,
	"category" text NOT NULL,
	"status" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "portfolio_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "portfolio_images" (
	"id" serial PRIMARY KEY NOT NULL,
	"portfolio_id" integer NOT NULL,
	"url" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "settings" (
	"key" text PRIMARY KEY NOT NULL,
	"value" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "team" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"title" text NOT NULL,
	"image" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
ALTER TABLE "expertise_images" ADD CONSTRAINT "expertise_images_expertise_id_expertise_id_fk" FOREIGN KEY ("expertise_id") REFERENCES "public"."expertise"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "expertise_portfolio" ADD CONSTRAINT "expertise_portfolio_expertise_id_expertise_id_fk" FOREIGN KEY ("expertise_id") REFERENCES "public"."expertise"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "expertise_portfolio" ADD CONSTRAINT "expertise_portfolio_portfolio_id_portfolio_id_fk" FOREIGN KEY ("portfolio_id") REFERENCES "public"."portfolio"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "portfolio_images" ADD CONSTRAINT "portfolio_images_portfolio_id_portfolio_id_fk" FOREIGN KEY ("portfolio_id") REFERENCES "public"."portfolio"("id") ON DELETE cascade ON UPDATE no action;