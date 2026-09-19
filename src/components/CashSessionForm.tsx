"use client";

import { useState } from "react";

import type { VenueOption } from "@/db/queries";
import { withClientClock } from "@/lib/clock";

import { FormField } from "./FormField";
import { inputClass } from "./form-styles";
import { RebuyList } from "./RebuyList";
import { VenuePicker } from "./VenuePicker";

export type CashSessionFormValues = {
  datePlayed: string;
  timeStarted: string;
  timeEnded: string;
  smallBlind: string;
  bigBlind: string;
  startingBuyin: string;
  rebuyAmounts: string[];
  cashout: string;
  venueName: string;
  venueLocation: string;
  notes: string;
};

export function CashSessionForm({
  action,
  defaultValues,
  venues,
  submitLabel = "Save Session",
}: {
  action: (formData: FormData) => void | Promise<void>;
  defaultValues?: Partial<CashSessionFormValues>;
  venues: VenueOption[];
  submitLabel?: string;
}) {
  // A brand-new session with no end time starts a live timer instead of
  // being saved as a finished one. Once a session has been finished, its end
  // time and cash-out stay required when it's edited.
  const isNew = !defaultValues;
  const wasFinished = !!defaultValues?.timeEnded;
  const [timeEnded, setTimeEnded] = useState(defaultValues?.timeEnded ?? "");
  const hasEnd = timeEnded !== "";
  const label = isNew && !hasEnd ? "Start Session" : submitLabel;

  return (
    <form action={isNew ? withClientClock(action) : action} className="flex flex-col gap-4">
      <FormField label="Date Played">
        <input
          type="date"
          name="datePlayed"
          required={!isNew}
          defaultValue={defaultValues?.datePlayed}
          className={inputClass}
        />
      </FormField>

      <div className="grid grid-cols-2 gap-3">
        <FormField label="Time Started">
          <input
            type="time"
            name="timeStarted"
            required={!isNew || hasEnd}
            defaultValue={defaultValues?.timeStarted}
            className={inputClass}
          />
        </FormField>
        <FormField label="Time Ended">
          <input
            type="time"
            name="timeEnded"
            required={wasFinished}
            defaultValue={defaultValues?.timeEnded}
            onChange={(e) => setTimeEnded(e.target.value)}
            className={inputClass}
          />
        </FormField>
      </div>
      {isNew ? (
        <p className="-mt-2 text-xs text-black/50 dark:text-white/50">
          Leave the times blank to start tracking your time from now. You can add rebuys as you
          play and finish the session at the end.
        </p>
      ) : null}

      <div className="grid grid-cols-2 gap-3">
        <FormField label="Small Blind">
          <input
            type="number"
            step="0.01"
            name="smallBlind"
            required
            defaultValue={defaultValues?.smallBlind}
            className={inputClass}
          />
        </FormField>
        <FormField label="Big Blind">
          <input
            type="number"
            step="0.01"
            name="bigBlind"
            required
            defaultValue={defaultValues?.bigBlind}
            className={inputClass}
          />
        </FormField>
      </div>

      <FormField label="Starting Buy-in">
        <input
          type="number"
          step="0.01"
          name="startingBuyin"
          required
          defaultValue={defaultValues?.startingBuyin}
          className={inputClass}
        />
      </FormField>

      <RebuyList initialAmounts={defaultValues?.rebuyAmounts} />

      {wasFinished || hasEnd ? (
        <FormField label="Cash-out">
          <input
            type="number"
            step="0.01"
            name="cashout"
            required
            defaultValue={defaultValues?.cashout}
            className={inputClass}
          />
        </FormField>
      ) : null}

      <VenuePicker
        venues={venues}
        defaultName={defaultValues?.venueName}
        defaultLocation={defaultValues?.venueLocation}
      />

      <FormField label="Notes (optional)">
        <textarea name="notes" rows={3} defaultValue={defaultValues?.notes} className={inputClass} />
      </FormField>

      <button
        type="submit"
        className="mt-2 rounded-lg bg-black py-2.5 text-sm font-medium text-white dark:bg-white dark:text-black"
      >
        {label}
      </button>
    </form>
  );
}
