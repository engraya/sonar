# @engraya/sonar

## 0.2.1

### Patch Changes

- 830dee2: Fix AreaChart width feedback loop: the chart's fixed-pixel SVG could prop its
  container open at the default width (so it never shrank on small screens). The
  SVG now renders with a viewBox at 100% width, and `.sonar-panel` allows itself to
  shrink (`min-width: 0`), so charts measure the true available width and stay
  responsive inside grid/flex layouts.

## 0.2.0

### Minor Changes

- c99ee5f: Initial release of the Sonar dashboard kit: accessibility-first, zero-dependency
  SVG charts (AreaChart, BarChart, DonutChart, Sparkline) where every chart ships
  an aria summary and a hidden data table, plus dashboard primitives (KpiTile,
  StatGrid, Panel, SegmentedControl), the `useChartDimensions` hook, generic
  formatters, and CSS-variable theming that pairs with @engraya/fathom-ui.
