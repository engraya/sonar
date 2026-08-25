import type { Meta, StoryObj } from "@storybook/react";
import { Panel } from "./Panel";
import { DonutChart } from "../charts/DonutChart";

const meta = {
  title: "Dashboard/Panel",
  component: Panel,
  decorators: [(Story) => <div style={{ maxWidth: 480 }}>{Story()}</div>],
} satisfies Meta<typeof Panel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithChart: Story = {
  args: {
    title: "Payment provider mix",
    subtitle: "Share of successful revenue",
    children: (
      <DonutChart
        data={[
          { label: "Paystack", value: 62 },
          { label: "Monnify", value: 24 },
          { label: "Nomba", value: 14 },
        ]}
      />
    ),
  },
};
