import { asc } from "drizzle-orm";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getDb, schema } from "@/lib/db";
import { xlsxFromTable } from "@/lib/xlsx";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Events → branded Excel download. Also guarded by middleware (matcher
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
    .from(schema.events)
    .orderBy(asc(schema.events.date));

  return xlsxFromTable("events", "Events", "Events",
    [
      "ID",
      "Slug",
      "Title",
      "Category",
      "Date",
      "End Date",
      "Time",
      "Description",
      "Image URL",
      "CTA URL",
      "CTA Label",
      "Created At",
    ],
    rows.map((r) => [
      r.id,
      r.slug,
      r.title,
      r.category,
      r.date,
      r.endDate ?? "",
      r.time ?? "",
      r.description,
      r.imageUrl ?? "",
      r.ctaUrl ?? "",
      r.ctaLabel ?? "",
      r.createdAt.toISOString(),
    ]),
  );

}
