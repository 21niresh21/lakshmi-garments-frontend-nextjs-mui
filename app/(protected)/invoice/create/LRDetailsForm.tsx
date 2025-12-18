"use client";

import {
  Button,
  Grid,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import React, { useEffect, useState } from "react";
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
}

export default function LRDetailsForm({
  value,
  onChange,
  categories,
  subCategories,
  lrErrors,
  onClearBaleError,
}: Props) {
  const [lrNumber, setLrNumber] = useState("");

  const handleTransportTypeChange = (
    event: React.MouseEvent<HTMLElement>,
    newTransportType: "transport" | "self"
  ) => {
    if (newTransportType === "transport") {
      onChange({ transportType: newTransportType });
      setLrNumber("");
    } else if (newTransportType === "self") {
      setLrNumber(`SELF-${Date.now()}`);
      onChange({ transportType: newTransportType });
    }
  };

  const addLr = () => {
    if (!lrNumber.trim()) return;

    const newLR: LR = {
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

  useEffect(() => {
    if (value.transportType === "self") {
      setLrNumber(`SELF-${Date.now()}`);
    } else {
      setLrNumber("")
    }
  }, [value]);

  return (
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
          <TextField
            label="LR Number"
            value={lrNumber}
            disabled={value.transportType === "self"}
            placeholder={
              value.transportType === "self"
                ? "Auto-generated"
                : "Enter LR number"
            }
            onChange={(e) => setLrNumber(e.target.value)}
          />
          <Button
            sx={{ height: 35 }}
            onClick={addLr}
            disabled={!lrNumber}
            size="medium"
            variant="contained"
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
        />
      </Grid>
    </Grid>
  );
}
