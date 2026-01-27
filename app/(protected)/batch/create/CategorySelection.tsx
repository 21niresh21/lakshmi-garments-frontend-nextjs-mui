import { Box, Checkbox, Switch, TextField, Typography } from "@mui/material";
import { SelectionState } from "./_types/models";

interface Props {
  selection: SelectionState | null;
  onToggleItem: (name: string) => void;
  onQtyChange: (name: string, qty: number | "") => void;
  onUrgentChange: (v: boolean) => void;
  onRemarksChange: (v: string) => void;
}

export default function CategorySelection({
  selection,
  onToggleItem,
  onQtyChange,
  onUrgentChange,
  onRemarksChange,
}: Props) {
  if (!selection) return null;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Typography variant="h6">{selection.categoryName}</Typography>
      <Typography variant="body2" color="text.secondary" mb={2}>
        Select items and adjust quantities
      </Typography>

      <Box
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          maxHeight: { xs: "300px", md: "500px" },
          pr: 1,
        }}
      >
        {selection.items.map((item) => (
          <Box
            key={item.name}
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: { xs: "flex-start", sm: "center" },
              justifyContent: "space-between",
              gap: 1,
              py: 1.5,
              borderBottom: "1px dashed",
              borderColor: "divider",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Checkbox
                checked={item.selected}
                onChange={() => onToggleItem(item.name)}
              />
              <Typography variant="body1">{item.name}</Typography>
            </Box>
            <TextField
              value={item.qty}
              label="Quantity"
              type="number"
              size="small"
              disabled={!item.selected}
              onChange={(e) =>
                onQtyChange(
                  item.name,
                  e.target.value === "" ? "" : Number(e.target.value),
                )
              }
              sx={{ width: { xs: "100%", sm: "140px" } }}
            />
          </Box>
        ))}
      </Box>

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

      <TextField
        multiline
        fullWidth
        value={selection.remarks}
        onChange={(e) => onRemarksChange(e.target.value)}
        size="small"
        label="Remarks"
        rows={3}
        sx={{ mt: 2 }}
      />
    </Box>
  );
}
