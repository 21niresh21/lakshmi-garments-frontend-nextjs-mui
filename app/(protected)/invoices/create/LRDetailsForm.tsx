"use client";

import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import AddIcon from "@mui/icons-material/Add";
import { LRDetails } from "../_types/LRDetails";
import { LR } from "../_types/LR";
import LRAccordionSection from "./LRBaleDetails";
import { Category } from "@/app/_types/Category";
import { SubCategory } from "@/app/_types/SubCategory";
import { Bale } from "../_types/Bale";
import { LRErrors } from "./invoice.types";

interface Props {
  value: LRDetails;
  onChange: (patch: Partial<LRDetails>) => void;
  categories: Category[];
  subCategories: SubCategory[];
  lrErrors: Record<string, LRErrors>;
  onClearBaleError?: (lrId: string, baleId: string, field: keyof Bale) => void;
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  setSubCategories: React.Dispatch<React.SetStateAction<SubCategory[]>>;
}

export default function LRDetailsForm({
  value,
  onChange,
  categories,
  subCategories,
  lrErrors,
  onClearBaleError,
  setCategories,
  setSubCategories,
}: Props) {
  const theme = useTheme();
  const [lrNumber, setLrNumber] = useState("");
  const submitButtonRef = useRef<HTMLButtonElement>(null);
  const hasMounted = useRef(false);

  /* ---------------- Derived State ---------------- */

  const isSelfTransport = value.transportType === "self";

  /* ---------------- Effects ---------------- */

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }

    setLrNumber(isSelfTransport ? `SELF-${Date.now()}` : "");
  }, [isSelfTransport]);

  /* ---------------- Handlers ---------------- */

  const handleTransportTypeChange = useCallback(
    (
      _: React.MouseEvent<HTMLElement>,
      newType: "transport" | "self" | null
    ) => {
      if (!newType || newType === value.transportType) return;

      onChange({ transportType: newType });
    },
    [onChange, value.transportType]
  );

  const handleAddLr = useCallback(() => {
    const trimmedLr = lrNumber.trim();
    if (!trimmedLr) return;

    const newLR: LR = {
      id: crypto.randomUUID(),
      lrNumber: trimmedLr,
      bales: [],
    };

    onChange({
      lorryReceipts: [...value.lorryReceipts, newLR],
    });

    setLrNumber(isSelfTransport ? `SELF-${Date.now()}` : "");
  }, [lrNumber, isSelfTransport, onChange, value.lorryReceipts]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        submitButtonRef.current?.click();
      }
    },
    []
  );

  /* ---------------- Memoized UI Flags ---------------- */

  const isAddDisabled = useMemo(() => !lrNumber.trim(), [lrNumber]);

  /* ---------------- Render ---------------- */

  return (
    <Card
      elevation={0}
      sx={{
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 3,
        overflow: "visible", // To allow poppers or shadows if needed
      }}
    >
      <Box
        sx={{
          py: 2,
          px: 3,
          bgcolor: alpha(theme.palette.primary.main, 0.04),
          borderBottom: `1px solid ${theme.palette.divider}`,
          display: "flex",
          alignItems: "center",
          gap: 1.5,
        }}
      >
        <LocalShippingIcon color="primary" />
        <Typography variant="h6" fontWeight={700}>
          Lorry Receipt & Bale Details
        </Typography>
      </Box>

      <CardContent sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid size={12}>
            <Box 
              sx={{ 
                // p: 2.5, 
                // borderRadius: 2, 
                // bgcolor: alpha(theme.palette.action.hover, 0.3),
                border: `1px dashed ${theme.palette.divider}`
              }}
            >
              <Stack
                direction={{ xs: "column", md: "row" }}
                alignItems={{ md: "center" }}
                gap={2.5}
              >
                <Box>
                  <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ mb: 1, display: "block", textTransform: "uppercase" }}>
                    Transport Type
                  </Typography>
                  <ToggleButtonGroup
                    size="small"
                    color="primary"
                    value={value.transportType}
                    onChange={handleTransportTypeChange}
                    exclusive
                    aria-label="Transport Type"
                    sx={{ bgcolor: "background.paper" }}
                  >
                    <ToggleButton value="transport" sx={{ px: 3 }}>Transport</ToggleButton>
                    <ToggleButton value="self" sx={{ px: 3 }}>Self</ToggleButton>
                  </ToggleButtonGroup>
                </Box>

                <Box sx={{ flex: 1 }}>
                  <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ mb: 1, display: "block", textTransform: "uppercase" }}>
                    LR Number
                  </Typography>
                  <TextField
                    id="lr-number"
                    fullWidth
                    size="small"
                    value={lrNumber}
                    disabled={isSelfTransport}
                    placeholder={
                      isSelfTransport ? "Auto-generated" : "Enter LR number"
                    }
                    onChange={(e) => setLrNumber(e.target.value)}
                    onBlur={(e) => setLrNumber(e.target.value.trim())}
                    onKeyDown={handleKeyDown}
                  />
                </Box>

                <Box sx={{ alignSelf: { xs: "stretch", md: "flex-end"} }}>
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleAddLr}
                    disabled={isAddDisabled}
                    ref={submitButtonRef}
                    sx={{ height: 40, px: 4, borderRadius: 2 }}
                  >
                    Add LR
                  </Button>
                </Box>
              </Stack>
            </Box>
          </Grid>

          <Grid size={12}>
            <LRAccordionSection
              lorryReceipts={value.lorryReceipts}
              onChange={(nextLrs) =>
                onChange({
                  lorryReceipts: nextLrs,
                })
              }
              categories={categories}
              subCategories={subCategories}
              errors={lrErrors}
              onClearBaleError={onClearBaleError}
              setCategories={setCategories}
              setSubCategories={setSubCategories}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
