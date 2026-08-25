import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { useChartDimensions } from "./useChartDimensions";

describe("useChartDimensions", () => {
  it("returns the default width and a ref before measurement", () => {
    const { result } = renderHook(() => useChartDimensions({ height: 200, defaultWidth: 500 }));
    expect(result.current.width).toBe(500);
    expect(result.current.height).toBe(200);
    expect(result.current.ref).toBeDefined();
  });

  it("derives height from aspectRatio when provided", () => {
    const { result } = renderHook(() => useChartDimensions({ aspectRatio: 2, defaultWidth: 600 }));
    expect(result.current.height).toBe(300); // 600 / 2
  });
});
