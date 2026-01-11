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
import { createWorflowRequest } from "@/app/api/workflowRequestApi";
import { WorkflowRequestType } from "@/app/_types/WorkflowRequestType";

interface JobworkItemsTableProps {
  allItems: Item[];
  jobwork: any; // ✅ jobwork assigned qty
  setJobwork: React.Dispatch<React.SetStateAction<any | null>>;
}

const toNumber = (v: number | "") => (v === "" ? 0 : v);

export default function JobworkItemsTable({
  allItems,
  jobwork,
  setJobwork,
}: JobworkItemsTableProps) {
  const assignedQuantity = jobwork.jobworkItems.reduce(
    (sum: number, item: any) => sum + item.quantity,
    0
  );

  const receivedQuantity = jobwork.jobworkReceiptItems.reduce(
    (sum: number, item: any) =>
      sum +
      (item.returnedQuantity ?? 0) +
      (item.damagedQuantity ?? 0) +
      (item.purchasedQuantity ?? 0),
    0
  );

  const pendingQuantity = assignedQuantity - receivedQuantity;

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
    totalEntered > pendingQuantity ||
    jobwork.jobworkStatus === JobworkStatus.COMPLETED;
  const remainingQty = pendingQuantity - totalEntered;

  const canSubmit =
    totalEntered === pendingQuantity &&
    jobwork.jobworkStatus !== JobworkStatus.COMPLETED &&
    rows.length > 0 &&
    !!rows[0].item;

  const canRaiseRequest =
    rows.length > 0 &&
    rows.every((r) => r.item) &&
    totalEntered !== pendingQuantity &&
    jobwork.jobworkStatus !== JobworkStatus.COMPLETED;

  // ✅ Submit handler
  const handleSubmit = () => {
    if (totalExceeded) {
      notify("Total quantity exceeds assigned quantity!", "error");
      return;
    }
    const payload = {
      batchSerialCode: jobwork.batchSerialCode,
      jobworkNumber: jobwork.jobworkNumber,
      receivedById: user?.id,
      jobworkReceiptItems: rows,
    };
    createJobworkReceipt(payload)
      .then((res) => {
        notify("Jobwork accepted!", "success");
        setRows([]);
        setJobwork(null);
      })
      .catch((err) => {
        notify("An error occured", "error");
      });
    // Proceed with submission
    console.log("Submitting rows:", rows);
  };

  const raiseRequest = () => {
    const rowsWithJobworkNumber = rows.map((row) => ({
      ...row,
      jobworkNumber: jobwork.jobworkNumber,
    }));

    const payload = {
      requestType: WorkflowRequestType.JOBWORK_RECEIPT,
      payload: JSON.stringify(rowsWithJobworkNumber),
      systemComments: "Quantity mismatch in Cutting jobwork",
    };

    createWorflowRequest(payload)
      .then((res) => {
        notify("Request raised to admin", "success");
        setRows([]);
        setJobwork(null);
      })
      .catch((err) => {
        notify("An error occured when submitting request", "error");
      });
  };

  return (
    <>
      <Typography sx={{ my: 2 }}>
        Assigned Qty: <b>{pendingQuantity}</b> | Remaining:{" "}
        <b style={{ color: remainingQty < 0 ? "red" : "inherit" }}>
          {JobworkStatus.COMPLETED === jobwork.jobworkStatus ? 0 : remainingQty}
        </b>
      </Typography>

      {pendingQuantity > 0 && (
        <>
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
                {rows.map((row) => (
                  <JobworkItemRow
                    key={row.id}
                    row={row}
                    availableItems={allItems.filter(
                      (item) =>
                        !selectedItemIds.includes(item.id) ||
                        item.id === row.itemId
                    )}
                    onChange={(updated) => handleRowChange(row.id, updated)}
                    onRemove={() => handleRemoveRow(row.id)}
                    totalExceeded={totalExceeded} // ✅ pass down
                  />
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
            <Button
              variant="contained"
              onClick={handleAddRow}
              // disabled={rows.length >= allItems.length}
            >
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
              disabled={!canSubmit} // can't submit empty
            >
              Submit
            </Button>
          </Stack>
        </>
      )}
    </>
  );
}
