import { useMemo, useState } from "react";
import { computeArcs, arcPath } from "../core";
import { ChartDataTable } from "../a11y";
import { formatPercent, formatNumber, type NumberFormat } from "../format";

export interface DonutDatum {
  label: string;
  value: number;
  color?: string;
}

export interface DonutChartProps {
  data: DonutDatum[];
  size?: number;
  thickness?: number;
  centerLabel?: string;
  /** Formats the center total and the hidden table values. */
  valueFormat?: NumberFormat;
  caption?: string;
}

const SERIES = [
  "var(--sonar-series-1)",
  "var(--sonar-series-2)",
  "var(--sonar-series-3)",
  "var(--sonar-series-4)",
  "var(--sonar-series-5)",
  "var(--sonar-series-6)",
  "var(--sonar-series-7)",
  "var(--sonar-series-8)",
];

export function DonutChart({
  data,
  size = 200,
  thickness = 32,
  centerLabel = "Total",
  valueFormat = (v) => formatNumber(v),
  caption = "Share by category",
}: DonutChartProps) {
  const [active, setActive] = useState<number | null>(null);
  const total = data.reduce((s, d) => s + Math.max(0, d.value), 0);
  const arcs = useMemo(() => computeArcs(data.map((d) => d.value)), [data]);

  const cx = size / 2;
  const cy = size / 2;
  const outer = size / 2 - 8;
  const inner = outer - thickness;
  const focus = active !== null ? data[active] : undefined;

  const colorAt = (i: number, d: DonutDatum) => d.color ?? SERIES[i % SERIES.length]!;
  const share = (v: number) => (total === 0 ? 0 : v / total);

  const summary = `Share by category. ${data
    .map((d) => `${d.label} ${formatPercent(share(d.value))}`)
    .join(", ")}.`;

  return (
    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "1.25rem" }}>
      <svg
        viewBox={`0 0 ${size} ${size}`}
        width={size}
        height={size}
        role="img"
        aria-label={summary}
        style={{ flexShrink: 0 }}
      >
        {arcs.map((arc, i) => {
          const d = data[i]!;
          const dimmed = active !== null && active !== i;
          return (
            <path
              key={d.label}
              d={arcPath(cx, cy, inner, outer, arc.startAngle, arc.endAngle)}
              fill={colorAt(i, d)}
              opacity={dimmed ? 0.35 : 1}
              onPointerEnter={() => setActive(i)}
              onPointerLeave={() => setActive(null)}
              style={{ transition: "opacity 120ms" }}
            />
          );
        })}
        <text x={cx} y={cy - 4} textAnchor="middle" fontSize={13} fontWeight={600} fill="var(--sonar-fg)">
          {focus ? focus.label : centerLabel}
        </text>
        <text x={cx} y={cy + 14} textAnchor="middle" fontSize={12} fill="var(--sonar-muted)">
          {focus ? formatPercent(share(focus.value)) : valueFormat(total)}
        </text>
      </svg>

      <ul className="sonar-legend">
        {data.map((d, i) => (
          <li
            key={d.label}
            className="sonar-legend__item"
            onPointerEnter={() => setActive(i)}
            onPointerLeave={() => setActive(null)}
          >
            <span>
              <span className="sonar-legend__swatch" style={{ background: colorAt(i, d) }} />
              {d.label}
            </span>
            <span className="sonar-legend__value">{formatPercent(share(d.value))}</span>
          </li>
        ))}
      </ul>

      <ChartDataTable
        caption={caption}
        columns={["Category", "Value", "Share"]}
        rows={data.map((d) => [d.label, valueFormat(d.value), formatPercent(share(d.value))])}
      />
    </div>
  );
}
