"use client";

import { useEffect, useState } from "react";
import CategoryCard from "./CategoryCard";
import { Inventory } from "@/app/_types/Inventory";
import { fetchInventory } from "@/app/api/inventoryApi";
import { Box, Button, Grid, Stack, Typography } from "@mui/material";
import CategorySelection from "./CategorySelection";
import { SelectionState } from "./_types/models";
import BatchPreview from "./BatchPreview";
import { fetchNextSerialCode } from "@/app/api/idApi";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import CategoryIcon from "@mui/icons-material/Category";
import { useNotification } from "@/app/components/shared/NotificationProvider";
import InboxIcon from "@mui/icons-material/Inbox";

export default function Page() {
  const { notify } = useNotification();
  const [inventory, setInventory] = useState<Inventory[]>([]);
  const [selection, setSelection] = useState<SelectionState | null>(null);
  const [nextSerialCode, setNextSerialCode] = useState<string>("");

  const onCategorySelect = (category: Inventory) => {
    setSelection({
      categoryName: category.categoryName,
      urgent: false,
      remarks: "",
      items: category.subCategories.map((sc) => ({
        name: sc.subCategoryName,
        maxQty: sc.count,
        qty: sc.count > 0 ? 1 : 0,
        selected: false,
      })),
    });
  };

  const toggleItem = (name: string) => {
    setSelection((prev) =>
      !prev
        ? prev
        : {
            ...prev,
            items: prev.items.map((i) =>
              i.name === name ? { ...i, selected: !i.selected } : i
            ),
          }
    );
  };

  const onQtyChange = (name: string, value: number | "") => {
    setSelection((prev) =>
      !prev
        ? prev
        : {
            ...prev,
            items: prev.items.map((i) =>
              i.name === name
                ? {
                    ...i,
                    qty:
                      value === ""
                        ? ""
                        : Math.min(Math.max(value, 0), i.maxQty),
                  }
                : i
            ),
          }
    );
  };

  const updateIsUrgent = (urgent: boolean) =>
    setSelection((p) => (p ? { ...p, urgent } : p));

  const updateRemarks = (remarks: string) =>
    setSelection((p) => (p ? { ...p, remarks } : p));

  const clearSelection = async () => {
    setSelection(null);
    try {
      const data = await fetchInventory();
      setInventory(data);
    } catch {
      notify("Error ocurred while fetching data", "error");
    }
  };

  useEffect(() => {
    const loadInventory = async () => {
      const data = await fetchInventory();
      setInventory(data);
    };

    try {
      loadInventory();
    } catch {
      notify("Error fetching inventory data", "error");
      console.log("error when fetching inventory");
    }
  }, []);

  useEffect(() => {
    if (!selection?.categoryName) return;

    fetchNextSerialCode(selection.categoryName)
      .then((serialCode) => setNextSerialCode(serialCode))
      .catch((err) => notify("Server error"));
  }, [selection?.categoryName]);

  return (
    <>
      <Grid container spacing={1} height={"100%"}>
        <Grid size={12}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 2,
              alignItems: "stretch", // important
            }}
          >
            {inventory.map((category) => (
              <CategoryCard
                key={category.categoryCode}
                category={category}
                onChange={onCategorySelect}
              />
            ))}
          </Box>
        </Grid>
        {selection ? (
          <Box
            sx={{
              width: "100%",
              mt: 2,
              // minHeight: "calc(100vh - 300px)",
              bgcolor: "grey.100",
              borderRadius: 1,
              p: 2,
              boxShadow: "inset 0 4px 6px rgba(0,0,0,0.1)",
            }}
          >
            <Grid container spacing={2} direction="row">
              {/* LEFT PANEL */}
              <Grid size={5}>
                <Box
                  sx={{
                    height: "100%",
                    bgcolor: "background.paper",
                    borderRadius: 2,
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <CategorySelection
                    selection={selection}
                    onToggleItem={toggleItem}
                    onQtyChange={onQtyChange}
                    onUrgentChange={updateIsUrgent}
                    onRemarksChange={updateRemarks}
                  />
                </Box>
              </Grid>
              <Grid
                container
                size={2}
                sx={{ alignItems: "center", justifyContent: "center" }}
              >
                <Stack sx={{ alignItems: "center", justifyContent: "center" }}>
                  <ArrowRightAltIcon sx={{ fontSize: 90 }} />
                  <Typography variant="body2">
                    Choose from left to Preview
                  </Typography>
                </Stack>
              </Grid>
              {/* RIGHT PANEL */}
              <Grid size={5}>
                <Box
                  sx={{
                    height: "100%",
                    bgcolor: "background.paper",
                    borderRadius: 2,
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    borderLeft: `${
                      selection?.urgent ? "5px solid #ff000091" : ""
                    }`,
                  }}
                >
                  <BatchPreview
                    serialCode={nextSerialCode}
                    batchDetails={selection}
                    onClear={clearSelection}
                  />
                </Box>
              </Grid>
            </Grid>
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
            {inventory.length > 0 ? (
              <>
                <CategoryIcon sx={{ fontSize: 100, color: "gray" }} />
                <Typography variant="h6" color="gray">
                  Choose from the above categories to start forming the Batch
                </Typography>
              </>
            ) : (
              <>
                <InboxIcon sx={{ fontSize: 100, color: "gray" }} />
                <Typography variant="h6" color="gray">
                  Inventory is empty.
                </Typography>
              </>
            )}
          </Box>
        )}
        {selection && (
          <Grid size={12}>
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                startIcon={<DeleteIcon />}
                variant="outlined"
                color="error"
                onClick={clearSelection}
              >
                Clear
              </Button>
            </Box>
          </Grid>
        )}
      </Grid>
    </>
  );
}
