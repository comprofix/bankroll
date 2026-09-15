import "server-only";
import { and, eq, inArray } from "drizzle-orm";

import { formatDateLocal, formatTimeLocal } from "@/lib/datetime";

import { db } from "./index";
import { cashRebuys, cashSessions, tournamentRebuys, tournamentSessions, venues } from "./schema";

export type VenueOption = {
  id: number;
  name: string;
  location: string | null;
};

export async function getVenuesForUser(userId: number): Promise<VenueOption[]> {
  const rows = await db
    .select({ id: venues.id, name: venues.name, location: venues.location })
    .from(venues)
    .where(eq(venues.userId, userId));

  return rows.sort((a, b) => a.name.localeCompare(b.name));
}

export type SessionListRow = {
  id: number;
  type: "cash" | "tournament";
  date: string;
  venue: string;
  net: number;
};

type EnrichedCashSession = {
  id: number;
  date: string;
  venue: string;
  totalBuyin: number;
  result: number;
  net: number;
  hours: number;
};

type EnrichedTournamentSession = {
  id: number;
  date: string;
  venue: string;
  totalBuyin: number;
  result: number;
  net: number;
};

async function getEnrichedCashSessions(userId: number): Promise<EnrichedCashSession[]> {
  const cash = await db.select().from(cashSessions).where(eq(cashSessions.userId, userId));
  const ids = cash.map((s) => s.id);
  const rebuys = ids.length
    ? await db.select().from(cashRebuys).where(inArray(cashRebuys.cashSessionId, ids))
    : [];

  const rebuyTotals = new Map<number, number>();
  for (const r of rebuys) {
    rebuyTotals.set(r.cashSessionId, (rebuyTotals.get(r.cashSessionId) ?? 0) + Number(r.amount));
  }

  return cash.map((s) => {
    const totalBuyin = Number(s.startingBuyin) + (rebuyTotals.get(s.id) ?? 0);
    const result = Number(s.cashout);
    return {
      id: s.id,
      date: formatDateLocal(s.startDatetime),
      venue: s.venueName,
      totalBuyin,
      result,
      net: result - totalBuyin,
      hours: (s.endDatetime.getTime() - s.startDatetime.getTime()) / (1000 * 60 * 60),
    };
  });
}

async function getEnrichedTournamentSessions(userId: number): Promise<EnrichedTournamentSession[]> {
  const tournaments = await db
    .select()
    .from(tournamentSessions)
    .where(eq(tournamentSessions.userId, userId));
  const ids = tournaments.map((s) => s.id);
  const rebuys = ids.length
    ? await db.select().from(tournamentRebuys).where(inArray(tournamentRebuys.tournamentSessionId, ids))
    : [];

  const rebuyTotals = new Map<number, number>();
  for (const r of rebuys) {
    rebuyTotals.set(r.tournamentSessionId, (rebuyTotals.get(r.tournamentSessionId) ?? 0) + Number(r.amount));
  }

  return tournaments.map((s) => {
    const totalBuyin = Number(s.startingBuyin) + (rebuyTotals.get(s.id) ?? 0);
    const result = Number(s.payout);
    return {
      id: s.id,
      date: s.datePlayed,
      venue: s.venueName,
      totalBuyin,
      result,
      net: result - totalBuyin,
    };
  });
}

export async function getSessionListForUser(userId: number): Promise<SessionListRow[]> {
  const [cash, tournaments] = await Promise.all([
    getEnrichedCashSessions(userId),
    getEnrichedTournamentSessions(userId),
  ]);

  const rows: SessionListRow[] = [
    ...cash.map((s) => ({ id: s.id, type: "cash" as const, date: s.date, venue: s.venue, net: s.net })),
    ...tournaments.map((s) => ({
      id: s.id,
      type: "tournament" as const,
      date: s.date,
      venue: s.venue,
      net: s.net,
    })),
  ];

  return rows.sort((a, b) => (a.date < b.date ? 1 : -1));
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

function sum(nums: number[]): number {
  return nums.reduce((a, b) => a + b, 0);
}

function roiOf(net: number, buyin: number): number | null {
  return buyin > 0 ? net / buyin : null;
}

function winRateOf(nets: number[]): number {
  return nets.length > 0 ? nets.filter((n) => n > 0).length / nets.length : 0;
}

function cumulativeSeries(rows: { date: string; net: number }[]): { date: string; cumulative: number }[] {
  const sorted = [...rows].sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
  let running = 0;
  return sorted.map((r) => {
    running += r.net;
    return { date: r.date, cumulative: running };
  });
}

export type DashboardTotals = {
  buyIn: number;
  winnings: number;
  net: number;
  sessions: number;
  hours: number | null;
  hourlyRate: number | null;
  roi: number | null;
  winRate: number;
};

export type DashboardData = {
  totals: { cash: DashboardTotals; tournament: DashboardTotals; combined: DashboardTotals };
  chart: {
    cash: { date: string; cumulative: number }[];
    tournament: { date: string; cumulative: number }[];
  };
  sessionMix: { cash: number; tournament: number };
  winLoss: { won: number; lost: number };
  byVenue: { venue: string; sessions: number; net: number; roi: number | null }[];
  bestSessions: SessionListRow[];
  worstSessions: SessionListRow[];
};

export async function getDashboardData(userId: number): Promise<DashboardData> {
  const [cash, tournaments] = await Promise.all([
    getEnrichedCashSessions(userId),
    getEnrichedTournamentSessions(userId),
  ]);

  const cashNets = cash.map((s) => s.net);
  const tourneyNets = tournaments.map((s) => s.net);
  const allNets = [...cashNets, ...tourneyNets];

  const cashBuyin = sum(cash.map((s) => s.totalBuyin));
  const cashWinnings = sum(cash.map((s) => s.result));
  const cashNet = sum(cashNets);
  const cashHours = sum(cash.map((s) => s.hours));

  const tourneyBuyin = sum(tournaments.map((s) => s.totalBuyin));
  const tourneyWinnings = sum(tournaments.map((s) => s.result));
  const tourneyNet = sum(tourneyNets);

  const totals: DashboardData["totals"] = {
    cash: {
      buyIn: cashBuyin,
      winnings: cashWinnings,
      net: cashNet,
      sessions: cash.length,
      hours: cashHours,
      hourlyRate: cashHours > 0 ? cashNet / cashHours : null,
      roi: roiOf(cashNet, cashBuyin),
      winRate: winRateOf(cashNets),
    },
    tournament: {
      buyIn: tourneyBuyin,
      winnings: tourneyWinnings,
      net: tourneyNet,
      sessions: tournaments.length,
      hours: null,
      hourlyRate: null,
      roi: roiOf(tourneyNet, tourneyBuyin),
      winRate: winRateOf(tourneyNets),
    },
    combined: {
      buyIn: cashBuyin + tourneyBuyin,
      winnings: cashWinnings + tourneyWinnings,
      net: cashNet + tourneyNet,
      sessions: cash.length + tournaments.length,
      hours: cashHours,
      // No combined hourly rate: hours are only tracked for Cash, so blending
      // Tournament profit into that figure would misattribute it to tracked time.
      hourlyRate: null,
      roi: roiOf(cashNet + tourneyNet, cashBuyin + tourneyBuyin),
      winRate: winRateOf(allNets),
    },
  };

  const venueMap = new Map<string, { sessions: number; net: number; buyin: number }>();
  for (const s of [...cash, ...tournaments]) {
    const entry = venueMap.get(s.venue) ?? { sessions: 0, net: 0, buyin: 0 };
    entry.sessions += 1;
    entry.net += s.net;
    entry.buyin += s.totalBuyin;
    venueMap.set(s.venue, entry);
  }
  const byVenue = [...venueMap.entries()]
    .map(([venue, v]) => ({ venue, sessions: v.sessions, net: v.net, roi: roiOf(v.net, v.buyin) }))
    .sort((a, b) => b.net - a.net);

  const combined: SessionListRow[] = [
    ...cash.map((s) => ({ id: s.id, type: "cash" as const, date: s.date, venue: s.venue, net: s.net })),
    ...tournaments.map((s) => ({
      id: s.id,
      type: "tournament" as const,
      date: s.date,
      venue: s.venue,
      net: s.net,
    })),
  ];
  const bySortedNet = [...combined].sort((a, b) => b.net - a.net);
  // Cap at 3 each, but never let the two lists overlap when there aren't enough
  // sessions to fill both distinctly.
  const numEach = Math.min(3, Math.floor(combined.length / 2));

  return {
    totals,
    chart: {
      cash: cumulativeSeries(cash),
      tournament: cumulativeSeries(tournaments),
    },
    sessionMix: { cash: cash.length, tournament: tournaments.length },
    winLoss: {
      won: allNets.filter((n) => n > 0).length,
      lost: allNets.filter((n) => n <= 0).length,
    },
    byVenue,
    bestSessions: numEach > 0 ? bySortedNet.slice(0, numEach) : [],
    worstSessions: numEach > 0 ? bySortedNet.slice(-numEach).reverse() : [],
  };
}
