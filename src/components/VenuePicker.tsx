"use client";

import type { ChangeEvent } from "react";
import { useState } from "react";

import type { VenueOption } from "@/db/queries";

import { FormField } from "./FormField";
import { selectClass } from "./form-styles";

export function VenuePicker({
  venues,
  defaultName,
  defaultLocation,
}: {
  venues: VenueOption[];
  defaultName?: string;
  defaultLocation?: string;
}) {
  // Editing a session whose venue was since removed from the saved list:
  // keep it selectable (and preselected) rather than forcing a change.
  const options =
    defaultName && !venues.some((v) => v.name === defaultName)
      ? [{ id: -1, name: defaultName, location: defaultLocation ?? null }, ...venues]
      : venues;

  const [location, setLocation] = useState(defaultLocation ?? "");

  function handleChange(e: ChangeEvent<HTMLSelectElement>) {
    const venue = options.find((v) => v.name === e.target.value);
    setLocation(venue?.location ?? "");
  }

  return (
    <>
      <FormField label="Venue">
        <select
          name="venueName"
          required
          defaultValue={defaultName ?? ""}
          onChange={handleChange}
          className={selectClass}
        >
          <option value="" disabled>
            {options.length === 0 ? "No saved venues — add one in Settings first" : "Choose a venue…"}
          </option>
          {options.map((v) => (
            <option key={v.id} value={v.name}>
              {v.name}
              {v.id === -1 ? " (no longer saved)" : ""}
            </option>
          ))}
        </select>
      </FormField>
      <input type="hidden" name="venueLocation" value={location} />
    </>
  );
}
