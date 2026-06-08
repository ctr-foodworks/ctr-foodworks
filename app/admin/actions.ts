"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth, signOut } from "@/auth";
import {
  createEvent,
  updateEvent,
  deleteEvent,
} from "@/lib/events-db";
import { markWaitlistRead, markContactRead } from "@/lib/submissions-db";
import type { NewEventRow } from "@/lib/db/schema";

export type EventFormState = { error?: string } | undefined;

const CATEGORIES = ["public", "private", "recurring"] as const;
type Category = (typeof CATEGORIES)[number];

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function str(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}

/** Pulls + validates the shared event fields from the form. */
function parseEvent(formData: FormData):
  | { ok: true; data: NewEventRow }
  | { ok: false; error: string } {
  const title = str(formData, "title");
  const date = str(formData, "date");
  const description = str(formData, "description");
  const categoryRaw = str(formData, "category") || "public";

  if (!title) return { ok: false, error: "Title is required." };
  if (!date) return { ok: false, error: "Date is required." };
  if (!description) return { ok: false, error: "Description is required." };
  if (!CATEGORIES.includes(categoryRaw as Category)) {
    return { ok: false, error: "Invalid category." };
  }

  const slug = slugify(str(formData, "slug") || title);
  if (!slug) return { ok: false, error: "Could not derive a slug from the title." };

  return {
    ok: true,
    data: {
      slug,
      title,
      category: categoryRaw as Category,
      date,
      endDate: str(formData, "endDate") || null,
      time: str(formData, "time") || null,
      description,
      imageUrl: str(formData, "imageUrl") || null,
      ctaUrl: str(formData, "ctaUrl") || null,
      ctaLabel: str(formData, "ctaLabel") || null,
    },
  };
}

async function requireAdmin(): Promise<boolean> {
  const session = await auth();
  return Boolean(session?.user);
}

/** Create (no id) or update (with id) — used by the shared EventForm. */
export async function saveEvent(
  _prev: EventFormState,
  formData: FormData,
): Promise<EventFormState> {
  if (!(await requireAdmin())) return { error: "Not authorized." };

  const parsed = parseEvent(formData);
  if (!parsed.ok) return { error: parsed.error };

  const idRaw = str(formData, "id");

  try {
    if (idRaw) {
      await updateEvent(Number(idRaw), parsed.data);
    } else {
      await createEvent(parsed.data);
    }
  } catch (err) {
    // Most likely a unique-slug collision.
    if (err instanceof Error && /unique|duplicate/i.test(err.message)) {
      return { error: "That slug is already in use. Choose a different one." };
    }
    return { error: "Something went wrong saving the event." };
  }

  revalidatePath("/events");
  revalidatePath("/admin");
  redirect(idRaw ? "/admin?flash=event-updated" : "/admin?flash=event-created");
}

export async function removeEvent(formData: FormData): Promise<void> {
  if (!(await requireAdmin())) return;
  const id = Number(str(formData, "id"));
  if (!Number.isFinite(id)) return;
  await deleteEvent(id);
  revalidatePath("/events");
  revalidatePath("/admin");
  redirect("/admin?flash=event-deleted");
}

export async function markWaitlistReadAction(): Promise<void> {
  if (!(await requireAdmin())) return;
  await markWaitlistRead();
  revalidatePath("/admin", "layout");
  revalidatePath("/admin/waitlist");
}

export async function markContactReadAction(): Promise<void> {
  if (!(await requireAdmin())) return;
  await markContactRead();
  revalidatePath("/admin", "layout");
  revalidatePath("/admin/contact");
}

export async function adminSignOut(): Promise<void> {
  await signOut({ redirectTo: "/admin/login" });
}
