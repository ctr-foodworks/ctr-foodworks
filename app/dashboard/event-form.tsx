"use client";

import {
  useState,
  useTransition,
  type ChangeEvent,
  type FormEvent,
} from "react";
import Link from "next/link";
import { saveEvent } from "./actions";
import { useToast } from "@/components/admin/toast";
import type { EventRow } from "@/lib/db/schema";

const inputClass =
  "h-10 w-full rounded-xl border border-[#e4e8f1] bg-white px-3.5 text-sm text-[#1c2130] focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/25";
const labelClass =
  "mb-1.5 text-xs font-semibold uppercase tracking-wide text-[#828b9e]";

export function EventForm({ event }: { event?: EventRow }) {
  // `imageUrl` is the already-saved (remote) URL; `file` is a newly picked image
  // held in state and only uploaded on submit. `previewSrc` shows either.
  const [imageUrl, setImageUrl] = useState(event?.imageUrl ?? "");
  const [file, setFile] = useState<File | null>(null);
  const [previewSrc, setPreviewSrc] = useState(event?.imageUrl ?? "");
  const [error, setError] = useState<string>();
  const [isPending, startTransition] = useTransition();
  const toast = useToast();

  function onFile(e: ChangeEvent<HTMLInputElement>) {
    const picked = e.target.files?.[0];
    if (!picked) return;
    setFile(picked);
    setPreviewSrc(URL.createObjectURL(picked)); // local preview, no upload yet
  }

  function removeImage() {
    setFile(null);
    setImageUrl("");
    setPreviewSrc("");
  }

  async function uploadFile(f: File): Promise<string> {
    const res = await fetch(
      `/api/admin/upload?filename=${encodeURIComponent(f.name)}`,
      { method: "POST", body: f },
    );
    if (!res.ok) throw new Error("upload failed");
    const data = (await res.json()) as { url: string };
    return data.url;
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    startTransition(async () => {
      setError(undefined);

      // Upload the pending image first (only now, on save).
      let finalUrl = imageUrl;
      if (file) {
        try {
          finalUrl = await uploadFile(file);
        } catch {
          setError("Image upload failed. Try again.");
          toast("Image upload failed.", "error");
          return;
        }
      }

      const fd = new FormData(form);
      fd.set("imageUrl", finalUrl);

      const result = await saveEvent(undefined, fd);
      // Success redirects (handled by the action); only errors return here.
      if (result?.error) setError(result.error);
    });
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6">
      {event && <input type="hidden" name="id" value={event.id} />}
      {/* Slug is auto-derived from the title for new events and preserved
          (stable) for existing ones — no need to expose it to editors. */}
      {event && <input type="hidden" name="slug" value={event.slug} />}
      {/* Category isn't shown: the carousel only renders public events, so new
          events default to "public" (server action); edits keep their value. */}
      {event && <input type="hidden" name="category" value={event.category} />}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <label className="flex flex-col sm:col-span-2">
          <span className={labelClass}>Title *</span>
          <input
            name="title"
            required
            defaultValue={event?.title}
            className={inputClass}
          />
        </label>

        <label className="flex flex-col">
          <span className={labelClass}>Date *</span>
          <input
            type="date"
            name="date"
            required
            defaultValue={event?.date}
            className={inputClass}
          />
        </label>

        <label className="flex flex-col">
          <span className={labelClass}>End date</span>
          <input
            type="date"
            name="endDate"
            defaultValue={event?.endDate ?? ""}
            className={inputClass}
          />
        </label>

        <label className="flex flex-col">
          <span className={labelClass}>Time</span>
          <input
            name="time"
            defaultValue={event?.time ?? ""}
            placeholder="e.g. 11 AM – Late"
            className={inputClass}
          />
        </label>

        <label className="flex flex-col sm:col-span-2">
          <span className={labelClass}>Description *</span>
          <textarea
            name="description"
            required
            rows={4}
            defaultValue={event?.description}
            className="w-full rounded-xl border border-[#e4e8f1] bg-white px-3.5 py-2.5 text-sm leading-[1.6] text-[#1c2130] focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/25"
          />
        </label>

        {/* Image — held in state; uploaded on Save */}
        <div className="flex flex-col sm:col-span-2">
          <span className={labelClass}>Image</span>
          {previewSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={previewSrc}
              alt="Event preview"
              className="h-40 w-full max-w-[420px] rounded-xl border border-[#e4e8f1] object-cover"
            />
          ) : null}
          <div className="mt-1.5 flex flex-wrap items-center gap-3">
            <label className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-xl border border-[#e4e8f1] bg-white px-4 text-[13px] font-medium text-[#1c2130] transition-colors hover:border-[var(--primary)] hover:text-[var(--primary)]">
              {previewSrc ? "Replace image" : "Upload image"}
              <input
                type="file"
                accept="image/*"
                onChange={onFile}
                className="hidden"
              />
            </label>
            {previewSrc && (
              <button
                type="button"
                onClick={removeImage}
                className="rounded-lg px-2 py-1 text-[13px] font-medium text-[#e4524e] transition-colors hover:bg-[#fdeceb]"
              >
                Remove
              </button>
            )}
          </div>
          {file && (
            <p className="mt-1.5 text-xs text-[#828b9e]">
              Selected — uploads when you save.
            </p>
          )}
        </div>

        <label className="flex flex-col">
          <span className={labelClass}>CTA link</span>
          <input
            name="ctaUrl"
            defaultValue={event?.ctaUrl ?? ""}
            placeholder="https:// or /events#book"
            className={inputClass}
          />
        </label>

        <label className="flex flex-col">
          <span className={labelClass}>CTA label</span>
          <input
            name="ctaLabel"
            defaultValue={event?.ctaLabel ?? ""}
            placeholder="e.g. Get Tickets"
            className={inputClass}
          />
        </label>
      </div>

      {error && (
        <p className="text-[13px] text-[#e4524e]" role="alert">
          {error}
        </p>
      )}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex h-10 items-center gap-2 rounded-xl bg-[var(--primary)] px-4 text-[13px] font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-wait disabled:opacity-60"
        >
          {isPending ? "Saving…" : event ? "Save changes" : "Create event"}
        </button>
        <Link
          href="/dashboard/events"
          className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#e4e8f1] bg-white px-4 text-[13px] font-medium text-[#1c2130] transition-colors hover:border-[var(--primary)] hover:text-[var(--primary)]"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
