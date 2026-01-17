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
  useMediaQuery,
  useTheme,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import MenuIcon from "@mui/icons-material/Menu";

import SideBarContent from "./SideBarContent";
import UserMenu from "./UserMenu";
import { usePathname } from "next/navigation";

const DRAWER_WIDTH = 250;
const COLLAPSED_WIDTH = 70;

export default function AppShell({ children }: { children: React.ReactNode }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [collapsed, setCollapsed] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [logoHover, setLogoHover] = React.useState(false);

  const pathname = usePathname();
  const firstSegment = pathname.split("/").filter(Boolean)[0] ?? "";
  const title =
    firstSegment.charAt(0).toUpperCase() +
    firstSegment.slice(1) +
    " Management";

  /* ---------------- Drawer Content ---------------- */

  const drawerContent = (
    <>
      {/* Header */}
      <Box
        onMouseEnter={() => setLogoHover(true)}
        onMouseLeave={() => setLogoHover(false)}
        sx={{
          height: 56,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mt : isMobile ? 7 : ""
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
              py: 2,
              mt: 1,
            }}
          >
            <Typography fontWeight={600}>Lakshmi Garments</Typography>
            {!isMobile && (
              <IconButton size="small" onClick={() => setCollapsed(true)}>
                <ChevronLeftIcon />
              </IconButton>
            )}
          </Box>
        )}

        {collapsed && !logoHover && (
          <Typography sx={{ mt: 2 }} fontWeight={600}>
            LG
          </Typography>
        )}

        {collapsed && logoHover && !isMobile && (
          <IconButton
            sx={{ mt: 2 }}
            size="small"
            onClick={() => setCollapsed(false)}
          >
            <ChevronRightIcon />
          </IconButton>
        )}
      </Box>

      <SideBarContent
        collapsed={!isMobile && collapsed}
        onItemClick={() => setMobileOpen(false)}
      />
    </>
  );

  /* ---------------- Render ---------------- */

  return (
    <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <CssBaseline />

      {/* 🔹 Desktop Drawer */}
      {!isMobile && (
        <Drawer
          variant="permanent"
          sx={{
            width: collapsed ? COLLAPSED_WIDTH : DRAWER_WIDTH,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: collapsed ? COLLAPSED_WIDTH : DRAWER_WIDTH,
              transition: "width 0.25s",
              overflowX: "hidden",
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}

      {/* 🔹 Mobile Drawer */}
      {isMobile && (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            "& .MuiDrawer-paper": {
              width: DRAWER_WIDTH,
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}

      {/* ---------------- Main Content ---------------- */}
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* 🔹 Top App Bar */}
        <AppBar
          position="sticky"
          color="inherit"
          elevation={1}
          sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
        >
          <Toolbar sx={{ justifyContent: "space-between" }}>
            {isMobile && (
              <IconButton
                edge="start"
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                <MenuIcon />
              </IconButton>
            )}

            <Typography variant="h5" fontWeight={600}>
              {title}
            </Typography>

            <UserMenu />
          </Toolbar>
        </AppBar>

        {/* 🔹 Scrollable Content */}
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
