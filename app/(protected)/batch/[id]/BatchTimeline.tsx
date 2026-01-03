import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator,
} from "@mui/lab";
import { Typography } from "@mui/material";
import React from "react";
import FastfoodIcon from "@mui/icons-material/Fastfood";
import { LuPackage } from "react-icons/lu";

export default function BatchTimeline() {
  return (
    <>
      <Timeline position="alternate">
        <TimelineItem>
          <TimelineOppositeContent
            sx={{ m: "auto 0" }}
            align="right"
            variant="body2"
            color="text.secondary"
          >
            9:30 am
          </TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineConnector />
            <TimelineDot>
              <LuPackage size={30}  />
            </TimelineDot>
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent sx={{ py: "12px", px: 2 }}>
            <Typography variant="h6" component="span">
              Eat
            </Typography>
            <Typography>Because you need strength</Typography>
          </TimelineContent>
        </TimelineItem>
      </Timeline>
    </>
  );
}
