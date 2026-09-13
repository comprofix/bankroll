"use client";

import { useRouter } from "next/navigation";

import { FormField } from "@/components/FormField";
import { inputClass } from "@/components/form-styles";

export default function Login() {
  const router = useRouter();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    router.push("/");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="mb-6 text-center text-xl font-semibold">Bankroll</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <FormField label="Email">
            <input type="email" name="email" required autoComplete="username" className={inputClass} />
          </FormField>
          <FormField label="Password">
            <input
              type="password"
              name="password"
              required
              autoComplete="current-password"
              className={inputClass}
            />
          </FormField>
          <button
            type="submit"
            className="mt-2 rounded-lg bg-black py-2.5 text-sm font-medium text-white dark:bg-white dark:text-black"
          >
            Log In
          </button>
          <p className="text-center text-xs text-black/40 dark:text-white/40">
            Not yet connected to auth — this is a layout preview.
          </p>
        </form>
      </div>
    </div>
  );
}
