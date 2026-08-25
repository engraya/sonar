import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { AreaChart, type AreaDatum } from "./AreaChart";

const data: AreaDatum[] = Array.from({ length: 12 }, (_, i) => ({ x: i, y: 100 + i * 10 }));

describe("AreaChart", () => {
  it("renders an accessible image with a summary", () => {
    render(<AreaChart data={data} yLabel="Revenue" valueFormat={(v) => `$${v}`} />);
    const img = screen.getByRole("img");
    expect(img.getAttribute("aria-label")).toMatch(/Revenue over 12 points/);
  });

  it("exposes the data as a hidden table", () => {
    render(<AreaChart data={data} caption="Daily revenue" xLabel="Day" yLabel="Revenue" />);
    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.getAllByRole("row")).toHaveLength(13); // 12 rows + header
    expect(screen.getByText("Daily revenue")).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<AreaChart data={data} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
