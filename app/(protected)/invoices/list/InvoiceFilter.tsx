"use client";

import {
  Popper,
  Paper,
  Typography,
  Divider,
  Stack,
  Button,
  TextField,
  ClickAwayListener,
  Autocomplete,
  Box,
  Grid,
  alpha,
  useTheme,
} from "@mui/material";
import BusinessIcon from "@mui/icons-material/Business";
import PaymentsIcon from "@mui/icons-material/Payments";
import DateRangeIcon from "@mui/icons-material/DateRange";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { Supplier } from "../_types/supplier";
import { Transport } from "../_types/transport";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

export interface InvoiceFilterType {
  supplierNames: string[];
  transportNames: string[];
  isPaid: boolean[];
  invoiceStartDate: string;
  invoiceEndDate: string;
  receivedStartDate: string;
  receivedEndDate: string;
}

interface Props {
  anchorEl: HTMLElement | null;
  open: boolean;
  filters: InvoiceFilterType;
  suppliers: Supplier[];
  transports: Transport[];
  onChange: (filters: InvoiceFilterType) => void;
  onApply: () => void;
  onReset: () => void;
  onClose: () => void;
}

export default function InvoiceFilter({
  anchorEl,
  open,
  filters,
  suppliers,
  transports,
  onChange,
  onApply,
  onReset,
  onClose,
}: Props) {
  const theme = useTheme();

  const handleChange = <K extends keyof InvoiceFilterType>(
    key: K,
    value: InvoiceFilterType[K]
  ) => {
    onChange({ ...filters, [key]: value });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Popper
        open={open}
        anchorEl={anchorEl}
        placement="bottom-end"
        sx={{ zIndex: 1300, mt: 1.5 }}
      >
        <ClickAwayListener onClickAway={onClose}>
          <Paper
            elevation={8}
            sx={{
              width: 400,
              borderRadius: 3,
              overflow: "hidden",
              border: `1px solid ${theme.palette.divider}`,
              boxShadow: "0 10px 40px rgba(0,0,0,0.12)",
            }}
          >
            {/* Header */}
            <Box
              sx={{
                px: 2.5,
                py: 2,
                bgcolor: alpha(theme.palette.primary.main, 0.04),
                display: "flex",
                alignItems: "center",
                gap: 1.5,
              }}
            >
              <FilterAltIcon color="primary" fontSize="small" />
              <Typography variant="subtitle1" fontWeight={800}>
                Filter Invoices
              </Typography>
            </Box>

            <Divider />

            <Box sx={{ p: 2.5 }}>
              <Stack spacing={3}>
                {/* Entities Section */}
                <Box>
                  <SectionHeader icon={<BusinessIcon fontSize="inherit" />} title="Business Entities" />
                  <Stack spacing={2}>
                    <Autocomplete
                      multiple
                      size="small"
                      options={suppliers.map((s) => s.name)}
                      value={filters.supplierNames}
                      onChange={(_, value) => handleChange("supplierNames", value)}
                      renderInput={(params) => <TextField {...params} label="Suppliers" placeholder="Search..." />}
                    />
                    <Autocomplete
                      multiple
                      size="small"
                      options={transports.map((t) => t.name)}
                      value={filters.transportNames}
                      onChange={(_, value) => handleChange("transportNames", value)}
                      renderInput={(params) => <TextField {...params} label="Transports" placeholder="Search..." />}
                    />
                  </Stack>
                </Box>

                {/* Status Section */}
                <Box>
                  <SectionHeader icon={<PaymentsIcon fontSize="inherit" />} title="Payment Status" />
                  <Autocomplete
                    multiple
                    size="small"
                    options={[true, false]}
                    value={filters.isPaid}
                    onChange={(_, value) => handleChange("isPaid", value)}
                    getOptionLabel={(option) => (option ? "Paid" : "Unpaid")}
                    renderInput={(params) => <TextField {...params} label="Transport Status" />}
                  />
                </Box>

                {/* Invoice Date Range */}
                <Box>
                  <SectionHeader icon={<DateRangeIcon fontSize="inherit" />} title="Invoice Date Range" />
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 6 }}>
                      <DatePicker
                        label="From"
                        format="DD/MM/YYYY"
                        value={filters.invoiceStartDate ? dayjs(filters.invoiceStartDate, "DD-MM-YYYY") : null}
                        onAccept={(d) => handleChange("invoiceStartDate", d?.format("DD-MM-YYYY") || "")}
                        slotProps={{ textField: { size: "small", fullWidth: true } }}
                      />
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <DatePicker
                        label="To"
                        format="DD/MM/YYYY"
                        value={filters.invoiceEndDate ? dayjs(filters.invoiceEndDate, "DD-MM-YYYY") : null}
                        onAccept={(d) => handleChange("invoiceEndDate", d?.format("DD-MM-YYYY") || "")}
                        slotProps={{ textField: { size: "small", fullWidth: true } }}
                      />
                    </Grid>
                  </Grid>
                </Box>

                {/* Received Date Range */}
                <Box>
                  <SectionHeader icon={<EventAvailableIcon fontSize="inherit" />} title="Received Date Range" />
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 6 }}>
                      <DatePicker
                        label="From"
                        format="DD/MM/YYYY"
                        value={filters.receivedStartDate ? dayjs(filters.receivedStartDate, "DD-MM-YYYY") : null}
                        onAccept={(d) => handleChange("receivedStartDate", d?.format("DD-MM-YYYY") || "")}
                        slotProps={{ textField: { size: "small", fullWidth: true } }}
                      />
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <DatePicker
                        label="To"
                        format="DD/MM/YYYY"
                        value={filters.receivedEndDate ? dayjs(filters.receivedEndDate, "DD-MM-YYYY") : null}
                        onAccept={(d) => handleChange("receivedEndDate", d?.format("DD-MM-YYYY") || "")}
                        slotProps={{ textField: { size: "small", fullWidth: true } }}
                      />
                    </Grid>
                  </Grid>
                </Box>
              </Stack>
            </Box>

            <Divider />

            {/* Footer */}
            <Box
              sx={{
                p: 2,
                display: "flex",
                justifyContent: "space-between",
                bgcolor: alpha(theme.palette.background.default, 0.4),
              }}
            >
              <Button
                size="small"
                onClick={onReset}
                startIcon={<RestartAltIcon />}
                sx={{ color: "text.secondary", fontWeight: 700 }}
              >
                Reset
              </Button>
              <Stack direction="row" spacing={1}>
                <Button size="small" onClick={onClose} sx={{ fontWeight: 700 }}>
                  Cancel
                </Button>
                <Button size="small" variant="contained" onClick={onApply} sx={{ px: 3, fontWeight: 800 }}>
                  Apply
                </Button>
              </Stack>
            </Box>
          </Paper>
        </ClickAwayListener>
      </Popper>
    </LocalizationProvider>
  );
}

function SectionHeader({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5, color: "text.secondary" }}>
      <Box sx={{ display: "flex", color: "primary.main", fontSize: 18 }}>{icon}</Box>
      <Typography
        variant="caption"
        fontWeight={800}
        sx={{ textTransform: "uppercase", letterSpacing: "0.05em" }}
      >
        {title}
      </Typography>
    </Box>
  );
}
