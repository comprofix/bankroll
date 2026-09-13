"use server";

import { and, eq } from "drizzle-orm";
import { redirect } from "next/navigation";

import { db } from "@/db";
import { tournamentRebuys, tournamentSessions } from "@/db/schema";
import { requireUserId } from "@/lib/session";

export async function updateTournamentSession(id: number, formData: FormData) {
  const userId = await requireUserId();

  const finishPositionRaw = String(formData.get("finishPosition") ?? "").trim();
  const rebuyAmounts = formData
    .getAll("rebuyAmount")
    .map((v) => String(v).trim())
    .filter((v) => v.length > 0);

  await db
    .update(tournamentSessions)
    .set({
      tournamentName: String(formData.get("tournamentName")),
      datePlayed: String(formData.get("datePlayed")),
      startingBuyin: String(formData.get("startingBuyin")),
      finishPosition: finishPositionRaw ? Number(finishPositionRaw) : null,
      payout: String(formData.get("payout") || "0"),
      venueName: String(formData.get("venueName")),
      venueLocation: (formData.get("venueLocation") as string) || null,
      notes: (formData.get("notes") as string) || null,
      updatedAt: new Date(),
    })
    .where(and(eq(tournamentSessions.id, id), eq(tournamentSessions.userId, userId)));

  await db.delete(tournamentRebuys).where(eq(tournamentRebuys.tournamentSessionId, id));
  if (rebuyAmounts.length > 0) {
    await db
      .insert(tournamentRebuys)
      .values(rebuyAmounts.map((amount) => ({ tournamentSessionId: id, amount })));
  }

  redirect("/");
}

export async function deleteTournamentSession(id: number) {
  const userId = await requireUserId();
  await db
    .delete(tournamentSessions)
    .where(and(eq(tournamentSessions.id, id), eq(tournamentSessions.userId, userId)));
  redirect("/");
}
