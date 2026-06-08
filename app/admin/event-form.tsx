"use client";

import { useActionState, useState, type ChangeEvent } from "react";
import Link from "next/link";
import { saveEvent, type EventFormState } from "./actions";
import { useToast } from "@/components/admin/toast";
import type { EventRow } from "@/lib/db/schema";

const inputClass =
  "h-[44px] w-full border border-[var(--border-light)] bg-white px-3 text-[14px] text-[var(--text-dark)] outline-none focus:border-[var(--primary)]";
const labelClass =
  "text-[10px] font-semibold tracking-[3px] uppercase text-[var(--text-muted-dark)]";

export function EventForm({ event }: { event?: EventRow }) {
  const [state, formAction, isPending] = useActionState<
    EventFormState,
    FormData
  >(saveEvent, undefined);

  const [imageUrl, setImageUrl] = useState(event?.imageUrl ?? "");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | undefined>();
  const toast = useToast();

  async function onFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError(undefined);
    try {
      const res = await fetch(
        `/api/admin/upload/?filename=${encodeURIComponent(file.name)}`,
        { method: "POST", body: file },
      );
      if (!res.ok) throw new Error("upload failed");
      const data = (await res.json()) as { url: string };
      setImageUrl(data.url);
      toast("Image uploaded.");
    } catch {
      setUploadError("Upload failed. Try again.");
      toast("Image upload failed.", "error");
    } finally {
      setUploading(false);
    }
  }

  return (
    <form action={formAction} className="flex flex-col gap-6">
      {event && <input type="hidden" name="id" value={event.id} />}
      {/* Slug is auto-derived from the title for new events and preserved
          (stable) for existing ones — no need to expose it to editors. */}
      {event && <input type="hidden" name="slug" value={event.slug} />}
      {/* Category isn't shown: the carousel only renders public events, so new
          events default to "public" (server action); edits keep their value. */}
      {event && <input type="hidden" name="category" value={event.category} />}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <label className="flex flex-col gap-2 sm:col-span-2">
          <span className={labelClass}>Title *</span>
          <input
            name="title"
            required
            defaultValue={event?.title}
            className={inputClass}
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className={labelClass}>Date *</span>
          <input
            type="date"
            name="date"
            required
            defaultValue={event?.date}
            className={inputClass}
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className={labelClass}>End date</span>
          <input
            type="date"
            name="endDate"
            defaultValue={event?.endDate ?? ""}
            className={inputClass}
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className={labelClass}>Time</span>
          <input
            name="time"
            defaultValue={event?.time ?? ""}
            placeholder="e.g. 11 AM – Late"
            className={inputClass}
          />
        </label>

        <label className="flex flex-col gap-2 sm:col-span-2">
          <span className={labelClass}>Description *</span>
          <textarea
            name="description"
            required
            rows={4}
            defaultValue={event?.description}
            className="w-full border border-[var(--border-light)] bg-white px-3 py-2 text-[14px] leading-[1.6] text-[var(--text-dark)] outline-none focus:border-[var(--primary)]"
          />
        </label>

        {/* Image */}
        <div className="flex flex-col gap-2 sm:col-span-2">
          <span className={labelClass}>Image</span>
          <input type="hidden" name="imageUrl" value={imageUrl} />
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageUrl}
              alt="Event preview"
              className="h-40 w-full max-w-[420px] border border-[var(--border-light)] object-cover"
            />
          ) : null}
          <div className="flex flex-wrap items-center gap-3">
            <label className="inline-flex cursor-pointer items-center border border-[var(--text-dark)] px-4 py-2 text-[11px] font-semibold tracking-[2px] uppercase text-[var(--text-dark)] transition-colors hover:bg-[var(--text-dark)] hover:text-white">
              {uploading ? "Uploading…" : imageUrl ? "Replace image" : "Upload image"}
              <input
                type="file"
                accept="image/*"
                onChange={onFile}
                disabled={uploading}
                className="hidden"
              />
            </label>
            {imageUrl && (
              <button
                type="button"
                onClick={() => setImageUrl("")}
                className="text-[11px] font-semibold tracking-[2px] uppercase text-[var(--text-muted-dark)] hover:text-[var(--primary)]"
              >
                Remove
              </button>
            )}
          </div>
          {uploadError && (
            <p className="text-[12px] text-[var(--primary)]">{uploadError}</p>
          )}
        </div>

        <label className="flex flex-col gap-2">
          <span className={labelClass}>CTA link</span>
          <input
            name="ctaUrl"
            defaultValue={event?.ctaUrl ?? ""}
            placeholder="https:// or /events#book"
            className={inputClass}
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className={labelClass}>CTA label</span>
          <input
            name="ctaLabel"
            defaultValue={event?.ctaLabel ?? ""}
            placeholder="e.g. Get Tickets"
            className={inputClass}
          />
        </label>
      </div>

      {state?.error && (
        <p className="text-[13px] font-light text-[var(--primary)]" role="alert">
          {state.error}
        </p>
      )}

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={isPending || uploading}
          className="inline-flex h-[48px] items-center justify-center bg-[var(--primary)] px-7 text-[12px] font-semibold tracking-[3px] uppercase text-white transition-colors hover:bg-[#a82d1d] disabled:cursor-wait disabled:opacity-60"
        >
          {isPending ? "Saving…" : event ? "Save changes" : "Create event"}
        </button>
        <Link
          href="/admin"
          className="text-[12px] font-semibold tracking-[3px] uppercase text-[var(--text-muted-dark)] hover:text-[var(--text-dark)]"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
