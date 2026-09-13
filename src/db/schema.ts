import {
  bigint,
  bigserial,
  date,
  index,
  integer,
  numeric,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const cashSessions = pgTable(
  "cash_sessions",
  {
    id: bigserial("id", { mode: "number" }).primaryKey(),
    userId: bigint("user_id", { mode: "number" })
      .notNull()
      .references(() => users.id),
    // date_played is derived from startDatetime, not stored separately
    startDatetime: timestamp("start_datetime", { withTimezone: true }).notNull(),
    endDatetime: timestamp("end_datetime", { withTimezone: true }).notNull(),
    smallBlind: numeric("small_blind", { precision: 10, scale: 2 }).notNull(),
    bigBlind: numeric("big_blind", { precision: 10, scale: 2 }).notNull(),
    startingBuyin: numeric("starting_buyin", {
      precision: 10,
      scale: 2,
    }).notNull(),
    cashout: numeric("cashout", { precision: 10, scale: 2 }).notNull(),
    venueName: varchar("venue_name", { length: 150 }).notNull(),
    venueLocation: varchar("venue_location", { length: 150 }),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [index("cash_sessions_user_start_idx").on(table.userId, table.startDatetime)],
);

export const cashRebuys = pgTable("cash_rebuys", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  cashSessionId: bigint("cash_session_id", { mode: "number" })
    .notNull()
    .references(() => cashSessions.id, { onDelete: "cascade" }),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
});

export const tournamentSessions = pgTable(
  "tournament_sessions",
  {
    id: bigserial("id", { mode: "number" }).primaryKey(),
    userId: bigint("user_id", { mode: "number" })
      .notNull()
      .references(() => users.id),
    tournamentName: varchar("tournament_name", { length: 150 }).notNull(),
    datePlayed: date("date_played").notNull(),
    startingBuyin: numeric("starting_buyin", {
      precision: 10,
      scale: 2,
    }).notNull(),
    finishPosition: integer("finish_position"),
    payout: numeric("payout", { precision: 10, scale: 2 })
      .notNull()
      .default("0"),
    venueName: varchar("venue_name", { length: 150 }).notNull(),
    venueLocation: varchar("venue_location", { length: 150 }),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [index("tournament_sessions_user_date_idx").on(table.userId, table.datePlayed)],
);

export const tournamentRebuys = pgTable("tournament_rebuys", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  tournamentSessionId: bigint("tournament_session_id", { mode: "number" })
    .notNull()
    .references(() => tournamentSessions.id, { onDelete: "cascade" }),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
});
