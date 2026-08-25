import { useMemo, useRef, useState } from "react";
import { linearScale, niceTicks, buildLinePath, buildAreaPath, type Point } from "../core";
import { ChartDataTable } from "../a11y";
import { useChartDimensions } from "../hooks";
import type { NumberFormat } from "../format";

export interface AreaDatum {
  x: number | Date;
  y: number;
}

export interface AreaChartProps {
  data: AreaDatum[];
  height?: number;
  color?: string;
  /** Formats the y value (axis + tooltip). Defaults to locale number. */
  valueFormat?: NumberFormat;
  /** Formats the x value (axis + tooltip). Defaults to String / date. */
  xFormat?: (x: number | Date) => string;
  /** Overrides the auto-generated aria summary. */
  ariaLabel?: string;
  /** Caption for the hidden data table. */
  caption?: string;
  xLabel?: string;
  yLabel?: string;
}

const M = { top: 12, right: 16, bottom: 26, left: 52 };

const defaultNumber: NumberFormat = (v) => new Intl.NumberFormat().format(v);
const defaultX = (x: number | Date): string =>
  x instanceof Date ? x.toLocaleDateString(undefined, { month: "short", day: "numeric" }) : String(x);

export function AreaChart({
  data,
  height = 260,
  color = "var(--sonar-primary)",
  valueFormat = defaultNumber,
  xFormat = defaultX,
  ariaLabel,
  caption = "Chart data",
  xLabel = "X",
  yLabel = "Value",
}: AreaChartProps) {
  const { ref, width } = useChartDimensions({ height, defaultWidth: 640 });
  const svgRef = useRef<SVGSVGElement>(null);
  const [hover, setHover] = useState<number | null>(null);

  const innerW = Math.max(0, width - M.left - M.right);
  const innerH = Math.max(0, height - M.top - M.bottom);

  const model = useMemo(() => {
    const max = Math.max(1, ...data.map((d) => d.y));
    const ticks = niceTicks(0, max, 4);
    const tickMax = ticks.length ? Math.max(max, ticks[ticks.length - 1]!) : max;
    const x = linearScale([0, Math.max(1, data.length - 1)], [M.left, M.left + innerW]);
    const y = linearScale([0, tickMax], [M.top + innerH, M.top]);
    const points: Point[] = data.map((d, i) => ({ x: x(i), y: y(d.y) }));
    return {
      x,
      y,
      points,
      ticks,
      line: buildLinePath(points),
      area: buildAreaPath(points, M.top + innerH),
      total: data.reduce((s, d) => s + d.y, 0),
    };
  }, [data, innerW, innerH]);

  function onMove(e: React.PointerEvent<SVGSVGElement>) {
    const svg = svgRef.current;
    if (!svg || data.length === 0) return;
    const rect = svg.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * width;
    const ratio = (px - M.left) / Math.max(1, innerW);
    const idx = Math.max(0, Math.min(data.length - 1, Math.round(ratio * (data.length - 1))));
    setHover(idx);
  }

  const hoverDatum = hover !== null ? data[hover] : undefined;
  const hoverPoint = hover !== null ? model.points[hover] : undefined;
  const labelEvery = Math.max(1, Math.ceil(data.length / 6));

  const summary =
    ariaLabel ??
    `${yLabel} over ${data.length} points, totalling ${valueFormat(model.total)}.`;

  return (
    <div ref={ref} style={{ position: "relative", width: "100%" }}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${width} ${height}`}
        width="100%"
        preserveAspectRatio="none"
        style={{ display: "block", height: "auto", maxWidth: "100%" }}
        role="img"
        aria-label={summary}
        onPointerMove={onMove}
        onPointerLeave={() => setHover(null)}
      >
        {model.ticks.map((t) => {
          const yy = model.y(t);
          return (
            <g key={t}>
              <line x1={M.left} x2={M.left + innerW} y1={yy} y2={yy} stroke="var(--sonar-grid)" strokeWidth={1} />
              <text x={M.left - 8} y={yy} dy="0.32em" textAnchor="end" fontSize={11} fill="var(--sonar-axis)">
                {valueFormat(t)}
              </text>
            </g>
          );
        })}

        {data.map((d, i) =>
          i % labelEvery === 0 ? (
            <text key={i} x={model.x(i)} y={height - 6} textAnchor="middle" fontSize={11} fill="var(--sonar-axis)">
              {xFormat(d.x)}
            </text>
          ) : null
        )}

        <path d={model.area} fill={color} opacity={0.14} />
        <path d={model.line} fill="none" stroke={color} strokeWidth={2} strokeLinejoin="round" />

        {hoverPoint ? (
          <g>
            <line
              x1={hoverPoint.x}
              x2={hoverPoint.x}
              y1={M.top}
              y2={M.top + innerH}
              stroke="var(--sonar-axis)"
              strokeWidth={1}
              strokeDasharray="3 3"
            />
            <circle cx={hoverPoint.x} cy={hoverPoint.y} r={4} fill={color} stroke="var(--sonar-surface)" strokeWidth={2} />
          </g>
        ) : null}
      </svg>

      {hoverDatum && hoverPoint ? (
        <div className="sonar-tooltip" style={{ left: hoverPoint.x, top: 0 }} role="status">
          <div className="sonar-tooltip__title">{xFormat(hoverDatum.x)}</div>
          <div className="sonar-tooltip__value">{valueFormat(hoverDatum.y)}</div>
        </div>
      ) : null}

      <ChartDataTable
        caption={caption}
        columns={[xLabel, yLabel]}
        rows={data.map((d) => [xFormat(d.x), valueFormat(d.y)])}
      />
    </div>
  );
}
