// "use client";

// import {
//   Box,
//   Button,
//   Chip,
//   Grid,
//   MenuItem,
//   Paper,
//   Select,
//   TextField,
//   Typography,
// } from "@mui/material";
// import { DatePicker } from "@mui/x-date-pickers";
// import React from "react";
// import { BatchStatus } from "@/app/_types/BatchStatus";
// import { BatchFilters } from "./_types/BatchFilter";

// interface Props {
//   filters: BatchFilters;
//   onChange: (filters: BatchFilters) => void;
//   onReset: () => void;

//   categories: string[];
//   createdByOptions: string[];
// }

// export default function BatchFiltersPanel({
//   filters,
//   onChange,
//   onReset,
//   categories,
//   createdByOptions,
// }: Props) {
//   return (
//     <Box
//         sx={{
//           display: "grid",
//           gridTemplateColumns: "50% 50%",
//           gridTemplateRows: "repeat(3, auto)",
//           gap: "10px",
//           pl: 3,
//           pr: 3,
//           pt: 1,
//         }}
//       >
//         <Box sx={{ padding: 1, textAlign: "left" }}>
//           <Typography variant="h6" fontWeight={600}>
//             FILTERS
//           </Typography>
//         </Box>
//         <Box sx={{ padding: 1, textAlign: "right" }}>
//           <Button
//             variant="contained"
//             size="small"
//             sx={{ fontWeight: 600 }}
//             startIcon={<FilterListOffIcon />}
//             onClick={clearFilter}
//           >
//             Clear Filters
//           </Button>
//         </Box>

//         <Box sx={{ padding: 1 }}>
//           <FormControl fullWidth>
//             <Autocomplete
//               size="small"
//               multiple
//               value={filter.categories || []}
//               options={
//                 categories && categories.length > 0
//                   ? categories.map((c) => c.name)
//                   : []
//               }
//               onChange={handleCategoryChange}
//               renderInput={(params) => (
//                 <TextField {...params} label="Filter by Categories" />
//               )}
//               disableCloseOnSelect
//             />
//           </FormControl>
//         </Box>

//         {/* Status Filter */}
//         <Box sx={{ padding: 1 }}>
//           <FormControl fullWidth>
//             <Autocomplete
//               size="small"
//               multiple
//               value={filter.batchStatusNames || []}
//               options={statuses}
//               onChange={handleStatusChange}
//               renderInput={(params) => (
//                 <TextField {...params} label="Filter by Statuses" />
//               )}
//               disableCloseOnSelect
//             />
//           </FormControl>
//         </Box>

//         {/* Batch Dates */}
//         <Box sx={{ padding: 1 }}>
//           <LocalizationProvider dateAdapter={AdapterDayjs}>
//             <DatePicker
//               label="Batch Start Date"
//               value={startDate}
//               onChange={(v) => handleBatchDateChange("startDate", v)}
//               maxDate={today}
//               slotProps={{ textField: { fullWidth: true, size: "small" } }}
//             />
//           </LocalizationProvider>
//         </Box>
//         <Box sx={{ padding: 1 }}>
//           <LocalizationProvider dateAdapter={AdapterDayjs}>
//             <DatePicker
//               label="Batch End Date"
//               value={endDate}
//               onChange={(v) => handleBatchDateChange("endDate", v)}
//               maxDate={today}
//               slotProps={{ textField: { fullWidth: true, size: "small" } }}
//             />
//           </LocalizationProvider>
//         </Box>
//         <Box sx={{ padding: 1 }}>
//           <Typography sx={{ pl: 1.5 }}>Batch Status</Typography>
//           <FormControl sx={{ mt : 1, ml: 1, width: 300, flexDirection : "row" }}>
//             <FormControlLabel
//               control={
//                 <Checkbox
//                   value="Urgent"
//                   checked={filter.isUrgent?.includes(true) || false}
//                   onChange={handleUrgentStatusChange}
//                 />
//               }
//               label="Urgent"
//             />
//             <FormControlLabel
//               control={
//                 <Checkbox
//                   value="Not Urgent"
//                   checked={filter.isUrgent?.includes(false) || false}
//                   onChange={handleUrgentStatusChange}
//                 />
//               }
//               label="Not Urgent"
//             />
//           </FormControl>
//         </Box>
//       </Box>
//   );
// }
