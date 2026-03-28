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
  Chip,
  Grid,
  Stack,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import { formatToShortDateTime } from "@/app/utils/date";
import {
  BatchTimelineStage,
  BatchTimelineStageColorMap,
  BatchTimelineStageIconMap,
} from "@/app/_types/BatchTimelineStage";
import PersonIcon from "@mui/icons-material/Person";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AssignmentIcon from "@mui/icons-material/Assignment";

/* ───────────────── Types ───────────────── */

interface SubCategory {
  id: number;
  subCategoryName: string;
  quantity: number;
}

interface BatchDetails {
  id: number;
  categoryName: string;
  serialCode: string;
  batchStatus: string;
  isUrgent: boolean;
  remarks: string;
  createdAt: string;
  createdBy: string;
  availableQuantity: number;
  subCategories: SubCategory[];
  items: any[];
}

interface TimelineEvent {
  message: string;
  timeTakenFromPrevious: string | null;
  transactionType: string | null;
  performedAt: string;
  stage: BatchTimelineStage;
}

interface BatchTimelineResponse {
  batchDetails: BatchDetails;
  timelineDetail: TimelineEvent[];
}

type Props = {
  batchTimeline: BatchTimelineResponse;
};

/* ───────────────── Component ───────────────── */

export default function BatchTimeline({ batchTimeline }: Props) {
  const theme = useTheme();

  if (!batchTimeline) return null;

  const { batchDetails, timelineDetail } = batchTimeline;

  if (!batchDetails || !timelineDetail) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography color="text.secondary">No timeline data available</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", py: 3, px: 2 }}>
      {/* ─── Batch Info Card ─── */}
      <Card
        variant="outlined"
        sx={{
          p: 3,
          mb: 4,
          borderLeft: `4px solid ${batchDetails.isUrgent ? theme.palette.error.main : theme.palette.primary.main}`,
        }}
      >
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Stack spacing={1}>
              <Typography variant="caption" color="text.secondary">
                Serial Code
              </Typography>
              <Typography variant="h6" fontWeight={700}>
                {batchDetails.serialCode}
              </Typography>
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Stack spacing={1}>
              <Typography variant="caption" color="text.secondary">
                Category
              </Typography>
              <Typography variant="h6" fontWeight={700}>
                {batchDetails.categoryName}
              </Typography>
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Stack spacing={1}>
              <Typography variant="caption" color="text.secondary">
                Status
              </Typography>
              <Chip
                label={batchDetails.batchStatus}
                size="small"
                color={
                  batchDetails.batchStatus === "COMPLETED"
                    ? "success"
                    : batchDetails.batchStatus === "ASSIGNED"
                    ? "primary"
                    : "default"
                }
                sx={{ width: "fit-content" }}
              />
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Stack spacing={1}>
              <Typography variant="caption" color="text.secondary">
                Available Quantity
              </Typography>
              <Typography variant="body1" fontWeight={600}>
                {batchDetails.availableQuantity}
              </Typography>
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Stack spacing={1}>
              <Typography variant="caption" color="text.secondary">
                Created
              </Typography>
              <Typography variant="body2">
                {formatToShortDateTime(batchDetails.createdAt)} by {batchDetails.createdBy}
              </Typography>
            </Stack>
          </Grid>
        </Grid>

        {/* Sub Categories */}
        {batchDetails.subCategories && batchDetails.subCategories.length > 0 && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ mb: 1, display: "block" }}>
              Sub Categories
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {batchDetails.subCategories.map((sub) => (
                <Chip
                  key={sub.id}
                  label={`${sub.subCategoryName}: ${sub.quantity}`}
                  size="small"
                  variant="outlined"
                  sx={{ fontWeight: 600 }}
                />
              ))}
            </Stack>
          </Box>
        )}

        {batchDetails.isUrgent && (
          <Chip
            label="URGENT"
            color="error"
            size="small"
            sx={{ mt: 2, fontWeight: 700 }}
          />
        )}
      </Card>

      {/* ─── Timeline Section ─── */}
      <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>
        Timeline ({timelineDetail.length} events)
      </Typography>

      {timelineDetail.length === 0 ? (
        <Box sx={{ p: 3, textAlign: "center", bgcolor: alpha(theme.palette.background.default, 0.5), borderRadius: 2 }}>
          <Typography color="text.secondary">No timeline events yet</Typography>
        </Box>
      ) : (
        <Timeline position="right" sx={{ maxWidth: 900, mx: "auto" }}>
          {timelineDetail.map((event, index) => {
            const Icon = BatchTimelineStageIconMap[event.stage] || AssignmentIcon;
            const color = BatchTimelineStageColorMap[event.stage] || "grey";
            const isLast = index === timelineDetail.length - 1;

            return (
              <TimelineItem key={index}>
                <TimelineOppositeContent sx={{ py: "12px", px: 2, flex: 0.3 }}>
                  <Typography variant="caption" fontWeight={700} color="text.secondary">
                    {formatToShortDateTime(event.performedAt)}
                  </Typography>
                </TimelineOppositeContent>

                <TimelineSeparator>
                  <TimelineDot color={color as any} sx={{ p: 1.5, boxShadow: 2 }}>
                    <Icon size={24} strokeWidth={1} />
                  </TimelineDot>
                  {!isLast && (
                    <TimelineConnector
                      sx={{ width: 3, bgcolor: alpha(theme.palette.divider, 0.5) }}
                    />
                  )}
                </TimelineSeparator>

                <TimelineContent sx={{ py: "12px", px: 3 }}>
                  <Card
                    variant="outlined"
                    sx={{
                      p: 2,
                      mb: 2,
                      borderLeft: `4px solid ${
                        theme.palette[
                          color as "primary" | "secondary" | "info" | "error" | "success"
                        ]?.main || theme.palette.divider
                      }`,
                      transition: "all 0.2s",
                      "&:hover": {
                        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                        transform: "translateY(-2px)",
                      },
                    }}
                  >
                    <Typography variant="body2" fontWeight={600}>
                      {event.message}
                    </Typography>

                    <Stack
                      direction="row"
                      spacing={1}
                      sx={{ mt: 1.5, flexWrap: "wrap", gap: 1 }}
                    >
                      {event.timeTakenFromPrevious && event.timeTakenFromPrevious !== "N/A" && (
                        <Chip
                          icon={<AccessTimeIcon sx={{ fontSize: "14px !important" }} />}
                          label={event.timeTakenFromPrevious}
                          size="small"
                          sx={{
                            bgcolor: alpha(theme.palette.info.main, 0.08),
                            color: "info.main",
                            border: "none",
                          }}
                        />
                      )}
                      {event.transactionType && (
                        <Chip
                          label={event.transactionType}
                          size="small"
                          variant="outlined"
                        />
                      )}
                    </Stack>
                  </Card>
                </TimelineContent>
              </TimelineItem>
            );
          })}
        </Timeline>
      )}
    </Box>
  );
}
