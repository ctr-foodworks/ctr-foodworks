import {
  pgTable,
  pgEnum,
  serial,
  text,
  timestamp,
  jsonb,
  boolean,
} from "drizzle-orm/pg-core";

/**
 * Database schema (Drizzle + Postgres/Neon).
 *
 * Three tables back the dynamic parts of the site:
 *   · events            — the editable Public/Private events feed (CMS)
 *   · waitlist_signups  — email captures from the waitlist forms
 *   · contact_messages  — submissions from the /connect contact form
 *
 * Run `npm run db:generate` after editing this file, then `npm run db:migrate`
 * (or `npm run db:push` in dev) to apply.
 */

export const eventCategory = pgEnum("event_category", [
  "public",
  "private",
  "recurring",
]);

export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  /** URL-safe identifier, unique. Used as the React key + future detail routes. */
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  category: eventCategory("category").notNull().default("public"),
  /** ISO date string `YYYY-MM-DD` (kept as text to match the existing TZ-safe
   *  parsing in the events page — avoids local-timezone day shifts). */
  date: text("date").notNull(),
  /** Optional end date for multi-day events (`YYYY-MM-DD`). */
  endDate: text("end_date"),
  /** Free-form display time, e.g. "11 AM – Late". */
  time: text("time"),
  description: text("description").notNull(),
  /** Image URL (typically a Vercel Blob URL uploaded via the admin). */
  imageUrl: text("image_url"),
  ctaUrl: text("cta_url"),
  ctaLabel: text("cta_label"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type EventRow = typeof events.$inferSelect;
export type NewEventRow = typeof events.$inferInsert;

export const waitlistSignups = pgTable("waitlist_signups", {
  id: serial("id").primaryKey(),
  email: text("email").notNull(),
  /** Where the signup came from, e.g. "welcome-modal" | "signup-break". */
  source: text("source"),
  /** Admin "seen" flag — new signups are unread until marked. */
  read: boolean("read").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type WaitlistRow = typeof waitlistSignups.$inferSelect;

export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: text("name"),
  email: text("email").notNull(),
  phone: text("phone"),
  message: text("message"),
  /** Any extra fields the form sends (event type, date, etc.) without a schema
   *  migration each time. */
  meta: jsonb("meta"),
  /** Admin "seen" flag — new messages are unread until marked. */
  read: boolean("read").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type ContactRow = typeof contactMessages.$inferSelect;

export const userRole = pgEnum("user_role", ["super_admin", "admin", "user"]);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  /** bcrypt hash of the password (never store plaintext). */
  passwordHash: text("password_hash").notNull(),
  /** Display name shown in the admin header. */
  name: text("name"),
  role: userRole("role").notNull().default("user"),
  /** Profile photo (Vercel Blob URL). */
  imageUrl: text("image_url"),
  /** Set for invited users — forces a password reset on first login. */
  mustChangePassword: boolean("must_change_password").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type UserRow = typeof users.$inferSelect;
export type UserRole = (typeof userRole.enumValues)[number];
