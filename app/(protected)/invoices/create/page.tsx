"use client";

import {
  Box,
  Grid,
  Stack,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import dayjs from "dayjs";

import InvoiceDetailsForm from "./InvoiceDetailsForm";
import LRDetailsForm from "./LRDetailsForm";
import InvoiceSummary from "./InvoiceSummary";

import {
  BaleErrors,
  INITIAL_INVOICE,
  INITIAL_LR,
  InvoiceErrors,
  LRErrors,
} from "./invoice.types";

import { InvoiceDetails } from "../_types/invoiceDetails";
import { LRDetails } from "../_types/LRDetails";
import { Bale } from "../_types/Bale";
import { LR } from "../_types/LR";

import { Supplier } from "../_types/supplier";
import { Transport } from "../_types/transport";
import { Category } from "@/app/_types/Category";
import { SubCategory } from "@/app/_types/SubCategory";

import { createStock } from "@/app/api/invoiceApi";
import { useNotification } from "@/app/components/shared/NotificationProvider";
import { useUser } from "@/app/context/UserContext";

import { fetchSuppliers } from "@/app/api/supplier";
import { fetchTransports } from "@/app/api/transport";
import { fetchCategories } from "@/app/api/category";
import { fetchSubCategories } from "@/app/api/subCategory";
import { useGlobalLoading } from "@/app/components/layout/LoadingProvider";
import { normalizeError } from "@/app/utils/error";

const DRAFT_KEY = "invoiceDraft";

/* ---------------- Validation ---------------- */

const isFutureDate = (date?: string) =>
  !!date && dayjs(date, "DD-MM-YYYY", true).isAfter(dayjs(), "day");

const validateInvoice = (invoice: InvoiceDetails): InvoiceErrors => {
  const errors: InvoiceErrors = {};

  if (!invoice.invoiceNumber.trim())
    errors.invoiceNumber = "Invoice number is required";

  if (!invoice.invoiceDate) errors.invoiceDate = "Invoice date is required";
  else if (isFutureDate(invoice.invoiceDate))
    errors.invoiceDate = "Cannot select a future date";

  if (!invoice.receivedDate) errors.receivedDate = "Received date is required";
  else if (isFutureDate(invoice.receivedDate))
    errors.receivedDate = "Cannot select a future date";

  if (!invoice.supplierID) errors.supplierID = "Supplier is required";

  if (!invoice.transportID) errors.transportID = "Transport is required";

  if (invoice.transportCost !== undefined && invoice.transportCost <= 0)
    errors.transportCost = "Transport cost must be greater than 0";

  return errors;
};

const validateLRs = (lrs: LR[]) => {
  const errors: Record<string, LRErrors> = {};
  const emptyLRs: string[] = [];

  lrs.forEach((lr) => {
    const lrErrors: LRErrors = { bales: {} };

    if (!lr.lrNumber) lrErrors.lrNumber = "LR number is required";

    if (!lr.bales.length) emptyLRs.push(lr.lrNumber);

    lr.bales.forEach((bale) => {
      const baleErrors: BaleErrors = {};

      if (!bale.baleNumber?.trim()) baleErrors.baleNumber = "Required";

      if (!bale.price || bale.price <= 0) baleErrors.price = "Must be > 0";

      if (!bale.quantity || bale.quantity <= 0)
        baleErrors.quantity = "Must be > 0";

      if (!bale.length || bale.length <= 0) baleErrors.length = "Must be > 0";

      if (!bale.quality?.trim()) baleErrors.quality = "Required";

      if (!bale.categoryID) baleErrors.categoryID = "Required";

      if (!bale.subCategoryID) baleErrors.subCategoryID = "Required";

      if (Object.keys(baleErrors).length) lrErrors.bales![bale.id] = baleErrors;
    });

    if (Object.keys(lrErrors.bales!).length) errors[lr.id] = lrErrors;
  });

  return { errors, emptyLRs };
};

/* ---------------- Page ---------------- */

export default function InvoicePage() {
  const theme = useTheme();
  // We use LG breakpoint to switch from 2-column to 1-column
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));
  const { notify } = useNotification();
  const { user } = useUser();
  const { loading, showLoading, hideLoading } = useGlobalLoading();

  const [invoice, setInvoice] = useState(INITIAL_INVOICE);
  const [invoiceErrors, setInvoiceErrors] = useState<InvoiceErrors>({});
  const [lr, setLr] = useState<LRDetails>(INITIAL_LR);
  const [lrErrors, setLrErrors] = useState<Record<string, LRErrors>>({});

  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [transports, setTransports] = useState<Transport[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);

  /* ---------- Data bootstrap ---------- */

  useEffect(() => {
    const restoreDraft = () => {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (!raw) return;
      try {
        const parsed = JSON.parse(raw);
        parsed.invoice && setInvoice(parsed.invoice);
        parsed.lr && setLr(parsed.lr);
        notify("Draft restored", "info");
      } catch {}
    };

    restoreDraft();

    showLoading();

    Promise.all([
      fetchSuppliers(),
      fetchTransports(),
      fetchCategories(),
      fetchSubCategories(),
    ])
      .then(([s, t, c, sc]) => {
        setSuppliers(s);
        setTransports(t);
        setCategories(c);
        setSubCategories(sc);
      })
      .catch(() => notify("Failed to load master data", "error"))
      .finally(hideLoading);
  }, [notify, showLoading, hideLoading]);

  /* ---------- Handlers ---------- */

  const handleInvoiceChange = useCallback((patch: Partial<InvoiceDetails>) => {
    setInvoice((p) => ({ ...p, ...patch }));
    setInvoiceErrors((e) => {
      const next = { ...e };
      Object.keys(patch).forEach((k) => delete next[k as keyof InvoiceErrors]);
      return next;
    });
  }, []);

  const clearBaleError = useCallback(
    (lrId: string, baleId: string, field: keyof Bale) => {
      setLrErrors((prev) => {
        const next = structuredClone(prev);
        delete next?.[lrId]?.bales?.[baleId]?.[field];
        return next;
      });
    },
    [],
  );

  const saveDraft = () => {
    localStorage.setItem(DRAFT_KEY, JSON.stringify({ invoice, lr }));
    notify("Draft saved", "success");
  };

  const clearForm = () => {
    setInvoice(INITIAL_INVOICE);
    setLr(INITIAL_LR);
    setInvoiceErrors({});
    setLrErrors({});
    localStorage.removeItem(DRAFT_KEY);
  };

  const submitInvoice = async () => {
    const invErrors = validateInvoice(invoice);
    setInvoiceErrors(invErrors);
    if (Object.keys(invErrors).length) return;

    if (!lr.lorryReceipts.length) {
      notify("Add at least one LR", "error");
      return;
    }

    const { errors, emptyLRs } = validateLRs(lr.lorryReceipts);
    setLrErrors(errors);

    if (emptyLRs.length) {
      notify("Some LRs have no bales", "error");
      return;
    }

    if (Object.keys(errors).length) return;

    try {
      showLoading();
      await createStock({
        ...invoice,
        invoiceDate: invoice.invoiceDate.replaceAll("-", "/"),
        receivedDate: invoice.receivedDate.replaceAll("-", "/"),
        lorryReceipts: lr.lorryReceipts,
        createdById: user?.id,
        isTransportPaid: invoice.transportCost ? invoice.isTransportPaid : true,
      });
      notify("Invoice saved successfully", "success");
      clearForm();
    } catch (err) {
      notify(normalizeError(err), "error");
    } finally {
      hideLoading();
    }
  };

  /* ---------- UI ---------- */

  return (
    <Box sx={{ p: { xs: 0, md: 1 } }}>
      <Grid container spacing={3}>
        {/* Main Form Area */}
        <Grid size={{ xs: 12, lg: 8, xl: 9 }}>
          <Stack spacing={3}>
            <InvoiceDetailsForm
              value={invoice}
              errors={invoiceErrors}
              onChange={handleInvoiceChange}
              suppliers={suppliers}
              transports={transports}
              setSuppliers={setSuppliers}
              setTransports={setTransports}
            />

            <LRDetailsForm
              value={lr}
              onChange={(p) => setLr((v) => ({ ...v, ...p }))}
              categories={categories}
              subCategories={subCategories}
              lrErrors={lrErrors}
              onClearBaleError={clearBaleError}
              setCategories={setCategories}
              setSubCategories={setSubCategories}
            />
          </Stack>
        </Grid>

        {/* Sticky Summary Area */}
        <Grid size={{ xs: 12, lg: 4, xl: 3 }}>
          <InvoiceSummary
            invoice={invoice}
            lr={lr}
            loading={loading}
            onSubmit={submitInvoice}
            onSaveDraft={saveDraft}
            onClear={clearForm}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
