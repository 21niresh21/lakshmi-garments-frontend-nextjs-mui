import {
  Box,
  Checkbox,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { SelectionState } from "./_types/models";

interface Props {
  selection: SelectionState | null;
  onToggleItem: (name: string) => void;
  onQtyChange: (name: string, qty: number | "") => void;
  onUrgentChange: (v: boolean) => void;
  onRemarksChange: (v: string) => void;
  //   onClear: () => void;
}

export default function CategorySelection({
  selection,
  onToggleItem,
  onQtyChange,
  onUrgentChange,
  onRemarksChange,
}: //   onClear,
Props) {
  if (!selection) {
    return "";
  }

  return (
    <>
      <Typography variant="h6" mb={1}>
        {selection.categoryName}
      </Typography>

      <Typography variant="body2" color="text.secondary" mb={2}>
        Choose items to include in batch
      </Typography>

      {/* ITEM LIST */}
      <Box
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          pr: 1,
        }}
      >
        {selection.items.map((subCategory) => (
          <Box
            key={subCategory.name}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              py: 1,
              borderBottom: "1px dashed",
              borderColor: "divider",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Checkbox
                checked={subCategory.selected}
                onChange={() => onToggleItem(subCategory.name)}
              />
              <Typography variant="body1">{subCategory.name}</Typography>
            </Box>
            <TextField
              value={subCategory.qty}
              label="Quantity"
              type="number"
              size="small"
              disabled={!subCategory.selected}
              slotProps={{
                htmlInput: {
                  min: 0,
                  max: subCategory.maxQty,
                },
              }}
              onChange={(e) => {
                const v = e.target.value;

                if (v === "") {
                  onQtyChange(subCategory.name, "");
                  return;
                }

                onQtyChange(subCategory.name, Number(v));
              }}
              sx={{minWidth : 200, maxWidth : 300}}
            />
          </Box>
        ))}
      </Box>

      {/* URGENT */}
      <Box
        sx={{
          mt: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          
        }}
      >
        <Typography fontWeight={500}>Urgent Order</Typography>
        <Switch
          checked={selection.urgent}
          onChange={(e) => onUrgentChange(e.target.checked)}
        />
      </Box>

      {/* REMARKS */}
      <Box mt={2}>
        <TextField
          multiline
          fullWidth
          value={selection.remarks}
          onChange={(e) => onRemarksChange(e.target.value)}
          size="small"
          label="Remarks"
          rows={3}
        />
      </Box>

      {/* CLEAR */}
      <Box mt={2} textAlign="right">
        {/* Button later */}
      </Box>
    </>
  );
}
