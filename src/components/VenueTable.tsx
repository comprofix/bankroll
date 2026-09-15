import { formatMoneySigned, formatPercent } from "@/lib/format";

export function VenueTable({
  rows,
}: {
  rows: { venue: string; sessions: number; net: number; roi: number | null }[];
}) {
  if (rows.length === 0) {
    return <p className="text-sm text-black/40 dark:text-white/40">No sessions yet.</p>;
  }

  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="text-xs text-black/40 dark:text-white/40">
          <th className="pb-1.5 text-left font-normal">Venue</th>
          <th className="px-2 pb-1.5 text-right font-normal">Sessions</th>
          <th className="px-2 pb-1.5 text-right font-normal">Net</th>
          <th className="pb-1.5 pl-2 text-right font-normal">ROI</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.venue} className="border-t border-black/5 dark:border-white/10">
            <td className="py-1.5 pr-2">{r.venue}</td>
            <td className="px-2 py-1.5 text-right tabular-nums">{r.sessions}</td>
            <td
              className={`px-2 py-1.5 text-right font-semibold tabular-nums ${
                r.net >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"
              }`}
            >
              {formatMoneySigned(r.net)}
            </td>
            <td className="py-1.5 pl-2 text-right tabular-nums">{formatPercent(r.roi)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
