"use client";

import GenericTable from "@/app/components/shared/GenericTable";
import {
  Grid,
  Chip,
  Button,
  IconButton,
  Popper,
  ClickAwayListener,
  Paper,
  Typography,
  Divider,
  Stack,
  Box,
  CircularProgress,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import React, { useEffect, useState } from "react";
import { People } from "@mui/icons-material";
import { fetchSuppliers } from "@/app/api/supplier";
import { fetchBatches, recycleBatch } from "@/app/api/batchApi";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import LowPriorityIcon from "@mui/icons-material/LowPriority";
import { formatToShortDate } from "@/app/utils/date";
import BadgeIcon from "@mui/icons-material/Badge";
import NewReleasesIcon from "@mui/icons-material/NewReleases";
import { BatchStatus, BatchStatusColorMap } from "@/app/_types/BatchStatus";
import RecyclingIcon from "@mui/icons-material/Recycling";
import PrecisionManufacturingIcon from "@mui/icons-material/PrecisionManufacturing";
import ExpandCircleDownIcon from "@mui/icons-material/ExpandCircleDown";
import { SubCategory } from "@/app/_types/SubCategory";
import { useNotification } from "@/app/components/shared/NotificationProvider";
import { fetchInvoices, updateInvoice } from "@/app/api/invoiceApi";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ReportIcon from "@mui/icons-material/Report";
import InvoiceFormModal from "@/app/components/shared/InvoiceFormModal";
import { Supplier } from "../_types/supplier";
import { fetchTransports } from "@/app/api/transport";
import dayjs from "dayjs";
import { INITIAL_INVOICE, InvoiceErrors } from "../create/invoice.types";
import { InvoiceDetails } from "../_types/invoiceDetails";
import { useRouter } from "next/navigation";
import { Category } from "@/app/_types/Category";
import { fetchCategories } from "@/app/api/category";
import { fetchSubCategories } from "@/app/api/subCategory";
import BaleFormModal from "@/app/components/shared/BaleFormModal";
import { BaleDetails, BaleErrors, INITIAL_BALE } from "./bale.types";
import { updateBale } from "@/app/api/baleApi";
import { useUser } from "@/app/context/UserContext";

interface BaleRow {
  id: number;
  baleNumber: string;
  quantity: number;
  length: number;
  price: number;
  quality: string;
  category: string;
  subCategory: string;
}

type Props = {
  bales: BaleRow[];
  canEdit: boolean;
};

const HEADERS = [
  {
    id: "baleNumber",
    label: "Bale Number",
  },
  {
    id: "quantity",
    label: "Quantity",
  },
  {
    id: "length",
    label: "Length",
  },
  {
    id: "price",
    label: "Price",
  },
  {
    id: "quality",
    label: "Quality",
  },
  {
    id: "category",
    label: "Category",
  },
  {
    id: "subCategory",
    label: "Sub Category",
  },
];

export default function BaleTable({ bales, canEdit }: Props) {
  console.log(bales);
  const { notify } = useNotification();
  const { user } = useUser();
  const router = useRouter();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<string | undefined>();
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [totalCount, setTotalCount] = useState(0);

  const [rows, setRows] = useState<BaleRow[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [baleErrors, setBaleErrors] = useState<BaleErrors>({});

  const [openModal, setOpenModal] = useState(false);
  const [selectedBale, setSelectedBale] = useState<BaleDetails>(INITIAL_BALE);

  // ✅ Popper state
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleBaleChange = (patch: Partial<BaleDetails>) => {
    setSelectedBale((prev) => ({ ...prev, ...patch }));
    setBaleErrors((prev) => {
      const next = { ...prev };
      Object.keys(patch).forEach((key) => delete next[key as keyof BaleErrors]);
      return next;
    });
  };

  const handleEditBale = (bale: any) => {
    setSelectedBale(bale);
    setOpenModal(true);
  };

  const validateBale = (bale: BaleDetails): boolean => {
    const errors: BaleErrors = {};

    // Bale number validation
    if (!bale.baleNumber || !bale.baleNumber.trim()) {
      errors.baleNumber = "Bale number is required";
    }

    // Quantity validation
    if (
      bale.quantity === "" ||
      bale.quantity === undefined ||
      bale.quantity <= 0
    ) {
      errors.quantity = "Quantity must be greater than 0";
    }

    // Length validation
    if (bale.length === "" || bale.length === undefined || bale.length <= 0) {
      errors.length = "Length must be greater than 0";
    }

    // Price validation
    if (bale.price === "" || bale.price === undefined || bale.price < 0) {
      errors.price = "Price must be 0 or more";
    }

    // Quality validation
    if (!bale.quality || !bale.quality.trim()) {
      errors.quality = "Quality is required";
    }

    // Category validation
    if (!bale.category) {
      errors.category = "Category is required";
    }

    // Subcategory validation
    if (!bale.subCategory) {
      errors.subCategory = "Sub Category is required";
    }

    // Set errors in state (assuming you have a setBaleErrors state setter)
    setBaleErrors(errors);

    // Return true if no errors
    return Object.keys(errors).length === 0;
  };

  const toISODate = (date: string) => {
    const [dd, mm, yyyy] = date.split("-");
    return `${yyyy}-${mm}-${dd}`;
  };

  const handleBaleSubmit = async (data: BaleDetails) => {
    console.log(data);
    try {
      if (!validateBale(data)) {
        return;
      }
      const payload = {
        ...data,
        updatedById: user?.id,
      };
      await updateBale(data.id, payload);
      notify("Invoice updated successfully", "success");
      setOpenModal(false);
      setRows((prevRows) =>
        prevRows.map((row) =>
          row.id === data.id
            ? {
                ...row,
                baleNumber: data.baleNumber,
                quantity: Number(data.quantity),
                length: Number(data.length),
                price: Number(data.price),
                quality: data.quality,
                category: data.category || "",
                subCategory: data.subCategory || "",
              }
            : row
        )
      );
    } catch (err: any) {
      notify(err?.response?.data?.message ?? "Error saving invoice", "error");
    }
  };

  const handleCloseDetails = () => {
    setAnchorEl(null);
    setOpenModal(false);
    setSubCategories([]);
    setBaleErrors({});
  };

  useEffect(() => {
    setRows(bales ?? []);
    setTotalCount(bales?.length ?? 0);
  }, [bales]);

  useEffect(() => {
    if (openModal) {
      fetchCategories()
        .then((res) => setCategories(res))
        .catch((err) => {
          notify("Error fetching categories", "error");
        });
      fetchSubCategories()
        .then((res) => setSubCategories(res))
        .catch((err) => {
          notify("Error fetching sub categories", "error");
        });
    }
  }, [openModal]);

  return (
    <Grid container>
      <Grid size={12}>
        <GenericTable<BaleRow>
          title="Bales"
          rows={rows}
          pagination={false}
          totalCount={totalCount}
          onSortChange={(col, order) => {
            setSortBy(col);
            setSortOrder(order);
          }}
          columns={HEADERS}
          rowActions={
            canEdit
              ? [
                  {
                    label: "Edit",
                    icon: () => (
                      <IconButton size="small">
                        <EditIcon sx={{ color: "gray" }} />
                      </IconButton>
                    ),
                    onClick: (row) => handleEditBale(row),
                  },
                ]
              : undefined
          }
        />
      </Grid>

      {/* ✅ POPPER (render ONCE, outside table) */}
      <BaleFormModal
        open={openModal}
        mode={selectedBale ? "edit" : "create"}
        onChange={handleBaleChange}
        initialData={selectedBale}
        onClose={handleCloseDetails}
        onSubmit={handleBaleSubmit}
        categories={categories}
        subCategories={subCategories}
        errors={baleErrors}
      />
    </Grid>
  );
}
