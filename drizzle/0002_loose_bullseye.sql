ALTER TABLE "contact_messages" ADD COLUMN "read" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "waitlist_signups" ADD COLUMN "read" boolean DEFAULT false NOT NULL;