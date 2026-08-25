import type { ReactNode } from "react";
import { Sparkline } from "../charts/Sparkline";
import { formatDelta } from "../format";

export interface KpiTileProps {
  label: string;
  value: ReactNode;
  /** Signed fractional change vs the comparison period; null renders "—". */
  delta?: number | null;
  /** Values for the trend sparkline. */
  sparkline?: number[];
  sparklineColor?: string;
  /** When true, a rising delta is treated as bad (e.g. error rate). */
  invertDelta?: boolean;
}

const FLAT_THRESHOLD = 0.0005;

function DeltaBadge({ delta, invert }: { delta: number | null; invert?: boolean }) {
  if (delta === null || delta === undefined) {
    return <span className="sonar-kpi__delta sonar-kpi__delta--flat">—</span>;
  }
  const flat = Math.abs(delta) < FLAT_THRESHOLD;
  const rising = !flat && delta > 0;
  const falling = !flat && delta < 0;
  const good = invert ? falling : rising;
  const tone = flat ? "flat" : good ? "pos" : "neg";
  return (
    <span className={`sonar-kpi__delta sonar-kpi__delta--${tone}`}>
      {rising ? "▲" : falling ? "▼" : "•"} {formatDelta(flat ? 0 : delta)}
    </span>
  );
}

/** A single KPI: label, big value, period-over-period delta and a sparkline. */
export function KpiTile({ label, value, delta, sparkline, sparklineColor, invertDelta }: KpiTileProps) {
  return (
    <div className="sonar-kpi">
      <div className="sonar-kpi__top">
        <p className="sonar-kpi__label">{label}</p>
        <DeltaBadge delta={delta ?? null} invert={invertDelta} />
      </div>
      <div className="sonar-kpi__row">
        <span className="sonar-kpi__value">{value}</span>
        {sparkline && sparkline.length > 1 ? (
          <Sparkline values={sparkline} color={sparklineColor} ariaLabel={`${label} trend`} />
        ) : null}
      </div>
    </div>
  );
}
