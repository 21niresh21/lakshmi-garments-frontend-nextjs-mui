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
import React, { useEffect, useRef, useState } from "react";
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
  const hasMounted = useRef(false);
  const submitButtonRef = useRef<HTMLButtonElement>(null);

  // ✅ Generate SELF LR only on client AFTER mount
  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }

    if (value.transportType === "self") {
      setLrNumber(`SELF-${Date.now()}`);
    } else {
      setLrNumber("");
    }
  }, [value.transportType]);

  const handleTransportTypeChange = (
    _: React.MouseEvent<HTMLElement>,
    newTransportType: "transport" | "self" | null
  ) => {
    if (!newTransportType) return;

    onChange({ transportType: newTransportType });

    if (newTransportType === "transport") {
      setLrNumber("");
    }
  };

  const addLr = () => {
    if (!lrNumber.trim()) return;

    const newLR: LR = {
      // ✅ UUID generated ONLY on client interaction
      id: crypto.randomUUID(),
      lrNumber,
      bales: [],
    };

    onChange({
      lorryReceipts: [...value.lorryReceipts, newLR],
    });

    if (value.transportType === "self") {
      setLrNumber(`SELF-${Date.now()}`);
    } else {
      setLrNumber("");
    }
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 500 }}>
        Lorry Receipt & Bale Details
      </Typography>

      <Grid container>
        <Grid size={12}>
          <Stack direction="row" alignItems="center" columnGap={3}>
            <ToggleButtonGroup
              color="primary"
              value={value.transportType}
              onChange={handleTransportTypeChange}
              exclusive
            >
              <ToggleButton value="transport">Transport</ToggleButton>
              <ToggleButton value="self">Self</ToggleButton>
            </ToggleButtonGroup>

            {/* ✅ FIXED: Explicit ID */}
            <TextField
              id="lr-number"
              label="LR Number"
              value={lrNumber}
              disabled={value.transportType === "self"}
              placeholder={
                value.transportType === "self"
                  ? "Auto-generated"
                  : "Enter LR number"
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  submitButtonRef.current?.click();
                }
              }}
              onChange={(e) => setLrNumber(e.target.value)}
            />

            <Button
              sx={{ height: 35 }}
              onClick={addLr}
              disabled={!lrNumber.trim()}
              size="medium"
              variant="contained"
              ref={submitButtonRef}
            >
              Add LR
            </Button>
          </Stack>
        </Grid>

        <Grid size={12} my={4}>
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
