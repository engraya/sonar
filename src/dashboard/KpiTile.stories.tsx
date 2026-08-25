import type { Meta, StoryObj } from "@storybook/react";
import { KpiTile } from "./KpiTile";
import { StatGrid } from "./StatGrid";

const meta = {
  title: "Dashboard/KpiTile",
  component: KpiTile,
} satisfies Meta<typeof KpiTile>;

export default meta;
type Story = StoryObj<typeof meta>;

const spark = [3, 4, 3.5, 5, 4.2, 6, 5.5, 7];

export const Single: Story = {
  args: { label: "Gross revenue", value: "₦124.4M", delta: 0.029, sparkline: spark },
};

export const Grid: Story = {
  args: { label: "KPIs", value: "" },
  render: () => (
    <StatGrid min={2} sm={3} lg={5}>
      <KpiTile label="Gross revenue" value="₦124.4M" delta={0.029} sparkline={spark} />
      <KpiTile label="Bookings" value="5,300" delta={-0.05} sparkline={spark} />
      <KpiTile label="Avg fare" value="₦23,480" delta={0.0001} sparkline={spark} />
      <KpiTile label="Seat fill" value="83.4%" delta={0.04} sparkline={spark} />
      <KpiTile label="Refund rate" value="2.7%" delta={0.09} invertDelta sparkline={spark} />
    </StatGrid>
  ),
};
