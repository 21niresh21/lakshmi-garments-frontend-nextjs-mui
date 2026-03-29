"use client";

import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Stack,
  Chip,
  IconButton,
  Divider,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Tooltip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  LinearProgress,
  Container,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AssignmentIcon from "@mui/icons-material/Assignment";
import PersonIcon from "@mui/icons-material/Person";
import BusinessIcon from "@mui/icons-material/Business";
import ScheduleIcon from "@mui/icons-material/Schedule";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import WarningIcon from "@mui/icons-material/Warning";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PaymentsIcon from "@mui/icons-material/Payments";
import ReceiptIcon from "@mui/icons-material/Receipt";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import TimelineOppositeContent from "@mui/lab/TimelineOppositeContent";
import { fetchJobworkTimeline } from "@/app/api/jobworkApi";
import { JobworkTimelineResponse } from "@/app/api/_types/JobworkTimeline";
import { useNotification } from "@/app/components/shared/NotificationProvider";
import { formatToShortDateTime } from "@/app/utils/date";
import { JobworkStatus } from "@/app/_types/JobworkStatus";
import { DamageType } from "@/app/_types/DamageType";

const getJobworkStatusConfig = (status: string) => {
  switch (status) {
    case JobworkStatus.CLOSED:
      return { label: "Closed", color: "success" as const, icon: <CheckCircleIcon /> };
    case JobworkStatus.IN_PROGRESS:
      return { label: "In Progress", color: "primary" as const, icon: <ScheduleIcon /> };
    case JobworkStatus.PENDING_RETURN:
      return { label: "Pending Return", color: "warning" as const, icon: <ScheduleIcon /> };
    case JobworkStatus.REASSIGNED:
      return { label: "Reassigned", color: "info" as const, icon: <AssignmentIcon /> };
    case JobworkStatus.AWAITING_CLOSE:
      return { label: "Awaiting Close", color: "warning" as const, icon: <ScheduleIcon /> };
    case JobworkStatus.AWAITING_APPROVAL:
      return { label: "Awaiting Approval", color: "primary" as const, icon: <ScheduleIcon /> };
    default:
      return { label: status, color: "default" as const, icon: <AssignmentIcon /> };
  }
};

const getEventTypeConfig = (eventType: string) => {
  switch (eventType) {
    case "JOBWORK_ASSIGNED":
      return { label: "Assigned", color: "primary" as const, icon: <AssignmentIcon /> };
    case "JOBWORK_RECEIPT":
      return { label: "Receipt", color: "info" as const, icon: <ReceiptIcon /> };
    case "JOBWORK_COMPLETED":
    case "JOBWORK_CLOSED":
      return { label: "Completed", color: "success" as const, icon: <CheckCircleIcon /> };
    case "JOBWORK_REASSIGNED":
      return { label: "Reassigned", color: "warning" as const, icon: <AssignmentIcon /> };
    case "JOBWORK_REOPENED":
      return { label: "Reopened", color: "info" as const, icon: <AssignmentIcon /> };
    default:
      return { label: eventType, color: "grey" as const, icon: <AssignmentIcon /> };
  }
};

const getEfficiencyColor = (score: string) => {
  switch (score) {
    case "A":
      return "success";
    case "B":
      return "info";
    case "C":
      return "warning";
    case "D":
    case "F":
      return "error";
    default:
      return "default";
  }
};

const StatCard = ({
  title,
  value,
  subtitle,
  icon,
  color = "primary",
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  color?: "primary" | "success" | "warning" | "error" | "info";
}) => (
  <Card sx={{ height: "100%", borderRadius: 2 }}>
    <CardContent>
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
        <Box>
          <Typography variant="body2" color="text.secondary" fontWeight={500}>
            {title}
          </Typography>
          <Typography variant="h5" fontWeight={700} color={`${color}.main`}>
            {value}
          </Typography>
          {subtitle && (
            <Typography variant="caption" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Box>
        <Box
          sx={{
            p: 1,
            borderRadius: 2,
            bgcolor: `${color}.lighter`,
            color: `${color}.main`,
          }}
        >
          {icon}
        </Box>
      </Stack>
    </CardContent>
  </Card>
);

export default function JobworkDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { notify } = useNotification();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<JobworkTimelineResponse | null>(null);

  const jobworkNumber = params.id as string;

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const res = await fetchJobworkTimeline(jobworkNumber);
        setData(res);
      } catch (err: any) {
        notify("Error fetching jobwork timeline", "error");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [jobworkNumber, notify]);

  const handleCopyJobworkNumber = () => {
    if (data?.jobworkNumber) {
      navigator.clipboard.writeText(data.jobworkNumber);
      notify("Jobwork number copied to clipboard", "success");
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!data) {
    return (
      <Container maxWidth="md" sx={{ py: 3 }}>
        <Typography variant="h6" color="text.secondary">
          Jobwork not found
        </Typography>
      </Container>
    );
  }

  const statusConfig = getJobworkStatusConfig(data.jobworkStatus);

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
        <IconButton onClick={() => router.back()}>
          <ArrowBackIcon />
        </IconButton>
        <Box sx={{ flex: 1 }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="h4" fontWeight={700}>
              {data.jobworkNumber}
            </Typography>
            <Tooltip title="Copy Jobwork Number">
              <IconButton onClick={handleCopyJobworkNumber} size="small">
                <ContentCopyIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
            <Chip
              icon={statusConfig.icon}
              label={statusConfig.label}
              color={statusConfig.color}
              size="small"
            />
            <Chip label={data.jobworkType} variant="outlined" size="small" />
            <Chip
              icon={<BusinessIcon />}
              label={data.jobworkOrigin}
              variant="outlined"
              size="small"
            />
          </Stack>
        </Box>
      </Stack>

      <Grid container spacing={3}>
        {/* Left Column - Info & Metrics */}
        <Grid size={{ xs: 12, md: 4 }}>
          {/* Basic Info Card */}
          <Card sx={{ mb: 3, borderRadius: 2 }}>
            <CardContent>
              <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
                Basic Information
              </Typography>
              <Stack spacing={1.5}>
                <Box sx={{ display: "grid", gridTemplateColumns: "120px 1fr", alignItems: "center" }}>
                  <Typography variant="body2" color="text.secondary">Batch:</Typography>
                  <Typography variant="body2" fontWeight={500}>{data.batchSerialCode}</Typography>
                </Box>
                <Box sx={{ display: "grid", gridTemplateColumns: "120px 1fr", alignItems: "center" }}>
                  <Typography variant="body2" color="text.secondary">Assigned To:</Typography>
                  <Chip icon={<PersonIcon />} label={data.assignedTo} size="small" />
                </Box>
                <Box sx={{ display: "grid", gridTemplateColumns: "120px 1fr", alignItems: "center" }}>
                  <Typography variant="body2" color="text.secondary">Created By:</Typography>
                  <Typography variant="body2">{data.createdBy}</Typography>
                </Box>
                <Box sx={{ display: "grid", gridTemplateColumns: "120px 1fr", alignItems: "center" }}>
                  <Typography variant="body2" color="text.secondary">Created At:</Typography>
                  <Typography variant="body2">{formatToShortDateTime(data.createdAt)}</Typography>
                </Box>
                <Box sx={{ display: "grid", gridTemplateColumns: "120px 1fr", alignItems: "center" }}>
                  <Typography variant="body2" color="text.secondary">Last Modified:</Typography>
                  <Typography variant="body2">{formatToShortDateTime(data.lastModifiedAt)}</Typography>
                </Box>
                {data.remarks && (
                  <Box sx={{ display: "grid", gridTemplateColumns: "120px 1fr", alignItems: "start" }}>
                    <Typography variant="body2" color="text.secondary">Remarks:</Typography>
                    <Typography variant="body2">{data.remarks}</Typography>
                  </Box>
                )}
              </Stack>
            </CardContent>
          </Card>

          {/* Parent/Child Jobworks */}
          {(data.parentJobworkNumber || (data.childJobworkNumbers?.length ?? 0) > 0) && (
            <Card sx={{ mb: 3, borderRadius: 2 }}>
              <CardContent>
                <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
                  Related Jobworks
                </Typography>
                {data.parentJobworkNumber && (
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">Parent:</Typography>
                    <Chip label={data.parentJobworkNumber} size="small" sx={{ mt: 0.5 }} />
                  </Box>
                )}
                {(data.childJobworkNumbers?.length ?? 0) > 0 && (
                  <Box>
                    <Typography variant="body2" color="text.secondary">Children:</Typography>
                    <Stack direction="row" flexWrap="wrap" spacing={0.5} sx={{ mt: 0.5 }}>
                      {data.childJobworkNumbers?.map((jw) => (
                        <Chip key={jw} label={jw} size="small" sx={{ mb: 0.5 }} />
                      ))}
                    </Stack>
                  </Box>
                )}
              </CardContent>
            </Card>
          )}

          {/* Metrics Card */}
          <Card sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
                Performance Metrics
              </Typography>
              <Grid container spacing={2}>
                <Grid size={6}>
                  <Box sx={{ textAlign: "center", p: 1.5, bgcolor: "background.default", borderRadius: 2 }}>
                    <Typography variant="h5" fontWeight={700} color="primary">
                      {data.metrics.completionPercentage}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">Completion</Typography>
                  </Box>
                </Grid>
                <Grid size={6}>
                  <Box sx={{ textAlign: "center", p: 1.5, bgcolor: "background.default", borderRadius: 2 }}>
                    <Typography variant="h5" fontWeight={700} color={getEfficiencyColor(data.metrics.efficiencyScore)}>
                      {data.metrics.efficiencyScore}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">Efficiency</Typography>
                  </Box>
                </Grid>
                <Grid size={6}>
                  <Box sx={{ textAlign: "center", p: 1.5, bgcolor: "background.default", borderRadius: 2 }}>
                    <Typography variant="body1" fontWeight={600} color="success.main">
                      {data.metrics.acceptanceRate}%
                    </Typography>
                    <Typography variant="caption" color="text.secondary">Acceptance</Typography>
                  </Box>
                </Grid>
                <Grid size={6}>
                  <Box sx={{ textAlign: "center", p: 1.5, bgcolor: "background.default", borderRadius: 2 }}>
                    <Typography variant="body1" fontWeight={600} color="error.main">
                      {data.metrics.damageRate}%
                    </Typography>
                    <Typography variant="caption" color="text.secondary">Damage</Typography>
                  </Box>
                </Grid>
              </Grid>
              <Divider sx={{ my: 2 }} />
              <Stack spacing={1}>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body2" color="text.secondary">Total Issued</Typography>
                  <Typography variant="body2" fontWeight={500}>{data.metrics.totalIssued}</Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body2" color="text.secondary">Total Accepted</Typography>
                  <Typography variant="body2" fontWeight={500} color="success.main">{data.metrics.totalAccepted}</Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body2" color="text.secondary">Total Damaged</Typography>
                  <Typography variant="body2" fontWeight={500} color="error.main">{data.metrics.totalDamaged}</Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body2" color="text.secondary">Total Sales</Typography>
                  <Typography variant="body2" fontWeight={500}>{data.metrics.totalSales}</Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body2" color="text.secondary">Total Pending</Typography>
                  <Typography variant="body2" fontWeight={500} color="warning.main">{data.metrics.totalPending}</Typography>
                </Box>
                <Divider />
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body2" color="text.secondary">Total Wages</Typography>
                  <Typography variant="body2" fontWeight={700} color="primary">₹{data.metrics.totalWagesEarned.toFixed(2)}</Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body2" color="text.secondary">Sales Deduction</Typography>
                  <Typography variant="body2" fontWeight={500} color="error.main">₹{data.metrics.totalSalesDeduction.toFixed(2)}</Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body2" color="text.secondary">Net Wages</Typography>
                  <Typography variant="body2" fontWeight={700} color="primary">₹{data.metrics.netWagesEarned.toFixed(2)}</Typography>
                </Box>
                <Divider />
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body2" color="text.secondary">Receipts</Typography>
                  <Typography variant="body2" fontWeight={500}>{data.metrics.receiptCount}</Typography>
                </Box>
                {/* <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body2" color="text.secondary">Avg Time/Receipt</Typography>
                  <Typography variant="body2" fontWeight={500}>{data.metrics.averageTimePerReceipt}</Typography>
                </Box> */}
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body2" color="text.secondary">Total Duration</Typography>
                  <Typography variant="body2" fontWeight={500}>{data.metrics.totalDuration}</Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body2" color="text.secondary">Rework Count</Typography>
                  <Typography variant="body2" fontWeight={500}>{data.metrics.reworkCount}</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Right Column - Items, Timeline, Receipts */}
        <Grid size={{ xs: 12, md: 8 }}>
          {/* Items Table */}
          {/* <Card sx={{ mb: 3, borderRadius: 2 }}>
            <CardContent>
              <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
                Items ({data.items?.length ?? 0})
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Item</TableCell>
                      <TableCell align="right">Issued</TableCell>
                      <TableCell align="right">Accepted</TableCell>
                      <TableCell align="right">Damaged</TableCell>
                      <TableCell align="right">Sales</TableCell>
                      <TableCell align="right">Pending</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.items?.map((item, idx) => (
                      <TableRow key={idx}>
                        <TableCell>
                          <Typography variant="body2" fontWeight={500}>{item.itemName}</Typography>
                        </TableCell>
                        <TableCell align="right">{item.issuedQuantity}</TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" color="success.main" fontWeight={500}>
                            {item.acceptedQuantity}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" color={item.damagedQuantity > 0 ? "error.main" : "inherit"}>
                            {item.damagedQuantity}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">{item.salesQuantity}</TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" color={item.pendingQuantity > 0 ? "warning.main" : "inherit"}>
                            {item.pendingQuantity}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={item.status}
                            size="small"
                            color={item.status === "CLOSED" ? "success" : "warning"}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card> */}

          {/* Timeline */}
          <Card sx={{ mb: 3, borderRadius: 2 }}>
            <CardContent>
              <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
                Timeline
              </Typography>
              <Timeline position="alternate" sx={{ padding: 0, margin: 0 }}>
                {data.timeline?.map((event, idx) => {
                  const eventConfig = getEventTypeConfig(event.eventType);
                  return (
                    <TimelineItem key={idx}>
                      <TimelineOppositeContent
                        sx={{ m: "auto 0" }}
                        align="right"
                        variant="body2"
                        color="text.secondary"
                      >
                        <Typography variant="caption" display="block">
                          {formatToShortDateTime(event.performedAt)}
                        </Typography>
                        {event.timeTakenFromPrevious !== "N/A" && (
                          <Typography variant="caption" color="text.disabled">
                            {event.timeTakenFromPrevious}
                          </Typography>
                        )}
                      </TimelineOppositeContent>
                      <TimelineSeparator>
                        <TimelineDot color={eventConfig.color}>{eventConfig.icon}</TimelineDot>
                        {idx < (data.timeline?.length ?? 0) - 1 && <TimelineConnector />}
                      </TimelineSeparator>
                      <TimelineContent sx={{ py: "12px", px: 2 }}>
                        <Typography variant="body2" fontWeight={500}>
                          {event.message}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          by {event.performedBy}
                        </Typography>
                        {event.items && (event.items?.length ?? 0) > 0 && (
                          <Stack direction="row" flexWrap="wrap" spacing={0.5} sx={{ mt: 1 }}>
                            {event.items?.map((item, i) => (
                              <Chip
                                key={i}
                                label={`${item.itemName} (${item.quantity || item.acceptedQuantity})`}
                                size="small"
                                variant="outlined"
                                sx={{ fontSize: "0.7rem" }}
                              />
                            ))}
                          </Stack>
                        )}
                      </TimelineContent>
                    </TimelineItem>
                  );
                })}
              </Timeline>
            </CardContent>
          </Card>

          {/* Receipts */}
          {(data.receipts?.length ?? 0) > 0 && (
            <Card sx={{ borderRadius: 2 }}>
              <CardContent>
                <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
                  Receipts ({data.receipts?.length ?? 0})
                </Typography>
                <Stack spacing={2}>
                  {data.receipts?.map((receipt, idx) => (
                    <Accordion key={receipt.receiptId} defaultExpanded={idx === 0}>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Stack direction="row" alignItems="center" spacing={2} sx={{ width: "100%" }}>
                          <Chip label={`#${receipt.receiptId}`} size="small" color="primary" />
                          <Typography variant="body2">
                            {formatToShortDateTime(receipt.receivedAt)}
                          </Typography>
                          <Chip label={receipt.recordedBy} size="small" variant="outlined" />
                          <Box sx={{ flex: 1 }} />
                          <Typography variant="body2" fontWeight={600} color="success.main">
                            ₹{receipt.receiptWages.toFixed(2)}
                          </Typography>
                        </Stack>
                      </AccordionSummary>
                      <AccordionDetails>
                        <TableContainer>
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell>Item</TableCell>
                                <TableCell align="right">Accepted</TableCell>
                                <TableCell align="right" colSpan={5}>Damaged</TableCell>
                                <TableCell align="right">Sales</TableCell>
                                <TableCell align="right">Wage/Item</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell />
                                <TableCell />
                                <TableCell align="right"><Typography variant="caption">Supplier</Typography></TableCell>
                                <TableCell align="right"><Typography variant="caption">Repairable (Current)</Typography></TableCell>
                                <TableCell align="right"><Typography variant="caption">Repairable (Previous)</Typography></TableCell>
                                <TableCell align="right"><Typography variant="caption">Unrepairable</Typography></TableCell>
                                <TableCell align="right"><Typography variant="caption">Total</Typography></TableCell>
                                <TableCell />
                                <TableCell />
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {receipt.receiptItems?.map((item, i) => {
                                const supplierDamage = item.damages?.find(d => d.damageType === DamageType.SUPPLIER_DAMAGE);
                                const repairableCurrent = item.damages?.find(d => d.damageType === DamageType.REPAIRABLE && !d.damageSource);
                                const repairablePrevious = item.damages?.find(d => d.damageType === DamageType.REPAIRABLE && d.damageSource === "PREVIOUS_JOBWORK");
                                const unrepairableDamage = item.damages?.find(d => d.damageType === DamageType.UNREPAIRABLE);
                                const totalDamage = (supplierDamage?.quantity || 0) + (repairableCurrent?.quantity || 0) + (repairablePrevious?.quantity || 0) + (unrepairableDamage?.quantity || 0);

                                return (
                                  <TableRow key={i}>
                                    <TableCell>{item.itemName}</TableCell>
                                    <TableCell align="right">{item.acceptedQuantity}</TableCell>
                                    <TableCell align="right">
                                      {supplierDamage && supplierDamage.quantity > 0 ? (
                                        <Typography variant="body2" color="error.main">{supplierDamage.quantity}</Typography>
                                      ) : (
                                        "-"
                                      )}
                                    </TableCell>
                                    <TableCell align="right">
                                      {repairableCurrent && repairableCurrent.quantity > 0 ? (
                                        <Typography variant="body2" color="warning.main">{repairableCurrent.quantity}</Typography>
                                      ) : (
                                        "-"
                                      )}
                                    </TableCell>
                                    <TableCell align="right">
                                      {repairablePrevious && repairablePrevious.quantity > 0 ? (
                                        <Box>
                                          <Typography variant="body2" color="warning.main">{repairablePrevious.quantity}</Typography>
                                          {repairablePrevious.damageSource === "PREVIOUS_JOBWORK" && repairablePrevious.reworkJobworkNumber && (
                                            <Typography variant="caption" color="primary.main" sx={{ fontWeight: 500, fontSize: "0.65rem" }}>
                                              {repairablePrevious.reworkJobworkNumber}
                                            </Typography>
                                          )}
                                        </Box>
                                      ) : (
                                        "-"
                                      )}
                                    </TableCell>
                                    <TableCell align="right">
                                      {unrepairableDamage && unrepairableDamage.quantity > 0 ? (
                                        <Typography variant="body2" color="error.dark">{unrepairableDamage.quantity}</Typography>
                                      ) : (
                                        "-"
                                      )}
                                    </TableCell>
                                    <TableCell align="right">
                                      {totalDamage > 0 ? (
                                        <Typography variant="body2" fontWeight={600} color="error.main">{totalDamage}</Typography>
                                      ) : (
                                        "-"
                                      )}
                                    </TableCell>
                                    <TableCell align="right">{item.salesQuantity || "-"}</TableCell>
                                    <TableCell align="right">₹{item.wagePerItem.toFixed(2)}</TableCell>
                                  </TableRow>
                                );
                              })}
                            </TableBody>
                          </Table>
                        </TableContainer>
                        <Box sx={{ mt: 2, p: 1.5, bgcolor: "background.default", borderRadius: 1 }}>
                          <Grid container spacing={2}>
                            <Grid size={3}>
                              <Typography variant="caption" color="text.secondary">Total Accepted</Typography>
                              <Typography variant="body2" fontWeight={500}>{receipt.totalAccepted}</Typography>
                            </Grid>
                            <Grid size={3}>
                              <Typography variant="caption" color="text.secondary">Total Damaged</Typography>
                              <Typography variant="body2" fontWeight={500} color="error.main">{receipt.totalDamaged}</Typography>
                            </Grid>
                            <Grid size={3}>
                              <Typography variant="caption" color="text.secondary">Total Sales</Typography>
                              <Typography variant="body2" fontWeight={500}>{receipt.totalSales}</Typography>
                            </Grid>
                            <Grid size={3}>
                              <Typography variant="caption" color="text.secondary">Wages Earned</Typography>
                              <Typography variant="body2" fontWeight={600} color="success.main">
                                ₹{receipt.receiptWages.toFixed(2)}
                              </Typography>
                            </Grid>
                          </Grid>
                        </Box>
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}
