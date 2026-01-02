"use client";

import { useEffect, useState } from "react";
import { Box, Grid, Typography } from "@mui/material";
import { Inventory } from "@/app/_types/Inventory";
import { fetchInventory } from "@/app/api/inventoryApi";
import { useNotification } from "@/app/components/shared/NotificationProvider";
import CategoryIcon from "@mui/icons-material/Category";
import InboxIcon from "@mui/icons-material/Inbox";
import CategoryCard from "../batch/create/CategoryCard";

export default function Page() {
  const { notify } = useNotification();
  const [inventory, setInventory] = useState<Inventory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInventory = async () => {
      try {
        const data = await fetchInventory();
        setInventory(data);
      } catch {
        notify("Error fetching inventory data", "error");
      } finally {
        setLoading(false);
      }
    };

    loadInventory();
  }, []);

  if (loading) {
    return (
      <Box sx={{ textAlign: "center", mt: 10 }}>
        <Typography>Loading inventory...</Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={2}>
      <Grid size={12}>
        {inventory.length > 0 ? (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 2,
              alignItems: "stretch",
            }}
          >
            {inventory.map((category) => (
              <CategoryCard
                key={category.categoryCode}
                category={category}
                readOnly // 👈 optional prop (see below)
              />
            ))}
          </Box>
        ) : (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              mt: 20,
              flexDirection: "column",
            }}
          >
            <InboxIcon sx={{ fontSize: 100, color: "gray" }} />
            <Typography variant="h6" color="gray">
              Inventory is empty
            </Typography>
          </Box>
        )}
      </Grid>
    </Grid>
  );
}
