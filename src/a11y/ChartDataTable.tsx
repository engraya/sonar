import { VisuallyHidden } from "./VisuallyHidden";

export interface ChartDataTableProps {
  caption: string;
  columns: readonly string[];
  rows: ReadonlyArray<ReadonlyArray<string | number>>;
}

/**
 * The accessibility backbone of every Sonar chart: a visually-hidden but fully
 * structured data table. Sighted users see the SVG; screen-reader users get the
 * same numbers in a real table. Charts render this alongside their SVG so the
 * information is never locked inside pixels.
 */
export function ChartDataTable({ caption, columns, rows }: ChartDataTableProps) {
  return (
    <VisuallyHidden>
      <table>
        <caption>{caption}</caption>
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c} scope="col">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td key={j}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </VisuallyHidden>
  );
}
