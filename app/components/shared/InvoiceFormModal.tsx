"use client";

import { InvoiceDetails } from "@/app/(protected)/invoice/_types/invoiceDetails";
import { Supplier } from "@/app/(protected)/invoice/_types/supplier";
import { Transport } from "@/app/(protected)/invoice/_types/transport";
import { InvoiceErrors } from "@/app/(protected)/invoice/create/invoice.types";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  FormControlLabel,
  Switch,
  Autocomplete,
  FormControl,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

// export type InvoiceFormData = {
//   invoiceNumber: string;
//   invoiceDate: string | null;
//   receivedDate: string | null;
//   supplierName: string;
//   transportName: string;
//   transportCost: number | "";
//   isTransportPaid: boolean;
// };

type InvoiceFormModalProps = {
  open: boolean;
  mode: "create" | "edit";
  initialData: InvoiceDetails;
  loading?: boolean;
  onChange: (patch: Partial<InvoiceDetails>) => void;
  onClose: () => void;
  onSubmit: (data: InvoiceDetails) => void;
  suppliers: Supplier[];
  transports: Transport[];
  errors: InvoiceErrors;
};

export default function InvoiceFormModal({
  open,
  mode,
  initialData,
  loading = false,
  onClose,
  onSubmit,
  suppliers,
  transports,
  errors,
  onChange,
}: InvoiceFormModalProps) {
  console.log(initialData);
  // const [form, setForm] = useState<InvoiceFormData>({
  //   invoiceNumber: "",
  //   invoiceDate: null,
  //   receivedDate: "",
  //   supplierName: "",
  //   transportName: "",
  //   transportCost: "",
  //   isTransportPaid: false,
  // });

  // useEffect(() => {
  //   if (open) {
  //     setForm(
  //       initialData ?? {
  //         invoiceNumber: "",
  //         invoiceDate: null,
  //         receivedDate: null,
  //         supplierName: "",
  //         transportName: "",
  //         transportCost: "",
  //         isTransportPaid: false,
  //       }
  //     );
  //   }
  // }, [open, initialData]);

  // const handleChange =
  //   (field: keyof InvoiceFormData) =>
  //   (e: React.ChangeEvent<HTMLInputElement>) => {
  //     let value: any;

  //     if (field === "transportCost") {
  //       value = e.target.value === "" ? "" : Number(e.target.value);
  //     } else if (field === "isTransportPaid") {
  //       value = e.target.checked; // Switch has checked property
  //     } else {
  //       value = e.target.value;
  //     }

  //     setForm((prev) => ({ ...prev, [field]: value }));
  //     set((prev) => {
  //       const next = { ...prev };
  //       Object.keys(patch).forEach(
  //         (key) => delete next[key as keyof InvoiceErrors]
  //       );
  //       return next;
  //     });
  //   };

  console.log("date", initialData?.invoiceDate);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>
          {mode === "create" ? "Add Invoice" : "Edit Invoice"}
        </DialogTitle>

        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField
              label="Invoice Number"
              value={initialData.invoiceNumber}
              onChange={(e) => onChange({ invoiceNumber: e.target.value })}
              fullWidth
              required
              error={!!errors.invoiceNumber}
              helperText={errors.invoiceNumber}
            />

            <FormControl fullWidth>
              <DatePicker
                label="Invoice Date"
                format="DD/MM/YYYY"
                value={
                  initialData.invoiceDate
                    ? dayjs(initialData.invoiceDate, "DD-MM-YYYY", true)
                    : null
                }
                onAccept={(date) =>
                  onChange({
                    invoiceDate: date ? date.format("DD-MM-YYYY") : "",
                  })
                }
                maxDate={dayjs()}
                slotProps={{
                  textField: {
                    id: "invoice-date",
                    fullWidth: true,
                    error: Boolean(errors.invoiceDate),
                    helperText: errors.invoiceDate,
                  },
                }}
              />
            </FormControl>

            <FormControl fullWidth>
              <DatePicker
                label="Received Date"
                format="DD/MM/YYYY"
                value={
                  initialData.receivedDate
                    ? dayjs(initialData.receivedDate, "DD-MM-YYYY", true)
                    : null
                }
                onAccept={(date) =>
                  onChange({
                    receivedDate: date ? date.format("DD-MM-YYYY") : "",
                  })
                }
                maxDate={dayjs()}
                slotProps={{
                  textField: {
                    id: "received-date",
                    fullWidth: true,
                    error: Boolean(errors.receivedDate),
                    helperText: errors.receivedDate,
                  },
                }}
              />
            </FormControl>

            <Autocomplete
              openOnFocus
              id="supplier-autocomplete"
              disablePortal
              autoHighlight
              options={suppliers.map((s) => s.name)}
              value={initialData.supplierName}
              onChange={(_, supplier) =>
                onChange({ supplierName: supplier ?? undefined })
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  id="supplier-input"
                  label="Supplier"
                  error={!!errors.supplierName}
                  helperText={errors.supplierName}
                />
              )}
            />
            <Autocomplete
              openOnFocus
              id="transport-autocomplete"
              disablePortal
              autoHighlight
              options={transports.map((t) => t.name)}
              // getOptionLabel={(option) => option.name}
              value={initialData.transportName}
              onChange={(_, transport) =>
                onChange({ transportName: transport ?? undefined })
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  id="transport-input"
                  label="Transport"
                  error={!!errors.transportName}
                  helperText={errors.transportName}
                />
              )}
            />

            <TextField
              label="Transport Cost"
              type="number"
              value={initialData.transportCost}
              onChange={(e) => {
                const raw = e.target.value;
                onChange({
                  transportCost: raw === "" ? undefined : Number(raw),
                });
              }}
              fullWidth
              error={!!errors.transportCost}
              helperText={errors.transportCost}
            />
          </Stack>
          <FormControlLabel
            control={
              <Switch
                checked={initialData.isTransportPaid}
                onChange={(e) =>
                  onChange({ isTransportPaid: e.target.checked })
                }
              />
            }
            label="Transport Paid"
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={() => onSubmit(initialData)}
            loading={loading}
            loadingPosition="end"
          >
            {mode === "create" ? "Create" : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
}
