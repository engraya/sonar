import { useMemo } from "react";
import { linearScale, buildLinePath, buildAreaPath, type Point } from "../core";

export interface SparklineProps {
  values: number[];
  width?: number;
  height?: number;
  color?: string;
  /** When provided, the sparkline is exposed as an image with this label. */
  ariaLabel?: string;
}

export function Sparkline({
  values,
  width = 96,
  height = 28,
  color = "var(--sonar-primary)",
  ariaLabel,
}: SparklineProps) {
  const paths = useMemo(() => {
    if (values.length < 2) return null;
    const max = Math.max(...values);
    const min = Math.min(...values);
    const x = linearScale([0, values.length - 1], [1, width - 1]);
    const y = linearScale([min, max], [height - 2, 2]);
    const pts: Point[] = values.map((v, i) => ({ x: x(i), y: y(v) }));
    return { line: buildLinePath(pts), area: buildAreaPath(pts, height) };
  }, [values, width, height]);

  if (!paths) return null;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      role={ariaLabel ? "img" : "presentation"}
      aria-label={ariaLabel}
      aria-hidden={ariaLabel ? undefined : true}
    >
      <path d={paths.area} fill={color} opacity={0.12} />
      <path
        d={paths.line}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}
