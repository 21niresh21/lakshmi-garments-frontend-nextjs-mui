"use client";

import React, { useState, useEffect } from "react";
import {
  TableRow,
  TableCell,
  TextField,
  IconButton,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { GenericAutocomplete } from "@/app/components/shared/GenericAutocomplete";
import { Item } from "@/app/_types/Item";
import { JobworkItemRowData } from "./_types/jobwork";
import ItemFormModal, {
  ItemFormData,
} from "@/app/components/shared/ItemFormModal";
import { ItemErrors } from "../../item/page";
import { addItem } from "@/app/api/itemApi";
import { useNotification } from "@/app/components/shared/NotificationProvider";
import { DamageSource, DamageSourceLabels } from "@/app/_types/DamageSource";
import { DamageType } from "@/app/_types/DamageType";
import { fetchBatchPriorJobworks } from "@/app/api/jobworkApi";

interface JobworkItemRowProps {
  row: JobworkItemRowData;
  availableItems: Item[];
  onChange: (updatedRow: JobworkItemRowData) => void;
  onRemove: () => void;
  totalExceeded: boolean; // global total exceeded flag
  rowRemaining: number;
  showItemQuantity: boolean;
  jobworkNumber?: string; // Add jobwork number prop for fetching prior jobworks
}

/**
 * Converts input string to:
 * - "" → ""
 * - number < 0 → 0
 * - valid number → number
 */
const sanitizeNumber = (value: string): number | "" => {
  if (value === "") return "";
  const n = Number(value);
  if (isNaN(n)) return "";
  return n < 0 ? 0 : n;
};

/**
 * Checks if a row has all numeric fields zero/empty
 */
export const isRowEmpty = (row: JobworkItemRowData) => {
  const sum =
    (row.salesQuantity ? row.salesQuantity : 0) +
    (row.acceptedQuantity ? row.acceptedQuantity : 0) +
    row.damages.reduce((sum, d) => sum + (d.quantity ? d.quantity : 0), 0);
  return sum === 0;
};

const JobworkItemRow: React.FC<JobworkItemRowProps> = ({
  row,
  availableItems,
  onChange,
  onRemove,
  totalExceeded,
  rowRemaining,
  showItemQuantity,
  jobworkNumber,
}) => {
  const noItemSelected = row.itemId === null;
  const emptyRow = isRowEmpty(row);
  const [items, setItems] = useState(availableItems);
  const { notify } = useNotification();
  const [priorJobworks, setPriorJobworks] = useState<any[]>([]);

  const handleNumberChange = (
    field: keyof JobworkItemRowData,
    value: string,
  ) => {
    onChange({
      ...row,
      [field]: sanitizeNumber(value) === "" ? 0 : sanitizeNumber(value),
    });
  };

  const handleDamageChange = (damageIndex: number, value: string) => {
    const damages = [...row.damages];
    damages[damageIndex] = {
      ...damages[damageIndex],
      quantity: sanitizeNumber(value) === '' ? 0 : sanitizeNumber(value),
    };
    onChange({ ...row, damages });
  };

  const handleReworkJobworkChange = (damageIndex: number, jobworkNumber: string) => {
    const damages = [...row.damages];
    damages[damageIndex] = {
      ...damages[damageIndex],
      reworkJobworkNumber: jobworkNumber,
    };
    onChange({ ...row, damages });
  };

  useEffect(() => {
    if (jobworkNumber) {
      fetchBatchPriorJobworks(jobworkNumber)
        .then((data) => setPriorJobworks(data))
        .catch((error) => {
          console.error("Error fetching prior jobworks:", error);
          setPriorJobworks([]);
        });
    }
  }, [jobworkNumber]);

  // ✅ Row error flag for UI
  const rowError = totalExceeded || noItemSelected || emptyRow;

  type CreateEntityType = "item" | null;

  const [createDialog, setCreateDialog] = useState<{
    type: CreateEntityType;
    prefillName: string;
  }>({
    type: null,
    prefillName: "",
  });
  const [itemErrors, setItemErrors] = useState<ItemErrors>({});

  const createItem = async (data: ItemFormData) => {
    try {
      const createdItem = await addItem(data);
      setItems((prev) => [...prev, createdItem]);
      onChange({
        ...row,
        item: createdItem,
        itemId: createdItem.id,
        itemName: createdItem.name,
      });
      notify("Item created successfully", "success");
      setCreateDialog({ type: null, prefillName: "" });
      setItemErrors({});
    } catch (err: any) {
      if (err.validationErrors) {
        setItemErrors(err.validationErrors);
      } else if (err.message && err.message !== "Validation failed") {
        notify(err?.message || "Error saving item", "error");
      }
    }
  };

  return (
    <TableRow>
      {/* Item */}
      <TableCell>
        <GenericAutocomplete<Item>
          label="Item"
          options={items}
          value={row.item ?? null}
          getOptionLabel={(i) => i.name}
          isOptionEqualToValue={(a, b) => a.id === b.id}
          onChange={(item) =>
            onChange({
              ...row,
              item: item ?? undefined,
              itemId: item?.id ?? null,
              itemName: item?.name ?? "",
            })
          }
          size="small"
          sx={{ width: 180 }}
          allowCreate
          onCreateClick={(name) =>
            setCreateDialog({ type: "item", prefillName: name })
          }
        />
        {row.itemId && showItemQuantity && (
          <Typography
            variant="caption"
            sx={{
              display: "block",
              color: totalExceeded ? "red" : "text.secondary",
            }}
          >
            Item Remaining: {rowRemaining}
          </Typography>
        )}
        <ItemFormModal
          open={createDialog.type === "item"}
          mode="create"
          onSubmit={createItem}
          onClose={() => {
            setCreateDialog({ type: null, prefillName: "" });
            setItemErrors({});
          }}
          initialData={{ name: createDialog.prefillName }}
          errors={itemErrors}
          setErrors={setItemErrors}
        />
        {noItemSelected && (
          <span style={{ color: "red", fontSize: 12 }}>Select an item</span>
        )}
      </TableCell>

      {/* Returned */}
      <TableCell>
        <TextField
          size="small"
          type="number"
          value={row.acceptedQuantity}
          onChange={(e) =>
            handleNumberChange("acceptedQuantity", e.target.value)
          }
          error={row.acceptedQuantity === 0 && emptyRow}
          inputProps={{ min: 0 }}
        />
      </TableCell>
      <TableCell>
        <TextField
          size="small"
          type="number"
          value={row.wagePerItem ?? 0}
          onChange={(e) => handleNumberChange("wagePerItem", e.target.value)}
          inputProps={{ min: 0 }}
          sx={{ width: 65 }}
        />
      </TableCell>

      {/* Purchase Cost */}
      <TableCell>
        <TextField
          size="small"
          type="number"
          value={row.salesPrice}
          onChange={(e) => handleNumberChange("salesPrice", e.target.value)}
          inputProps={{ min: 0 }}
          sx={{ width: 70 }}
        />
      </TableCell>

      {/* Purchased Qty */}
      <TableCell>
        <TextField
          size="small"
          type="number"
          value={row.salesQuantity}
          onChange={(e) => handleNumberChange("salesQuantity", e.target.value)}
          error={row.salesQuantity === 0 && emptyRow}
          inputProps={{ min: 0 }}
          sx={{ width: 70 }}
        />
      </TableCell>

      {/* Damages - Structured Layout */}
      <TableCell>
        <TextField
          size="small"
          type="number"
          value={row.damages[0]?.quantity || ""}
          onChange={(e) => handleDamageChange(0, e.target.value)}
          error={(row.damages[0]?.quantity === "" ? 0 : row.damages[0]?.quantity || 0) === 0 && emptyRow}
          inputProps={{ min: 0 }}
          sx={{ width: 75 }}
          placeholder="0"
        />
      </TableCell>

      <TableCell>
        <TextField
          size="small"
          type="number"
          value={row.damages[1]?.quantity || ""}
          onChange={(e) => handleDamageChange(1, e.target.value)}
          error={(row.damages[1]?.quantity === "" ? 0 : row.damages[1]?.quantity || 0) === 0 && emptyRow}
          inputProps={{ min: 0 }}
          sx={{ width: 75 }}
          placeholder="0"
        />
      </TableCell>

      <TableCell>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
          <TextField
            size="small"
            type="number"
            value={row.damages[2]?.quantity || ""}
            onChange={(e) => handleDamageChange(2, e.target.value)}
            error={(row.damages[2]?.quantity === "" ? 0 : row.damages[2]?.quantity || 0) === 0 && emptyRow}
            inputProps={{ min: 0 }}
            sx={{ width: 75 }}
            placeholder="0"
          />
          {row.damages[2]?.quantity && Number(row.damages[2].quantity) > 0 && (
            <FormControl size="small" variant="outlined" sx={{ minWidth: 130 }}>
              <InputLabel 
                sx={{ 
                  fontSize: "0.7rem",
                  "&.Mui-focused": {
                    fontSize: "0.7rem"
                  }
                }}
              >
                Prior Jobwork
              </InputLabel>
              <Select
                value={row.damages[2]?.reworkJobworkNumber || ""}
                onChange={(e) => handleReworkJobworkChange(2, e.target.value)}
                displayEmpty
                label="Prior Jobwork"
                sx={{ 
                  fontSize: "0.7rem",
                  minHeight: "40px",
                  "& .MuiSelect-select": {
                    padding: "8px 32px 8px 12px",
                    display: "flex",
                    alignItems: "center"
                  }
                }}
                MenuProps={{
                  PaperProps: { sx: { maxHeight: 300 } }
                }}
              >
                {priorJobworks.length > 0 ? (
                  priorJobworks.map((pjw) => (
                    <MenuItem key={pjw.jobworkNumber} value={pjw.jobworkNumber} sx={{ fontSize: "0.7rem" }}>
                      {`${pjw.jobworkNumber} - ${pjw.employeeName}`}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled value="" sx={{ fontSize: "0.7rem", fontStyle: "italic", color: "text.secondary" }}>
                    No prior jobworks
                  </MenuItem>
                )}
              </Select>
            </FormControl>
          )}
        </Box>
      </TableCell>

      <TableCell>
        <TextField
          size="small"
          type="number"
          value={row.damages[3]?.quantity || ""}
          onChange={(e) => handleDamageChange(3, e.target.value)}
          error={(row.damages[3]?.quantity === "" ? 0 : row.damages[3]?.quantity || 0) === 0 && emptyRow}
          inputProps={{ min: 0 }}
          sx={{ width: 75 }}
          placeholder="0"
        />
      </TableCell>

      {/* Remove */}
      <TableCell>
        <IconButton onClick={onRemove} color="error">
          <DeleteIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};

export default JobworkItemRow;
