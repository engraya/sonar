import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { DonutChart, type DonutDatum } from "./DonutChart";

const data: DonutDatum[] = [
  { label: "Paystack", value: 60 },
  { label: "Monnify", value: 30 },
  { label: "Nomba", value: 10 },
];

describe("DonutChart", () => {
  it("summarises the split for assistive tech", () => {
    render(<DonutChart data={data} />);
    expect(screen.getByRole("img").getAttribute("aria-label")).toMatch(/Paystack 60\.0%/);
  });

  it("renders a legend and a hidden data table", () => {
    render(<DonutChart data={data} />);
    expect(screen.getAllByText("Monnify").length).toBeGreaterThan(0);
    expect(screen.getByRole("table")).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<DonutChart data={data} />);
    expect(await axe(container, { rules: { region: { enabled: false } } })).toHaveNoViolations();
  });
});
