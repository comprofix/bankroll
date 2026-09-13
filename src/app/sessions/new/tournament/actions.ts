"use server";

import { redirect } from "next/navigation";

import { db } from "@/db";
import { tournamentRebuys, tournamentSessions } from "@/db/schema";
import { requireUserId } from "@/lib/session";

export async function createTournamentSession(formData: FormData) {
  const userId = await requireUserId();

  const finishPositionRaw = String(formData.get("finishPosition") ?? "").trim();
  const rebuyAmounts = formData
    .getAll("rebuyAmount")
    .map((v) => String(v).trim())
    .filter((v) => v.length > 0);

  const [session] = await db
    .insert(tournamentSessions)
    .values({
      userId,
      tournamentName: String(formData.get("tournamentName")),
      datePlayed: String(formData.get("datePlayed")),
      startingBuyin: String(formData.get("startingBuyin")),
      finishPosition: finishPositionRaw ? Number(finishPositionRaw) : null,
      payout: String(formData.get("payout") || "0"),
      venueName: String(formData.get("venueName")),
      venueLocation: (formData.get("venueLocation") as string) || null,
      notes: (formData.get("notes") as string) || null,
    })
    .returning({ id: tournamentSessions.id });

  if (rebuyAmounts.length > 0) {
    await db
      .insert(tournamentRebuys)
      .values(rebuyAmounts.map((amount) => ({ tournamentSessionId: session.id, amount })));
  }

  redirect("/");
}
