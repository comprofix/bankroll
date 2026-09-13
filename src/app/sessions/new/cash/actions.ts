"use server";

import { redirect } from "next/navigation";

import { db } from "@/db";
import { cashRebuys, cashSessions } from "@/db/schema";
import { combineDateAndTime } from "@/lib/datetime";
import { requireUserId } from "@/lib/session";

export async function createCashSession(formData: FormData) {
  const userId = await requireUserId();

  const datePlayed = String(formData.get("datePlayed"));
  const startDatetime = combineDateAndTime(datePlayed, String(formData.get("timeStarted")));
  let endDatetime = combineDateAndTime(datePlayed, String(formData.get("timeEnded")));
  if (endDatetime < startDatetime) {
    endDatetime = new Date(endDatetime.getTime() + 24 * 60 * 60 * 1000);
  }

  const rebuyAmounts = formData
    .getAll("rebuyAmount")
    .map((v) => String(v).trim())
    .filter((v) => v.length > 0);

  const [session] = await db
    .insert(cashSessions)
    .values({
      userId,
      startDatetime,
      endDatetime,
      smallBlind: String(formData.get("smallBlind")),
      bigBlind: String(formData.get("bigBlind")),
      startingBuyin: String(formData.get("startingBuyin")),
      cashout: String(formData.get("cashout")),
      venueName: String(formData.get("venueName")),
      venueLocation: (formData.get("venueLocation") as string) || null,
      notes: (formData.get("notes") as string) || null,
    })
    .returning({ id: cashSessions.id });

  if (rebuyAmounts.length > 0) {
    await db.insert(cashRebuys).values(rebuyAmounts.map((amount) => ({ cashSessionId: session.id, amount })));
  }

  redirect("/");
}
