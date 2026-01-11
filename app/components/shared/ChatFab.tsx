"use client";

import * as React from "react";
import {
  Fab,
  Drawer,
  Box,
  Typography,
  IconButton,
  TextField,
} from "@mui/material";
import AssistantIcon from "@mui/icons-material/Assistant";
import CloseIcon from "@mui/icons-material/Close";

export default function ChatFab() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      {/* Floating Action Button */}
      {!open && (
        <Fab
          color="primary"
          onClick={() => setOpen(true)}
          sx={{
            position: "fixed",
            bottom: 24,
            right: 24,
            zIndex: 2000,
          }}
        >
          <AssistantIcon />
        </Fab>
      )}

      {/* Chat Drawer */}
      <Drawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          sx: {
            width: 360,
            display: "flex",
            flexDirection: "column",
          },
        }}
        sx={{
          zIndex: (theme) => theme.zIndex.modal + 1,
        }}
      >
        {/* Header */}
        <Box
          sx={{
            p: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid #eee",
          }}
        >
          <Typography fontWeight={600}>Chat Assistant</Typography>
          <IconButton onClick={() => setOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Messages */}
        <Box
          sx={{
            flexGrow: 1,
            p: 2,
            overflowY: "auto",
            bgcolor: "#fafafa",
          }}
        >
          <Typography variant="body2" color="text.secondary">
            👋 Hi! How can I help you today?
          </Typography>
        </Box>

        {/* Input */}
        <Box
          sx={{
            p: 2,
            borderTop: "1px solid #eee",
            bgcolor: "#fff",
          }}
        >
          <TextField fullWidth size="small" placeholder="Type a message..." />
        </Box>
      </Drawer>
    </>
  );
}
