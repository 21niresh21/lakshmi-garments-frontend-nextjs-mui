import { useEffect, useMemo, useState } from "react";
import { Grid, Typography } from "@mui/material";
import { fetchItems } from "@/app/api/itemApi";
import { Item } from "@/app/_types/Item";
import { JobworkReceipt } from "@/app/_types/JobworkReceipt";
import ReceiptItemRow from "./ReceiptItemRow";


interface Props {
  maxQuantity: number;
  receipt: JobworkReceipt;
  setReceipt: React.Dispatch<React.SetStateAction<JobworkReceipt>>;
}

interface Row {
  itemId: number | null;
  quantity: number | null;
}

const ReceiptItemsForm = ({ maxQuantity, receipt, setReceipt }: Props) => {
  const [items, setItems] = useState<Item[]>([]);
  const [rows, setRows] = useState<Row[]>([{ itemId: null, quantity: null }]);

  useEffect(() => {
    fetchItems().then(setItems);
  }, []);

  const totalQty = useMemo(
    () => rows.reduce((s, r) => s + (r.quantity || 0), 0),
    [rows]
  );

  useEffect(() => {
    const mapped = rows
      .filter(r => r.itemId && r.quantity)
      .map(r => {
        const item = items.find(i => i.id === r.itemId)!;
        return {
          itemId: item.id,
          itemName: item.name,
          returnedQuantity: r.quantity!,
          purchaseQuantity: 0,
          purchaseCost: 0,
          wage: 0,
          damages: [],
        };
      });

    setReceipt(prev => ({ ...prev, jobworkReceiptItems: mapped }));
  }, [rows, items, setReceipt]);

  return (
    <>
      <Typography fontWeight={600} mb={1}>
        Items Brought
      </Typography>

      {rows.map((row, i) => (
        <ReceiptItemRow
          key={i}
          index={i}
          row={row}
          rows={rows}
          setRows={setRows}
          items={items}
          totalQty={totalQty}
          maxQuantity={maxQuantity}
        />
      ))}

      <Typography mt={1} color="text.secondary">
        Total Entered: {totalQty} / {maxQuantity}
      </Typography>
    </>
  );
};

export default ReceiptItemsForm;
