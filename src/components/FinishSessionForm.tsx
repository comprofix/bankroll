"use client";

import { withClientClock } from "@/lib/clock";

import { FormField } from "./FormField";
import { inputClass } from "./form-styles";

export function FinishSessionForm({ action }: { action: (formData: FormData) => void | Promise<void> }) {
  return (
    <form action={withClientClock(action)} className="flex flex-col gap-3">
      <FormField label="Cash-out">
        <input type="number" step="0.01" name="cashout" required className={inputClass} />
      </FormField>
      <FormField label="Time Ended (optional)">
        <input type="time" name="timeEnded" className={inputClass} />
      </FormField>
      <p className="-mt-1 text-xs text-black/50 dark:text-white/50">
        Leave the end time blank to finish at the current time.
      </p>
      <button
        type="submit"
        className="rounded-lg bg-black py-2.5 text-sm font-medium text-white dark:bg-white dark:text-black"
      >
        Finish Session
      </button>
    </form>
  );
}
