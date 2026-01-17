"use client";

import {
  Box,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import { sidebarGroups } from "./sidebarConfig";
import { useUser } from "@/app/context/UserContext";

export default function SideBarContent({
  collapsed,
  onItemClick,
}: {
  collapsed: boolean;
  onItemClick: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useUser();
  const userRole = user?.roles?.[0] ?? "GUEST";

  return (
    <Box sx={{ mt: 1 }}>
      {sidebarGroups.map(
        (group) =>
          group.allowFor?.includes(userRole ?? "") && (
            <Box key={group.title} sx={{ mb: 1 }}>
              {/* Group Title */}
              {!collapsed && (
                <Typography
                  variant="caption"
                  sx={{ px: 2, color: "text.secondary", fontWeight: 600 }}
                >
                  {group.title.toUpperCase()}
                </Typography>
              )}

              <List dense>
                {group.items.map((item) => {
                  const selected = pathname.startsWith(item.href);

                  return (
                    <ListItemButton
                      key={item.href}
                      selected={selected}
                      onClick={() => {
                        router.push(item.href);
                        onItemClick();
                      }}
                      sx={{
                        mx: 1,
                        my: 0.5,
                        borderRadius: 1,
                        whiteSpace: "nowrap",
                        justifyContent: collapsed ? "center" : "flex-start",
                        px: collapsed ? 1 : 2,
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: collapsed ? "auto" : 40,
                          justifyContent: "center",
                        }}
                      >
                        {item.icon}
                      </ListItemIcon>

                      {!collapsed && <ListItemText primary={item.label} />}
                    </ListItemButton>
                  );
                })}
              </List>

              <Divider sx={{ my: 1 }} />
            </Box>
          )
      )}
    </Box>
  );
}
