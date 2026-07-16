"use client";

import {
  useState,
  useTransition,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { updateProfileAction } from "./actions";

const inputClass =
  "h-10 w-full max-w-[420px] rounded-xl border border-[#e4e8f1] bg-white px-3.5 text-sm text-[#1c2130] focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/25";
const labelClass =
  "mb-1.5 text-xs font-semibold uppercase tracking-wide text-[#828b9e]";

export function ProfileForm({
  name,
  email,
  imageUrl,
}: {
  name: string | null;
  email: string;
  imageUrl: string | null;
}) {
  const [savedUrl, setSavedUrl] = useState(imageUrl ?? "");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState(imageUrl ?? "");
  const [error, setError] = useState<string>();
  const [isPending, startTransition] = useTransition();

  function onFile(e: ChangeEvent<HTMLInputElement>) {
    const picked = e.target.files?.[0];
    if (!picked) return;
    setFile(picked);
    setPreview(URL.createObjectURL(picked));
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
      let url = savedUrl;
      if (file) {
        try {
          url = await uploadFile(file);
          setSavedUrl(url);
        } catch {
          setError("Photo upload failed. Try again.");
          return;
        }
      }
      const fd = new FormData(form);
      fd.set("imageUrl", url);
      const result = await updateProfileAction(undefined, fd);
      if (result?.error) setError(result.error);
    });
  }

  const initial = (name || email).charAt(0).toUpperCase();

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <div className="flex items-center gap-4">
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={preview}
            alt="Profile"
            className="h-16 w-16 rounded-full border border-[#e4e8f1] object-cover"
          />
        ) : (
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#eef1f7] text-[20px] font-semibold text-[#1c2130]">
            {initial}
          </span>
        )}
        <label className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-xl border border-[#e4e8f1] bg-white px-4 text-[13px] font-medium text-[#1c2130] transition-colors hover:border-[var(--primary)] hover:text-[var(--primary)]">
          {preview ? "Change photo" : "Upload photo"}
          <input type="file" accept="image/*" onChange={onFile} className="hidden" />
        </label>
      </div>

      <label className="flex flex-col">
        <span className={labelClass}>Display name</span>
        <input name="name" defaultValue={name ?? ""} className={inputClass} />
      </label>

      <div className="flex flex-col">
        <span className={labelClass}>Email</span>
        <p className="text-sm text-[#828b9e]">{email}</p>
      </div>

      {error && (
        <p className="text-[13px] text-[#e4524e]" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex h-10 w-fit items-center gap-2 rounded-xl bg-[var(--primary)] px-4 text-[13px] font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-wait disabled:opacity-60"
      >
        {isPending ? "Saving…" : "Save profile"}
      </button>
    </form>
  );
}
