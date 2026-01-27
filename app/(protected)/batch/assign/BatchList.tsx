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
import { GiCardboardBox } from "react-icons/gi";

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
    <Paper elevation={0} sx={{ height: "100%", p: { xs: 1, md: 2 } }}>
      <Typography fontWeight={600} mb={1}>
        Priority Batches
      </Typography>
      <Divider />
      <Box
        sx={{
          flex: 1,
          overflow: "auto",
          maxHeight: { xs: "300px", md: "calc(100vh - 250px)" },
        }}
      >
        {batchList.length > 0 ? (
          <List dense>
            {batchList.map((batch) => (
              <ListItem
                key={batch.id}
                secondaryAction={
                  <IconButton
                    onClick={(e) => handleClick(e, batch)}
                    size="small"
                  >
                    <CommentIcon fontSize="small" />
                  </IconButton>
                }
              >
                <ListItemText
                  primary={
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography variant="body2" fontWeight={500}>
                        {batch.serialCode}
                      </Typography>
                      <Chip
                        label={formatToShortDate(batch.createdAt)}
                        size="small"
                        sx={{ height: 16, fontSize: "0.65rem" }}
                      />
                    </Stack>
                  }
                />
              </ListItem>
            ))}
          </List>
        ) : (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              py: 5,
              opacity: 0.5,
            }}
          >
            <GiCardboardBox size={50} />
            <Typography variant="caption">No Urgent Batches</Typography>
          </Box>
        )}
      </Box>
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
