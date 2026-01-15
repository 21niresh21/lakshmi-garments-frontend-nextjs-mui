"use client";

import React, { useState } from "react";
import { TableRow, TableCell, TextField, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { GenericAutocomplete } from "@/app/components/shared/GenericAutocomplete";
import { Item } from "@/app/_types/Item";
import { JobworkItemRowData } from "./_types/jobwork";
import ItemFormModal, {
  ItemFormData,
} from "@/app/components/shared/ItemFormModal";
import { addItem } from "@/app/api/itemApi";
import { useNotification } from "@/app/components/shared/NotificationProvider";

interface JobworkItemRowProps {
  row: JobworkItemRowData;
  availableItems: Item[];
  onChange: (updatedRow: JobworkItemRowData) => void;
  onRemove: () => void;
  totalExceeded: boolean; // global total exceeded flag
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
    (row.purchasedQuantity ? row.purchasedQuantity : 0) +
    (row.returnedQuantity ? row.returnedQuantity : 0) +
    row.damages.reduce((sum, d) => sum + (d.quantity ? d.quantity : 0), 0);
  return sum === 0;
};

const JobworkItemRow: React.FC<JobworkItemRowProps> = ({
  row,
  availableItems,
  onChange,
  onRemove,
  totalExceeded,
}) => {
  const noItemSelected = row.itemId === null;
  const emptyRow = isRowEmpty(row);
  const [items, setItems] = useState(availableItems);
  const { notify } = useNotification();

  const handleNumberChange = (
    field: keyof JobworkItemRowData,
    value: string
  ) => {
    onChange({
      ...row,
      [field]: sanitizeNumber(value),
    });
  };

  const handleDamageChange = (index: number, value: string) => {
    const damages = [...row.damages];
    damages[index] = {
      ...damages[index],
      quantity: sanitizeNumber(value),
    };
    onChange({ ...row, damages });
  };

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

  const createItem = async (data: ItemFormData) => {
    try {
      const createdItem = await addItem(data);
      setCreateDialog({ type: null, prefillName: "" });
      setItems((prev) => [...prev, createdItem]);
      onChange({
        ...row,
        item: createdItem,
        itemId: createdItem.id,
        itemName: createdItem.name,
      });
      notify("Item created successfully", "success");
    } catch (err: any) {
      notify(err?.response?.data ?? "Error saving item", "error");
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
        <ItemFormModal
          open={createDialog.type === "item"}
          mode="create"
          onSubmit={createItem}
          onClose={() => setCreateDialog({ type: null, prefillName: "" })}
          initialData={{ name: createDialog.prefillName }}
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
          value={row.returnedQuantity}
          onChange={(e) =>
            handleNumberChange("returnedQuantity", e.target.value)
          }
          error={row.returnedQuantity === 0 && emptyRow}
          inputProps={{ min: 0 }}
        />
      </TableCell>
      <TableCell>
        <TextField
          size="small"
          type="number"
          value={row.wage ?? ""}
          onChange={(e) => handleNumberChange("wage", e.target.value)}
          inputProps={{ min: 0 }}
          sx={{ width: 65 }}
        />
      </TableCell>

      {/* Purchase Cost */}
      <TableCell>
        <TextField
          size="small"
          type="number"
          value={row.purchaseCost}
          onChange={(e) => handleNumberChange("purchaseCost", e.target.value)}
          inputProps={{ min: 0 }}
          sx={{ width: 70 }}
        />
      </TableCell>

      {/* Purchased Qty */}
      <TableCell>
        <TextField
          size="small"
          type="number"
          value={row.purchasedQuantity}
          onChange={(e) =>
            handleNumberChange("purchasedQuantity", e.target.value)
          }
          error={row.purchasedQuantity === 0 && emptyRow}
          inputProps={{ min: 0 }}
          sx={{ width: 70 }}
        />
      </TableCell>

      {/* Damages */}
      {row.damages.map((d, i) => (
        <TableCell key={i}>
          <TextField
            size="small"
            type="number"
            value={d.quantity}
            onChange={(e) => handleDamageChange(i, e.target.value)}
            error={d.quantity === 0 && emptyRow}
            inputProps={{ min: 0 }}
          />
        </TableCell>
      ))}

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
