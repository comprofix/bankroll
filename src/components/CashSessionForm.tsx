import type { VenueOption } from "@/db/queries";

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
  action: (formData: FormData) => void;
  defaultValues?: Partial<CashSessionFormValues>;
  venues: VenueOption[];
  submitLabel?: string;
}) {
  return (
    <form action={action} className="flex flex-col gap-4">
      <FormField label="Date Played">
        <input
          type="date"
          name="datePlayed"
          required
          defaultValue={defaultValues?.datePlayed}
          className={inputClass}
        />
      </FormField>

      <div className="grid grid-cols-2 gap-3">
        <FormField label="Time Started">
          <input
            type="time"
            name="timeStarted"
            required
            defaultValue={defaultValues?.timeStarted}
            className={inputClass}
          />
        </FormField>
        <FormField label="Time Ended">
          <input
            type="time"
            name="timeEnded"
            required
            defaultValue={defaultValues?.timeEnded}
            className={inputClass}
          />
        </FormField>
      </div>

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
        {submitLabel}
      </button>
    </form>
  );
}
