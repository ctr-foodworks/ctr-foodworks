import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

/**
 * Admin-only image upload → Vercel Blob. The browser POSTs the raw file body
 * with `?filename=...`; we return the public Blob URL to store on the event.
 *
 * Also guarded by middleware (matcher /api/admin/:path*); the auth() check here
 * is defense-in-depth. Note: serverless request bodies cap ~4.5MB — large
 * photos should be optimized before upload.
 */
// Temporary diagnostic: visit /api/admin/upload/ (logged in) to confirm the
// Blob token is reaching this function. Returns no secret — only presence,
// length, prefix, and whether it was pasted with stray quotes.
export async function GET(): Promise<Response> {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const t = process.env.BLOB_READ_WRITE_TOKEN ?? "";
  // Attempt a tiny real upload so we see the exact put() error (if any).
  try {
    const blob = await put(`diagnostic/test-${Date.now()}.txt`, "ok", {
      access: "public",
      addRandomSuffix: true,
      token: t,
    });
    return NextResponse.json({
      tokenPresent: Boolean(t),
      tokenLength: t.length,
      testUpload: "success",
      url: blob.url,
    });
  } catch (err) {
    return NextResponse.json({
      tokenPresent: Boolean(t),
      tokenLength: t.length,
      testUpload: "failed",
      error: err instanceof Error ? err.message : String(err),
    });
  }
}

export async function POST(request: Request): Promise<Response> {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
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
      token: process.env.BLOB_READ_WRITE_TOKEN,
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
