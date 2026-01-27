"use client";

import React from "react";
import {
  Box,
  Grid, // Using Grid2 for better layout handling in latest MUI
  Paper,
  Typography,
  Container,
  Card,
  CardContent,
} from "@mui/material";
import { ResponsiveBar } from "@nivo/bar";
import { ResponsivePie } from "@nivo/pie";
import { ResponsiveSunburst } from "@nivo/sunburst";
import { ResponsiveCalendar } from "@nivo/calendar";
import AnalyticsHeader from "@/app/components/analytics/AnalyticsHeader";

// --- MOCK DATA ---
/* =========================
   SUPPLIER AGGREGATE DATA
========================= */

export const supplierData = [
  { supplier: "Vardhman", material: 1250000, transport: 45000, bales: 450 },
  { supplier: "Arvind", material: 980000, transport: 32000, bales: 310 },
  { supplier: "Raymond", material: 2100000, transport: 85000, bales: 680 },
  { supplier: "Reliance", material: 1550000, transport: 22000, bales: 520 },
  { supplier: "Welspun", material: 450000, transport: 18000, bales: 140 },
  { supplier: "Siyaram", material: 720000, transport: 25000, bales: 210 },
  { supplier: "Luthai", material: 3100000, transport: 120000, bales: 890 },
  { supplier: "Grasim", material: 1650000, transport: 60000, bales: 530 },
  { supplier: "Bombay Dyeing", material: 880000, transport: 31000, bales: 290 },
  { supplier: "Trident", material: 1340000, transport: 47000, bales: 460 },
  { supplier: "Indo Count", material: 760000, transport: 28000, bales: 240 },
  { supplier: "Texmaco", material: 590000, transport: 20000, bales: 180 },
  { supplier: "Himatsingka", material: 990000, transport: 41000, bales: 330 },
  { supplier: "Alok Industries", material: 1880000, transport: 74000, bales: 620 },
  { supplier: "Shahi Exports", material: 1420000, transport: 53000, bales: 510 },
];

/* =========================
   SUPPLIER BOTTLENECK DATA
========================= */

export const bottleneckData = [
  { supplier: "Luthai", avgLeadTime: 15.2 },
  { supplier: "Alok Industries", avgLeadTime: 14.7 },
  { supplier: "Raymond", avgLeadTime: 12.5 },
  { supplier: "Himatsingka", avgLeadTime: 10.2 },
  { supplier: "Bombay Dyeing", avgLeadTime: 9.6 },
  { supplier: "Siyaram", avgLeadTime: 8.9 },
  { supplier: "Shahi Exports", avgLeadTime: 7.9 },
  { supplier: "Grasim", avgLeadTime: 7.3 },
  { supplier: "Welspun", avgLeadTime: 6.8 },
  { supplier: "Indo Count", avgLeadTime: 6.1 },
  { supplier: "Trident", avgLeadTime: 5.9 },
  { supplier: "Vardhman", avgLeadTime: 5.2 },
  { supplier: "Arvind", avgLeadTime: 4.1 },
  { supplier: "Texmaco", avgLeadTime: 3.5 },
  { supplier: "Reliance", avgLeadTime: 2.4 },
];

/* =========================
   TRANSPORT DISTRIBUTION
========================= */

export const transportPieData = [
  { id: "Domestic Trucking", label: "Road (Full Load)", value: 4500, color: "#61cdbb" },
  { id: "Rail Freight", label: "Rail (Interstate)", value: 2800, color: "#97e3d5" },
  { id: "Ocean Freight", label: "Sea (Import)", value: 3400, color: "#f47560" },
  { id: "Air Express", label: "Air (Urgent)", value: 1200, color: "#e8c1a0" },
  { id: "Cross Border Trucking", label: "International Road", value: 1120, color: "#6a4c93" },
  { id: "Last Mile", label: "Local Delivery", value: 950, color: "#f1e15b" },
  { id: "Courier", label: "Courier & Parcel", value: 640, color: "#d45087" },
];

/* =========================
   DEEP INVENTORY HIERARCHY
========================= */

export const sunburstData = {
  name: "fabric_inventory",
  children: [
    {
      name: "Cotton",
      children: [
        {
          name: "40s Count",
          children: [
            { name: "Combed", value: 450 },
            { name: "Carded", value: 300 },
            { name: "Compact", value: 220 },
          ],
        },
        {
          name: "60s Count",
          children: [
            { name: "Premium", value: 520 },
            { name: "Standard", value: 310 },
          ],
        },
        {
          name: "Organic Cotton",
          children: [
            { name: "GOTS Certified", value: 260 },
            { name: "BCI Cotton", value: 190 },
          ],
        },
        { name: "Lycra Cotton", value: 400 },
      ],
    },

    {
      name: "Polyester",
      children: [
        {
          name: "Recycled",
          children: [
            { name: "Ocean Bound", value: 300 },
            { name: "Post-Consumer", value: 500 },
            { name: "Industrial Scrap", value: 210 },
          ],
        },
        {
          name: "Virgin Polyester",
          children: [
            { name: "High Tenacity", value: 350 },
            { name: "Standard", value: 270 },
          ],
        },
        {
          name: "Poly Blends",
          children: [
            { name: "Cotton Blend", value: 380 },
            { name: "Viscose Blend", value: 290 },
          ],
        },
      ],
    },

    {
      name: "Luxury",
      children: [
        {
          name: "Silk",
          children: [
            { name: "Mulberry", value: 180 },
            { name: "Tussar", value: 120 },
            { name: "Eri Silk", value: 90 },
          ],
        },
        {
          name: "Wool",
          children: [
            { name: "Merino", value: 210 },
            { name: "Cashmere", value: 80 },
          ],
        },
        {
          name: "Linen",
          children: [
            { name: "Belgian Linen", value: 190 },
            { name: "European Flax", value: 120 },
          ],
        },
      ],
    },

    {
      name: "Technical Textiles",
      children: [
        {
          name: "Industrial",
          children: [
            { name: "Kevlar Blend", value: 90 },
            { name: "Fire Retardant", value: 130 },
          ],
        },
        {
          name: "Medical",
          children: [
            { name: "Surgical Fabric", value: 160 },
            { name: "Disposable Nonwoven", value: 240 },
          ],
        },
        {
          name: "Sportswear",
          children: [
            { name: "Moisture Wicking", value: 300 },
            { name: "Compression Knit", value: 190 },
          ],
        },
      ],
    },
  ],
};

/* =========================
   YEARLY CALENDAR DATA
========================= */

export const generateYearlyCalendarData = () => {
  const data: { day: string; value: number }[] = [];
  const start = new Date("2025-06-01");
  const end = new Date("2026-06-01");

  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const isWeekend = d.getDay() === 0 || d.getDay() === 6;

    const baseValue = isWeekend
      ? Math.floor(Math.random() * 50)
      : Math.floor(Math.random() * 350) + 50;

    const month = d.getMonth();
    const seasonalMultiplier = month === 9 || month === 2 ? 1.5 : 1;

    if (baseValue > 20) {
      data.push({
        day: d.toISOString().split("T")[0],
        value: Math.floor(baseValue * seasonalMultiplier),
      });
    }
  }

  return data;
};

export const calendarData = generateYearlyCalendarData();

// Hover constant to keep effects consistent
const paperHoverStyle = {
  p: 3,
  height: 450,
  borderRadius: 2,
  transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
  position: "relative",
  zIndex: 1,
  "&:hover": {
    transform: "scale(1.01)",
    zIndex: 10,
    boxShadow: "0px 10px 30px rgba(0,0,0,0.12)",
  },
};

const StatCard = ({
  title,
  value,
  color,
}: {
  title: string;
  value: string;
  color: string;
}) => (
  <Card
    sx={{
      height: "100%",
      borderLeft: `6px solid ${color}`,
      transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
      position: "relative",
      zIndex: 1,
      "&:hover": {
        transform: "scale(1.05)",
        zIndex: 10,
        boxShadow: 4,
      },
    }}
  >
    <CardContent>
      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
        {title}
      </Typography>
      <Typography variant="h5" fontWeight="bold">
        {value}
      </Typography>
    </CardContent>
  </Card>
);

export default function InvoiceAnalytics() {
  const totalMaterial = supplierData.reduce(
    (acc, curr) => acc + curr.material,
    0,
  );
  const totalTransport = supplierData.reduce(
    (acc, curr) => acc + curr.transport,
    0,
  );
  const totalBales = supplierData.reduce((acc, curr) => acc + curr.bales, 0);

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <AnalyticsHeader
        title="Invoice Analytics"
        subtitle="Detailed breakdown of fabric categories and delivery schedules"
      />

      {/* STATS ROW */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 3 }}>
          <StatCard
            title="Total Material Value"
            value={`₹${totalMaterial.toLocaleString()}`}
            color="#61cdbb"
          />
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <StatCard
            title="Total Transport Cost"
            value={`₹${totalTransport.toLocaleString()}`}
            color="#f47560"
          />
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <StatCard
            title="Total Bales Received"
            value={totalBales.toString()}
            color="#e8c1a0"
          />
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <StatCard
            title="Total Bales Received"
            value={totalBales.toString()}
            color="#e8c1a0"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* SUNBURST: CATEGORY HIERARCHY */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={paperHoverStyle}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Category Hierarchy
            </Typography>
            <Box sx={{ height: 350 }}>
              <ResponsiveSunburst
                data={sunburstData}
                id="name"
                value="value"
                arcLabel={(d) => `${d.id}`}
                margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
                arcLabelsSkipAngle={8}
                enableArcLabels={true}
                colors={{ scheme: "nivo" }}
                arcLabelsTextColor={{
                  from: "color",
                  modifiers: [["darker", 2]],
                }}
              />
            </Box>
          </Paper>
        </Grid>

        {/* PIE: TRANSPORT DISTRIBUTION */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={paperHoverStyle}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Transport Share
            </Typography>
            <Box sx={{ height: 350 }}>
              <ResponsivePie
                data={transportPieData}
                margin={{ top: 40, right: 40, bottom: 40, left: 40 }}
                innerRadius={0.6}
                padAngle={0.7}
                cornerRadius={3}
                activeOuterRadiusOffset={8}
                colors={{ datum: "data.color" }}
                enableArcLinkLabels={true}
                arcLinkLabelsTextColor="#333333"
                arcLabelsSkipAngle={10}
              />
            </Box>
          </Paper>
        </Grid>

        {/* BAR: SUPPLIER LEAD TIME (BOTTLENECK) */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={paperHoverStyle}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Supplier Bottlenecks
            </Typography>
            <Box sx={{ height: 350 }}>
              <ResponsiveBar
                data={bottleneckData}
                keys={["avgLeadTime"]}
                indexBy="supplier"
                layout="horizontal"
                margin={{ top: 5, right: 30, bottom: 50, left: 80 }}
                padding={0.3}
                colors={({ data }) =>
                  data.avgLeadTime > 6 ? "#f47560" : "#61cdbb"
                }
                axisBottom={{
                  legend: "Avg Days (Inv to Rec)",
                  legendPosition: "middle",
                  legendOffset: 40,
                }}
                enableLabel={true}
                label={(d) => `${d.value}d`}
              />
            </Box>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          <Paper sx={{ p: 3, height: 500, borderRadius: 2 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Supplier Cost Breakdown
            </Typography>

            <Box sx={{ height: 400 }}>
              {(() => {
                const supplierCount = supplierData.length;
                const labelRotation =
                  supplierCount > 10 ? -45 : supplierCount > 6 ? -30 : 0;

                return (
                  <ResponsiveBar
                    data={supplierData}
                    keys={["material", "transport"]}
                    indexBy="supplier"
                    margin={{ top: 20, right: 130, bottom: 60, left: 80 }}
                    padding={0.3}
                    colors={["#61cdbb", "#f47560"]}
                    enableLabel={false} // removes values on bars
                    axisLeft={{
                      legend: "Amount (INR)",
                      legendPosition: "middle",
                      legendOffset: -60,
                    }}
                    axisBottom={{
                      tickRotation: labelRotation,
                      legend: "Supplier",
                      legendPosition: "middle",
                      legendOffset: 40,
                      format: (value) =>
                        value.length > 12 ? `${value.slice(0, 12)}…` : value,
                    }}
                    legends={[
                      {
                        dataFrom: "keys",
                        anchor: "bottom-right",
                        direction: "column",
                        translateX: 120,
                        itemWidth: 100,
                        itemHeight: 20,
                        symbolSize: 20,
                      },
                    ]}
                  />
                );
              })()}
            </Box>
          </Paper>
        </Grid>

        {/* CALENDAR HEATMAP */}
        <Grid size={{ xs: 12 }}>
          <Paper sx={{ ...paperHoverStyle, height: 450 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Bale Arrival Intensity
            </Typography>
            <Box sx={{ height: 350 }}>
              <ResponsiveCalendar
                data={calendarData}
                from="2025-06-01"
                to="2026-06-01"
                emptyColor="#eeeeee"
                colors={["#61cdbb", "#97e3d5", "#e8c1a0", "#f47560"]}
                margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                yearSpacing={40}
                monthBorderColor="#ffffff"
                dayBorderWidth={2}
                dayBorderColor="#ffffff"
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
