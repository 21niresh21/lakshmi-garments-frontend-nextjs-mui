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
import { Box, Card, Divider, Stack, Typography } from "@mui/material";
import { LuPackageOpen } from "react-icons/lu";
import { formatToShortDateTime } from "@/app/utils/date";
import {
  BatchTimelineStage,
  BatchTimelineStageColorMap,
  BatchTimelineStageIconMap,
} from "@/app/_types/BatchTimelineStage";

/* ───────────────── Types ───────────────── */

type TimelineEvent = {
  stage: BatchTimelineStage;
  message: string;
  timeTakenFromPrevious?: string;
  performedAt?: string;
};

type Props = {
  batchTimeline: any;
};

/* ───────────────── Component ───────────────── */

export default function BatchTimeline({ batchTimeline }: Props) {
  if (!batchTimeline) return null;

  const totalQuantity =
    batchTimeline.batchDetails?.subCategories?.reduce(
      (sum: number, subCat: any) => sum + subCat.quantity,
      0
    ) ?? 0;

  const timelineEvents: TimelineEvent[] = batchTimeline.timelineDetail ?? [];

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        width: "100%",
        py: 3,
      }}
    >
      <Box sx={{ maxWidth: 900, width: "100%" }}>
        <Timeline position="right">
          {/* ───────────── Batch Creation ───────────── */}
          <TimelineItem sx={{ minHeight: 100 }}>
            <TimelineOppositeContent
              sx={{
                maxWidth: 400,
                alignSelf: "flex-start",
                pt: 3, // fine-tune vertical alignment
              }}
              align="right"
              variant="body2"
              color="text.secondary"
            >
              {`Batch was created by ${
                batchTimeline.batchDetails.createdBy
              } at ${formatToShortDateTime(
                batchTimeline.batchDetails.createdAt
              )}`}
            </TimelineOppositeContent>

            <TimelineSeparator>
              <TimelineDot color="primary" sx={{ p: 1 }}>
                <LuPackageOpen size={36} strokeWidth={1} />
              </TimelineDot>
              {timelineEvents.length > 0 && <TimelineConnector />}
            </TimelineSeparator>

            <TimelineContent sx={{ py: 2, px: 2 }}>
              <Card sx={{ p: 2, maxWidth: 420 }}>
                <Typography variant="h6">Batch Contents</Typography>
                <Divider sx={{ my: 0.5 }} />

                <Typography fontWeight={600} sx={{ mb: 1 }}>
                  {`${batchTimeline.batchDetails.serialCode} - ${batchTimeline.batchDetails.categoryName}`}
                </Typography>

                <Stack spacing={1}>
                  {batchTimeline.batchDetails.subCategories.map(
                    (subCat: any) => (
                      <Stack
                        key={subCat.id}
                        direction="row"
                        justifyContent="space-between"
                      >
                        <Typography>{subCat.subCategoryName}</Typography>
                        <Typography>{subCat.quantity}</Typography>
                      </Stack>
                    )
                  )}

                  <Stack direction="row" justifyContent="flex-end">
                    <Typography fontWeight={600}>{totalQuantity}</Typography>
                  </Stack>
                </Stack>
              </Card>
            </TimelineContent>
          </TimelineItem>

          {/* ───────────── Timeline Events ───────────── */}
          {timelineEvents.map((event, index) => {
            const isLast = index === timelineEvents.length - 1;

            const Icon = BatchTimelineStageIconMap[event.stage];
            const color = BatchTimelineStageColorMap[event.stage];

            return (
              <TimelineItem key={index} sx={{ minHeight: 150, ml : isLast ? 0 : 0.75 }}>
                <TimelineOppositeContent
                  sx={{ m: "auto 0", maxWidth: 400 }}
                  align="right"
                  variant="body2"
                  color="text.secondary"
                >
                  <Typography variant="body2">{event.message}</Typography>

                  {event.timeTakenFromPrevious && (
                    <Typography
                      variant="caption"
                      color="text.disabled"
                      sx={{ display: "block", mt: 0.5 }}
                    >
                      ⏱ {event.timeTakenFromPrevious} from previous stage
                    </Typography>
                  )}
                </TimelineOppositeContent>

                <TimelineSeparator>
                  <TimelineConnector />
                  <TimelineDot color={color} sx={{ p: 1 }}>
                    <Icon size={36} strokeWidth={1} />
                  </TimelineDot>
                  {!isLast && <TimelineConnector />}
                </TimelineSeparator>

                <TimelineContent sx={{ py: 2, px: 2 }} />
              </TimelineItem>
            );
          })}
        </Timeline>
      </Box>
    </Box>
  );
}
