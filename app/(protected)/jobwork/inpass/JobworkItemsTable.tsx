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
  Box,
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
import { createWorflowRequest } from "@/app/api/workflowRequestApi";
import { WorkflowRequestType } from "@/app/_types/WorkflowRequestType";

interface JobworkItemsTableProps {
  allItems: Item[];
  jobwork: any;
  setJobwork: React.Dispatch<React.SetStateAction<any | null>>;
  setJobworkNumber: React.Dispatch<React.SetStateAction<string>>;
}

const toNumber = (v: number | "") => (v === "" ? 0 : v);

export default function JobworkItemsTable({
  allItems,
  jobwork,
  setJobwork,
  setJobworkNumber,
}: JobworkItemsTableProps) {
  const { notify } = useNotification();
  const [rows, setRows] = useState<JobworkItemRowData[]>([]);

  // Helper: Get original issued amount for a specific item
  const getIssuedQtyForItem = (itemName: string | null) => {
    if (!itemName) return 0;
    console.log(itemName, jobwork.jobworkItems);

    const originalItem = jobwork.jobworkItems.find(
      (i: any) => i.itemName === itemName,
    );
    return originalItem ? originalItem.quantity : 0;
  };

  // Helper: Calculate total of (Accepted + Sales + Damages) for a single row
  const getRowTotal = (row: JobworkItemRowData) => {
    const damageTotal = row.damages.reduce(
      (sum, d) => sum + toNumber(d.quantity),
      0,
    );
    return (
      toNumber(row.salesQuantity) + toNumber(row.acceptedQuantity) + damageTotal
    );
  };

  const assignedQuantity = jobwork.jobworkItems.reduce(
    (sum: number, item: any) => sum + item.quantity,
    0,
  );
  const receivedQuantity = jobwork.jobworkReceiptItems.reduce(
    (sum: number, item: any) =>
      sum +
      (item.acceptedQuantity ?? 0) +
      (item.damagedQuantity ?? 0) +
      (item.salesQuantity ?? 0),
    0,
  );
  const pendingQuantity = assignedQuantity - receivedQuantity;

  const totalEntered = useMemo(
    () => rows.reduce((sum, row) => sum + getRowTotal(row), 0),
    [rows],
  );

  const hasRowLevelViolation = useMemo(() => {
    if (jobwork.jobworkType === "CUTTING") return false;
    return rows.some(
      (row) => getRowTotal(row) > getIssuedQtyForItem(row.itemName),
    );
  }, [rows, jobwork]);

  const totalExceeded =
    totalEntered > pendingQuantity ||
    hasRowLevelViolation ||
    jobwork.jobworkStatus === JobworkStatus.CLOSED;
  const remainingQty = pendingQuantity - totalEntered;

  const canSubmit =
    totalEntered === pendingQuantity &&
    !hasRowLevelViolation &&
    jobwork.jobworkStatus !== JobworkStatus.CLOSED &&
    rows.length > 0 &&
    !!rows[0].item;
  const canRaiseRequest =
    rows.length > 0 &&
    rows.every((r) => r.item) &&
    totalEntered !== pendingQuantity &&
    jobwork.jobworkStatus !== JobworkStatus.CLOSED;

  const handleAddRow = () => {
    setRows((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        item: undefined,
        itemId: null,
        itemName: "",
        wagePerItem: 0,
        salesQuantity: 0,
        salesPrice: 0,
        acceptedQuantity: "",
        damages: [
          { type: DamageType.SUPPLIER_DAMAGE, quantity: 0 },
          { type: DamageType.REPAIRABLE, quantity: 0 },
          { type: DamageType.UNREPAIRABLE, quantity: 0 },
        ],
      },
    ]);
  };

  const handleRemoveRow = (id: string) =>
    setRows((prev) => prev.filter((row) => row.id !== id));
  const handleRowChange = (id: string, updatedRow: JobworkItemRowData) =>
    setRows((prev) => prev.map((row) => (row.id === id ? updatedRow : row)));

  const handleSubmit = () => {
    if (totalExceeded) {
      notify(
        hasRowLevelViolation
          ? "Individual item limit exceeded!"
          : "Total quantity exceeds assigned!",
        "error",
      );
      return;
    }
    createJobworkReceipt({
      jobworkNumber: jobwork.jobworkNumber,
      jobworkReceiptItems: rows,
    })
      .then(() => {
        notify("Success!", "success");
        setRows([]);
        setJobwork(null);
        setJobworkNumber("");
      })
      .catch(() => notify("Error occurred", "error"));
  };

  const raiseRequest = () => {
    createWorflowRequest({
      requestType: WorkflowRequestType.JOBWORK_RECEIPT,
      payload: JSON.stringify({
        jobworkNumber: jobwork.jobworkNumber,
        items: rows,
      }),
      systemComments: "Quantity mismatch",
    })
      .then(() => {
        notify("Request raised", "success");
        setRows([]);
        setJobwork(null);
      })
      .catch(() => notify("Error raising request", "error"));
  };

  const selectedItemIds = rows
    .map((r) => r.itemId)
    .filter((id): id is number => id !== null);

  return (
    <>
      <Typography sx={{ my: 2 }}>
        Assigned Qty: <b>{assignedQuantity}</b>
        {" | "}
        Pending quantity: <b>{pendingQuantity}</b>
        {" | "}
        Remaining:{" "}
        <Box
          component="span"
          sx={{
            fontWeight: "bold",
            color: remainingQty < 0 ? "error.main" : "inherit",
          }}
        >
          {jobwork.jobworkStatus === JobworkStatus.CLOSED ||
          jobwork.jobworkStatus === JobworkStatus.REASSIGNED
            ? 0
            : remainingQty}
        </Box>
      </Typography>

      <TableContainer component={Paper} sx={{ mt: 2, width: "100%" }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Item</TableCell>
              <TableCell>Returned</TableCell>
              <TableCell>Wage</TableCell>
              <TableCell>Sales Cost</TableCell>
              <TableCell>Sales Qty</TableCell>
              <TableCell>Supplier Damage</TableCell>
              <TableCell>Repairable</TableCell>
              <TableCell>Unrepairable</TableCell>
              <TableCell>Remove</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => {
              // --- PER-ITEM VISUAL CUE CALCULATIONS ---
              const issuedLimit = getIssuedQtyForItem(row.itemName);
              const currentTotal = getRowTotal(row);
              const rowRemaining = issuedLimit - currentTotal;
              const isInvalid =
                jobwork.jobworkType !== "CUTTING" && currentTotal > issuedLimit;

              return (
                <JobworkItemRow
                  key={row.id}
                  row={row}
                  availableItems={allItems.filter(
                    (item) =>
                      !selectedItemIds.includes(item.id) ||
                      item.id === row.itemId,
                  )}
                  onChange={(updated) => handleRowChange(row.id, updated)}
                  onRemove={() => handleRemoveRow(row.id)}
                  // Pass down the row-specific "totalExceeded" and the "remaining amount"
                  totalExceeded={isInvalid}
                  rowRemaining={rowRemaining} // <--- You can display this in the Row UI
                  showItemQuantity={
                    jobwork.jobworkType === "CUTTING" ? false : true
                  }
                  // jobworkType={jobwork.jobworkType} // Pass type so Row knows whether to show limit
                />
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
        <Button variant="contained" onClick={handleAddRow}>
          Add Item
        </Button>
        <Button
          variant="contained"
          onClick={raiseRequest}
          disabled={!canRaiseRequest}
        >
          Raise Request
        </Button>
        <Button
          variant="contained"
          color="success"
          onClick={handleSubmit}
          disabled={!canSubmit}
        >
          Submit
        </Button>
      </Stack>
    </>
  );
}
