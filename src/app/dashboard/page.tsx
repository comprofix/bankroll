import { NavBar } from "@/components/NavBar";
import { ProfitChart } from "@/components/ProfitChart";
import { SegmentedBar } from "@/components/SegmentedBar";
import { SessionRowLink } from "@/components/SessionRowLink";
import { TotalsTable } from "@/components/TotalsTable";
import { VenueTable } from "@/components/VenueTable";
import { getDashboardData } from "@/db/queries";
import { requireUserId } from "@/lib/session";

export default async function Dashboard() {
  const userId = await requireUserId();
  const data = await getDashboardData(userId);

  return (
    <div className="flex min-h-screen flex-col">
      <NavBar title="Stats" backHref="/" />
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-6 px-4 pb-12 pt-4">
        <section className="rounded-xl border border-black/10 p-4 dark:border-white/10">
          <p className="mb-2 text-sm text-black/60 dark:text-white/60">Profit Over Time</p>
          <ProfitChart
            series={[
              { key: "cash", label: "Cash", color: "var(--series-cash)", points: data.chart.cash },
              {
                key: "tournament",
                label: "Tournament",
                color: "var(--series-tournament)",
                points: data.chart.tournament,
              },
            ]}
          />
        </section>

        <section className="rounded-xl border border-black/10 p-4 dark:border-white/10">
          <p className="mb-2 text-sm text-black/60 dark:text-white/60">All-Time Totals</p>
          <TotalsTable
            cash={data.totals.cash}
            tournament={data.totals.tournament}
            total={data.totals.combined}
          />
        </section>

        <section className="flex flex-col gap-4 rounded-xl border border-black/10 p-4 dark:border-white/10">
          <SegmentedBar
            title="Session Mix"
            segments={[
              { label: "Cash", value: data.sessionMix.cash, color: "var(--series-cash)" },
              {
                label: "Tournament",
                value: data.sessionMix.tournament,
                color: "var(--series-tournament)",
              },
            ]}
          />
          <SegmentedBar
            title="Win Rate"
            segments={[
              { label: "Won", value: data.winLoss.won, color: "var(--status-good)" },
              { label: "Lost", value: data.winLoss.lost, color: "var(--status-critical)" },
            ]}
          />
        </section>

        <section className="rounded-xl border border-black/10 p-4 dark:border-white/10">
          <p className="mb-2 text-sm text-black/60 dark:text-white/60">By Venue</p>
          <VenueTable rows={data.byVenue} />
        </section>

        <section className="rounded-xl border border-black/10 p-4 dark:border-white/10">
          <p className="mb-2 text-sm text-black/60 dark:text-white/60">Best Sessions</p>
          {data.bestSessions.length === 0 ? (
            <p className="text-sm text-black/40 dark:text-white/40">Not enough sessions yet.</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {data.bestSessions.map((s) => (
                <li key={`${s.type}-${s.id}`}>
                  <SessionRowLink session={s} />
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-xl border border-black/10 p-4 dark:border-white/10">
          <p className="mb-2 text-sm text-black/60 dark:text-white/60">Worst Sessions</p>
          {data.worstSessions.length === 0 ? (
            <p className="text-sm text-black/40 dark:text-white/40">Not enough sessions yet.</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {data.worstSessions.map((s) => (
                <li key={`${s.type}-${s.id}`}>
                  <SessionRowLink session={s} />
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
