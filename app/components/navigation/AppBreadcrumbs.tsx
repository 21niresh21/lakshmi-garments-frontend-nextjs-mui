"use client";

import { Breadcrumbs, Typography, Link, Box, IconButton } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { useRouter } from "next/navigation";
import { useBreadcrumbs } from "./useBreadcrumbs";
import { useHistory } from "@/app/context/HistoryContext";

export default function AppBreadcrumbs() {
  const router = useRouter();
  const crumbs = useBreadcrumbs();
  const { previousPath } = useHistory();

  const showBackButton = previousPath && !previousPath.includes("/login");

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      {showBackButton && (
        <IconButton size="small" onClick={() => router.back()}>
          <ArrowBackIcon fontSize="inherit" />
        </IconButton>
      )}

      <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />}>
        {crumbs.map((crumb, idx) =>
          idx === crumbs.length - 1 ? (
            <Typography
              key={crumb.label}
              sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
              fontWeight={600}
            >
              {crumb.icon}
              {crumb.label}
            </Typography>
          ) : (
            <Link
              key={crumb.label}
              underline="hover"
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                cursor: "pointer",
              }}
              onClick={() => crumb.href && router.push(crumb.href)}
            >
              {crumb.icon}
              {crumb.label}
            </Link>
          ),
        )}
      </Breadcrumbs>
    </Box>
  );
}
