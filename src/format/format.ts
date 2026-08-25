// Generic, locale-aware formatting helpers. Unlike an app's formatters, these
// take no domain assumptions (no fixed currency or minor-unit) — callers pass
// options, and charts accept a `format` callback so any unit works.

export type NumberFormat = (value: number) => string;

export interface CurrencyOptions {
  currency: string; // ISO 4217, e.g. "USD", "NGN", "EUR"
  locale?: string;
  /** Compact notation, e.g. 1.2M. */
  compact?: boolean;
  maximumFractionDigits?: number;
}

const numberCache = new Map<string, Intl.NumberFormat>();

function fmt(locale: string | undefined, options: Intl.NumberFormatOptions): Intl.NumberFormat {
  const key = `${locale ?? ""}|${JSON.stringify(options)}`;
  let f = numberCache.get(key);
  if (!f) {
    f = new Intl.NumberFormat(locale, options);
    numberCache.set(key, f);
  }
  return f;
}

/** Group digits, e.g. 12345 -> "12,345". */
export function formatNumber(value: number, locale?: string): string {
  return fmt(locale, {}).format(value);
}

/** Compact number, e.g. 1500000 -> "1.5M". */
export function formatCompact(value: number, locale?: string): string {
  return fmt(locale, { notation: "compact", maximumFractionDigits: 1 }).format(value);
}

/** Currency, e.g. formatCurrency(1234.5, { currency: "USD" }) -> "$1,235". */
export function formatCurrency(value: number, options: CurrencyOptions): string {
  const { currency, locale, compact, maximumFractionDigits = compact ? 1 : 0 } = options;
  return fmt(locale, {
    style: "currency",
    currency,
    notation: compact ? "compact" : "standard",
    maximumFractionDigits,
  }).format(value);
}

/** Fraction to percent, e.g. 0.1234 -> "12.3%". */
export function formatPercent(fraction: number, digits = 1): string {
  return `${(fraction * 100).toFixed(digits)}%`;
}

/** Signed delta for KPI badges: 0.12 -> "+12.0%", -0.05 -> "−5.0%", null -> "—". */
export function formatDelta(delta: number | null, digits = 1): string {
  if (delta === null) return "—";
  const sign = delta > 0 ? "+" : delta < 0 ? "−" : "";
  return `${sign}${Math.abs(delta * 100).toFixed(digits)}%`;
}

/** Build a reusable currency formatter to pass as a chart's `format` prop. */
export function currencyFormatter(options: CurrencyOptions): NumberFormat {
  return (value: number) => formatCurrency(value, options);
}
