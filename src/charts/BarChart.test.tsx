import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { BarChart, type BarDatum } from "./BarChart";

const data: BarDatum[] = [
  { id: "a", label: "Lagos → Abuja", value: 100 },
  { id: "b", label: "Lagos → Ibadan", value: 50 },
];

describe("BarChart", () => {
  it("renders static rows without onSelect", () => {
    render(<BarChart data={data} />);
    expect(screen.getByText("Lagos → Abuja")).toBeInTheDocument();
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("renders selectable buttons and toggles selection", async () => {
    const onSelect = vi.fn();
    render(<BarChart data={data} onSelect={onSelect} />);
    await userEvent.click(screen.getByRole("button", { name: /Lagos → Abuja/ }));
    expect(onSelect).toHaveBeenCalledWith("a");
  });

  it("clears selection when the active bar is clicked again", async () => {
    const onSelect = vi.fn();
    render(<BarChart data={data} activeId="a" onSelect={onSelect} />);
    const active = screen.getByRole("button", { name: /Lagos → Abuja/ });
    expect(active).toHaveAttribute("aria-pressed", "true");
    await userEvent.click(active);
    expect(onSelect).toHaveBeenCalledWith(null);
  });

  it("shows an empty state", () => {
    render(<BarChart data={[]} emptyMessage="Nothing here" />);
    expect(screen.getByText("Nothing here")).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<BarChart data={data} activeId="a" onSelect={() => {}} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
