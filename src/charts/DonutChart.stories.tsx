import type { Meta, StoryObj } from "@storybook/react";
import { DonutChart } from "./DonutChart";
import { currencyFormatter } from "../format";

const meta = {
  title: "Charts/DonutChart",
  component: DonutChart,
  decorators: [(Story) => <div style={{ maxWidth: 420 }}>{Story()}</div>],
} satisfies Meta<typeof DonutChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ProviderMix: Story = {
  args: {
    data: [
      { label: "Paystack", value: 62_000_000 },
      { label: "Monnify", value: 24_000_000 },
      { label: "Nomba", value: 14_000_000 },
    ],
    valueFormat: currencyFormatter({ currency: "NGN", locale: "en-NG", compact: true }),
  },
};
