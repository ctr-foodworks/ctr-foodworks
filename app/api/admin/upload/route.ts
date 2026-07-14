import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/current-user";

/**
 * Admin-only image upload → Vercel Blob. The browser POSTs the raw file body
 * with `?filename=...`; we return the public Blob URL to store on the event.
 *
 * Also guarded by middleware (matcher /api/admin/:path*); the auth() check here
 * is defense-in-depth. Note: serverless request bodies cap ~4.5MB — large
 * photos should be optimized before upload.
 */

/**
 * Vercel names the store token BLOB_READ_WRITE_TOKEN by default, but when that
 * name is already taken (e.g. imported empty from an env template) it injects
 * the token under a store-prefixed name like MYSTORE_READ_WRITE_TOKEN. Accept
 * either: prefer the canonical name, else any non-empty *_READ_WRITE_TOKEN
 * (BLOB-prefixed ones first, then alphabetical for determinism).
 */
function resolveBlobToken(): string | undefined {
  const canonical = process.env.BLOB_READ_WRITE_TOKEN;
  if (canonical) return canonical;
  const candidates = Object.keys(process.env)
    .filter((k) => k.endsWith("_READ_WRITE_TOKEN") && process.env[k])
    .sort((a, b) => {
      const aBlob = a.includes("BLOB") ? 0 : 1;
      const bBlob = b.includes("BLOB") ? 0 : 1;
      return aBlob - bBlob || a.localeCompare(b);
    });
  return candidates.length ? process.env[candidates[0]] : undefined;
}

export async function POST(request: Request): Promise<Response> {
  const me = await getCurrentUser();
  if (!me) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const blobToken = resolveBlobToken();
  if (!blobToken) {
    return NextResponse.json(
      { error: "Image storage is not configured (BLOB_READ_WRITE_TOKEN)." },
      { status: 500 },
    );
  }

  const { searchParams } = new URL(request.url);
  const filename = searchParams.get("filename") ?? "upload";

  try {
    // Read the body fully (more compatible across runtimes than streaming
    // request.body straight into put()).
    const data = await request.arrayBuffer();
    if (!data.byteLength) {
      return NextResponse.json({ error: "No file provided." }, { status: 400 });
    }

    const blob = await put(`events/${filename}`, data, {
      access: "public",
      addRandomSuffix: true,
      token: blobToken,
    });
    return NextResponse.json({ url: blob.url });
  } catch (err) {
    // Admin-only route — surface the real reason so we can diagnose.
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[upload] failed:", message);
    return NextResponse.json(
      { error: `Upload failed: ${message}` },
      { status: 500 },
    );
  }
}
