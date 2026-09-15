import type { VenueOption } from "@/db/queries";

import { FormField } from "./FormField";
import { inputClass } from "./form-styles";
import { RebuyList } from "./RebuyList";
import { VenuePicker } from "./VenuePicker";

export type TournamentSessionFormValues = {
  tournamentName: string;
  datePlayed: string;
  startingBuyin: string;
  rebuyAmounts: string[];
  finishPosition: string;
  payout: string;
  venueName: string;
  venueLocation: string;
  notes: string;
};

export function TournamentSessionForm({
  action,
  defaultValues,
  venues,
  submitLabel = "Save Session",
}: {
  action: (formData: FormData) => void;
  defaultValues?: Partial<TournamentSessionFormValues>;
  venues: VenueOption[];
  submitLabel?: string;
}) {
  return (
    <form action={action} className="flex flex-col gap-4">
      <FormField label="Tournament Name">
        <input
          type="text"
          name="tournamentName"
          required
          defaultValue={defaultValues?.tournamentName}
          className={inputClass}
        />
      </FormField>

      <FormField label="Date Played">
        <input
          type="date"
          name="datePlayed"
          required
          defaultValue={defaultValues?.datePlayed}
          className={inputClass}
        />
      </FormField>

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

      <div className="grid grid-cols-2 gap-3">
        <FormField label="Finish Position (optional)">
          <input
            type="number"
            min={1}
            name="finishPosition"
            defaultValue={defaultValues?.finishPosition}
            className={inputClass}
          />
        </FormField>
        <FormField label="Payout">
          <input
            type="number"
            step="0.01"
            name="payout"
            defaultValue={defaultValues?.payout ?? "0"}
            required
            className={inputClass}
          />
        </FormField>
      </div>

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
