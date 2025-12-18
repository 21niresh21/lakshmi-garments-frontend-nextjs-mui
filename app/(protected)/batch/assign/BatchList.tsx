"use client";

import {
  Chip,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
  Popper,
  Box,
  ClickAwayListener,
  Stack,
} from "@mui/material";
import CommentIcon from "@mui/icons-material/Comment";
import { Batch } from "@/app/_types/Batch";
import { formatToShortDate } from "@/app/utils/date";
import { useState } from "react";

interface Props {
  batchList: Batch[];
}

export default function BatchList({ batchList }: Props) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>, batch: Batch) => {
    setAnchorEl(event.currentTarget);
    setSelectedBatch(batch);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedBatch(null);
  };

  const open = Boolean(anchorEl);

  return (
    <Paper
      sx={{
        height: "100%",
        p: 2,
        display: "flex",
        flexDirection: "column",
      }}
      elevation={2}
    >
      <Typography fontWeight={600} mb={1}>
        Priority Batches (Date)
      </Typography>
      <Divider />

      {/* Scrollable list */}
      <Box sx={{ flex: 1, overflow: "auto", minHeight: 0 }}>
        <List>
          {batchList.map((batch) => (
            <ListItem
              key={batch.id}
              disableGutters
              secondaryAction={
                <IconButton onClick={(e) => handleClick(e, batch)} size="small">
                  <CommentIcon fontSize="small" />
                </IconButton>
              }
            >
              <ListItemText
                primary={
                  <Stack direction="row" alignItems="center" columnGap={1}>
                    <Typography display="flex" alignItems="center" gap={1}>
                      {batch.serialCode}
                    </Typography>
                    <Chip
                      label={formatToShortDate(batch.createdAt)}
                      size="small"
                      sx={{ fontSize: 10, height : 12, p : 1.3 }}
                    />
                  </Stack>
                }
              />
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Remarks Popper */}
      <Popper open={open} anchorEl={anchorEl} placement="left">
        <ClickAwayListener onClickAway={handleClose}>
          <Paper sx={{ p: 1.5, maxWidth: 220 }}>
            <Typography variant="caption" fontWeight={600}>
              Remarks
            </Typography>
            <Typography variant="body2">
              {selectedBatch?.remarks || "No remarks available"}
            </Typography>
          </Paper>
        </ClickAwayListener>
      </Popper>
    </Paper>
  );
}
