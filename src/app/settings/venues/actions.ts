"use server";

import { and, eq, ilike } from "drizzle-orm";
import { redirect } from "next/navigation";

import { db } from "@/db";
import { venues } from "@/db/schema";
import { requireUserId } from "@/lib/session";

export async function createVenue(formData: FormData) {
  const userId = await requireUserId();

  const name = String(formData.get("name") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim();

  if (name.length > 0) {
    const [existing] = await db
      .select({ id: venues.id })
      .from(venues)
      .where(and(eq(venues.userId, userId), ilike(venues.name, name)))
      .limit(1);

    if (!existing) {
      await db.insert(venues).values({ userId, name, location: location || null });
    }
  }

  redirect("/settings/venues");
}

export async function deleteVenue(id: number) {
  const userId = await requireUserId();
  await db.delete(venues).where(and(eq(venues.id, id), eq(venues.userId, userId)));
  redirect("/settings/venues");
}
