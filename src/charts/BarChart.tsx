import { formatNumber, type NumberFormat } from "../format";

export interface BarDatum {
  id?: string;
  label: string;
  value: number;
  color?: string;
}

export interface BarChartProps {
  data: BarDatum[];
  /** Max rows to render (data should be pre-sorted). */
  max?: number;
  /** Highlighted row id. */
  activeId?: string | null;
  /** When provided, each bar becomes a button that toggles selection. */
  onSelect?: (id: string | null) => void;
  valueFormat?: NumberFormat;
  emptyMessage?: string;
}

/**
 * Horizontal bars built from DOM elements (not SVG) so labels are natively
 * selectable and, when `onSelect` is given, each bar is a real button with
 * `aria-pressed` — ideal for cross-filtering a dashboard.
 */
export function BarChart({
  data,
  max = 8,
  activeId = null,
  onSelect,
  valueFormat = (v) => formatNumber(v),
  emptyMessage = "No data.",
}: BarChartProps) {
  const shown = data.slice(0, max);
  const peak = Math.max(1, ...shown.map((d) => d.value));

  if (shown.length === 0) {
    return <p className="sonar-empty">{emptyMessage}</p>;
  }

  return (
    <ul className="sonar-bars">
      {shown.map((d, i) => {
        const id = d.id ?? d.label;
        const isActive = activeId === id;
        const width = `${Math.max(3, (d.value / peak) * 100)}%`;
        const fill = d.color ? { background: d.color } : undefined;

        const inner = (
          <>
            <span className="sonar-bar__label">{d.label}</span>
            <span className="sonar-bar__track">
              <span className="sonar-bar__fill" style={{ width, ...fill }} />
            </span>
            <span className="sonar-bar__value">{valueFormat(d.value)}</span>
          </>
        );

        return (
          <li key={id}>
            {onSelect ? (
              <button
                type="button"
                className="sonar-bar"
                aria-pressed={isActive}
                onClick={() => onSelect(isActive ? null : id)}
              >
                {inner}
              </button>
            ) : (
              <div className="sonar-bar" data-index={i}>
                {inner}
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
