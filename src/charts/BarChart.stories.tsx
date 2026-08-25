import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { BarChart } from "./BarChart";
import { currencyFormatter } from "../format";

const ngn = currencyFormatter({ currency: "NGN", locale: "en-NG", compact: true });

const data = [
  { id: "lag-abj", label: "Lagos → Abuja", value: 34_600_000 },
  { id: "ph-abj", label: "Port Harcourt → Abuja", value: 15_200_000 },
  { id: "lag-enu", label: "Lagos → Enugu", value: 14_500_000 },
  { id: "kan-abj", label: "Kano → Abuja", value: 14_100_000 },
  { id: "lag-ben", label: "Lagos → Benin", value: 11_500_000 },
];

const meta = {
  title: "Charts/BarChart",
  component: BarChart,
  decorators: [(Story) => <div style={{ maxWidth: 560 }}>{Story()}</div>],
} satisfies Meta<typeof BarChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Static: Story = {
  args: { data, valueFormat: ngn },
};

export const Selectable: Story = {
  args: { data, valueFormat: ngn },
  render: () => {
    const [active, setActive] = useState<string | null>("lag-abj");
    return <BarChart data={data} valueFormat={ngn} activeId={active} onSelect={setActive} />;
  },
};
