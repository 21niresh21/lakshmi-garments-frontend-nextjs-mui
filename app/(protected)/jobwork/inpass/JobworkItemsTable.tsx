"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Paper,
  Typography,
  Stack,
} from "@mui/material";
import { useState, useMemo } from "react";
import JobworkItemRow from "./JobworkItemRow";
import { Item } from "@/app/_types/Item";
import { JobworkItemRowData } from "./_types/jobwork";
import { useNotification } from "@/app/components/shared/NotificationProvider";
import { DamageType } from "@/app/_types/DamageType";
import { useUser } from "@/app/context/UserContext";
import { createJobworkReceipt } from "@/app/api/jobworkReceipt";
import { JobworkStatus } from "@/app/_types/JobworkStatus";

interface JobworkItemsTableProps {
  allItems: Item[];
  jobwork: any; // ✅ jobwork assigned qty
}

const toNumber = (v: number | "") => (v === "" ? 0 : v);

export default function JobworkItemsTable({
  allItems,
  jobwork,
}: JobworkItemsTableProps) {
  const assignedQuantity = jobwork.jobworkItems.reduce(
    (sum: number, item: any) => sum + item.quantity,
    0
  );

  const { notify } = useNotification();
  const { user } = useUser();
  const [rows, setRows] = useState<JobworkItemRowData[]>([]);

  const handleAddRow = () => {
    setRows((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        item: undefined,
        itemId: null,
        itemName: "",
        wage: 0,

        purchasedQuantity: 0,
        purchaseCost: 0,
        returnedQuantity: "",

        damages: [
          { type: DamageType.SUPPLIER_DAMAGE, quantity: 0 },
          { type: DamageType.REPAIRABLE, quantity: 0 },
          { type: DamageType.UNREPAIRABLE, quantity: 0 },
        ],
      },
    ]);
  };

  const handleRemoveRow = (id: string) => {
    setRows((prev) => prev.filter((row) => row.id !== id));
  };

  const handleRowChange = (id: string, updatedRow: JobworkItemRowData) => {
    setRows((prev) => prev.map((row) => (row.id === id ? updatedRow : row)));
  };

  const selectedItemIds = rows
    .map((r) => r.itemId)
    .filter((id): id is number => id !== null);

  // 🔥 GLOBAL TOTAL ACROSS ALL ROWS
  const totalEntered = useMemo(() => {
    return rows.reduce((sum, row) => {
      const damageTotal = row.damages.reduce(
        (dSum, d) => dSum + toNumber(d.quantity),
        0
      );
      return (
        sum +
        toNumber(row.purchasedQuantity) +
        toNumber(row.returnedQuantity) +
        damageTotal
      );
    }, 0);
  }, [rows]);

  const totalExceeded =
    totalEntered > assignedQuantity ||
    jobwork.jobworkStatus === JobworkStatus.COMPLETED;
  const remainingQty = assignedQuantity - totalEntered;

  // ✅ Submit handler
  const handleSubmit = () => {
    if (totalExceeded) {
      notify("Total quantity exceeds assigned quantity!", "error");
      return;
    }
    const payload = {
      jobworkNumber: jobwork.jobworkNumber,
      receivedById: user?.id,
      jobworkReceiptItems: rows,
    };
    createJobworkReceipt(payload)
      .then((res) => {
        notify("Submission successful!", "success");
      })
      .catch((err) => {
        notify("An error occured", "error");
      });
    // Proceed with submission
    console.log("Submitting rows:", rows);
  };

  return (
    <>
      <Typography sx={{ my: 2 }}>
        Assigned Qty: <b>{assignedQuantity}</b> | Remaining:{" "}
        <b style={{ color: remainingQty < 0 ? "red" : "inherit" }}>
          {JobworkStatus.COMPLETED ? 0 : assignedQuantity}
        </b>
      </Typography>

      <TableContainer component={Paper} sx={{ mt: 2, width: "100%" }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Item</TableCell>
              <TableCell>Returned</TableCell>
              <TableCell>Wage</TableCell>
              <TableCell>Purchase Cost</TableCell>
              <TableCell>Purchase Qty</TableCell>
              <TableCell>Supplier Damage</TableCell>
              <TableCell>Repairable</TableCell>
              <TableCell>Unrepairable</TableCell>
              <TableCell>Remove</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {rows.map((row) => (
              <JobworkItemRow
                key={row.id}
                row={row}
                availableItems={allItems.filter(
                  (item) =>
                    !selectedItemIds.includes(item.id) || item.id === row.itemId
                )}
                onChange={(updated) => handleRowChange(row.id, updated)}
                onRemove={() => handleRemoveRow(row.id)}
                totalExceeded={totalExceeded} // ✅ pass down
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add + Submit buttons */}
      <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
        <Button
          variant="contained"
          onClick={handleAddRow}
          disabled={rows.length >= allItems.length}
        >
          Add Item
        </Button>

        <Button
          variant="contained"
          color="success"
          onClick={handleSubmit}
          disabled={rows.length === 0 || !rows[0].item} // can't submit empty
        >
          Submit
        </Button>
      </Stack>
    </>
  );
}
