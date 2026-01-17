"use client";

import {
  Box,
  Button,
  Grid,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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
  const [lrNumber, setLrNumber] = useState("");
  const submitButtonRef = useRef<HTMLButtonElement>(null);
  const hasMounted = useRef(false);

  /* ---------------- Derived State ---------------- */

  const isSelfTransport = value.transportType === "self";

  /* ---------------- Effects ---------------- */

  // Generate SELF LR only after mount (avoid hydration mismatch)
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
    <Box>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 500 }}>
        Lorry Receipt & Bale Details
      </Typography>

      <Grid container spacing={2}>
        <Grid size={12}>
          <Stack
            direction={{ xs: "column", md: "row" }}
            alignItems={{ md: "center" }}
            gap={2}
          >
            <ToggleButtonGroup
              color="primary"
              value={value.transportType}
              onChange={handleTransportTypeChange}
              exclusive
              aria-label="Transport Type"
            >
              <ToggleButton value="transport">Transport</ToggleButton>
              <ToggleButton value="self">Self</ToggleButton>
            </ToggleButtonGroup>

            <TextField
              id="lr-number"
              label="LR Number"
              value={lrNumber}
              disabled={isSelfTransport}
              placeholder={
                isSelfTransport ? "Auto-generated" : "Enter LR number"
              }
              onChange={(e) => setLrNumber(e.target.value)}
              onBlur={(e) => setLrNumber(e.target.value.trim())}
              onKeyDown={handleKeyDown}
              inputProps={{ "aria-label": "LR Number" }}
            />

            <Button
              sx={{ height: 40, minWidth: 100 }}
              onClick={handleAddLr}
              disabled={isAddDisabled}
              variant="contained"
              ref={submitButtonRef}
            >
              Add LR
            </Button>
          </Stack>
        </Grid>

        <Grid size={12} mt={3}>
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
    </Box>
  );
}
