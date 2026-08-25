import { describe, it, expect } from "vitest";
import {
  formatNumber,
  formatCompact,
  formatCurrency,
  formatPercent,
  formatDelta,
  currencyFormatter,
} from "./format";

describe("formatNumber", () => {
  it("groups thousands", () => {
    expect(formatNumber(12345, "en-US")).toBe("12,345");
  });
});

describe("formatCompact", () => {
  it("renders large numbers compactly", () => {
    expect(formatCompact(1_500_000, "en-US")).toMatch(/1\.5M/);
  });
});

describe("formatCurrency", () => {
  it("formats with the given currency and no fraction by default", () => {
    const s = formatCurrency(1234.5, { currency: "USD", locale: "en-US" });
    expect(s).toBe("$1,235");
  });

  it("supports compact notation", () => {
    const s = formatCurrency(1_500_000, { currency: "USD", locale: "en-US", compact: true });
    expect(s).toMatch(/\$1\.5M/);
  });
});

describe("formatPercent", () => {
  it("renders a fraction as a percentage", () => {
    expect(formatPercent(0.1234)).toBe("12.3%");
  });
});

describe("formatDelta", () => {
  it("prefixes positive deltas with +", () => {
    expect(formatDelta(0.12)).toBe("+12.0%");
  });
  it("uses a minus sign for negative deltas", () => {
    expect(formatDelta(-0.05)).toBe("−5.0%");
  });
  it("renders an em dash for null", () => {
    expect(formatDelta(null)).toBe("—");
  });
});

describe("currencyFormatter", () => {
  it("builds a reusable formatter", () => {
    const ngn = currencyFormatter({ currency: "NGN", locale: "en-NG" });
    expect(ngn(1000)).toMatch(/1,000/);
  });
});
