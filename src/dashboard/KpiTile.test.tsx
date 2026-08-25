import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { KpiTile } from "./KpiTile";

describe("KpiTile", () => {
  it("renders the label and value", () => {
    render(<KpiTile label="Revenue" value="$120K" />);
    expect(screen.getByText("Revenue")).toBeInTheDocument();
    expect(screen.getByText("$120K")).toBeInTheDocument();
  });

  it("shows a positive delta as ▲ with a + sign", () => {
    render(<KpiTile label="Revenue" value="1" delta={0.12} />);
    expect(screen.getByText(/▲ \+12\.0%/)).toBeInTheDocument();
  });

  it("shows a negative delta as ▼", () => {
    render(<KpiTile label="Revenue" value="1" delta={-0.08} />);
    expect(screen.getByText(/▼ −8\.0%/)).toBeInTheDocument();
  });

  it("treats a near-zero delta as flat", () => {
    render(<KpiTile label="Revenue" value="1" delta={0.0001} />);
    expect(screen.getByText(/• 0\.0%/)).toBeInTheDocument();
  });

  it("renders an em dash when delta is null", () => {
    render(<KpiTile label="Revenue" value="1" delta={null} />);
    expect(screen.getByText("—")).toBeInTheDocument();
  });

  it("inverts tone semantics when invertDelta is set", () => {
    // A rising error rate is bad -> should carry the negative tone class.
    const { container } = render(<KpiTile label="Error rate" value="3%" delta={0.2} invertDelta />);
    expect(container.querySelector(".sonar-kpi__delta--neg")).not.toBeNull();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <KpiTile label="Revenue" value="$120K" delta={0.12} sparkline={[1, 2, 3, 2, 4]} />
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
