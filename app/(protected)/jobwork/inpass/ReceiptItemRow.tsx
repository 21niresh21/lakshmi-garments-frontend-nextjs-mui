import { Grid, IconButton, TextField } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { GenericAutocomplete } from "@/app/components/shared/GenericAutocomplete";
import { Item } from "@/app/_types/Item";

interface Props {
  index: number;
  row: any;
  rows: any[];
  setRows: Function;
  items: Item[];
  totalQty: number;
  maxQuantity: number;
}

const ReceiptItemRow = ({
  index,
  row,
  rows,
  setRows,
  items,
  totalQty,
  maxQuantity,
}: Props) => {
  const update = (field: string, value: any) => {
    const copy = [...rows];
    copy[index] = { ...copy[index], [field]: value };
    setRows(copy);
  };

  return (
    <Grid container spacing={2} alignItems="center" mb={1}>
      <Grid size={5}>
        <GenericAutocomplete<Item>
          label="Item"
          options={items}
          value={items.find((i) => i.id === row.itemId) || null}
          getOptionLabel={(i) => i.name}
          onChange={(item) => update("itemId", item?.id ?? null)}
        />
      </Grid>

      <Grid size={4}>
        <TextField
          type="number"
          label="Quantity"
          fullWidth
          value={row.quantity ?? ""}
          onChange={(e) => {
            const val = Number(e.target.value);
            if (totalQty - (row.quantity || 0) + val <= maxQuantity) {
              update("quantity", val);
            }
          }}
        />
      </Grid>

      <Grid size={3}>
        <IconButton
          color="error"
          disabled={rows.length === 1}
          onClick={() => setRows(rows.filter((_, i) => i !== index))}
        >
          <DeleteOutlineIcon />
        </IconButton>

        {index === rows.length - 1 && (
          <IconButton
            color="primary"
            onClick={() => setRows([...rows, { itemId: null, quantity: null }])}
            disabled={totalQty >= maxQuantity}
          >
            <AddCircleOutlineIcon />
          </IconButton>
        )}
      </Grid>
    </Grid>
  );
};

export default ReceiptItemRow;
