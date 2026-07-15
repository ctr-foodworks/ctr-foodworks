import { desc } from "drizzle-orm";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getDb, schema } from "@/lib/db";
import { xlsxFromTable } from "@/lib/xlsx";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Waitlist signups → branded Excel download. Also guarded by middleware (matcher
 * /api/admin/:path*); the auth() check here is defense-in-depth.
 */
export async function GET(): Promise<Response> {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = getDb();
  const rows = await db
    .select()
    .from(schema.waitlistSignups)
    .orderBy(desc(schema.waitlistSignups.createdAt));

  return xlsxFromTable("waitlist", "Waitlist", "Waitlist signups",
    ["ID", "Created At", "Email", "Source", "Read"],
    rows.map((r) => [
      r.id,
      r.createdAt.toISOString(),
      r.email,
      r.source ?? "",
      r.read ? "yes" : "no",
    ]),
  );

}
