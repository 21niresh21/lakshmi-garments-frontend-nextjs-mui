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

export default function SideBarContent({ collapsed }: { collapsed: boolean }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useUser();
  console.log(user);

  return (
    <Box sx={{ mt: 1 }}>
      {sidebarGroups.map(
        (group) =>
          group.allowFor?.includes(user?.role.name ?? "") && (
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
                      onClick={() => router.push(item.href)}
                      sx={{
                        mx: 1,
                        my: 0.5,
                        borderRadius: 1,
                        whiteSpace: "nowrap",
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 40 }}>
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
