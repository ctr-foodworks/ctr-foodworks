import { NextResponse } from "next/server";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const email =
    typeof body === "object" && body !== null && "email" in body
      ? String((body as { email: unknown }).email).trim()
      : "";

  if (!emailRegex.test(email)) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 }
    );
  }

  // TODO: swap this stub for a real backend.
  //   - Resend:    POST /audiences/{id}/contacts
  //   - Formspree: forward to https://formspree.io/f/{form_id}
  //   - Mailchimp: POST /lists/{id}/members
  console.log(`[waitlist] new signup: ${email}`);

  return NextResponse.json({ ok: true });
}
