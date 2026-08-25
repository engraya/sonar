---
"@engraya/sonar": patch
---

Fix AreaChart width feedback loop: the chart's fixed-pixel SVG could prop its
container open at the default width (so it never shrank on small screens). The
SVG now renders with a viewBox at 100% width, and `.sonar-panel` allows itself to
shrink (`min-width: 0`), so charts measure the true available width and stay
responsive inside grid/flex layouts.
