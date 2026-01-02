"use client";

import { BaleDetails, BaleErrors } from "@/app/(protected)/invoice/[id]/bale.types";
import { InvoiceDetails } from "@/app/(protected)/invoice/_types/invoiceDetails";
import { Supplier } from "@/app/(protected)/invoice/_types/supplier";
import { Transport } from "@/app/(protected)/invoice/_types/transport";
import { InvoiceErrors } from "@/app/(protected)/invoice/create/invoice.types";
import { Category } from "@/app/_types/Category";
import { SubCategory } from "@/app/_types/SubCategory";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,

  Autocomplete,
  FormControl,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useEffect, useState } from "react";


type InvoiceFormModalProps = {
  open: boolean;
  mode: "create" | "edit";
  initialData: BaleDetails;
  loading?: boolean;
  onChange: (patch: Partial<BaleDetails>) => void;
  onClose: () => void;
  onSubmit: (data: BaleDetails) => void;
  categories: Category[];
  subCategories: SubCategory[];
  errors: BaleErrors;
};

export default function BaleFormModal({
  open,
  mode,
  initialData,
  loading = false,
  onClose,
  onSubmit,
  categories,
  subCategories,
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

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>
          {mode === "create" ? "Add Bale" : "Edit Bale"}
        </DialogTitle>

        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField
              label="Bale Number"
              value={initialData.baleNumber}
              onChange={(e) => onChange({ baleNumber: e.target.value })}
              fullWidth
              required
                error={!!errors.baleNumber}
                helperText={errors.baleNumber}
            />

            <TextField
              label="Quantity"
              type="number"
              value={initialData.quantity}
              onChange={(e) => {
                const raw = e.target.value;
                onChange({
                  quantity: raw === "" ? "" : Number(raw),
                });
              }}
              fullWidth
              error={!!errors.quantity}
              helperText={errors.quantity}
            />

            <TextField
              label="Length"
              type="number"
              value={initialData.length}
              onChange={(e) => {
                const raw = e.target.value;
                onChange({
                  length: raw === "" ? "" : Number(raw),
                });
              }}
              fullWidth
              error={!!errors.length}
              helperText={errors.length}
            />

            <TextField
              label="Price"
              type="number"
              value={initialData.price}
              onChange={(e) => {
                const raw = e.target.value;
                onChange({
                  price: raw === "" ? "" : Number(raw),
                });
              }}
              fullWidth
              error={!!errors.price}
              helperText={errors.price}
            />

            <TextField
              label="Quality"
              value={initialData.quality}
              onChange={(e) => onChange({ quality: e.target.value })}
              fullWidth
              required
                error={!!errors.quality}
                helperText={errors.quality}
            />

            <Autocomplete
              openOnFocus
              id="category-autocomplete"
              disablePortal
              autoHighlight
              options={categories.map((s) => s.name)}
              value={initialData.category}
              onChange={(_, category) =>
                onChange({ category: category ?? "" })
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  id="category-input"
                  label="Category"
                  error={!!errors.category}
                  helperText={errors.category}
                />
              )}
            />
            <Autocomplete
              openOnFocus
              id="sub-category-autocomplete"
              disablePortal
              autoHighlight
              options={subCategories.map((t) => t.name)}
              // getOptionLabel={(option) => option.name}
              value={initialData.subCategory}
              onChange={(_, subCat) =>
                onChange({ subCategory: subCat ?? "" })
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  id="sub-category-input"
                  label="Sub Category"
                  error={!!errors.subCategory}
                  helperText={errors.subCategory}
                />
              )}
            />

          </Stack>
          
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
