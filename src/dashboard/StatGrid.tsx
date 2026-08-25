import type { CSSProperties, ReactNode } from "react";
import { clsx } from "clsx";

export interface StatGridProps {
  children: ReactNode;
  /** Columns at base / >=640px / >=1024px. */
  min?: number;
  sm?: number;
  lg?: number;
  className?: string;
}

/** Responsive grid for KPI tiles (or any equal-width cards). */
export function StatGrid({ children, min = 1, sm = 3, lg = 5, className }: StatGridProps) {
  const style = {
    "--sonar-grid-min": min,
    "--sonar-grid-sm": sm,
    "--sonar-grid-lg": lg,
  } as CSSProperties;
  return (
    <div className={clsx("sonar-grid", className)} style={style}>
      {children}
    </div>
  );
}
