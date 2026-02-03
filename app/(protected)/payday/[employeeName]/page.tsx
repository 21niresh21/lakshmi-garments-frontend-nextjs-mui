"use client";

import React, { useEffect, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Stack,
  IconButton,
  Chip,
  Divider,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Button,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DateRangeIcon from "@mui/icons-material/DateRange";
import AssignmentIcon from "@mui/icons-material/Assignment";
import SpeedIcon from "@mui/icons-material/Speed";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PaymentsIcon from "@mui/icons-material/Payments";
import { fetchDetailedJobworkByEmployee } from "@/app/api/jobworkApi";
import { EmployeeJobworkDetailedResponse, DetailedJobwork } from "@/app/api/_types/JobworkDetails";
import { useNotification } from "@/app/components/shared/NotificationProvider";
import { formatToShortDate, formatToShortDateTime } from "@/app/utils/date";
import dayjs from "dayjs";

const StatCard = ({ title, value, icon, color }: { title: string, value: string | number, icon: React.ReactNode, color: string }) => (
  <Card sx={{ 
    height: '100%', 
    background: `linear-gradient(135deg, ${color}22 0%, ${color}11 100%)`,
    border: `1px solid ${color}44`,
    borderRadius: 2,
    boxShadow: 'none'
  }}>
    <CardContent>
      <Stack direction="row" spacing={2} alignItems="center">
        <Box sx={{ 
          p: 1.5, 
          borderRadius: 2, 
          bgcolor: `${color}22`, 
          color: color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {icon}
        </Box>
        <Box>
          <Typography variant="body2" color="text.secondary" fontWeight={500}>
            {title}
          </Typography>
          <Typography variant="h5" fontWeight={700}>
            {value}
          </Typography>
        </Box>
      </Stack>
    </CardContent>
  </Card>
);

export default function EmployeePaydayDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { notify } = useNotification();
  
  const employeeName = decodeURIComponent(params.employeeName as string);
  const startDate = searchParams.get("startDate") || undefined;
  const endDate = searchParams.get("endDate") || undefined;

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<EmployeeJobworkDetailedResponse | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const res = await fetchDetailedJobworkByEmployee(employeeName, startDate, endDate);
        setData(res);
      } catch (err: any) {
        notify("Error fetching detailed jobwork data", "error");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [employeeName, startDate, endDate, notify]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!data) return null;

  const { stats, jobworks } = data;

  const calculateTotalWage = () => {
    return jobworks.reduce((total, jw) => {
      return total + jw.items.reduce((jwTotal, item) => jwTotal + (item.acceptedQuantity * item.wagePerItem), 0);
    }, 0);
  };

  const totalWage = calculateTotalWage();

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 4 }}>
        <IconButton onClick={() => router.back()}>
          <ArrowBackIcon />
        </IconButton>
        <Box>
          <Typography variant="h4" fontWeight={700}>
            {employeeName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Jobwork performance detail
          </Typography>
        </Box>
        <Box sx={{ flexGrow: 1 }} />
        <Chip 
          icon={<DateRangeIcon />} 
          label={`${startDate ? dayjs(startDate).format("DD MMM YYYY") : 'Ever'} - ${endDate ? dayjs(endDate).format("DD MMM YYYY") : 'Now'}`}
          variant="outlined"
          sx={{ fontWeight: 600 }}
        />
      </Stack>

      {/* Stats Grid */}
      {/* <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={2}>
          <StatCard title="Total Jobworks" value={stats.totalJobworks} icon={<AssignmentIcon />} color="#6366f1" />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <StatCard title="Issued Qty" value={stats.totalIssuedQuantity} icon={<SpeedIcon />} color="#8b5cf6" />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <StatCard title="Accepted Qty" value={stats.totalAcceptedQuantity} icon={<AssignmentIcon />} color="#10b981" />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <StatCard title="Damaged Qty" value={stats.totalDamagedQuantity} icon={<ErrorOutlineIcon />} color="#f43f5e" />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <StatCard title="Sales Qty" value={stats.totalSalesQuantity} icon={<ShoppingCartIcon />} color="#f59e0b" />
        </Grid>
        <Grid item xs={12} sm={12} md={2}>
          <StatCard title="Total Wage" value={`₹${totalWage.toLocaleString()}`} icon={<PaymentsIcon />} color="#c026d3" />
        </Grid>
      </Grid> */}

      {/* Jobwork Detailed List */}
      <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
        Recent Jobworks
      </Typography>
      
      <Stack spacing={3}>
        {jobworks.map((jw) => (
          <Card key={jw.jobworkNumber} sx={{ borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
            <Box sx={{ p: 2, bgcolor: 'rgba(0,0,0,0.02)', borderBottom: '1px solid rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Typography variant="subtitle1" fontWeight={700}>
                    {jw.jobworkNumber}
                  </Typography>
                  <Chip label={jw.jobworkType} size="small" color="primary" sx={{ fontWeight: 600, fontSize: '0.7rem' }} />
                  <Typography variant="body2" color="text.secondary">
                    Batch: <b>{jw.batchSerialCode}</b>
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Typography variant="body2" color="text.secondary">
                    Started: {formatToShortDateTime(jw.startedAt)}
                  </Typography>
                  <Chip 
                    label={jw.jobworkStatus} 
                    size="small" 
                    color={jw.jobworkStatus === 'CLOSED' ? 'success' : 'warning'} 
                    variant="outlined"
                    sx={{ fontWeight: 700, fontSize: '0.7rem' }} 
                  />
                </Stack>
            </Box>
              
            <Box sx={{ p: 2 }}>
              {jw.jobworkType === 'CUTTING' ? (
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>Total Cutting Quantity</Typography>
                    <Typography variant="h5" fontWeight={700} color="primary">{jw.items[0]?.issuedQuantity || 0}</Typography>
                  </Box>
                  {jw.remarks && (
                    <Box sx={{ maxWidth: '60%', p: 1.5, bgcolor: '#f8fafc', borderRadius: 1, borderLeft: '4px solid #6366f1' }}>
                      <Typography variant="caption" color="text.secondary" fontWeight={700}>Remarks</Typography>
                      <Typography variant="body2">{jw.remarks}</Typography>
                    </Box>
                  )}
                </Stack>
              ) : (
                <>
                  <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid rgba(0,0,0,0.05)' }}>
                    <Table size="small">
                      <TableHead sx={{ bgcolor: 'rgba(0,0,0,0.01)' }}>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 700 }}>Item Name</TableCell>
                          <TableCell align="right" sx={{ fontWeight: 700 }}>Issued</TableCell>
                          <TableCell align="right" sx={{ fontWeight: 700 }}>Accepted</TableCell>
                          <TableCell align="right" sx={{ fontWeight: 700 }}>Damaged</TableCell>
                          <TableCell align="right" sx={{ fontWeight: 700 }}>Sales</TableCell>
                          <TableCell align="right" sx={{ fontWeight: 700 }}>Wage</TableCell>
                          <TableCell align="right" sx={{ fontWeight: 700 }}>Total</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {jw.items.map((item, idx) => (
                          <React.Fragment key={idx}>
                            <TableRow hover>
                              <TableCell sx={{ fontWeight: 600 }}>{item.itemName}</TableCell>
                              <TableCell align="right">{item.issuedQuantity}</TableCell>
                              <TableCell align="right">{item.acceptedQuantity}</TableCell>
                              <TableCell align="right" sx={{ color: item.damagedQuantity > 0 ? 'error.main' : 'inherit' }}>
                                {item.damagedQuantity}
                              </TableCell>
                              <TableCell align="right">{item.salesQuantity}</TableCell>
                              <TableCell align="right">₹{item.wagePerItem.toFixed(2)}</TableCell>
                              <TableCell align="right" sx={{ fontWeight: 700, color: 'primary.main' }}>
                                ₹{(item.acceptedQuantity * item.wagePerItem).toFixed(2)}
                              </TableCell>
                            </TableRow>
                            {Object.keys(item.damageBreakdown).length > 0 && (
                              <TableRow>
                                <TableCell colSpan={7} sx={{ py: 0.5, bgcolor: '#fff5f5' }}>
                                  <Stack direction="row" spacing={2} alignItems="center" sx={{ ml: 2 }}>
                                    <Typography variant="caption" color="error.dark" sx={{ fontWeight: 800 }}>DAMAGE DETAILS:</Typography>
                                    {Object.entries(item.damageBreakdown).map(([key, val]) => (
                                      <Chip 
                                        key={key} 
                                        label={`${key.replace('_', ' ')}: ${val}`} 
                                        size="small" 
                                        variant="outlined" 
                                        color="error"
                                        sx={{ height: 20, fontSize: '0.65rem', fontWeight: 700 }}
                                      />
                                    ))}
                                  </Stack>
                                </TableCell>
                              </TableRow>
                            )}
                          </React.Fragment>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  {jw.remarks && (
                    <Box sx={{ mt: 2, p: 1.5, bgcolor: '#f8fafc', borderRadius: 1, borderLeft: '4px solid #cbd5e1' }}>
                      <Typography variant="caption" color="text.secondary" fontWeight={700}>General Remarks</Typography>
                      <Typography variant="body2">{jw.remarks}</Typography>
                    </Box>
                  )}
                </>
              )}
            </Box>
          </Card>
        ))}
      </Stack>

      {jobworks.length === 0 && (
        <Paper sx={{ p: 8, textAlign: 'center', borderRadius: 4, bgcolor: 'rgba(0,0,0,0.01)', border: '2px dashed rgba(0,0,0,0.1)' }}>
          <AssignmentIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2, opacity: 0.5 }} />
          <Typography variant="h5" color="text.secondary" fontWeight={600}>No activity recorded</Typography>
          <Typography variant="body2" color="text.disabled">No jobworks were found for the selected date range.</Typography>
        </Paper>
      )}
    </Box>
  );
}
