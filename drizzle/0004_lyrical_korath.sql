CREATE TABLE "contact_replies" (
	"id" serial PRIMARY KEY NOT NULL,
	"message_id" integer NOT NULL,
	"direction" text NOT NULL,
	"from_addr" text NOT NULL,
	"body" text NOT NULL,
	"provider_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "contact_messages" ADD COLUMN "reply_token" text;--> statement-breakpoint
ALTER TABLE "contact_messages" ADD COLUMN "responded" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "contact_messages" ADD COLUMN "responded_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "contact_replies" ADD CONSTRAINT "contact_replies_message_id_contact_messages_id_fk" FOREIGN KEY ("message_id") REFERENCES "public"."contact_messages"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contact_messages" ADD CONSTRAINT "contact_messages_reply_token_unique" UNIQUE("reply_token");