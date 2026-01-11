"use client";

import {
  Autocomplete,
  Button,
  Grid,
  IconButton,
  TextField,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import React, { Dispatch, SetStateAction } from "react";
import { JobworkForm, ItemEntry } from "./_types/jobwork.types";
import { BatchItem } from "@/app/_types/BatchItem";
import { Item } from "@/app/_types/Item";

interface Props {
  batchItems: BatchItem[];
  jobwork: JobworkForm;
  setJobwork: Dispatch<SetStateAction<JobworkForm>>;
}

export default function ItemJobForm({
  batchItems,
  jobwork,
  setJobwork,
}: Props) {
  /* -------------------- helpers -------------------- */

  const selectedItemIds = jobwork.items
    .map((row) => row.item?.id)
    .filter((id): id is number => id !== undefined);

  const addRow = () => {
    setJobwork((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          rowId: crypto.randomUUID(),
          item: null,
          quantity: undefined,
        },
      ],
    }));
  };

  const removeRow = (rowId: string) => {
    setJobwork((prev) => ({
      ...prev,
      items: prev.items.filter((row) => row.rowId !== rowId),
    }));
  };

  const updateRow = (rowId: string, updated: Partial<ItemEntry>) => {
    setJobwork((prev) => ({
      ...prev,
      items: prev.items.map((row) =>
        row.rowId === rowId ? { ...row, ...updated } : row
      ),
    }));
  };

  const getAvailableQty = (itemId?: number) => {
    if (!itemId) return 0;
    return (
      batchItems.find((bi) => bi.id === itemId)?.availableQuantity ?? 0
    );
  };

  /* -------------------- render -------------------- */

  return (
    <Grid container spacing={2}>
      {jobwork.items.map((row) => {
        const availableItems = batchItems.filter(
          (bi) =>
            !selectedItemIds.includes(bi.id) || bi.id === row.item?.id
        );

        const maxQty = getAvailableQty(row.item?.id);

        return (
          <Grid container size={12} spacing={2} key={row.rowId}>
            {/* ITEM */}
            <Grid size={5}>
              <Autocomplete
                fullWidth
                options={availableItems}
                getOptionLabel={(bi) => bi.name}
                isOptionEqualToValue={(opt, val) => opt.id === val.id}
                value={
                  row.item
                    ? availableItems.find((bi) => bi.id === row.item!.id) ??
                      null
                    : null
                }
                onChange={(_, batchItem) => {
                  const selectedItem: Item | null = batchItem
                    ? {
                        id: batchItem.id,
                        name: batchItem.name,
                      }
                    : null;

                  updateRow(row.rowId, {
                    item: selectedItem,
                    quantity: undefined,
                  });
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Item" />
                )}
              />
            </Grid>

            {/* QUANTITY */}
            <Grid size={5}>
              <TextField
                fullWidth
                type="number"
                label="Quantity"
                value={row.quantity ?? ""}
                disabled={!row.item}
                inputProps={{
                  min: 0,
                  max: maxQty,
                }}
                onChange={(e) => {
                  const raw = e.target.value;
                  let value =
                    raw === "" ? undefined : Number(raw);

                  if (value !== undefined && value > maxQty) {
                    value = maxQty;
                  }

                  updateRow(row.rowId, { quantity: value });
                }}
                helperText={
                  row.item
                    ? `Available quantity ${maxQty}`
                    : "Select an item first"
                }
              />
            </Grid>

            {/* DELETE */}
            <Grid
              size={2}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <IconButton
                onClick={() => removeRow(row.rowId)}
                color="error"
              >
                <DeleteIcon />
              </IconButton>
            </Grid>
          </Grid>
        );
      })}

      {/* ADD BUTTON */}
      <Grid size={12}>
        <Button
          variant="outlined"
          onClick={addRow}
          disabled={selectedItemIds.length >= batchItems.length}
        >
          Add Item
        </Button>
      </Grid>
    </Grid>
  );
}
