"use client";

import { useRouter } from "next/navigation";

import { FormField } from "@/components/FormField";
import { inputClass } from "@/components/form-styles";
import { NavBar } from "@/components/NavBar";
import { RebuyList } from "@/components/RebuyList";

export default function NewCashSession() {
  const router = useRouter();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    router.push("/");
  }

  return (
    <div className="flex min-h-screen flex-col">
      <NavBar title="Cash Session" backHref="/sessions/new" />
      <main className="mx-auto w-full max-w-md flex-1 px-4 pb-12 pt-4">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <FormField label="Date Played">
            <input type="date" name="datePlayed" required className={inputClass} />
          </FormField>

          <div className="grid grid-cols-2 gap-3">
            <FormField label="Time Started">
              <input type="time" name="timeStarted" required className={inputClass} />
            </FormField>
            <FormField label="Time Ended">
              <input type="time" name="timeEnded" required className={inputClass} />
            </FormField>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <FormField label="Small Blind">
              <input
                type="number"
                step="0.01"
                name="smallBlind"
                required
                className={inputClass}
              />
            </FormField>
            <FormField label="Big Blind">
              <input
                type="number"
                step="0.01"
                name="bigBlind"
                required
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
              className={inputClass}
            />
          </FormField>

          <RebuyList />

          <FormField label="Cash-out">
            <input type="number" step="0.01" name="cashout" required className={inputClass} />
          </FormField>

          <FormField label="Venue Name">
            <input type="text" name="venueName" required className={inputClass} />
          </FormField>

          <FormField label="Venue Location (optional)">
            <input type="text" name="venueLocation" className={inputClass} />
          </FormField>

          <FormField label="Notes (optional)">
            <textarea name="notes" rows={3} className={inputClass} />
          </FormField>

          <button
            type="submit"
            className="mt-2 rounded-lg bg-black py-2.5 text-sm font-medium text-white dark:bg-white dark:text-black"
          >
            Save Session
          </button>
          <p className="text-center text-xs text-black/40 dark:text-white/40">
            Not yet connected to the database — this is a layout preview.
          </p>
        </form>
      </main>
    </div>
  );
}
