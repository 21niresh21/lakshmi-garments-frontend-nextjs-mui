"use client";

import GenericTable from "@/app/components/shared/GenericTable";
import { Chip, Grid, IconButton, Stack, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useEffect, useState } from "react";
import { SubCategory } from "@/app/_types/SubCategory";
import { useNotification } from "@/app/components/shared/NotificationProvider";
import { useRouter } from "next/navigation";
import { Category } from "@/app/_types/Category";
import { fetchCategories } from "@/app/api/category";
import { fetchSubCategories } from "@/app/api/subCategory";
import BaleFormModal from "@/app/components/shared/BaleFormModal";
import { BaleDetails, BaleErrors, INITIAL_BALE } from "./bale.types";
import { updateBale } from "@/app/api/baleApi";
import { useUser } from "@/app/context/UserContext";
import { useGlobalLoading } from "@/app/components/layout/LoadingProvider";

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
  const { loading, showLoading, hideLoading } = useGlobalLoading();
  const { notify } = useNotification();
  const { user } = useUser();

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

  const handleBaleSubmit = async (data: BaleDetails) => {
    try {
      if (!validateBale(data)) {
        return;
      }
      showLoading();
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
            : row,
        ),
      );
    } catch (err: any) {
      notify(err?.response?.data?.message ?? "Error saving invoice", "error");
    } finally {
      hideLoading();
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
    <Grid container spacing={2}>
      <Grid size={12}>
        <Stack
          direction="row"
          alignItems="center"
          spacing={1.5}
          sx={{ mb: 0.5, mx: 1 }}
        >
          <Typography variant="h5" fontWeight={600}>
            Bales
          </Typography>
          <Chip
            label={`${totalCount}`}
            size="small"
            color="primary"
            sx={{ fontWeight: 700 }}
          />
        </Stack>
      </Grid>
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
