"use client";

import InvoiceDetailsForm from "./InvoiceDetailsForm";
import { Box, Button, Divider, Grid, Stack, Typography } from "@mui/material";
import { InvoiceDetails } from "../_types/invoiceDetails";
import { useEffect, useRef, useState } from "react";
import { Supplier } from "../_types/supplier";
import { Transport } from "../_types/transport";
import { fetchSuppliers } from "@/app/api/supplier";
import { fetchTransports } from "@/app/api/transport";

import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import DraftsIcon from "@mui/icons-material/Drafts";
import LRDetailsForm from "./LRDetailsForm";
import { LRDetails } from "../_types/LRDetails";
import { fetchCategories } from "@/app/api/category";
import { fetchSubCategories } from "@/app/api/subCategory";
import { Category } from "@/app/_types/Category";
import { SubCategory } from "@/app/_types/SubCategory";
import { Bale } from "../_types/Bale";
import { LR } from "../_types/LR";
import { useNotification } from "@/app/components/shared/NotificationProvider";
import { useConfirmation } from "@/app/components/shared/ConfirmationProvider";
import { createStock } from "@/app/api/invoiceApi";
import { useUser } from "@/app/context/UserContext";
import {
  BaleErrors,
  INITIAL_INVOICE,
  INITIAL_LR,
  InvoiceErrors,
  LRErrors,
} from "./invoice.types";
import dayjs from "dayjs";

function page() {
  const [invoice, setInvoice] = useState<InvoiceDetails>(INITIAL_INVOICE);
  const [invoiceErrors, setInvoiceErrors] = useState<InvoiceErrors>({});
  const [lr, setLr] = useState<LRDetails>(INITIAL_LR);
  const [lrErrors, setLrErrors] = useState<Record<string, LRErrors>>({});
  const [loading, setLoading] = useState(false);

  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [transports, setTransports] = useState<Transport[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);

  const { notify } = useNotification();
  const { user } = useUser();

  const validateInvoice = (): boolean => {
    const errors: InvoiceErrors = {};
    if (!invoice.invoiceNumber)
      errors.invoiceNumber = "Invoice number is required";

    if (!invoice.invoiceDate) errors.invoiceDate = "Invoice date is required";
    else if (
      dayjs(invoice.invoiceDate, "DD-MM-YYYY", true).isAfter(dayjs(), "day")
    ) {
      errors.invoiceDate = "Cannot select a future date";
    }

    if (!invoice.receivedDate)
      errors.receivedDate = "Received date is required";
    else if (
      dayjs(invoice.receivedDate, "DD-MM-YYYY", true).isAfter(dayjs(), "day")
    ) {
      errors.receivedDate = "Cannot select a future date";
    }

    if (!invoice.supplierID) errors.supplierID = "Supplier is required";

    if (!invoice.transportID) errors.transportID = "Transport is required";
    if (invoice.transportCost && invoice.transportCost <= 0)
      errors.transportCost = "Transport cost cannot be negative";
    console.log("errors", errors);
    setInvoiceErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateAllLRs = (
    lrs: LR[]
  ): { errors: Record<string, LRErrors>; empty: string[]; valid: boolean } => {
    const allErrors: Record<string, LRErrors> = {};
    const emptyLrNumbers: string[] = [];

    if (lrs.length === 0) {
      notify("At least 1 Lorry Receipt should be present", "error");
      return { errors: {}, empty: [], valid: false };
    }

    lrs.forEach((lr) => {
      const errors: LRErrors = { bales: {} };

      if (!lr.lrNumber) errors.lrNumber = "LR number is required";

      if (lr.bales.length === 0) {
        emptyLrNumbers.push(lr.lrNumber);
      }

      lr.bales.forEach((bale) => {
        const baleErrors: BaleErrors = {};
        if (!bale.baleNumber.trim()) baleErrors.baleNumber = "Bale number is required";
        if (!bale.price) baleErrors.price = "Bale price is required";
        if (bale.price && bale.price < 0) {
          baleErrors.price = "Price must be > 0";
        }
        if (!bale.quantity) baleErrors.quantity = "Bale quantity is required";
        if (!bale.quality?.trim()) baleErrors.quality = "Bale quality is required";
        if (!bale.length) baleErrors.length = "Bale length is required";
        if (bale.length && bale.length < 0) {
          baleErrors.length = "Length must be > 0";
        }
        if (!bale.subCategoryID)
          baleErrors.subCategoryID = "Sub Category is required";
        if (!bale.categoryID) baleErrors.categoryID = "Category is required";
        if (bale.quantity !== undefined && bale.quantity <= 0)
          baleErrors.quantity = "Quantity must be > 0";
        if (Object.keys(baleErrors).length > 0) {
          errors.bales![bale.id] = baleErrors;
        }
      });

      if (errors.bales && Object.keys(errors.bales).length === 0) {
        delete errors.bales;
      }

      if (errors.lrNumber || errors.bales) {
        allErrors[lr.id] = errors;
      }
    });

    return { errors: allErrors, empty: emptyLrNumbers, valid: true };
  };

  const handleClearBaleError = (
    lrId: string,
    baleId: string,
    field: keyof Bale
  ) => {
    setLrErrors((prev) => {
      const next = { ...prev };
      const baleErrors = next[lrId]?.bales?.[baleId];
      if (baleErrors?.[field]) {
        delete baleErrors[field];

        // Cleanup empty objects
        if (Object.keys(baleErrors).length === 0)
          delete next[lrId].bales![baleId];
        if (next[lrId].bales && Object.keys(next[lrId].bales!).length === 0)
          delete next[lrId].bales;
        if (Object.keys(next[lrId]).length === 0) delete next[lrId];
      }
      return next;
    });
  };

  const handleInvoiceChange = (patch: Partial<InvoiceDetails>) => {
    setInvoice((prev) => ({ ...prev, ...patch }));

    setInvoiceErrors((prev) => {
      const next = { ...prev };
      Object.keys(patch).forEach(
        (key) => delete next[key as keyof InvoiceErrors]
      );
      return next;
    });
  };

  const updateLr = (patch: Partial<LRDetails>) => {
    setLr((prev) => ({ ...prev, ...patch }));
    console.log(patch);

    // setInvoiceErrors((prev) => {
    //   const next = { ...prev };
    //   Object.keys(patch).forEach(
    //     (key) => delete next[key as keyof InvoiceErrors]
    //   );
    //   return next;
    // });
  };

  const saveDraft = () => {
    const draft = {
      invoice,
      lr,
    };

    localStorage.setItem("invoiceDraft", JSON.stringify(draft));
    notify("Draft saved. Come back anytime to edit again!", "success");
  };

  const submitInvoice = async () => {
    if (!validateInvoice()) return;

    const { errors, empty, valid } = validateAllLRs(lr.lorryReceipts);
    setLrErrors(errors); // update state for UI

    if (!valid) {
      return;
    }

    if (empty.length > 0) {
      notify(
        "Some of your lorry receipt has no bales. Please remove and submit again",
        "error"
      );
      return;
    }

    if (Object.keys(errors).length === 0) {
      setLoading(true);
      const payload = {
        ...invoice,
        invoiceDate: invoice.invoiceDate.replaceAll("-", "/"),
        receivedDate: invoice.receivedDate.replaceAll("-", "/"),
        lorryReceipts: lr.lorryReceipts,
        createdById: user?.id,
        isTransportPaid: invoice.transportCost ? invoice.isTransportPaid : true,
      };
      try {
        await createStock(payload);
        notify("Invoice has been saved", "success");
        setInvoice(INITIAL_INVOICE);
        setLr(INITIAL_LR);
        localStorage.removeItem("invoiceDraft");
      } catch {
        notify("An error occured during submission", "error");
      } finally {
        setLoading(false);
      }
    }
  };

  const clearForm = () => {
    setInvoice(INITIAL_INVOICE);
    setInvoiceErrors({});
    setLr(INITIAL_LR);
    setLrErrors({});
    localStorage.removeItem("invoiceDraft");
  };

  useEffect(() => {
    const savedDraft = localStorage.getItem("invoiceDraft");
    if (savedDraft) {
      notify("Restored saved draft", "info");
      try {
        const parsed = JSON.parse(savedDraft);
        if (parsed.invoice) setInvoice(parsed.invoice);
        if (parsed.lr) setLr(parsed.lr);
      } catch (error) {
        console.error("Failed to parse draft", error);
      }
    }
    const loadSuppliers = async () => {
      const data = await fetchSuppliers();
      setSuppliers(data);
    };

    const loadTransports = async () => {
      const data = await fetchTransports();
      setTransports(data);
    };

    const loadCategories = async () => {
      const data = await fetchCategories();
      setCategories(data);
    };

    const loadSubCategories = async () => {
      const data = await fetchSubCategories();
      setSubCategories(data);
    };

    try {
      loadSuppliers();
      loadTransports();
      loadCategories();
      loadSubCategories();
    } catch {
      notify("Error fetching data");
      console.log("error fetch master data");
    }
  }, []);

  return (
    <Box>
      <Grid container>
        <Grid size={12}>
          <InvoiceDetailsForm
            value={invoice}
            errors={invoiceErrors}
            onChange={handleInvoiceChange}
            suppliers={suppliers}
            transports={transports}
            setSuppliers={setSuppliers}
            setTransports={setTransports}
          />
        </Grid>
        <Grid size={12}>
          <Divider sx={{ my: 3 }} />
        </Grid>
        <Grid size={12}>
          <LRDetailsForm
            value={lr}
            onChange={updateLr}
            categories={categories}
            subCategories={subCategories}
            lrErrors={lrErrors}
            onClearBaleError={handleClearBaleError}
            setCategories={setCategories}
            setSubCategories={setSubCategories}
          />
        </Grid>
        <Grid size={12}>
          <Stack justifyContent="flex-end" direction="row" columnGap={2}>
            <Button
              variant="outlined"
              onClick={clearForm}
              startIcon={<DeleteIcon />}
              color="error"
            >
              Clear
            </Button>
            <Button
              variant="contained"
              color="secondary"
              startIcon={<DraftsIcon />}
              onClick={saveDraft}
            >
              Save Draft
            </Button>
            <Button
              variant="contained"
              loading={loading}
              loadingPosition="start"
              onClick={submitInvoice}
            >
              Submit Invoice
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}

export default page;
