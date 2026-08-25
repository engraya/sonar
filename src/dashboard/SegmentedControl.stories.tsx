import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { SegmentedControl } from "./SegmentedControl";

const options = [
  { label: "7D", value: "7" },
  { label: "30D", value: "30" },
  { label: "60D", value: "60" },
];

const meta = {
  title: "Dashboard/SegmentedControl",
  component: SegmentedControl,
} satisfies Meta<typeof SegmentedControl<string>>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DateRange: Story = {
  args: { options, value: "30", onChange: () => {}, ariaLabel: "Date range" },
  render: () => {
    const [value, setValue] = useState("30");
    return (
      <SegmentedControl ariaLabel="Date range" value={value} onChange={setValue} options={options} />
    );
  },
};
