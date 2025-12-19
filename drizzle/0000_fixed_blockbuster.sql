CREATE TABLE "bins" (
	"id" text PRIMARY KEY NOT NULL,
	"content" text NOT NULL,
	"language" text NOT NULL,
	"is_private" boolean DEFAULT false NOT NULL,
	"is_markdown" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
