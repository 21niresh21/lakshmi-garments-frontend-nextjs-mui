"use client";

import * as React from "react";
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  Toolbar,
  useMediaQuery,
  useTheme,
  Slide,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import MenuIcon from "@mui/icons-material/Menu";
import { usePathname } from "next/navigation";
import AppBreadcrumbs from "../navigation/AppBreadcrumbs";
import SideBarContent from "./SideBarContent";
import SessionExpiryTracker from "../shared/SessionExpiryTracker";

const DRAWER_WIDTH = 250;
const COLLAPSED_WIDTH = 70;

export default function AppShell({ children }: { children: React.ReactNode }) {
  const theme = useTheme();
  const pathname = usePathname();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const isAnalyticsPage = pathname.includes("/analytics");

  const [collapsed, setCollapsed] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [logoHover, setLogoHover] = React.useState(false);
  const [showAppBar, setShowAppBar] = React.useState(!isAnalyticsPage);

  // Reset hover state when sidebar state changes to prevent "stuck" icons
  React.useEffect(() => {
    setLogoHover(false);
  }, [collapsed]);

  React.useEffect(() => {
    setShowAppBar(!isAnalyticsPage);
  }, [isAnalyticsPage]);

  const drawerContent = (
    <>
      <Box
        onMouseEnter={() => setLogoHover(true)}
        onMouseLeave={() => setLogoHover(false)}
        sx={{
          ...theme.mixins.toolbar,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.3s",
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        {!collapsed ? (
          <Box
            sx={{
              width: "100%",
              px: 2,
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              height: "100%",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                flexGrow: 1,
              }}
            >
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 700,
                  fontSize: "1rem",
                  letterSpacing: "-0.02em",
                  whiteSpace: "nowrap",
                }}
              >
                Lakshmi Garments
              </Typography>
            </Box>
            {!isMobile && (
              <IconButton
                size="small"
                onClick={() => setCollapsed(true)}
                sx={{ color: "text.secondary" }}
              >
                <ChevronLeftIcon />
              </IconButton>
            )}
          </Box>
        ) : (
          <Box
            onClick={() => setCollapsed(false)}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              height: "100%",
              cursor: "pointer",
              mt: 0.7,
            }}
          >
            {logoHover && !isMobile ? (
              <IconButton>
                <ChevronRightIcon color="primary" />
              </IconButton>
            ) : (
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 2,
                  overflow: "hidden",
                  // bgcolor: "background.paper", // Optional: highlight if SVG is transparent
                  // boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                }}
              >
                <Box
                  component="img"
                  src="/lg_logo.svg"
                  alt="LG Logo"
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                />
              </Box>
            )}
          </Box>
        )}
      </Box>

      <SideBarContent
        collapsed={!isMobile && collapsed}
        onItemClick={() => setMobileOpen(false)}
      />
    </>
  );

  return (
    <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <CssBaseline />

      {!isMobile && (
        <Drawer
          variant="permanent"
          sx={{
            width: collapsed ? COLLAPSED_WIDTH : DRAWER_WIDTH,
            flexShrink: 0,
            ".MuiDrawer-paper": {
              width: collapsed ? COLLAPSED_WIDTH : DRAWER_WIDTH,
              transition: "width 0.25s",
              overflowX: "hidden",
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}

      {isMobile && (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{ ".MuiDrawer-paper": { width: DRAWER_WIDTH } }}
        >
          {drawerContent}
        </Drawer>
      )}

      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
        }}
      >
        {isAnalyticsPage && (
          <Box
            onMouseEnter={() => setShowAppBar(true)}
            sx={{
              position: "fixed",
              top: 0,
              left: isMobile ? 0 : collapsed ? COLLAPSED_WIDTH : DRAWER_WIDTH,
              right: 0,
              height: 15,
              zIndex: theme.zIndex.appBar + 1,
            }}
          />
        )}

        <Slide direction="down" in={showAppBar}>
          <AppBar
            position={isAnalyticsPage ? "fixed" : "sticky"}
            color="inherit"
            elevation={0}
            onMouseLeave={() => isAnalyticsPage && setShowAppBar(false)}
            sx={{
              zIndex: theme.zIndex.drawer + 1,
              borderBottom: "1px solid",
              borderColor: "divider",
              width:
                isAnalyticsPage && !isMobile
                  ? `calc(100% - ${
                      collapsed ? COLLAPSED_WIDTH : DRAWER_WIDTH
                    }px)`
                  : "100%",
            }}
          >
            <Toolbar>
              {isMobile && (
                <IconButton onClick={() => setMobileOpen(true)}>
                  <MenuIcon />
                </IconButton>
              )}

              <AppBreadcrumbs />
            </Toolbar>
          </AppBar>
        </Slide>

        <Box sx={{ flexGrow: 1, overflowY: "auto", p: 2 }}>
          <Box sx={{ p: 2, minHeight: "100%" }}>{children}</Box>
        </Box>
      </Box>
      <SessionExpiryTracker />
    </Box>
  );
}
