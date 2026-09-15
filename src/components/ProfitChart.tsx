"use client";

import type { PointerEvent as ReactPointerEvent } from "react";
import { useMemo, useRef, useState } from "react";

type SeriesPoint = { date: string; cumulative: number };
type Series = { key: string; label: string; color: string; points: SeriesPoint[] };

const WIDTH = 340;
const HEIGHT = 180;
const PAD_LEFT = 44;
const PAD_RIGHT = 8;
const PAD_TOP = 10;
const PAD_BOTTOM = 20;

function formatSigned(value: number): string {
  return `${value >= 0 ? "+" : "-"}$${Math.abs(Math.round(value)).toLocaleString()}`;
}

export function ProfitChart({ series }: { series: Series[] }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const allDates = useMemo(() => {
    const set = new Set<string>();
    for (const s of series) for (const p of s.points) set.add(p.date);
    return [...set].sort();
  }, [series]);

  const dateIndex = useMemo(() => new Map(allDates.map((d, i) => [d, i])), [allDates]);

  const allValues = series.flatMap((s) => s.points.map((p) => p.cumulative));
  const minValue = Math.min(0, ...allValues);
  const maxValue = Math.max(0, ...allValues, 1);

  const plotWidth = WIDTH - PAD_LEFT - PAD_RIGHT;
  const plotHeight = HEIGHT - PAD_TOP - PAD_BOTTOM;
  const hasData = allDates.length > 0;

  function xForIndex(i: number): number {
    return allDates.length > 1
      ? PAD_LEFT + (i / (allDates.length - 1)) * plotWidth
      : PAD_LEFT + plotWidth / 2;
  }

  function yForValue(v: number): number {
    const range = maxValue - minValue || 1;
    return PAD_TOP + plotHeight - ((v - minValue) / range) * plotHeight;
  }

  function pathFor(s: Series): string {
    return s.points
      .map((p, i) => {
        const cmd = i === 0 ? "M" : "L";
        return `${cmd} ${xForIndex(dateIndex.get(p.date) ?? 0)} ${yForValue(p.cumulative)}`;
      })
      .join(" ");
  }

  // Step-carry-forward: a series' value as of a given date index is its last
  // known cumulative total at or before that date.
  function valueAt(s: Series, idx: number): number | null {
    let result: number | null = null;
    for (const p of s.points) {
      if ((dateIndex.get(p.date) ?? -1) <= idx) result = p.cumulative;
    }
    return result;
  }

  function handlePointerMove(e: ReactPointerEvent<SVGSVGElement>) {
    const svg = svgRef.current;
    if (!svg || allDates.length === 0) return;
    const rect = svg.getBoundingClientRect();
    const relX = ((e.clientX - rect.left) / rect.width) * WIDTH;
    const clamped = Math.max(PAD_LEFT, Math.min(WIDTH - PAD_RIGHT, relX));
    const fraction = plotWidth > 0 ? (clamped - PAD_LEFT) / plotWidth : 0;
    setHoverIndex(Math.round(fraction * (allDates.length - 1)));
  }

  const zeroY = yForValue(0);

  return (
    <div>
      {hasData ? (
        <svg
          ref={svgRef}
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="w-full touch-none"
          onPointerMove={handlePointerMove}
          onPointerLeave={() => setHoverIndex(null)}
        >
          <line
            x1={PAD_LEFT}
            x2={WIDTH - PAD_RIGHT}
            y1={zeroY}
            y2={zeroY}
            stroke="var(--chart-baseline)"
            strokeWidth={1}
          />
          <text x={2} y={PAD_TOP + 4} fontSize={9} fill="var(--chart-text-muted)">
            {Math.round(maxValue).toLocaleString()}
          </text>
          <text x={2} y={HEIGHT - PAD_BOTTOM + 4} fontSize={9} fill="var(--chart-text-muted)">
            {Math.round(minValue).toLocaleString()}
          </text>

          {series.map((s) => (
            <path
              key={s.key}
              d={pathFor(s)}
              fill="none"
              stroke={s.color}
              strokeWidth={2}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          ))}

          {series.map((s) => {
            const last = s.points[s.points.length - 1];
            if (!last) return null;
            return (
              <circle
                key={s.key}
                cx={xForIndex(dateIndex.get(last.date) ?? 0)}
                cy={yForValue(last.cumulative)}
                r={4}
                fill={s.color}
                stroke="var(--background)"
                strokeWidth={2}
              />
            );
          })}

          {hoverIndex !== null ? (
            <line
              x1={xForIndex(hoverIndex)}
              x2={xForIndex(hoverIndex)}
              y1={PAD_TOP}
              y2={HEIGHT - PAD_BOTTOM}
              stroke="var(--chart-gridline)"
              strokeWidth={1}
            />
          ) : null}
        </svg>
      ) : (
        <p className="py-8 text-center text-sm text-black/40 dark:text-white/40">
          Not enough sessions yet to chart.
        </p>
      )}

      <div className="mt-1 flex gap-4 text-xs text-black/60 dark:text-white/60">
        {series.map((s) => (
          <span key={s.key} className="flex items-center gap-1.5">
            <span className="inline-block h-2 w-3 rounded-sm" style={{ backgroundColor: s.color }} />
            {s.label}
          </span>
        ))}
      </div>

      {hoverIndex !== null && hasData ? (
        <div className="mt-2 rounded-lg border border-black/10 p-2 text-xs dark:border-white/10">
          <p className="mb-1 font-medium text-black/70 dark:text-white/70">{allDates[hoverIndex]}</p>
          {series.map((s) => {
            const v = valueAt(s, hoverIndex);
            return (
              <div key={s.key} className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-1.5 text-black/60 dark:text-white/60">
                  <span
                    className="inline-block h-2 w-3 rounded-sm"
                    style={{ backgroundColor: s.color }}
                  />
                  {s.label}
                </span>
                <span className="font-semibold tabular-nums">{v === null ? "—" : formatSigned(v)}</span>
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
