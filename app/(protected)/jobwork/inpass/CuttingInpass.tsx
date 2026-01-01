// import React, { useEffect, useMemo, useState } from "react";
// import {
//   Grid,
//   Typography,
//   Box,
//   Chip,
//   IconButton,
//   TextField,
//   Divider,
// } from "@mui/material";
// import ContentCutIcon from "@mui/icons-material/ContentCut";
// import BusinessIcon from "@mui/icons-material/Business";
// import PersonIcon from "@mui/icons-material/Person";
// import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
// import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

// import { formatToShortDateTime } from "@/app/utils/date";
// import { GenericAutocomplete } from "@/app/components/shared/GenericAutocomplete";
// import { Item } from "@/app/_types/Item";
// import { fetchItems } from "@/app/api/itemApi";
// import {
//   DamageItems,
//   JobworkReceipt,
//   JobworkReceiptItems,
// } from "@/app/_types/JobworkReceipt";
// import DamageForm from "./DamageForm";

// /* ---------- INITIAL STATE ---------- */

// const INITIAL_JOBWORK_RECEIPT = {
//   id: 0,
//   jobworkNumber: "",
//   receivedById: 0,
//   receiptItems: [],
//   damages : []
// };

// /* ---------- TYPES ---------- */

// interface JobworkItem {
//   id: number;
//   itemName: string | null;
//   jobworkNumber: string;
//   quantity: number;
//   startedAt: string | null;
//   endedAt: string | null;
//   status: string;
// }

// interface JobworkData {
//   jobworkNumber: string;
//   jobworkOrigin: string;
//   remarks: string;
//   jobworkType: string;
//   batchSerialCode: string;
//   assignedTo: string;
//   assignedBy: string;
//   jobworkItems: JobworkItem[];
//   startedAt: string;
// }

// interface CuttingInpassProps {
//   jobWorkData: JobworkData;
// }

// interface SelectedItem {
//   itemId: number | "";
//   quantity: number | "";
// }

// /* ---------- COMPONENT ---------- */

// const CuttingInpass: React.FC<CuttingInpassProps> = ({ jobWorkData }) => {
//   const jobworkItem = jobWorkData.jobworkItems?.[0];
//   const maxQuantity = jobworkItem?.quantity ?? 0;

//   const [items, setItems] = useState<Item[]>([]);
//   const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([
//     { itemId: "", quantity: "" },
//   ]);
//   const [jobworkReceipt, setJobworkReceipt] = useState<JobworkReceipt>(
//     INITIAL_JOBWORK_RECEIPT
//   );

//   /* ---------- FETCH ITEMS ---------- */

//   useEffect(() => {
//     fetchItems()
//       .then(setItems)
//       .catch(() => {});
//   }, []);

//   /* ---------- HELPERS ---------- */

//   const totalEnteredQty = useMemo(
//     () =>
//       selectedItems.reduce((sum, row) => sum + (Number(row.quantity) || 0), 0),
//     [selectedItems]
//   );

//   const handleChange = (
//     index: number,
//     field: keyof SelectedItem,
//     value: number | ""
//   ) => {
//     const updated = [...selectedItems];
//     updated[index] = { ...updated[index], [field]: value };
//     setSelectedItems(updated);
//     console.log(selectedItems);
//   };

//   const addRow = () =>
//     setSelectedItems([...selectedItems, { itemId: "", quantity: "" }]);

//   const deleteRow = (index: number) =>
//     setSelectedItems(selectedItems.filter((_, i) => i !== index));

//   /* ---------- PREVENT DUPLICATES ---------- */

//   const getAvailableItemsForRow = (rowIndex: number): Item[] => {
//     const selectedIds = selectedItems
//       .filter((_, i) => i !== rowIndex)
//       .map((row) => row.itemId)
//       .filter(Boolean);

//     return items.filter((item) => !selectedIds.includes(item.id));
//   };

//   /* ---------- SYNC RECEIPT ITEMS ---------- */

//   useEffect(() => {
//     const receiptItems: JobworkReceiptItems[] = selectedItems
//       .filter((row) => row.itemId && row.quantity)
//       .map((row) => {
//         const item = items.find((i) => i.id === row.itemId);
//         return {
//           itemName: item?.name ?? "",
//           returnedQuantity: Number(row.quantity),
//           purchaseQuantity: 0,
//           purchaseCost: 0,
//           wage: 0,
//         };
//       });

//     setJobworkReceipt((prev) => ({
//       ...prev,
//       jobworkNumber: jobWorkData.jobworkNumber,
//       receiptItems,
//     }));
//   }, [selectedItems, items, jobWorkData.jobworkNumber]);

//   /* ---------- DISPLAY DATA ---------- */

//   const column1 = [
//     { label: "Jobwork Number", value: jobWorkData.jobworkNumber },
//     {
//       label: "Jobwork Type",
//       value: (
//         <Chip
//           icon={<ContentCutIcon />}
//           label={jobWorkData.jobworkType}
//           size="small"
//         />
//       ),
//     },
//     { label: "Quantity", value: maxQuantity },
//     {
//       label: "Started At",
//       value: formatToShortDateTime(jobWorkData.startedAt),
//     },
//   ];

//   const column2 = [
//     {
//       label: "Origin",
//       value: (
//         <Chip
//           icon={<BusinessIcon />}
//           label={jobWorkData.jobworkOrigin}
//           size="small"
//         />
//       ),
//     },
//     { label: "Batch", value: jobWorkData.batchSerialCode },
//     {
//       label: "Assigned To",
//       value: (
//         <Chip
//           icon={<PersonIcon />}
//           label={jobWorkData.assignedTo}
//           size="small"
//         />
//       ),
//     },
//   ];

//   /* ---------- RENDER ---------- */

//   return (
//     <Box sx={{ maxWidth: 900 }}>
//       <Grid container spacing={4}>
//         {[column1, column2].map((col, idx) => (
//           <Grid key={idx}>
//             {col.map((row, i) => (
//               <Box
//                 key={i}
//                 sx={{ display: "flex", alignItems: "center", mb: 1.5 }}
//               >
//                 <Typography sx={{ minWidth: 140, fontWeight: 600 }}>
//                   {row.label}
//                 </Typography>
//                 <Box sx={{ ml: 0.5 }}>: {row.value}</Box>
//               </Box>
//             ))}
//           </Grid>
//         ))}
//       </Grid>

//       <Divider sx={{ my: 2 }} />

//       <Typography fontWeight={600} mb={1}>
//         Items Brought
//       </Typography>

//       {selectedItems.map((row, index) => (
//         <Grid container spacing={2} alignItems="center" key={index} mb={1}>
//           <Grid size={4}>
//             <GenericAutocomplete<Item>
//               label="Item"
//               options={getAvailableItemsForRow(index)}
//               value={items.find((i) => i.id === row.itemId) || null}
//               getOptionLabel={(i) => i.name}
//               isOptionEqualToValue={(a, b) => a.id === b.id}
//               onChange={(item) => handleChange(index, "itemId", item?.id ?? "")}
//               // allowCreate
//             />
//           </Grid>

//           <Grid size={4}>
//             <TextField
//               type="number"
//               fullWidth
//               size="small"
//               label="Quantity"
//               value={row.quantity}
//               onChange={(e) => {
//                 const raw = e.target.value;
//                 const val = raw === "" ? "" : Number(raw);

//                 if (!val) {
//                   handleChange(index, "quantity", val);
//                   return;
//                 }
//                 if (
//                   totalEnteredQty - (Number(row.quantity) || 0) + val <=
//                   maxQuantity
//                 ) {
//                   handleChange(index, "quantity", val);
//                 }
//               }}
//             />
//           </Grid>

//           <Grid size={2}>
//             <IconButton
//               color="error"
//               onClick={() => deleteRow(index)}
//               disabled={selectedItems.length === 1}
//             >
//               <DeleteOutlineIcon />
//             </IconButton>

//             {index === selectedItems.length - 1 && (
//               <IconButton
//                 color="primary"
//                 onClick={addRow}
//                 disabled={
//                   totalEnteredQty >= maxQuantity ||
//                   selectedItems.filter((s) => s.itemId).length >= items.length
//                 }
//               >
//                 <AddCircleOutlineIcon />
//               </IconButton>
//             )}
//           </Grid>
//         </Grid>
//       ))}

//       <Typography mt={1} color="text.secondary">
//         Total Entered: {totalEnteredQty} / {maxQuantity}
//       </Typography>
//       <Divider sx={{ my: 2 }} />
//       <DamageForm
//         items={items}
//         jobworkReceipt={jobworkReceipt}
//         setJobworkReceipt={setJobworkReceipt}
//       />
//     </Box>
//   );
// };

// export default CuttingInpass;
