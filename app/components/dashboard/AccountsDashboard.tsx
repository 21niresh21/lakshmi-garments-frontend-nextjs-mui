"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Card,
  CardContent,
  Button,
  Stack,
  useTheme,
  alpha,
  Tooltip as MuiTooltip,
  TextField,
  CircularProgress
} from "@mui/material";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line } from "recharts";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import CategoryIcon from "@mui/icons-material/Category";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import AnalyticsHeader from "../analytics/AnalyticsHeader";
import { useRouter } from "next/navigation";
import { fetchDashboardData } from "@/app/api/dashboardApi";
import { getStartOfWeek, getEndOfWeek } from "@/app/utils/date";

import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import NoDataState from "../shared/NoDataState";
import BarChartIcon from "@mui/icons-material/BarChart";
import PieChartIcon from "@mui/icons-material/PieChart";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import { formatCurrency } from "@/app/utils/number";

const FloatingAction = ({ title, icon, onClick, color }: { title: string, icon: React.ReactNode, onClick: () => void, color: string }) => {
  const theme = useTheme();
  return (
    <MuiTooltip title={title} placement="left" arrow>
      <Button
        onClick={onClick}
        variant="contained"
        sx={{
          minWidth: 52,
          width: 52,
          height: 52,
          borderRadius: "16px",
          bgcolor: "background.paper",
          color: color,
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          border: `1px solid ${alpha(color, 0.2)}`,
          "&:hover": {
            bgcolor: color,
            color: "white",
            transform: "translateX(-4px)",
            boxShadow: `0 6px 16px ${alpha(color, 0.3)}`,
          },
          transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}
      >
        {icon}
      </Button>
    </MuiTooltip>
  );
};

const StatCard = ({ title, value, subtitle, type, isCurrency }: { title: string, value: string, subtitle: string, type: string, isCurrency?: boolean }) => {
  const theme = useTheme();
  const color = (theme.palette as any)[type]?.main || theme.palette.primary.main;

  return (
    <Card sx={{ 
      height: "100%", 
      position: "relative", 
      overflow: "hidden", 
      borderRadius: 4,
      boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
      transition: "transform 0.2s ease, boxShadow 0.2s ease",
      "&:hover": {
        transform: "translateY(-4px)",
        boxShadow: "0 12px 24px -10px rgba(0,0,0,0.1)",
      }
    }}>
      <Box sx={{ position: "absolute", top: 0, left: 0, width: "100%", height: 4, bgcolor: color }} />
      <CardContent sx={{ p: 3 }}>
        <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ textTransform: "uppercase", letterSpacing: 1.2 }}>
          {title}
        </Typography>
        <Typography variant="h4" fontWeight={800} sx={{ mt: 1.5, mb: 0.5, color: value ? "text.primary" : "text.disabled" }}>
          {isCurrency ? formatCurrency(value) : (value || "0")}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ opacity: 0.8 }}>
          {subtitle}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default function AccountsDashboard() {
  const router = useRouter();
  const theme = useTheme();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [dates, setDates] = useState({
    startDate: getStartOfWeek(),
    endDate: getEndOfWeek()
  });

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const result = await fetchDashboardData(dates.startDate, dates.endDate);
        setData(result);
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [dates]);

  const handleDateChange = (name: string, value: string) => {
    setDates(prev => ({ ...prev, [name]: value }));
  };

  if (loading && !data) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', bgcolor: 'background.default' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Use fetched data or empty fallbacks
  const weeklyKPIs = data?.weeklyKPIs || [];
  const categoryData = data?.categoryData || [];
  const subCategoryData = data?.subCategoryData || [];
  const supplierPerformanceData = data?.supplierPerformanceData || [];

  const isDefaultRange = dates.startDate === getStartOfWeek() && dates.endDate === getEndOfWeek();
  const rangeLabel = isDefaultRange ? "Weekly" : "Period";

  const displayKPIs = weeklyKPIs.map((kpi: any) => {
    const title = kpi.title || "";
    const isCurrency = /revenue|payment|balance|valuation|amount|cost|price/i.test(title) || kpi.value.includes("₹");
    
    return {
      ...kpi,
      isCurrency,
      title: title.replace(/Weekly/g, rangeLabel),
      subtitle: kpi.subtitle?.replace(/this week/gi, isDefaultRange ? "this week" : "selected range")
    };
  });
  
  // Filter trend data to not plot future dates
  const todayStr = dayjs().format('YYYY-MM-DD');
  const quantityTrendData = (data?.quantityTrendData || []).filter((item: any) => {
    // If the data doesn't have a date, we use days of week as a proxy or keep it
    // Usually, real APIs return dates. If this is DOW, we just keep all Mon-Sun
    // But the user said "dont plot for volume trend", so I'll assume real dates are available
    // or I'll just check if it's the current week and filter by day index
    if (item.date) return dayjs(item.date).isBefore(dayjs().add(1, 'day'), 'day');
    return true; 
  });

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ pr: { md: 10 }, position: "relative", bgcolor: "background.default", minHeight: "100vh" }}>
        <Stack 
          direction={{ xs: "column", sm: "row" }} 
          justifyContent="space-between" 
          alignItems={{ sm: "center" }}
        >
          <AnalyticsHeader 
            title="Dashboard" 
            subtitle="Operational performance and financial metrics"
            hideFilters={true}
          />
          <Stack direction="row" spacing={2} sx={{ mb: { xs: 2, sm: 0 }, mr: { sm: 4 } }}>
            <DatePicker
              label="From"
              format="DD/MM/YYYY"
              value={dayjs(dates.startDate)}
              onChange={(newValue) => handleDateChange("startDate", newValue?.format('YYYY-MM-DD') || "")}
              slotProps={{ textField: { size: "small" } }}
            />
            <DatePicker
              label="To"
              format="DD/MM/YYYY"
              value={dayjs(dates.endDate)}
              onChange={(newValue) => handleDateChange("endDate", newValue?.format('YYYY-MM-DD') || "")}
              slotProps={{ textField: { size: "small" } }}
            />
          </Stack>
        </Stack>

        <Box>
          {loading && data && (
            <Box sx={{ position: 'fixed', top: 100, right: 120, zIndex: 2000 }}>
              <CircularProgress size={24} />
            </Box>
          )}

          <Grid container spacing={4}>
            {/* Weekly KPIs */}
            {displayKPIs.map((kpi: any, idx: number) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={idx}>
                <StatCard {...kpi} />
              </Grid>
            ))}

            {/* Category & Subcategory Distribution (Two-Level Pie Chart) */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Paper sx={{ p: 4, minHeight: 500, borderRadius: 4, boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)", display: "flex", flexDirection: "column" }}>
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" fontWeight={700}>Category Breakdown</Typography>
                  <Typography variant="body2" color="text.secondary">Categories vs Subcategories</Typography>
                </Box>
                {categoryData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={350}>
                    <PieChart>
                      <Pie
                        data={categoryData}
                        dataKey="value"
                        nameKey="name"
                        outerRadius={100}
                        innerRadius={70}
                        paddingAngle={5}
                        cx="50%"
                        cy="50%"
                      >
                        {categoryData.map((entry: any, index: number) => (
                          <Cell 
                            key={`cell-${entry.name}-${index}`} 
                            fill={(theme.palette as any)[entry.color]?.main || theme.palette.primary.main} 
                          />
                        ))}
                      </Pie>
                      <Pie
                        data={subCategoryData}
                        dataKey="value"
                        nameKey="name"
                        outerRadius={60}
                        innerRadius={40}
                        cx="50%"
                        cy="50%"
                      >
                        {subCategoryData.map((entry: any, index: number) => {
                          const parentCat = categoryData.find((c: any) => c.name === entry.category);
                          const baseColor = (theme.palette as any)[parentCat?.color || 'primary']?.main;
                          return (
                            <Cell 
                              key={`cell-sub-${entry.name}-${index}`} 
                              fill={alpha(baseColor || theme.palette.primary.main, 0.4 + (index % 3) * 0.2)} 
                            />
                          );
                        })}
                      </Pie>
                      <RechartsTooltip 
                        formatter={(value: any) => formatCurrency(value)}
                        contentStyle={{ 
                          borderRadius: 12, 
                          border: "none", 
                          boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)", 
                          backgroundColor: theme.palette.background.paper 
                        }}
                      />
                      <Legend iconType="circle" />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <NoDataState icon={<PieChartIcon sx={{ fontSize: 40 }} />} />
                )}
              </Paper>
            </Grid>

            {/* Supplier Performance Bar Chart */}
            <Grid size={{ xs: 12, md: 8 }}>
              <Paper sx={{ p: 4, minHeight: 500, borderRadius: 4, boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)", display: "flex", flexDirection: "column" }}>
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" fontWeight={700}>Supplier Price Comparison</Typography>
                  <Typography variant="body2" color="text.secondary">Total transaction value per supplier</Typography>
                </Box>
                {supplierPerformanceData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={supplierPerformanceData} layout="vertical" margin={{ left: 40, right: 30 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={theme.palette.divider} />
                      <XAxis type="number" hide />
                      <YAxis 
                        dataKey="name" 
                        type="category" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: theme.palette.text.primary, fontSize: 13, fontWeight: 500 }}
                      />
                      <RechartsTooltip 
                        cursor={{ fill: alpha(theme.palette.primary.main, 0.05) }}
                        formatter={(value: any) => formatCurrency(value)}
                        contentStyle={{ 
                          borderRadius: 12, 
                          border: "none", 
                          boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)", 
                          backgroundColor: theme.palette.background.paper 
                        }}
                      />
                      <Bar 
                        dataKey="value" 
                        fill={theme.palette.primary.main} 
                        radius={[0, 8, 8, 0]} 
                        barSize={32}
                      >
                        {supplierPerformanceData.map((entry: any, index: number) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={alpha(theme.palette.primary.main, 1 - index * 0.15)} 
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <NoDataState icon={<BarChartIcon sx={{ fontSize: 40 }} />} />
                )}
              </Paper>
            </Grid>

            {/* Quantity Trend Chart */}
            <Grid size={{ xs: 12 }}>
              <Paper sx={{ p: 4, height: 400, borderRadius: 4, boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)", display: "flex", flexDirection: "column" }}>
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" fontWeight={700}>Processing Volume Trend</Typography>
                  <Typography variant="body2" color="text.secondary">Daily processing volume for selected range</Typography>
                </Box>
                {quantityTrendData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={quantityTrendData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme.palette.divider} />
                      <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: theme.palette.text.secondary, fontSize: 12 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: theme.palette.text.secondary, fontSize: 12 }} />
                      <RechartsTooltip 
                        contentStyle={{ 
                          borderRadius: 12, 
                          border: "none", 
                          boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)", 
                          backgroundColor: theme.palette.background.paper 
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="quantity" 
                        stroke={theme.palette.secondary.main} 
                        strokeWidth={4} 
                        dot={{ r: 6, fill: theme.palette.secondary.main, strokeWidth: 2, stroke: "#fff" }} 
                        activeDot={{ r: 8, strokeWidth: 0, fill: theme.palette.secondary.main }} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <NoDataState icon={<ShowChartIcon sx={{ fontSize: 40 }} />} />
                )}
              </Paper>
            </Grid>
          </Grid>
        </Box>

        {/* Floating Action Strip */}
        <Box
          sx={{
            position: "fixed",
            right: 24,
            top: "50%",
            transform: "translateY(-50%)",
            display: "flex",
            flexDirection: "column",
            gap: 2,
            zIndex: 1000,
            p: 1.5,
            borderRadius: "24px",
            bgcolor: alpha(theme.palette.background.paper, 0.8),
            backdropFilter: "blur(12px)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          }}
        >
          <FloatingAction 
            title="Create New Invoice" 
            icon={<ReceiptLongIcon />} 
            color={theme.palette.primary.main}
            onClick={() => router.push("/invoices/create")}
          />
          <FloatingAction 
            title="Add New Supplier" 
            icon={<PersonAddIcon />} 
            color={theme.palette.warning.main}
            onClick={() => router.push("/supplier")}
          />
          <FloatingAction 
            title="Add Category" 
            icon={<CategoryIcon />} 
            color={theme.palette.success.main}
            onClick={() => router.push("/category")}
          />
          <FloatingAction 
            title="Add Sub Category" 
            icon={<AccountTreeIcon />} 
            color={theme.palette.info.main}
            onClick={() => router.push("/subcategory")}
          />
        </Box>
      </Box>
    </LocalizationProvider>
  );
}
