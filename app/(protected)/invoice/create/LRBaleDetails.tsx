"use client";

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Stack,
  Typography,
  TextField,
  IconButton,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { LR } from "../_types/LR";
import { Bale } from "../_types/Bale";
import BaleRow from "./BaleRow";
import { Category } from "@/app/_types/Category";
import { SubCategory } from "@/app/_types/SubCategory";
import { LRErrors } from "./page";

interface Props {
  lorryReceipts: LR[];
  onChange: (next: LR[]) => void;
  categories: Category[];
  subCategories: SubCategory[];
  errors: Record<string, LRErrors>;
  onClearBaleError?: (lrId: string, baleId: string, field: keyof Bale) => void;
}

export default function LRAccordionSection({
  lorryReceipts,
  onChange,
  categories,
  subCategories,
  errors,
  onClearBaleError,
}: Props) {
  /* ---------------- LR actions ---------------- */

  const removeLR = (lrId: string) => {
    const updated = lorryReceipts.filter((lr) => lr.id !== lrId);
    onChange(updated);
  };

  /* ---------------- Bale actions ---------------- */

  const addBale = (lrId: string) => {
    const updated = lorryReceipts.map((lr) =>
      lr.id === lrId
        ? {
            ...lr,
            bales: [...lr.bales, { id: crypto.randomUUID(), baleNumber: "" }],
          }
        : lr
    );

    onChange(updated);
  };

  const updateBale = (lrId: string, baleId: string, patch: Partial<Bale>) => {
    const updated = lorryReceipts.map((lr) =>
      lr.id === lrId
        ? {
            ...lr,
            bales: lr.bales.map((b) =>
              b.id === baleId ? { ...b, ...patch } : b
            ),
          }
        : lr
    );

    onChange(updated);
  };

  const removeBale = (lrId: string, baleId: string) => {
    const updated = lorryReceipts.map((lr) =>
      lr.id === lrId
        ? {
            ...lr,
            bales: lr.bales.filter((b) => b.id !== baleId),
          }
        : lr
    );

    onChange(updated);
  };

  /* ---------------- Empty state ---------------- */

  if (lorryReceipts.length === 0) {
    return (
      <Typography color="text.secondary" sx={{ mt: 1 }}>
        Add Lorry Receipts using the above button
      </Typography>
    );
  }

  /* ---------------- UI ---------------- */

  return (
    <Box mt={2}>
      {lorryReceipts.map((lr) => (
        <Accordion defaultExpanded key={lr.id} sx={{ mb: 2 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} component="div">
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              width="100%"
            >
              <Stack>
                <Typography fontWeight={600}>LR: {lr.lrNumber}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {lr.bales.length} bales
                </Typography>
              </Stack>

              <IconButton
                color="error"
                size="small"
                onClick={(e) => {
                  e.stopPropagation(); // 🔥 prevents accordion toggle
                  removeLR(lr.id);
                }}
              >
                <DeleteIcon />
              </IconButton>
            </Stack>
          </AccordionSummary>

          <AccordionDetails>
            <Stack spacing={2}>
              {lr.bales.map((bale) => (
                <Box key={bale.id} width="100%">
                  <BaleRow
                    bale={bale}
                    onChange={(patch) => {
                      updateBale(lr.id, bale.id, patch);
                      if (Object.keys(patch).length && onClearBaleError) {
                        const field = Object.keys(patch)[0] as keyof Bale;
                        onClearBaleError(lr.id, bale.id, field);
                      }
                    }}
                    onDelete={() => removeBale(lr.id, bale.id)}
                    categories={categories}
                    subCategories={subCategories}
                    errors={errors[lr.id]?.bales?.[bale.id]}
                  />
                </Box>
              ))}

              <Button
                startIcon={<AddIcon />}
                onClick={() => addBale(lr.id)}
                size="small"
              >
                Add Bale
              </Button>
            </Stack>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
}
