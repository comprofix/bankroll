"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { db } from "@/db";
import { cashRebuys, cashSessions } from "@/db/schema";
import { parseCashSessionForm } from "@/lib/cash-session-form";
import { combineDateAndTime, formatDateLocal } from "@/lib/datetime";
import { requireUserId } from "@/lib/session";

export async function updateCashSession(id: number, formData: FormData) {
  const userId = await requireUserId();
  const { rebuyAmounts, ...values } = parseCashSessionForm(formData);

  await db
    .update(cashSessions)
    .set({ ...values, updatedAt: new Date() })
    .where(and(eq(cashSessions.id, id), eq(cashSessions.userId, userId)));

  // Rebuys have no identity beyond their amount, so the simplest correct
  // update is to replace the full set rather than diff it.
  await db.delete(cashRebuys).where(eq(cashRebuys.cashSessionId, id));
  if (rebuyAmounts.length > 0) {
    await db.insert(cashRebuys).values(rebuyAmounts.map((amount) => ({ cashSessionId: id, amount })));
  }

  redirect(values.endDatetime ? "/" : `/sessions/cash/${id}`);
}

export async function finishCashSession(id: number, formData: FormData) {
  const userId = await requireUserId();

  const cashout = String(formData.get("cashout") ?? "").trim();
  if (!cashout) throw new Error("A cash-out amount is required to finish the session.");

  const [session] = await db
    .select({ startDatetime: cashSessions.startDatetime })
    .from(cashSessions)
    .where(and(eq(cashSessions.id, id), eq(cashSessions.userId, userId)));
  if (!session) throw new Error("Session not found.");

  // End time is either typed explicitly (time of day, on the start's date,
  // rolling to the next day if earlier than the start) or "now" from the
  // browser's clock.
  const timeEnded = String(formData.get("timeEnded") ?? "").trim();
  let endDatetime: Date;
  if (timeEnded) {
    endDatetime = combineDateAndTime(formatDateLocal(session.startDatetime), timeEnded);
    if (endDatetime < session.startDatetime) {
      endDatetime = new Date(endDatetime.getTime() + 24 * 60 * 60 * 1000);
    }
  } else {
    endDatetime = combineDateAndTime(
      String(formData.get("clientDate")),
      String(formData.get("clientTime")),
    );
    if (endDatetime < session.startDatetime) endDatetime = session.startDatetime;
  }

  await db
    .update(cashSessions)
    .set({ endDatetime, cashout, updatedAt: new Date() })
    .where(and(eq(cashSessions.id, id), eq(cashSessions.userId, userId)));

  redirect("/");
}

export async function addCashRebuy(id: number, formData: FormData) {
  const userId = await requireUserId();
  const amount = String(formData.get("amount") ?? "").trim();
  if (!amount) return;

  // Ownership check: only add to a session that belongs to this user.
  const [session] = await db
    .select({ id: cashSessions.id })
    .from(cashSessions)
    .where(and(eq(cashSessions.id, id), eq(cashSessions.userId, userId)));
  if (!session) throw new Error("Session not found.");

  await db.insert(cashRebuys).values({ cashSessionId: id, amount });
  revalidatePath(`/sessions/cash/${id}`);
}

export async function removeCashRebuy(sessionId: number, rebuyId: number) {
  const userId = await requireUserId();

  const [session] = await db
    .select({ id: cashSessions.id })
    .from(cashSessions)
    .where(and(eq(cashSessions.id, sessionId), eq(cashSessions.userId, userId)));
  if (!session) throw new Error("Session not found.");

  await db
    .delete(cashRebuys)
    .where(and(eq(cashRebuys.id, rebuyId), eq(cashRebuys.cashSessionId, sessionId)));
  revalidatePath(`/sessions/cash/${sessionId}`);
}

export async function deleteCashSession(id: number) {
  const userId = await requireUserId();
  await db.delete(cashSessions).where(and(eq(cashSessions.id, id), eq(cashSessions.userId, userId)));
  redirect("/");
}
