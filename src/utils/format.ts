const numberFormatter = new Intl.NumberFormat("en-US");

const compactFormatter = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
});

// 9364000 -> "9,364,000"
export function formatNumber(value: number): string {
  return numberFormatter.format(value);
}

// 9364000 -> "9.4M"
export function formatCompact(value: number): string {
  return compactFormatter.format(value);
}

// Date -> "12:30 05/10/2026"
export function formatDateTime(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  const time = `${pad(date.getHours())}:${pad(date.getMinutes())}`;
  const day = `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`;
  return `${time} ${day}`;
}
