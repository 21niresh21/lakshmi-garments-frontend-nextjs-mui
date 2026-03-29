"use client";

import React from "react";
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator,
} from "@mui/lab";
import {
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  Stack,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  Divider,
  IconButton,
  Tooltip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Paper,
  useTheme,
  alpha,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AssignmentIcon from "@mui/icons-material/Assignment";
import PersonIcon from "@mui/icons-material/Person";
import BusinessIcon from "@mui/icons-material/Business";
import ScheduleIcon from "@mui/icons-material/Schedule";
import ContentCutIcon from "@mui/icons-material/ContentCut";
import InventoryIcon from "@mui/icons-material/Inventory";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import WarningIcon from "@mui/icons-material/Warning";
import ReceiptIcon from "@mui/icons-material/Receipt";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { formatToShortDateTime } from "@/app/utils/date";
import { BatchTimelineResponse } from "@/app/api/_types/BatchTimeline";
import { useRouter } from "next/navigation";

const getProgressColor = (percentage: number): "success" | "primary" | "warning" | "error" => {
  if (percentage >= 80) return "success";
  if (percentage >= 50) return "primary";
  if (percentage >= 25) return "warning";
  return "error";
};

const getEfficiencyColor = (score: string): "success" | "primary" | "warning" | "error" | "default" => {
  switch (score) {
    case "A": return "success";
    case "B": return "primary";
    case "C": return "warning";
    case "D":
    case "F": return "error";
    default: return "default";
  }
};

const getEventTypeConfig = (eventType: string) => {
  switch (eventType) {
    case "BATCH_CREATED":
      return { label: "Created", color: "primary" as const, icon: <BusinessIcon /> };
    case "JOBWORK_ASSIGNED":
      return { label: "Assigned", color: "info" as const, icon: <AssignmentIcon /> };
    case "JOBWORK_RECEIPT":
      return { label: "Receipt", color: "success" as const, icon: <ReceiptIcon /> };
    case "JOBWORK_COMPLETED":
    case "JOBWORK_CLOSED":
      return { label: "Completed", color: "success" as const, icon: <CheckCircleIcon /> };
    case "JOBWORK_REASSIGNED":
      return { label: "Reassigned", color: "warning" as const, icon: <AssignmentIcon /> };
    case "BATCH_COMPLETED":
      return { label: "Completed", color: "success" as const, icon: <CheckCircleIcon /> };
    default:
      return { label: eventType, color: "grey" as const, icon: <AssignmentIcon /> };
  }
};

const getJobworkStatusColor = (status: string): "success" | "primary" | "warning" | "error" | "default" => {
  switch (status) {
    case "CLOSED": return "success";
    case "IN_PROGRESS": return "primary";
    case "AWAITING_CLOSE":
    case "PENDING_RETURN": return "warning";
    case "CANCELLED": return "error";
    default: return "default";
  }
};

type Props = {
  batchTimeline: BatchTimelineResponse | null;
};

export default function BatchTimeline({ batchTimeline }: Props) {
  const theme = useTheme();
  const router = useRouter();

  if (!batchTimeline) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography color="text.secondary">No timeline data available</Typography>
      </Box>
    );
  }

  const handleCopySerialCode = () => {
    navigator.clipboard.writeText(batchTimeline.serialCode);
  };

  const handleJobworkClick = (jobworkNumber: string) => {
    router.push(`/jobwork/${jobworkNumber}`);
  };

  const parsePercentage = (percentage: string): number => {
    return parseFloat(percentage.replace("%", "")) || 0;
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
        <Box sx={{ flex: 1 }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="h4" fontWeight={700}>
              {batchTimeline.serialCode}
            </Typography>
            <Tooltip title="Copy Serial Code">
              <IconButton onClick={handleCopySerialCode} size="small">
                <ContentCopyIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
            <Chip label={batchTimeline.batchStatus} color="primary" size="small" />
            <Chip label={batchTimeline.categoryName} variant="outlined" size="small" />
            {batchTimeline.isUrgent && (
              <Chip label="URGENT" color="error" size="small" icon={<WarningIcon />} />
            )}
          </Stack>
        </Box>
      </Stack>

      <Grid container spacing={3}>
        {/* Left Column - Info & Stats */}
        <Grid size={{ xs: 12, md: 4 }}>
          {/* Basic Info Card */}
          <Card sx={{ mb: 3, borderRadius: 2 }}>
            <CardContent>
              <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
                Batch Information
              </Typography>
              <Stack spacing={1.5}>
                <Box sx={{ display: "grid", gridTemplateColumns: "120px 1fr", alignItems: "center" }}>
                  <Typography variant="body2" color="text.secondary">Category:</Typography>
                  <Typography variant="body2" fontWeight={500}>{batchTimeline.categoryName}</Typography>
                </Box>
                <Box sx={{ display: "grid", gridTemplateColumns: "120px 1fr", alignItems: "center" }}>
                  <Typography variant="body2" color="text.secondary">Status:</Typography>
                  <Chip label={batchTimeline.batchStatus} size="small" color="primary" />
                </Box>
                <Box sx={{ display: "grid", gridTemplateColumns: "120px 1fr", alignItems: "center" }}>
                  <Typography variant="body2" color="text.secondary">Created By:</Typography>
                  <Typography variant="body2">{batchTimeline.createdBy}</Typography>
                </Box>
                <Box sx={{ display: "grid", gridTemplateColumns: "120px 1fr", alignItems: "center" }}>
                  <Typography variant="body2" color="text.secondary">Created At:</Typography>
                  <Typography variant="body2">{formatToShortDateTime(batchTimeline.createdAt)}</Typography>
                </Box>
                <Box sx={{ display: "grid", gridTemplateColumns: "120px 1fr", alignItems: "center" }}>
                  <Typography variant="body2" color="text.secondary">Last Modified:</Typography>
                  <Typography variant="body2">{formatToShortDateTime(batchTimeline.lastModifiedAt)}</Typography>
                </Box>
                {batchTimeline.remarks && (
                  <Box sx={{ display: "grid", gridTemplateColumns: "120px 1fr", alignItems: "start" }}>
                    <Typography variant="body2" color="text.secondary">Remarks:</Typography>
                    <Typography variant="body2">{batchTimeline.remarks}</Typography>
                  </Box>
                )}
              </Stack>
            </CardContent>
          </Card>



          {/* Stats Card */}
          <Card sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
                Statistics
              </Typography>
              <Grid container spacing={2}>
                <Grid size={6}>
                  <Box sx={{ textAlign: "center", p: 1.5, bgcolor: "background.default", borderRadius: 2 }}>
                    <Typography variant="h5" fontWeight={700} color={getEfficiencyColor(batchTimeline.stats?.productionEfficiencyScore || "")}>
                      {batchTimeline.stats?.productionEfficiencyScore || "-"}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">Efficiency</Typography>
                  </Box>
                </Grid>
                <Grid size={6}>
                  <Box sx={{ textAlign: "center", p: 1.5, bgcolor: "background.default", borderRadius: 2 }}>
                    <Typography variant="h5" fontWeight={700} color="success.main">
                      {batchTimeline.stats?.overallAcceptanceRate?.toFixed(1) || 0}%
                    </Typography>
                    <Typography variant="caption" color="text.secondary">Acceptance</Typography>
                  </Box>
                </Grid>
              </Grid>
              <Divider sx={{ my: 2 }} />
              <Stack spacing={1}>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body2" color="text.secondary">Total Events</Typography>
                  <Typography variant="body2" fontWeight={500}>{batchTimeline.stats?.totalEvents ?? 0}</Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body2" color="text.secondary">Total Jobworks</Typography>
                  <Typography variant="body2" fontWeight={500}>{batchTimeline.stats?.totalJobworks ?? 0}</Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body2" color="text.secondary">Total Receipts</Typography>
                  <Typography variant="body2" fontWeight={500}>{batchTimeline.stats?.totalReceipts ?? 0}</Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body2" color="text.secondary">Unique Employees</Typography>
                  <Typography variant="body2" fontWeight={500}>{batchTimeline.stats?.uniqueEmployeesAssigned ?? 0}</Typography>
                </Box>
                <Divider />
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body2" color="text.secondary">Total Wages (after deductions)</Typography>
                  <Typography variant="body2" fontWeight={700} color="primary">₹{(batchTimeline.stats?.totalWagesPaid ?? 0).toFixed(2)}</Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body2" color="text.secondary">Total Sales</Typography>
                  <Typography variant="body2" fontWeight={500} color="success.main">₹{(batchTimeline.stats?.totalSalesRevenue ?? 0).toFixed(2)}</Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body2" color="text.secondary">Total Cost</Typography>
                  <Typography variant="body2" fontWeight={700} color="primary">₹{(batchTimeline.stats?.totalCostOfProduction ?? 0).toFixed(2)}</Typography>
                </Box>
                <Divider />
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body2" color="text.secondary">Time from last event</Typography>
                  <Typography variant="body2" fontWeight={500}>{batchTimeline.stats?.totalDurationFromCreation || "-"}</Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body2" color="text.secondary">Rework Count</Typography>
                  <Typography variant="body2" fontWeight={500}>{batchTimeline.stats?.totalReworkCount ?? 0}</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Right Column - Items, Jobworks, Timeline */}
        <Grid size={{ xs: 12, md: 8 }}>
          {/* Items Table */}
          <Card sx={{ mb: 3, borderRadius: 2 }}>
            <CardContent>
              <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
                Items ({batchTimeline.items?.length ?? 0})
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Item</TableCell>
                      <TableCell align="right">Quantity</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {batchTimeline.items?.map((item, idx) => (
                      <TableRow key={idx}>
                        <TableCell>
                          <Typography variant="body2" fontWeight={500}>{item.itemName}</Typography>
                        </TableCell>
                        <TableCell align="right">{item.quantity}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>

          {/* SubCategories Table */}
          {(batchTimeline.subCategories?.length ?? 0) > 0 && (
            <Card sx={{ mb: 3, borderRadius: 2 }}>
              <CardContent>
                <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
                  Sub Categories ({batchTimeline.subCategories?.length ?? 0})
                </Typography>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Sub Category</TableCell>
                        <TableCell align="right">Quantity</TableCell>
                        {/* <TableCell align="right">Available</TableCell> */}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {batchTimeline.subCategories?.map((sub, idx) => (
                        <TableRow key={idx}>
                          <TableCell>
                            <Typography variant="body2" fontWeight={500}>{sub.subCategoryName}</Typography>
                          </TableCell>
                          <TableCell align="right">{sub.originalQuantity}</TableCell>
                          {/* <TableCell align="right">
                            <Typography variant="body2" color={sub.availableQuantity === 0 ? "error.main" : "success.main"}>
                              {sub.availableQuantity}
                            </Typography>
                          </TableCell> */}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          )}

          {/* Jobworks Table */}
          <Card sx={{ mb: 3, borderRadius: 2 }}>
            <CardContent>
              <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
                Jobworks ({batchTimeline.jobworks?.length ?? 0})
              </Typography>
              {(batchTimeline.jobworks?.length ?? 0) > 0 ? (
                <Stack spacing={1}>
                  {batchTimeline.jobworks?.map((jw, idx) => (
                    <Paper
                      key={jw.jobworkId}
                      variant="outlined"
                      sx={{
                        p: 2,
                        cursor: "pointer",
                        transition: "all 0.2s",
                        "&:hover": {
                          boxShadow: 2,
                          borderColor: "primary.main",
                        },
                      }}
                      onClick={() => handleJobworkClick(jw.jobworkNumber)}
                    >
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Chip
                          label={jw.jobworkType}
                          size="small"
                          color={jw.jobworkType === "CUTTING" ? "warning" : jw.jobworkType === "STITCHING" ? "primary" : "success"}
                        />
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="body2" fontWeight={600}>{jw.jobworkNumber}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {jw.assignedTo} • {formatToShortDateTime(jw.assignedAt)}
                          </Typography>
                        </Box>
                        <Chip
                          label={jw.jobworkStatus}
                          size="small"
                          color={getJobworkStatusColor(jw.jobworkStatus)}
                        />
                        <Box sx={{ textAlign: "right" }}>
                          <Typography variant="caption" color="text.secondary">Accepted</Typography>
                          <Typography variant="body2" fontWeight={500} color="success.main">
                            {jw.totalAcceptedQuantity} / {jw.totalAssignedQuantity}
                          </Typography>
                        </Box>
                      </Stack>
                    </Paper>
                  ))}
                </Stack>
              ) : (
                <Typography variant="body2" color="text.secondary">No jobworks assigned yet</Typography>
              )}
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
                Timeline ({batchTimeline.timeline?.length ?? 0} events)
              </Typography>
              {(batchTimeline.timeline?.length ?? 0) > 0 ? (
                <Timeline position="alternate" sx={{ padding: 0, margin: 0 }}>
                  {batchTimeline.timeline?.map((event, idx) => {
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
                          {idx < (batchTimeline.timeline?.length ?? 0) - 1 && <TimelineConnector />}
                        </TimelineSeparator>
                        <TimelineContent sx={{ py: "12px", px: 2 }}>
                          <Typography variant="body2" fontWeight={500}>
                            {event.message}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            by {event.performedBy}
                          </Typography>
                          {event.jobworkNumber && (
                            <Chip
                              label={event.jobworkNumber}
                              size="small"
                              variant="outlined"
                              sx={{ mt: 0.5, mr: 0.5 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleJobworkClick(event.jobworkNumber!);
                              }}
                            />
                          )}
                          {event.employeeName && (
                            <Chip
                              icon={<PersonIcon />}
                              label={event.employeeName}
                              size="small"
                              variant="outlined"
                              sx={{ mt: 0.5 }}
                            />
                          )}
                          {(event.items?.length ?? 0) > 0 && (
                            <Stack direction="row" flexWrap="wrap" spacing={0.5} sx={{ mt: 1 }}>
                              {event.items?.slice(0, 3).map((item, i) => (
                                <Chip
                                  key={i}
                                  label={`${item.itemName} (${item.quantity || (item.acceptedQuantity || 0) + (item.damagedQuantity || 0) + (item.salesQuantity || 0)})`}
                                  size="small"
                                  variant="outlined"
                                  sx={{ fontSize: "0.7rem" }}
                                />
                              ))}
                              {(event.items?.length ?? 0) > 3 && (
                                <Chip
                                  label={`+${event.items!.length - 3} more`}
                                  size="small"
                                  sx={{ fontSize: "0.7rem" }}
                                />
                              )}
                            </Stack>
                          )}
                        </TimelineContent>
                      </TimelineItem>
                    );
                  })}
                </Timeline>
              ) : (
                <Typography variant="body2" color="text.secondary">No timeline events yet</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
