import type { DashboardTotals } from "@/db/queries";
import { formatHours, formatMoney, formatMoneySigned, formatPercent } from "@/lib/format";

function Row({
  label,
  cash,
  tournament,
  total,
}: {
  label: string;
  cash: string;
  tournament: string;
  total: string;
}) {
  return (
    <tr className="border-t border-black/5 dark:border-white/10">
      <td className="py-1.5 pr-2 text-black/60 dark:text-white/60">{label}</td>
      <td className="px-2 py-1.5 text-right tabular-nums">{cash}</td>
      <td className="px-2 py-1.5 text-right tabular-nums">{tournament}</td>
      <td className="py-1.5 pl-2 text-right font-semibold tabular-nums">{total}</td>
    </tr>
  );
}

export function TotalsTable({
  cash,
  tournament,
  total,
}: {
  cash: DashboardTotals;
  tournament: DashboardTotals;
  total: DashboardTotals;
}) {
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="text-xs text-black/40 dark:text-white/40">
          <th className="pb-1.5 text-left font-normal">&nbsp;</th>
          <th className="px-2 pb-1.5 text-right font-normal">Cash</th>
          <th className="px-2 pb-1.5 text-right font-normal">Tourney</th>
          <th className="pb-1.5 pl-2 text-right font-normal">Total</th>
        </tr>
      </thead>
      <tbody>
        <Row
          label="Buy-in"
          cash={formatMoney(cash.buyIn)}
          tournament={formatMoney(tournament.buyIn)}
          total={formatMoney(total.buyIn)}
        />
        <Row
          label="Winnings"
          cash={formatMoney(cash.winnings)}
          tournament={formatMoney(tournament.winnings)}
          total={formatMoney(total.winnings)}
        />
        <Row
          label="Net Profit"
          cash={formatMoneySigned(cash.net)}
          tournament={formatMoneySigned(tournament.net)}
          total={formatMoneySigned(total.net)}
        />
        <Row
          label="Sessions"
          cash={String(cash.sessions)}
          tournament={String(tournament.sessions)}
          total={String(total.sessions)}
        />
        <Row label="Hours" cash={formatHours(cash.hours)} tournament="—" total={formatHours(total.hours)} />
        <Row
          label="$/Hour"
          cash={cash.hourlyRate === null ? "—" : formatMoneySigned(cash.hourlyRate)}
          tournament="—"
          total={total.hourlyRate === null ? "—" : formatMoneySigned(total.hourlyRate)}
        />
        <Row
          label="ROI"
          cash={formatPercent(cash.roi)}
          tournament={formatPercent(tournament.roi)}
          total={formatPercent(total.roi)}
        />
        <Row
          label="Win %"
          cash={formatPercent(cash.winRate)}
          tournament={formatPercent(tournament.winRate)}
          total={formatPercent(total.winRate)}
        />
      </tbody>
    </table>
  );
}
