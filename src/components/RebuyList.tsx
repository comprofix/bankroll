"use client";

import { useRef, useState } from "react";

import { inputClass } from "./form-styles";

export function RebuyList({ initialAmounts = [] }: { initialAmounts?: string[] }) {
  const nextId = useRef(initialAmounts.length);
  const [rebuys, setRebuys] = useState<{ id: number; amount: string }[]>(() =>
    initialAmounts.map((amount, index) => ({ id: index, amount })),
  );

  function addRebuy() {
    setRebuys((prev) => [...prev, { id: nextId.current++, amount: "" }]);
  }

  function removeRebuy(id: number) {
    setRebuys((prev) => prev.filter((r) => r.id !== id));
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium">Rebuys</span>
      {rebuys.map(({ id, amount }) => (
        <div key={id} className="flex items-center gap-2">
          <input
            type="number"
            step="0.01"
            placeholder="Amount"
            name="rebuyAmount"
            defaultValue={amount}
            className={`${inputClass} flex-1`}
          />
          <button
            type="button"
            onClick={() => removeRebuy(id)}
            aria-label="Remove rebuy"
            className="text-sm text-black/50 hover:text-red-600 dark:text-white/50 dark:hover:text-red-400"
          >
            ✕
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={addRebuy}
        className="self-start text-sm text-black/60 underline hover:text-black dark:text-white/60 dark:hover:text-white"
      >
        + Add Rebuy
      </button>
    </div>
  );
}
