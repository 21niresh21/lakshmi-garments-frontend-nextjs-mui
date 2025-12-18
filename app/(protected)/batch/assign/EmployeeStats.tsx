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
import EmojiPeopleIcon from "@mui/icons-material/EmojiPeople";

export default function EmployeeStats() {
  return (
    <Paper
      sx={{
        height: "100%",
        p: 2,
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
      }}
      elevation={2}
    >
      <Stack direction="row" justifyContent="space-between">
        <Typography fontWeight={600} mb={1}>
          Employee Details
        </Typography>
        <EmojiPeopleIcon sx={{ color: "gray" }} />
      </Stack>

      <Divider />

      {/* Scrollable list */}
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          overflowY: "auto",
          display: "grid",
          gridTemplateColumns: "1fr auto",
          rowGap: 1.5,
        }}
      >
        <Typography color="text.secondary">Name</Typography>
        <Typography fontWeight={500}>Ramesh</Typography>

        <Typography color="text.secondary">Avg Time</Typography>
        <Typography fontWeight={500}>10%</Typography>
        <Typography color="text.secondary">Name</Typography>
        <Typography fontWeight={500}>Ramesh</Typography>

        <Typography color="text.secondary">Avg Time</Typography>
        <Typography fontWeight={500}>10%</Typography>

        <Typography color="text.secondary">Name</Typography>
        <Typography fontWeight={500}>Ramesh</Typography>

        <Typography color="text.secondary">Avg Time</Typography>
        <Typography fontWeight={500}>10%</Typography>
      </Box>
    </Paper>
  );
}
