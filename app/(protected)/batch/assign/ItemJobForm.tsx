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
import { Item } from "@/app/_types/Item";

interface Props {
  items: Item[]; // master items list
  jobwork: JobworkForm;
  setJobwork: Dispatch<SetStateAction<JobworkForm>>;
}

export default function ItemJobForm({ items, jobwork, setJobwork }: Props) {
  const selectedItemIds = jobwork.items
    .map((row) => row.item?.id)
    .filter(Boolean);

  const addRow = () => {
    setJobwork((prev) => ({
      ...prev,
      items: [...prev.items, { item: null, quantity: undefined }],
    }));
  };

  const removeRow = (index: number) => {
    setJobwork((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const updateRow = (index: number, updated: Partial<ItemEntry>) => {
    setJobwork((prev) => {
      const copy = [...prev.items];
      copy[index] = { ...copy[index], ...updated };
      return { ...prev, items: copy };
    });
  };

  return (
    <Grid container spacing={2} >
      {jobwork.items.map((row, index) => {
        const availableItems = items.filter(
          (i) => !selectedItemIds.includes(i.id) || i.id === row.item?.id
        );

        return (
          <Grid container size={12} spacing={2} key={index}>
            {/* ITEM */}
            <Grid size={5}>
              <Autocomplete
                fullWidth
                options={availableItems}
                getOptionLabel={(i) => i.name}
                value={row.item}
                onChange={(_, value) =>
                  updateRow(index, { item: value })
                }
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
                onChange={(e) =>
                  updateRow(index, {
                    quantity:
                      e.target.value === ""
                        ? undefined
                        : Number(e.target.value),
                  })
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
              <IconButton onClick={() => removeRow(index)} color="error">
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
          disabled={jobwork.items.length >= items.length}
        >
          Add Item
        </Button>
      </Grid>
    </Grid>
  );
}
