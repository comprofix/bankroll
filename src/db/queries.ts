import "server-only";
import { and, eq, inArray } from "drizzle-orm";

import { formatDateLocal, formatTimeLocal } from "@/lib/datetime";

import { db } from "./index";
import { cashRebuys, cashSessions, tournamentRebuys, tournamentSessions } from "./schema";

export type SessionListRow = {
  id: number;
  type: "cash" | "tournament";
  date: string;
  venue: string;
  net: number;
};

export async function getSessionListForUser(userId: number): Promise<SessionListRow[]> {
  const [cash, tournaments] = await Promise.all([
    db.select().from(cashSessions).where(eq(cashSessions.userId, userId)),
    db.select().from(tournamentSessions).where(eq(tournamentSessions.userId, userId)),
  ]);

  const cashIds = cash.map((s) => s.id);
  const tournamentIds = tournaments.map((s) => s.id);

  const [cashRebuyRows, tournamentRebuyRows] = await Promise.all([
    cashIds.length
      ? db.select().from(cashRebuys).where(inArray(cashRebuys.cashSessionId, cashIds))
      : Promise.resolve([]),
    tournamentIds.length
      ? db
          .select()
          .from(tournamentRebuys)
          .where(inArray(tournamentRebuys.tournamentSessionId, tournamentIds))
      : Promise.resolve([]),
  ]);

  const cashRebuyTotals = new Map<number, number>();
  for (const row of cashRebuyRows) {
    cashRebuyTotals.set(row.cashSessionId, (cashRebuyTotals.get(row.cashSessionId) ?? 0) + Number(row.amount));
  }

  const tournamentRebuyTotals = new Map<number, number>();
  for (const row of tournamentRebuyRows) {
    tournamentRebuyTotals.set(
      row.tournamentSessionId,
      (tournamentRebuyTotals.get(row.tournamentSessionId) ?? 0) + Number(row.amount),
    );
  }

  const cashListRows: SessionListRow[] = cash.map((s) => ({
    id: s.id,
    type: "cash",
    date: formatDateLocal(s.startDatetime),
    venue: s.venueName,
    net: Number(s.cashout) - (Number(s.startingBuyin) + (cashRebuyTotals.get(s.id) ?? 0)),
  }));

  const tournamentListRows: SessionListRow[] = tournaments.map((s) => ({
    id: s.id,
    type: "tournament",
    date: s.datePlayed,
    venue: s.venueName,
    net: Number(s.payout) - (Number(s.startingBuyin) + (tournamentRebuyTotals.get(s.id) ?? 0)),
  }));

  return [...cashListRows, ...tournamentListRows].sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getCashSessionForEdit(userId: number, id: number) {
  const [session] = await db
    .select()
    .from(cashSessions)
    .where(and(eq(cashSessions.id, id), eq(cashSessions.userId, userId)));
  if (!session) return null;

  const rebuys = await db.select().from(cashRebuys).where(eq(cashRebuys.cashSessionId, id));

  return {
    id: session.id,
    datePlayed: formatDateLocal(session.startDatetime),
    timeStarted: formatTimeLocal(session.startDatetime),
    timeEnded: formatTimeLocal(session.endDatetime),
    smallBlind: session.smallBlind,
    bigBlind: session.bigBlind,
    startingBuyin: session.startingBuyin,
    rebuyAmounts: rebuys.map((r) => r.amount),
    cashout: session.cashout,
    venueName: session.venueName,
    venueLocation: session.venueLocation ?? "",
    notes: session.notes ?? "",
  };
}

export async function getTournamentSessionForEdit(userId: number, id: number) {
  const [session] = await db
    .select()
    .from(tournamentSessions)
    .where(and(eq(tournamentSessions.id, id), eq(tournamentSessions.userId, userId)));
  if (!session) return null;

  const rebuys = await db
    .select()
    .from(tournamentRebuys)
    .where(eq(tournamentRebuys.tournamentSessionId, id));

  return {
    id: session.id,
    tournamentName: session.tournamentName,
    datePlayed: session.datePlayed,
    startingBuyin: session.startingBuyin,
    rebuyAmounts: rebuys.map((r) => r.amount),
    finishPosition: session.finishPosition ? String(session.finishPosition) : "",
    payout: session.payout,
    venueName: session.venueName,
    venueLocation: session.venueLocation ?? "",
    notes: session.notes ?? "",
  };
}
