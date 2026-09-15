import type { VenueOption } from "@/db/queries";

import { createVenue, deleteVenue } from "@/app/settings/venues/actions";

import { FormField } from "./FormField";
import { inputClass } from "./form-styles";

export function VenuesSection({ venues }: { venues: VenueOption[] }) {
  return (
    <div>
      <ul className="mb-4 flex flex-col gap-2">
        {venues.map((v) => (
          <li
            key={v.id}
            className="flex items-center justify-between rounded-lg border border-black/10 p-3 dark:border-white/10"
          >
            <div>
              <p className="text-sm font-medium">{v.name}</p>
              {v.location ? (
                <p className="text-xs text-black/50 dark:text-white/50">{v.location}</p>
              ) : null}
            </div>
            <form action={deleteVenue.bind(null, v.id)}>
              <button
                type="submit"
                className="text-sm text-red-600 hover:underline dark:text-red-400"
              >
                Remove
              </button>
            </form>
          </li>
        ))}

        {venues.length === 0 ? (
          <li className="rounded-lg border border-dashed border-black/10 p-4 text-center text-sm text-black/40 dark:border-white/10 dark:text-white/40">
            No venues saved yet.
          </li>
        ) : null}
      </ul>

      <form action={createVenue} className="flex flex-col gap-3">
        <FormField label="Venue Name">
          <input type="text" name="name" required className={inputClass} />
        </FormField>
        <FormField label="Venue Location (optional)">
          <input type="text" name="location" className={inputClass} />
        </FormField>
        <button
          type="submit"
          className="rounded-lg border border-black/10 py-2.5 text-sm font-medium dark:border-white/10"
        >
          Add Venue
        </button>
      </form>
    </div>
  );
}
