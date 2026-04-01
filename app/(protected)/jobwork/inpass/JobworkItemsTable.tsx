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
import { DamageSource } from "@/app/_types/DamageSource";
import { createJobworkReceipt } from "@/app/api/jobworkReceipt";
import { JobworkStatus } from "@/app/_types/JobworkStatus";
import { createWorflowRequest } from "@/app/api/workflowRequestApi";
import { WorkflowRequestType } from "@/app/_types/WorkflowRequestType";
import InpassConfirmationDialog from "./InpassConfirmationDialog";
import InventoryIcon from "@mui/icons-material/Inventory";
import HourglassTopIcon from "@mui/icons-material/HourglassTop";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

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

  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    mode: "submit" | "raise-request";
  }>({ open: false, mode: "submit" });

  const isAwaitingApproval = jobwork.jobworkStatus === JobworkStatus.AWAITING_APPROVAL;

  const disableRequest = 
    jobwork.jobworkStatus === JobworkStatus.CLOSED || 
    jobwork.jobworkStatus === JobworkStatus.REASSIGNED ||
    isAwaitingApproval;

  const disableSubmit = 
    jobwork.jobworkStatus === JobworkStatus.CLOSED || 
    jobwork.jobworkStatus === JobworkStatus.REASSIGNED ||
    isAwaitingApproval;

  const disableAddItem = 
    jobwork.jobworkStatus === JobworkStatus.CLOSED || 
    jobwork.jobworkStatus === JobworkStatus.REASSIGNED ||
    isAwaitingApproval;

  // Helper: Get remaining quantity for a specific item after reconciling receipts
  const getIssuedQtyForItem = (itemName: string | null) => {
    if (!itemName) return 0;

    // Find the original assigned quantity from jobworkItems
    const originalItem = jobwork.jobworkItems.find(
      (i: any) => i.itemName === itemName,
    );
    
    if (!originalItem) return 0;
    
    const assignedQty = originalItem.quantity;

    // Calculate total already received for this item from jobworkReceiptItems
    const receivedForItem = jobwork.jobworkReceiptItems
      .filter((receipt: any) => receipt.itemName === itemName)
      .reduce((sum: number, receipt: any) => {
        return sum + 
          (receipt.acceptedQuantity ?? 0) + 
          (receipt.salesQuantity ?? 0) + 
          (receipt.damagedQuantity ?? 0);
      }, 0);

    // Return remaining quantity
    return assignedQty - receivedForItem;
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
          { type: DamageType.SUPPLIER_DAMAGE, quantity: 0 as number | "" }, // Index 0: Supplier Damage
          { type: DamageType.REPAIRABLE, quantity: 0 as number | "" }, // Index 1: Repairable (Current Jobwork)
          { type: DamageType.REPAIRABLE, quantity: 0 as number | "", source: DamageSource.PREVIOUS_JOBWORK }, // Index 2: Repairable (Previous Jobwork)
          { type: DamageType.UNREPAIRABLE, quantity: 0 as number | "" }, // Index 3: Unrepairable
        ],
      } as JobworkItemRowData,
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
    setConfirmDialog({ open: true, mode: "submit" });
  };

  const raiseRequest = () => {
    setConfirmDialog({ open: true, mode: "raise-request" });
  };

  const handleConfirm = () => {
    const { mode } = confirmDialog;
    setConfirmDialog((prev) => ({ ...prev, open: false }));

    // Helper function to transform rows to API format (includes ALL damages)
    const transformRows = (rows: JobworkItemRowData[]) => {
      return rows.map((row) => ({
        itemName: row.itemName,
        acceptedQuantity: row.acceptedQuantity === "" ? 0 : row.acceptedQuantity,
        salesQuantity: row.salesQuantity === "" ? 0 : row.salesQuantity,
        salesPrice: row.salesPrice === "" ? 0 : row.salesPrice,
        wagePerItem: row.wagePerItem === "" ? 0 : row.wagePerItem,
        damages: row.damages
          .filter((d) => (d.quantity === "" ? 0 : d.quantity) > 0)
          .map((d) => {
            const damage: { type: string; quantity: number; source?: string; reworkJobworkNumber?: string | null } = {
              type: d.type,
              quantity: d.quantity === "" ? 0 : d.quantity,
            };
            // For Repairable damage from Previous Jobwork, include source and reworkJobworkNumber
            if (d.type === DamageType.REPAIRABLE && d.source === DamageSource.PREVIOUS_JOBWORK) {
              damage.source = d.source;
              if (d.reworkJobworkNumber) {
                damage.reworkJobworkNumber = d.reworkJobworkNumber;
              }
            }
            return damage;
          }),
      }));
    };

    // Helper function to extract only previous jobwork damages for separate receipts
    const extractPreviousJobworkDamages = () => {
      const previousJobworkMap = new Map<string, any[]>();
      
      rows.forEach((row) => {
        const prevJobworkDamage = row.damages.find(
          d => d.type === DamageType.REPAIRABLE && d.source === DamageSource.PREVIOUS_JOBWORK && d.reworkJobworkNumber
        );
        
        if (prevJobworkDamage && prevJobworkDamage.reworkJobworkNumber) {
          const jobworkNumber = prevJobworkDamage.reworkJobworkNumber;
          if (!previousJobworkMap.has(jobworkNumber)) {
            previousJobworkMap.set(jobworkNumber, []);
          }
          
          // Include only the repairable damage from previous jobwork (not full receipt data)
          previousJobworkMap.get(jobworkNumber)!.push({
            itemName: row.itemName,
            acceptedQuantity: 0,
            salesQuantity: 0,
            salesPrice: 0,
            wagePerItem: 0,
            damages: [{
              type: DamageType.REPAIRABLE,
              quantity: prevJobworkDamage.quantity === "" ? 0 : prevJobworkDamage.quantity,
              source: DamageSource.CURRENT_JOBWORK, // From old jobwork's perspective, this is current damage
              reportedJobworkFrom: jobwork.jobworkNumber, // Track which jobwork reported this damage
            }],
          });
        }
      });
      
      return previousJobworkMap;
    };

    const submitReceipts = async (receiptData: { jobworkNumber: string; items: any[] }[]) => {
      try {
        for (const receipt of receiptData) {
          if (mode === "submit") {
            await createJobworkReceipt({
              jobworkNumber: receipt.jobworkNumber,
              jobworkReceiptItems: receipt.items,
            });
          } else {
            await createWorflowRequest({
              requestType: WorkflowRequestType.JOBWORK_RECEIPT,
              payload: JSON.stringify({
                jobworkNumber: receipt.jobworkNumber,
                items: receipt.items,
              }),
              systemComments: "Quantity mismatch",
            });
          }
        }
        notify(mode === "submit" ? "Jobwork receipts created successfully" : "Requests raised successfully", "success");
        setRows([]);
        setJobwork(null);
        setJobworkNumber("");
      } catch (error) {
        notify("Error occurred", "error");
      }
    };

    // Prepare current jobwork receipt with ALL damages (including previous jobwork damages)
    const currentJobworkItems = transformRows(rows);
    
    // Extract previous jobwork damages for separate receipts
    const previousJobworkDamagesMap = extractPreviousJobworkDamages();
    
    // Build list of receipts to submit
    const receiptsToSubmit = [
      {
        jobworkNumber: jobwork.jobworkNumber,
        items: currentJobworkItems, // Complete receipt with all damages
      },
    ];
    
    // Add receipts for each previous jobwork that has damages
    previousJobworkDamagesMap.forEach((items, jobworkNumber) => {
      receiptsToSubmit.push({
        jobworkNumber,
        items, // Only repairable damages from this previous jobwork
      });
    });
    
    // Submit all receipts
    submitReceipts(receiptsToSubmit);
  };

  const selectedItemIds = rows
    .map((r) => r.itemId)
    .filter((id): id is number => id !== null);

  return (
    <>
      {/* Quantity Summary Cards */}
      <Stack direction="row" spacing={2} sx={{ mb: 2 }} flexWrap="wrap">
        {/* Assigned Qty */}
        <Paper
          variant="outlined"
          sx={{
            display: "flex",
            alignItems: "center",
            px: 1.5,
            py: 0.75,
            borderRadius: 1,
            bgcolor: "action.hover",
          }}
        >
          <InventoryIcon fontSize="small" color="primary" sx={{ mr: 0.75 }} />
          <Typography variant="caption" color="text.secondary">
            Assigned:
          </Typography>
          <Typography variant="body2" fontWeight={700} color="primary.main" sx={{ ml: 0.5 }}>
            {assignedQuantity}
          </Typography>
        </Paper>

        {/* Pending Qty */}
        <Paper
          variant="outlined"
          sx={{
            display: "flex",
            alignItems: "center",
            px: 1.5,
            py: 0.75,
            borderRadius: 1,
            bgcolor: "action.hover",
          }}
        >
          <HourglassTopIcon fontSize="small" color="warning" sx={{ mr: 0.75 }} />
          <Typography variant="caption" color="text.secondary">
            Pending:
          </Typography>
          <Typography variant="body2" fontWeight={700} color="warning.main" sx={{ ml: 0.5 }}>
            {pendingQuantity > 0 ? pendingQuantity : 0}
          </Typography>
        </Paper>

        {/* Remaining Qty */}
        <Paper
          variant="outlined"
          sx={{
            display: "flex",
            alignItems: "center",
            px: 1.5,
            py: 0.75,
            borderRadius: 1,
            bgcolor: remainingQty < 0 ? "error.50" : "action.hover",
            borderColor: remainingQty < 0 ? "error.main" : "divider",
          }}
        >
          <CheckCircleOutlineIcon
            fontSize="small"
            color={remainingQty < 0 ? "error" : "success"}
            sx={{ mr: 0.75 }}
          />
          <Typography variant="caption" color="text.secondary">
            Remaining:
          </Typography>
          <Typography
            variant="body2"
            fontWeight={700}
            color={remainingQty < 0 ? "error.main" : "success.main"}
            sx={{ ml: 0.5 }}
          >
            {jobwork.jobworkStatus === JobworkStatus.CLOSED ||
            jobwork.jobworkStatus === JobworkStatus.REASSIGNED
              ? 0
              : remainingQty}
          </Typography>
        </Paper>
      </Stack>

      {/* Warning for exceeded quantity */}
      {remainingQty < 0 && (
        <Typography
          variant="body2"
          color="error.main"
          sx={{
            mb: 2,
            p: 1.5,
            bgcolor: "error.50",
            borderRadius: 1,
            border: "1px solid",
            borderColor: "error.main",
          }}
        >
          ⚠️ Total quantity exceeds assigned limit by {Math.abs(remainingQty)} items!
        </Typography>
      )}

      { disableAddItem ? (
        <Typography variant="body2" color="error.main" sx={{ mt: 2 }}>
          {isAwaitingApproval 
            ? "This jobwork has a receipt raised already and is still pending approval" 
            : "Jobwork is closed or reassigned"}
        </Typography>
      ) : (
        <>
          <TableContainer component={Paper} sx={{ mt: 2, width: "100%" }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell rowSpan={2}>Item</TableCell>
              <TableCell rowSpan={2}>Returned</TableCell>
              <TableCell rowSpan={2}>Wage/₹</TableCell>
              <TableCell rowSpan={2}>Sales Cost</TableCell>
              <TableCell rowSpan={2}>Sales Qty</TableCell>
              <TableCell align="center" colSpan={4}>Damages</TableCell>
              <TableCell rowSpan={2}>Remove</TableCell>
            </TableRow>
            <TableRow>
              <TableCell align="right">
                <Typography variant="caption" fontWeight={600} color="error.main">
                  Supplier
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Typography variant="caption" fontWeight={600} color="warning.main">
                  Repairable (Current)
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Typography variant="caption" fontWeight={600} color="warning.main">
                  Repairable (Previous)
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Typography variant="caption" fontWeight={600} color="error.dark">
                  Unrepairable
                </Typography>
              </TableCell>
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
                  jobworkNumber={jobwork.jobworkNumber} // Pass jobwork number for prior jobworks lookup
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
          disabled={!canRaiseRequest || disableRequest}
        >
          Raise Request
        </Button>
        <Button
          variant="contained"
          color="success"
          onClick={handleSubmit}
          disabled={!canSubmit || disableSubmit}
        >
          Submit
        </Button>
      </Stack>
        </>
      )}

      <InpassConfirmationDialog
        open={confirmDialog.open}
        mode={confirmDialog.mode}
        rows={rows}
        jobwork={jobwork}
        onClose={() => setConfirmDialog((prev) => ({ ...prev, open: false }))}
        onConfirm={handleConfirm}
      />
    </>
  );
}
