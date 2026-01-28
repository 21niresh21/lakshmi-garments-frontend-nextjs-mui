"use client";

import * as React from "react";
import {
  Box,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Collapse,
  Popper,
  Paper,
  Fade,
  Avatar,
  Menu,
  MenuItem,
  Card,
} from "@mui/material";

import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import PaletteIcon from "@mui/icons-material/Palette";
import SettingsIcon from "@mui/icons-material/Settings";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { alpha } from "@mui/material/styles";

import { usePathname, useRouter } from "next/navigation";
import { navigationConfig, NavItem } from "../navigation/navigationConfig";
import { useUser } from "@/app/context/UserContext";
import { useAuthActions } from "@/app/hooks/useAuthActions";

interface SideBarContentProps {
  collapsed: boolean;
  onItemClick: () => void;
}

export default function SideBarContent({
  collapsed,
  onItemClick,
}: SideBarContentProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useUser();
  const userRole = user?.roles?.[0] ?? "GUEST";
  const { logout } = useAuthActions();

  /** open / close state per parent menu (for expanded sidebar) */
  const [openMap, setOpenMap] = React.useState<Record<string, boolean>>({});

  /** Hover state for collapsed sidebar */
  const [hoverAnchorEl, setHoverAnchorEl] = React.useState<HTMLElement | null>(
    null,
  );
  const [hoveredItem, setHoveredItem] = React.useState<NavItem | null>(null);

  /** User menu anchor */
  const [userMenuAnchorEl, setUserMenuAnchorEl] =
    React.useState<HTMLElement | null>(null);

  // Timer to prevent immediate closing when moving to popper
  const closeTimer = React.useRef<NodeJS.Timeout | null>(null);

  const toggle = (key: string) => {
    setOpenMap((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  /** auto-open parent when child route is active */
  React.useEffect(() => {
    const map: Record<string, boolean> = {};

    navigationConfig.forEach((group) => {
      group.items.forEach((item) => {
        if (item.children) {
          map[item.label] = item.children.some((c) =>
            pathname.startsWith(c.href ?? ""),
          );
        }
      });
    });

    setOpenMap(map);
  }, [pathname]);

  const handleHoverEnter = (
    event: React.MouseEvent<HTMLElement>,
    item: NavItem,
  ) => {
    if (collapsed && item.children) {
      if (closeTimer.current) clearTimeout(closeTimer.current);
      setHoverAnchorEl(event.currentTarget);
      setHoveredItem(item);
    }
  };

  const handleHoverLeave = () => {
    if (collapsed) {
      closeTimer.current = setTimeout(() => {
        setHoverAnchorEl(null);
        setHoveredItem(null);
      }, 150); // Small delay to cross the gap
    }
  };

  const handlePopperEnter = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  };

  const hasAccess = (allowedRoles?: string[]) => {
    if (!allowedRoles || allowedRoles.length === 0) return true;
    return allowedRoles.includes(userRole);
  };

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* ================= MAIN NAV ================= */}
      <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
        {navigationConfig.map((group) => {
          const isAllowedGroup = hasAccess(group.allowFor);
          const visibleItems = group.items.filter((i) => !i.hideInSidebar && hasAccess(i.allowFor));

          if (!isAllowedGroup || visibleItems.length === 0) return null;

          return (
            <Box key={group.title} sx={{ mb: 1 }}>
              {!collapsed && (
                <Typography
                  variant="caption"
                  sx={{
                    px: 2,
                    py: 1,
                    display: "block",
                    color: "text.secondary",
                    fontWeight: 600,
                  }}
                >
                  {group.title.toUpperCase()}
                </Typography>
              )}

              <List dense>
                {visibleItems.map((item: NavItem) => {
                  const isNested = Boolean(item.children);
                  const isActive = isNested
                    ? item.children?.some(
                        (child) =>
                          child.href && pathname.startsWith(child.href),
                      )
                    : item.href
                    ? pathname.startsWith(item.href)
                    : false;

                  return (
                    <React.Fragment key={item.label}>
                      {/* Parent */}
                      <ListItemButton
                        selected={isActive}
                        onMouseEnter={(e) => handleHoverEnter(e, item)}
                        onMouseLeave={handleHoverLeave}
                        onClick={() => {
                          if (isNested && !collapsed) {
                            toggle(item.label);
                          } else if (item.href) {
                            router.push(item.href);
                            onItemClick();
                          }
                        }}
                        sx={{
                          mx: 1,
                          my: 0.5,
                          py: 1,
                          borderRadius: 1,
                          justifyContent: collapsed ? "center" : "flex-start",
                          "&.Mui-selected": {
                            backgroundColor: "primary.main",
                            color: "primary.contrastText",
                            "& .MuiListItemIcon-root": { color: "inherit" },
                            "&:hover": { backgroundColor: "primary.dark" },
                          },
                        }}
                      >
                        <ListItemIcon
                          sx={{
                            minWidth: collapsed ? "auto" : 40,
                            justifyContent: "center",
                            color: isActive ? "inherit" : "text.secondary",
                          }}
                        >
                          {item.icon}
                        </ListItemIcon>

                        {!collapsed && (
                          <>
                            <ListItemText primary={item.label} />
                            {isNested &&
                              (openMap[item.label] ? (
                                <ExpandLess />
                              ) : (
                                <ExpandMore />
                              ))}
                          </>
                        )}
                      </ListItemButton>

                      {/* Children (Expanded mode) */}
                      {isNested && !collapsed && (
                        <Collapse
                          in={openMap[item.label]}
                          timeout="auto"
                          unmountOnExit
                        >
                          <List dense disablePadding>
                            {item.children!.map((child: NavItem) => {
                              if (!hasAccess(child.allowFor) || child.hideInSidebar) return null;
                              
                              const isChildActive = child.href ? pathname.startsWith(child.href) : false;

                              return (
                                <ListItemButton
                                  key={child.href}
                                  selected={isChildActive}
                                  sx={{
                                    pl: 6,
                                    mx: 1,
                                    my: 0.25,
                                    py: 1,
                                    borderRadius: 1,
                                    "&.Mui-selected": {
                                      backgroundColor: "primary.main",
                                      color: "primary.contrastText",
                                      fontWeight: 600,
                                      "& .MuiListItemIcon-root": { color: "inherit" },
                                      "&:hover": { backgroundColor: "primary.dark" },
                                    },
                                  }}
                                  onClick={() => {
                                    if (child.href) {
                                      router.push(child.href);
                                      onItemClick();
                                    }
                                  }}
                                >
                                  <ListItemIcon sx={{ minWidth: 32}}>
                                    {child.icon}
                                  </ListItemIcon>
                                  <ListItemText primary={child.label} />
                                </ListItemButton>
                              );
                            })}
                          </List>
                        </Collapse>
                      )}
                    </React.Fragment>
                  );
                })}
              </List>

              <Divider sx={{ my: 1, opacity: 0.6 }} />
            </Box>
          );
        })}
      </Box>

      {/* ================= FLOATING POPPER (For collapsed mode) ================= */}
      <Popper
        open={Boolean(hoverAnchorEl)}
        anchorEl={hoverAnchorEl}
        placement="right-start"
        transition
        disablePortal={false}
        modifiers={[
          {
            name: "offset",
            options: {
              offset: [0, 8], // Adds a small gap visually but logic handles the 'bridge'
            },
          },
        ]}
        sx={{ zIndex: 2000 }}
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={200}>
            <Paper
              elevation={8}
              sx={{
                minWidth: 200,
                overflow: "hidden",
                borderRadius: 2,
                border: "1px solid",
                borderColor: "divider",
                bgcolor: "background.paper",
                pointerEvents: "auto", // Ensure it catches mouse
              }}
              onMouseEnter={handlePopperEnter}
              onMouseLeave={handleHoverLeave}
            >
              <Box
                sx={{
                  py: 1,
                  bgcolor: "primary.main",
                  color: "primary.contrastText",
                  px: 2,
                }}
              >
                <Typography variant="subtitle2" fontWeight={700}>
                  {hoveredItem?.label.toUpperCase()}
                </Typography>
              </Box>
              <List dense>
                {hoveredItem?.children?.map((child) => {
                  if (!hasAccess(child.allowFor) || child.hideInSidebar) return null;

                  const isChildActive = child.href ? pathname.startsWith(child.href) : false;
                  return (
                    <ListItemButton
                      key={child.href}
                      selected={isChildActive}
                      onClick={() => {
                        if (child.href) {
                          router.push(child.href);
                          onItemClick();
                          setHoverAnchorEl(null);
                          setHoveredItem(null);
                        }
                      }}
                      sx={{
                        px: 2,
                        mx: 1,
                        my: 0.5,
                        borderRadius: 1,
                        // Match main item styling
                        "&.Mui-selected": {
                          backgroundColor: "primary.main",
                          color: "primary.contrastText",
                          "& .MuiListItemIcon-root": { color: "inherit" },
                          "&:hover": { backgroundColor: "primary.dark" },
                        },
                        "&:hover": {
                          backgroundColor: isChildActive
                            ? "primary.dark"
                            : "action.hover",
                        },
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 32,
                          color: isChildActive ? "inherit" : "text.secondary",
                        }}
                      >
                        {child.icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={child.label}
                        primaryTypographyProps={{
                          fontWeight: isChildActive ? 600 : 400,
                        }}
                      />
                    </ListItemButton>
                  );
                })}
              </List>
            </Paper>
          </Fade>
        )}
      </Popper>

      {!collapsed && (

        <Box
          sx={{
            mx: 1.5,
            mb: 2,
            position: "relative",
            "&:hover .main-card": {
              transform: "translateY(15px)",
              boxShadow: 8,
            },
            "&:hover .back-card": {
              transform: "translateY(-45px) scale(0.96)",
              opacity: 1,
            },
          }}
        >
          {/* Back Card (Upcoming: Accounts) */}
          <Card
            className="back-card"
            elevation={5}
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              zIndex: 0,
              opacity: 0,
              borderRadius: 2,
              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.2),
              transform: "translateY(0) scale(0.9)",
              transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
              display: "flex",
              alignItems: "flex-start",
              px: 2,
              py : 2
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, width: "100%" }}>
              <AccountBalanceWalletIcon 
                sx={{ fontSize: 22, color: "secondary.main", mb: 0.5 }} 
              />
              <Box>
                <Typography variant="caption" sx={{ fontWeight: 700, color: "secondary.main", display: "block", lineHeight: 1, fontSize: "0.85rem" }}>
                  Accounts Module
                </Typography>
              </Box>
            </Box>
          </Card>

          {/* Main Card */}
          <Card
            className="main-card"
            elevation={3}
            sx={{
              position: "relative",
              zIndex: 2,
              borderRadius: 2,
              background: (theme) =>
                `linear-gradient(135deg, ${theme.palette.primary.main}15 0%, ${theme.palette.primary.dark}15 100%)`,
              border: (theme) => `1px solid ${theme.palette.primary.main}30`,
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            <Box
              sx={{
                p: 2,
                display: "flex",
                alignItems: "center",
                gap: 1.5,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  bgcolor: "primary.main",
                  color: "primary.contrastText",
                }}
              >
                <RocketLaunchIcon sx={{ fontSize: 20 }} />
              </Box>

              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 700, color: "primary.main", mb: 0.25 }}
                >
                  More Features Coming Soon
                </Typography>
                <Typography variant="caption" sx={{ color: "text.secondary", lineHeight: 1.4 }}>
                  We're working on new features to enhance your experience.
                </Typography>
              </Box>
            </Box>
          </Card>
        </Box>
      )}



      {/* ================= USER / SETTINGS ================= */}

      <Divider />

      <List dense sx={{ p: 1 }}>
        <ListItemButton
          onClick={(e) => setUserMenuAnchorEl(e.currentTarget)}
          sx={{
            mx: 1,
            borderRadius: 1,
            justifyContent: collapsed ? "center" : "flex-start",
            "&:hover": { bgcolor: "action.hover" },
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: collapsed ? "auto" : 40,
              justifyContent: "center",
            }}
          >
            <Avatar
              sx={{
                width: 32,
                height: 32,
                bgcolor: "primary.main",
                fontSize: "0.875rem",
                fontWeight: 700,
                color: "primary.contrastText",
              }}
            >
              {user?.username?.[0]?.toUpperCase() || "U"}
            </Avatar>
          </ListItemIcon>

          {!collapsed && (
            <ListItemText
              primary={user?.username || "User"}
              primaryTypographyProps={{ fontWeight: 600, noWrap: true }}
              secondary="Account Settings"
              secondaryTypographyProps={{ variant: "caption" }}
            />
          )}
        </ListItemButton>
      </List>

      {/* User Dropdown Menu */}
      <Menu
        anchorEl={userMenuAnchorEl}
        open={Boolean(userMenuAnchorEl)}
        onClose={() => setUserMenuAnchorEl(null)}
        anchorOrigin={{
          vertical: "top",
          horizontal: collapsed ? "right" : "center",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: collapsed ? "left" : "center",
        }}
        PaperProps={{
          sx: {
            mt: -1,
            minWidth: 180,
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            borderRadius: 2,
            border: "1px solid",
            borderColor: "divider",
          },
        }}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
            {user?.username}
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block">
            {userRole.replace("_", " ")}
          </Typography>
        </Box>
        <Divider />
        <MenuItem
          onClick={() => {
            setUserMenuAnchorEl(null);
            router.push("/profile");
          }}
          sx={{ py: 1 }}
        >
          <ListItemIcon>
            <AccountCircleIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary="My Profile"
            primaryTypographyProps={{ variant: "body2" }}
          />
        </MenuItem>

        <Divider />
        {/* <MenuItem
          onClick={() => {
            setUserMenuAnchorEl(null);
            router.push("/settings/customize");
          }}
          sx={{ py: 1 }}
        >
          <ListItemIcon>
            <PaletteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Customize" primaryTypographyProps={{ variant: "body2" }} />
        </MenuItem> */}

        {/* <Divider /> */}
        <MenuItem
          onClick={() => {
            setUserMenuAnchorEl(null);
            logout();
          }}
          sx={{
            py: 1,
            color: "error.main",
            "& .MuiListItemIcon-root": { color: "error.main" },
          }}
        >
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary="Logout"
            primaryTypographyProps={{ variant: "body2", fontWeight: 600 }}
          />
        </MenuItem>
      </Menu>
    </Box>
  );
}
