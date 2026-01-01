import { JobworkReceipt } from "@/app/_types/JobworkReceipt";
import { Button, Stack } from "@mui/material";
interface Props {
  receipt: JobworkReceipt;
}

const ReceiptSubmitBar = ({ receipt }: Props) => {
//   const handleSubmit = async () => {
//     await createJobworkReceipt({
//       jobworkNumber: receipt.jobworkNumber,
//       receivedById: receipt.receivedById,
//       jobworkReceiptItems: receipt.jobworkReceiptItems.map(i => ({
//         itemName: i.itemName,
//         returnedQuantity: i.returnedQuantity,
//         purchaseQuantity: i.purchaseQuantity,
//         purchaseCost: i.purchaseCost,
//         wage: i.wage,
//         damages: i.damages,
//       })),
//     });
//   };

  return (
    <Stack direction="row" justifyContent="flex-end">
      <Button
        variant="contained"
        disabled={!receipt.jobworkReceiptItems.length}
        // onClick={handleSubmit}
      >
        Submit Receipt
      </Button>
    </Stack>
  );
};

export default ReceiptSubmitBar;
