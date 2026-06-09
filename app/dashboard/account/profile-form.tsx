"use client";

import {
  useState,
  useTransition,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { updateProfileAction } from "./actions";

const inputClass =
  "h-[44px] w-full max-w-[420px] border border-[var(--border-light)] bg-white px-3 text-[14px] text-[var(--text-dark)] outline-none focus:border-[var(--primary)]";
const labelClass =
  "text-[10px] font-semibold tracking-[3px] uppercase text-[var(--text-muted-dark)]";

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
            className="h-16 w-16 rounded-full border border-[var(--border-light)] object-cover"
          />
        ) : (
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--text-dark)]/10 text-[20px] font-semibold text-[var(--text-dark)]">
            {initial}
          </span>
        )}
        <label className="inline-flex cursor-pointer items-center border border-[var(--text-dark)] px-4 py-2 text-[11px] font-semibold tracking-[2px] uppercase text-[var(--text-dark)] transition-colors hover:bg-[var(--text-dark)] hover:text-white">
          {preview ? "Change photo" : "Upload photo"}
          <input type="file" accept="image/*" onChange={onFile} className="hidden" />
        </label>
      </div>

      <label className="flex flex-col gap-2">
        <span className={labelClass}>Display name</span>
        <input name="name" defaultValue={name ?? ""} className={inputClass} />
      </label>

      <div className="flex flex-col gap-2">
        <span className={labelClass}>Email</span>
        <p className="text-[14px] text-[var(--text-muted-dark)]">{email}</p>
      </div>

      {error && (
        <p className="text-[13px] font-light text-[var(--primary)]" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex h-[48px] w-fit items-center justify-center bg-[var(--primary)] px-7 text-[12px] font-semibold tracking-[3px] uppercase text-white transition-colors hover:bg-[#a82d1d] disabled:cursor-wait disabled:opacity-60"
      >
        {isPending ? "Saving…" : "Save profile"}
      </button>
    </form>
  );
}
