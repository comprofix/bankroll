export function SegmentedBar({
  title,
  segments,
}: {
  title: string;
  segments: { label: string; value: number; color: string }[];
}) {
  const total = segments.reduce((sum, s) => sum + s.value, 0);

  return (
    <div>
      <p className="mb-2 text-sm text-black/60 dark:text-white/60">{title}</p>
      <div className="flex h-5 w-full overflow-hidden rounded-full bg-black/5 dark:bg-white/10">
        {segments.map((s, i) =>
          total > 0 ? (
            <div
              key={s.label}
              style={{ width: `${(s.value / total) * 100}%`, backgroundColor: s.color }}
              className={i > 0 ? "border-l-2 border-[var(--background)]" : ""}
            />
          ) : null,
        )}
      </div>
      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-black/60 dark:text-white/60">
        {segments.map((s) => (
          <span key={s.label} className="flex items-center gap-1.5">
            <span
              className="inline-block h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: s.color }}
            />
            {s.label} · {s.value}
            {total > 0 ? ` (${Math.round((s.value / total) * 100)}%)` : ""}
          </span>
        ))}
      </div>
    </div>
  );
}
