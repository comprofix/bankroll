import { combineDateAndTime } from "@/lib/datetime";

const DAY_MS = 24 * 60 * 60 * 1000;

function text(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}

// Shared by create and update. A blank end time means the session is still
// in progress (live timer); a blank start time on create means "start now"
// using the browser's clock (clientDate/clientTime, see lib/clock.ts).
export function parseCashSessionForm(formData: FormData) {
  const timeStarted = text(formData, "timeStarted");
  const timeEnded = text(formData, "timeEnded");
  const cashout = text(formData, "cashout");

  let startDatetime: Date;
  if (timeStarted) {
    const date = text(formData, "datePlayed") || text(formData, "clientDate");
    startDatetime = combineDateAndTime(date, timeStarted);
  } else {
    if (timeEnded) throw new Error("A start time is required when an end time is given.");
    startDatetime = combineDateAndTime(text(formData, "clientDate"), text(formData, "clientTime"));
  }

  let endDatetime: Date | null = null;
  if (timeEnded) {
    if (!cashout) throw new Error("A cash-out amount is required when the session has ended.");
    endDatetime = combineDateAndTime(
      text(formData, "datePlayed") || text(formData, "clientDate"),
      timeEnded,
    );
    // Overnight session: end clock time is earlier than the start's.
    if (endDatetime < startDatetime) endDatetime = new Date(endDatetime.getTime() + DAY_MS);
  }

  const rebuyAmounts = formData
    .getAll("rebuyAmount")
    .map((v) => String(v).trim())
    .filter((v) => v.length > 0);

  return {
    startDatetime,
    endDatetime,
    smallBlind: text(formData, "smallBlind"),
    bigBlind: text(formData, "bigBlind"),
    startingBuyin: text(formData, "startingBuyin"),
    cashout: endDatetime ? cashout : null,
    venueName: text(formData, "venueName"),
    venueLocation: text(formData, "venueLocation") || null,
    notes: text(formData, "notes") || null,
    rebuyAmounts,
  };
}
