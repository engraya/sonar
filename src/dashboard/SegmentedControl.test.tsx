import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { SegmentedControl } from "./SegmentedControl";

const options = [
  { label: "7D", value: "7" },
  { label: "30D", value: "30" },
  { label: "60D", value: "60" },
];

describe("SegmentedControl", () => {
  it("marks the selected option as pressed", () => {
    render(<SegmentedControl options={options} value="30" onChange={() => {}} ariaLabel="Range" />);
    expect(screen.getByRole("button", { name: "30D" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "7D" })).toHaveAttribute("aria-pressed", "false");
  });

  it("calls onChange with the chosen value", async () => {
    const onChange = vi.fn();
    render(<SegmentedControl options={options} value="30" onChange={onChange} ariaLabel="Range" />);
    await userEvent.click(screen.getByRole("button", { name: "60D" }));
    expect(onChange).toHaveBeenCalledWith("60");
  });

  it("exposes an accessible group label", () => {
    render(<SegmentedControl options={options} value="7" onChange={() => {}} ariaLabel="Date range" />);
    expect(screen.getByRole("group", { name: "Date range" })).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <SegmentedControl options={options} value="30" onChange={() => {}} ariaLabel="Range" />
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
