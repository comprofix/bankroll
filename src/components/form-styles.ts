const baseFieldClass =
  "rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:border-black/30 dark:border-white/10 dark:focus:border-white/30";

export const inputClass = `${baseFieldClass} bg-transparent`;

// <select> needs an explicit (non-transparent) background/text color, unlike
// text inputs. The dropdown popup is a separate native rendering surface —
// it falls back to the browser/OS default (white) when the background is
// transparent, which left dark-mode option text illegible on it. Built from
// baseFieldClass rather than inputClass so bg-transparent and this explicit
// background never end up in the same class list — same specificity, so
// whichever Tailwind happens to emit last would silently win.
export const selectClass = `${baseFieldClass} bg-[var(--background)] text-[var(--foreground)]`;
