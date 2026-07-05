import "server-only";
import { createHmac, timingSafeEqual } from "crypto";

/**
 * Verify a Resend webhook signature. Resend signs with Svix, so the scheme is:
 *   signedContent = `${svix-id}.${svix-timestamp}.${rawBody}`
 *   expected      = base64( HMAC-SHA256(secretBytes, signedContent) )
 * where secretBytes is the base64-decoded portion of the `whsec_…` secret. The
 * `svix-signature` header is a space-separated list of `v1,<sig>` entries; the
 * request is authentic if any entry matches. We compare in constant time.
 *
 * Returns false on any missing header / bad secret rather than throwing.
 */
export function verifyResendWebhook(
  rawBody: string,
  headers: Headers,
  secret: string,
): boolean {
  const id = headers.get("svix-id");
  const timestamp = headers.get("svix-timestamp");
  const signature = headers.get("svix-signature");
  if (!id || !timestamp || !signature || !secret) return false;

  // Reject stale deliveries (replay guard): 5-minute tolerance.
  const ts = Number(timestamp);
  if (!Number.isFinite(ts) || Math.abs(nowSeconds() - ts) > 300) return false;

  let secretBytes: Buffer;
  try {
    secretBytes = Buffer.from(secret.replace(/^whsec_/, ""), "base64");
  } catch {
    return false;
  }

  const expected = createHmac("sha256", secretBytes)
    .update(`${id}.${timestamp}.${rawBody}`)
    .digest("base64");

  // Header looks like: "v1,g0h... v1,abc..." — check each candidate.
  return signature.split(" ").some((entry) => {
    const sig = entry.includes(",") ? entry.split(",")[1] : entry;
    return safeEqual(sig, expected);
  });
}

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && timingSafeEqual(ab, bb);
}

// Wrapped so the module stays testable and the intent is explicit.
function nowSeconds(): number {
  return Math.floor(Date.now() / 1000);
}
