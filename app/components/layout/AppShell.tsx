"use client";

import * as React from "react";
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import SideBarContent from "./SideBarContent";
import UserMenu from "./UserMenu";
import { usePathname } from "next/navigation";

const DRAWER_WIDTH = 250;
const COLLAPSED_WIDTH = 70;

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = React.useState(false);
  const [logoHover, setLogoHover] = React.useState(false);

  const pathname = usePathname();
  const firstSegment = pathname.split("/").filter(Boolean)[0] ?? "";
  const title =
    firstSegment.charAt(0).toUpperCase() +
    firstSegment.slice(1) +
    " Management";

  return (
    <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <CssBaseline />

      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: collapsed ? COLLAPSED_WIDTH : DRAWER_WIDTH,
          "& .MuiDrawer-paper": {
            width: collapsed ? COLLAPSED_WIDTH : DRAWER_WIDTH,
            transition: "width 0.25s",
            overflowX: "hidden",
          },
        }}
      >
        {/* Header */}
        <Box
          onMouseEnter={() => setLogoHover(true)}
          onMouseLeave={() => setLogoHover(false)}
          sx={{
            height: 56,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {!collapsed && (
            <Box
              sx={{
                width: "100%",
                px: 2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                py : 2
              }}
            >
              <Typography fontWeight={600}>Lakshmi Garments</Typography>
              <IconButton size="small" onClick={() => setCollapsed(true)}>
                <ChevronLeftIcon />
              </IconButton>
            </Box>
          )}

          {collapsed && !logoHover && (
            <Typography fontWeight={600}>LG</Typography>
          )}

          {collapsed && logoHover && (
            <IconButton size="small" onClick={() => setCollapsed(false)}>
              <ChevronRightIcon />
            </IconButton>
          )}
        </Box>

        <SideBarContent collapsed={collapsed} />
      </Drawer>

      {/* Main */}
      {/* Main */}
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Top bar */}
        <AppBar
          position="sticky"
          color="inherit"
          elevation={1}
          sx={{ top: 0, zIndex: (theme) => theme.zIndex.drawer + 1 }}
        >
          <Toolbar sx={{ justifyContent: "space-between" }}>
            <Typography variant="h5" fontWeight={600}>
              {title}
            </Typography>
            <UserMenu />
          </Toolbar>
        </AppBar>

        {/* Scrollable content */}
        <Box
          sx={{
            flexGrow: 1,
            overflowY: "auto",
            bgcolor: "#f5f5f5",
            p: 2,
          }}
        >
          <Box sx={{ p: 2, bgcolor: "#fff", minHeight: "100%" }}>
            {children}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
