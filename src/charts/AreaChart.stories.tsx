import type { Meta, StoryObj } from "@storybook/react";
import { AreaChart } from "./AreaChart";
import { currencyFormatter } from "../format";

const day = 86_400_000;
const start = Date.now() - 29 * day;
const data = Array.from({ length: 30 }, (_, i) => ({
  x: new Date(start + i * day),
  y: 2_000_000 + Math.round(Math.abs(Math.sin(i / 3)) * 4_000_000),
}));

const meta = {
  title: "Charts/AreaChart",
  component: AreaChart,
  parameters: { layout: "padded" },
  decorators: [(Story) => <div style={{ maxWidth: 760 }}>{Story()}</div>],
} satisfies Meta<typeof AreaChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Revenue: Story = {
  args: {
    data,
    yLabel: "Revenue",
    xLabel: "Date",
    caption: "Daily revenue",
    valueFormat: currencyFormatter({ currency: "NGN", locale: "en-NG", compact: true }),
  },
};
