"use client";

import * as React from "react";
import { Avatar, IconButton, Menu, MenuItem, Divider } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { useRouter } from "next/navigation";

type User = {
  name?: string;
};

export default function UserMenu() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [user, setUser] = React.useState<User | null>(null);
  const router = useRouter();

  React.useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("user");
    document.cookie = "auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    router.push("/login");
  };

  return (
    <>
      <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
        <Avatar sx={{ bgcolor: "blue" }}>
          {user?.name?.[0]?.toUpperCase() || "U"}
        </Avatar>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem disabled>{user?.name || "User"}</MenuItem>
        <Divider />
        <MenuItem onClick={logout}>
          <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
          Logout
        </MenuItem>
      </Menu>
    </>
  );
}
