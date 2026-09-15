export function formatMoneySigned(value: number): string {
  return `${value >= 0 ? "+" : "-"}$${Math.abs(Math.round(value)).toLocaleString()}`;
}

export function formatMoney(value: number): string {
  return `$${Math.round(value).toLocaleString()}`;
}

export function formatPercent(value: number | null, digits = 0): string {
  return value === null ? "—" : `${(value * 100).toFixed(digits)}%`;
}

export function formatHours(value: number | null): string {
  return value === null ? "—" : `${value.toFixed(1)}h`;
}
