# Sonar

An **accessibility-first React dashboard kit**. Zero-dependency SVG charts where **every chart ships an aria summary and a hidden data table**, plus KPI tiles, a responsive stat grid, and filter primitives. Themeable through CSS variables; pairs with [`@engraya/fathom-ui`](https://www.npmjs.com/package/@engraya/fathom-ui).

[![CI](https://github.com/engraya/sonar/actions/workflows/ci.yml/badge.svg)](https://github.com/engraya/sonar/actions/workflows/ci.yml)

> Most chart libraries treat accessibility as an afterthought — the data lives in `<path>` elements a screen reader can't read. Sonar inverts that: the SVG is the *visual* layer, and every chart renders a real, structured `<table>` (visually hidden) so assistive tech gets the same numbers. Enforced with `jest-axe` in CI.

## Install

```bash
npm install @engraya/sonar
```

Import the stylesheet once (it defines the design tokens and component styles):

```tsx
import "@engraya/sonar/styles.css";
import { AreaChart, KpiTile, StatGrid, Panel } from "@engraya/sonar";
```

## Why it's different

- **A11y by construction.** `AreaChart`, `BarChart` and `DonutChart` each expose a concise `aria-label` summary *and* a visually-hidden data table (`ChartDataTable`). No information is trapped in pixels.
- **No charting dependency.** Charts are drawn from a small, unit-tested geometry core (`linearScale`, `niceTicks`, line/area/arc path builders). Tiny bundle, no black box.
- **Framework-CSS-agnostic theming.** Tokens are plain CSS custom properties (`--sonar-*`) that *fall back to Fathom UI's* (`--fathom-*`) when present — so used together they share one theme, and used alone Sonar brings its own light/dark palette. No Tailwind required.
- **Responsive.** Charts measure their container via `useChartDimensions` (ResizeObserver) and reflow; the `StatGrid` is responsive by breakpoint.
- **Tree-shakeable** ESM + CJS with type definitions.

## Components

| Component | What it does |
| --- | --- |
| `AreaChart` | Time/'category' area chart with hover tooltip, gridlines, and a hidden data table. `valueFormat` / `xFormat` control units. |
| `BarChart` | Horizontal bars; pass `onSelect` to turn each bar into an `aria-pressed` button for cross-filtering. |
| `DonutChart` | Proportional donut with an interactive legend and center total. |
| `Sparkline` | Compact inline trend line for KPI tiles. |
| `KpiTile` | Label, big value, period-over-period delta (▲/▼, color-coded, `invertDelta` for "lower is better") and a sparkline. |
| `StatGrid` | Responsive grid for KPI tiles (columns per breakpoint). |
| `Panel` | Titled surface for grouping a chart or table. |
| `SegmentedControl` | Compact single-select for filters (typed, generic). |
| `ChartDataTable` / `VisuallyHidden` | The a11y primitives every chart is built on. |
| `useChartDimensions` | ResizeObserver hook for responsive chart sizing. |

## Example

```tsx
import "@engraya/sonar/styles.css";
import { Panel, AreaChart, currencyFormatter } from "@engraya/sonar";

const ngn = currencyFormatter({ currency: "NGN", locale: "en-NG", compact: true });

export function Revenue({ data }: { data: { x: Date; y: number }[] }) {
  return (
    <Panel title="Gross revenue" subtitle="Successful payments per day">
      <AreaChart data={data} yLabel="Revenue" valueFormat={ngn} caption="Daily revenue" />
    </Panel>
  );
}
```

## Theming

Tokens are CSS variables. Light is the default; dark applies from the OS preference, and you can force either with `data-theme` on the root:

```html
<html data-theme="dark"> … </html>
```

Override any token in your own CSS:

```css
:root {
  --sonar-primary: #0d7d72;
  --sonar-radius: 0.75rem;
  --sonar-series-1: #2563eb;
}
```

## Development

```bash
npm run storybook       # component workshop at :6006
npm run test            # Vitest + Testing Library + jest-axe
npm run typecheck
npm run build           # tsup -> dist (ESM + CJS + d.ts + styles.css)
```

## Testing & accessibility

Every chart and dashboard component has unit/interaction tests plus an automated accessibility assertion via `jest-axe` (`expect(await axe(container)).toHaveNoViolations()`). The geometry core is tested directly.

## Releasing

Versioning is managed with [Changesets](https://github.com/changesets/changesets):

```bash
npx changeset          # describe the change
npx changeset version  # bump + changelog
npm run build && npm run release
```

## License

MIT © Ahmad Yakubu Ahmad
