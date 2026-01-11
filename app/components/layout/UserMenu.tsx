"use client";

import * as React from "react";
import { Avatar, IconButton, Menu, MenuItem, Divider } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { useRouter } from "next/navigation";
import { AuthUser } from "@/app/_types/User";

export default function UserMenu() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [user, setUser] = React.useState<AuthUser | null>(null);
  const router = useRouter();

  React.useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const logout = () => {
    // 1. Clear user data from local storage
    localStorage.removeItem("user");

    // 2. Clear the ACTUAL cookie being used (token)
    // Note: Use the same path used when setting the cookie (usually '/')
    document.cookie =
      "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict";

    // 3. Redirect to login
    router.push("/login");
  };

  return (
    <>
      <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
        <Avatar sx={{ bgcolor: "primary.main", height: 35, width: 35 }}>
          {user?.username?.[0]?.toUpperCase() || "U"}
        </Avatar>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem disabled>
          {`${user?.username} (${user?.username})` || "User"}
        </MenuItem>
        <Divider />
        <MenuItem onClick={logout}>
          <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
          Logout
        </MenuItem>
      </Menu>
    </>
  );
}
