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

  if (!request.body) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }

  try {
    const blob = await put(`events/${filename}`, request.body, {
      access: "public",
      addRandomSuffix: true,
    });
    return NextResponse.json({ url: blob.url });
  } catch {
    return NextResponse.json({ error: "Upload failed." }, { status: 500 });
  }
}
