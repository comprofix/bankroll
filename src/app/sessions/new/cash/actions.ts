"use server";

import { redirect } from "next/navigation";

import { db } from "@/db";
import { cashRebuys, cashSessions } from "@/db/schema";
import { parseCashSessionForm } from "@/lib/cash-session-form";
import { requireUserId } from "@/lib/session";

export async function createCashSession(formData: FormData) {
  const userId = await requireUserId();
  const { rebuyAmounts, ...values } = parseCashSessionForm(formData);

  const [session] = await db
    .insert(cashSessions)
    .values({ userId, ...values })
    .returning({ id: cashSessions.id });

  if (rebuyAmounts.length > 0) {
    await db.insert(cashRebuys).values(rebuyAmounts.map((amount) => ({ cashSessionId: session.id, amount })));
  }

  redirect("/");
}
