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
import { useGlobalLoading } from "@/app/components/layout/LoadingProvider";

export default function Page() {
  const { notify } = useNotification();
  const { showLoading, hideLoading } = useGlobalLoading();
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
        qty: sc.count > 0 ? sc.count : 0,
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
              i.name === name ? { ...i, selected: !i.selected } : i,
            ),
          },
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
                : i,
            ),
          },
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
      notify("Error occurred while fetching data", "error");
    }
  };

  const loadInventory = async () => {
    try {
      showLoading();
      const data = await fetchInventory();
      setInventory(data);
    } catch (error) {
      notify("Error fetching inventory data", "error");
    } finally {
      hideLoading();
    }
  };

  useEffect(() => {
    loadInventory();
  }, []);

  useEffect(() => {
    if (!selection?.categoryName) return;
    fetchNextSerialCode(selection.categoryName)
      .then((serialCode) => setNextSerialCode(serialCode))
      .catch(() => notify("Server error", "error"));
  }, [selection?.categoryName]);

  return (
    <Box sx={{ p: { xs: 1, md: 1 } }}>
      <Grid container spacing={2}>
        {/* Category Header Grid */}
        <Grid size={{ xs: 12 }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: 2,
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
          <Grid size={{ xs: 12 }}>
            <Box
              sx={{
                mt: 2,
                bgcolor: "grey.100",
                borderRadius: 2,
                p: { xs: 1, sm: 2 },
                boxShadow: "inset 0 2px 4px rgba(0,0,0,0.05)",
              }}
            >
              <Grid container spacing={2}>
                {/* Left Panel */}
                <Grid size={{ xs: 12, md: 5 }}>
                  <Box
                    sx={{
                      bgcolor: "background.paper",
                      borderRadius: 2,
                      p: 2,
                      height: "100%",
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

                {/* Desktop Arrow */}
                <Grid
                  size={{ md: 2 }}
                  sx={{
                    display: { xs: "none", md: "flex" },
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Stack alignItems="center">
                    <ArrowRightAltIcon
                      sx={{ fontSize: 60, color: "grey.400" }}
                    />
                    <Typography variant="caption" color="grey.500">
                      Preview
                    </Typography>
                  </Stack>
                </Grid>

                {/* Right Panel */}
                <Grid size={{ xs: 12, md: 5 }}>
                  <Box
                    sx={{
                      bgcolor: "background.paper",
                      borderRadius: 2,
                      p: 2,
                      height: "100%",
                      borderTop: selection?.urgent
                        ? { xs: "5px solid #ff000091", md: "none" }
                        : "none",
                      borderLeft: selection?.urgent
                        ? { md: "5px solid #ff000091" }
                        : "none",
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
          </Grid>
        ) : (
          <Grid size={{ xs: 12 }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                mt: 10,
                textAlign: "center",
              }}
            >
              {inventory.length > 0 ? (
                <>
                  <CategoryIcon sx={{ fontSize: 80, color: "grey.300" }} />
                  <Typography variant="h6" color="text.secondary">
                    Select a category to begin
                  </Typography>
                </>
              ) : (
                <>
                  <InboxIcon sx={{ fontSize: 80, color: "grey.300" }} />
                  <Typography variant="h6" color="text.secondary">
                    Inventory is empty
                  </Typography>
                </>
              )}
            </Box>
          </Grid>
        )}

        {selection && (
          <Grid size={{ xs: 12 }}>
            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
              <Button
                startIcon={<DeleteIcon />}
                variant="outlined"
                color="error"
                onClick={clearSelection}
              >
                Clear All
              </Button>
            </Box>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}
