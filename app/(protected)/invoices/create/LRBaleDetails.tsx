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
  Divider,
  alpha,
  useTheme,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { LR } from "../_types/LR";
import { Bale } from "../_types/Bale";
import BaleRow from "./BaleRow";
import { Category } from "@/app/_types/Category";
import { SubCategory } from "@/app/_types/SubCategory";
import { LRErrors } from "./invoice.types";

interface Props {
  lorryReceipts: LR[];
  onChange: (next: LR[]) => void;
  categories: Category[];
  subCategories: SubCategory[];
  errors: Record<string, LRErrors>;
  onClearBaleError?: (lrId: string, baleId: string, field: keyof Bale) => void;
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  setSubCategories: React.Dispatch<React.SetStateAction<SubCategory[]>>;
}

export default function LRAccordionSection({
  lorryReceipts,
  onChange,
  categories,
  subCategories,
  errors,
  onClearBaleError,
  setCategories,
  setSubCategories,
}: Props) {
  const theme = useTheme();
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
    <Box mt={1}>
      {lorryReceipts.map((lr) => (
        <Accordion
          disableGutters
          elevation={0}
          defaultExpanded
          key={lr.id}
          sx={{
            mb: 2,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: "12px !important",
            overflow: "hidden",
            "&:before": { display: "none" },
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            component="div"
            sx={{
              bgcolor: alpha(theme.palette.action.hover, 0.1),
              minHeight: 64,
            }}
          >
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              width="100%"
              pr={1}
            >
              <Stack>
                <Typography variant="subtitle1" fontWeight={700}>
                  LR: {lr.lrNumber}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                   {lr.bales.length} {lr.bales.length === 1 ? "bale" : "bales"} recorded
                </Typography>
              </Stack>

              <IconButton
                color="error"
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  removeLR(lr.id);
                }}
                sx={{ 
                  bgcolor: alpha(theme.palette.error.main, 0.05),
                  "&:hover": { bgcolor: alpha(theme.palette.error.main, 0.1) }
                }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Stack>
          </AccordionSummary>

          <AccordionDetails sx={{ p: 3 }}>
            <Stack spacing={3}>
              {lr.bales.map((bale) => (
                <Box key={bale.id} width="100%">
                  <BaleRow
                    setCategories={setCategories}
                    setSubCategories={setSubCategories}
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
                  {/* Subtle divider between rows if not the last one */}
                  {lr.bales[lr.bales.length - 1].id !== bale.id && (
                    <Divider sx={{ mt: 3, opacity: 0.6 }} />
                  )}
                </Box>
              ))}

              <Box sx={{ pt: 1 }}>
                <Button
                  startIcon={<AddIcon />}
                  onClick={() => addBale(lr.id)}
                  size="medium"
                  variant="outlined"
                  sx={{ 
                    borderRadius: 2,
                    borderStyle: "dashed",
                    borderWidth: 2,
                    px: 4,
                    "&:hover": { borderWidth: 2, borderStyle: "dashed" }
                  }}
                >
                  Add Bale
                </Button>
              </Box>
            </Stack>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
}
