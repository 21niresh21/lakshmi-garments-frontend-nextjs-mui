"use client";

import { 
  Alert, 
  Button, 
  Chip,
  IconButton, 
  Link, 
  Stack, 
  TextField, 
  Tooltip, 
  Typography,
  Box,
  Drawer,
  Fab,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import { fetchJobworkDetail, getItemsForJobwork } from "@/app/api/jobworkApi";
import JobworkSummary from "./JobworkSummary";
import { useNotification } from "@/app/components/shared/NotificationProvider";
import { fetchItems } from "@/app/api/itemApi";
import JobworkItemsTable from "./JobworkItemsTable";
import { Item } from "@/app/_types/Item";
import { useGlobalLoading } from "@/app/components/layout/LoadingProvider";
import { JobworkStatus } from "@/app/_types/JobworkStatus";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import InfoIcon from "@mui/icons-material/Info";
import CloseIcon from "@mui/icons-material/Close";

export default function Page() {
  const { notify } = useNotification();
  const { loading, showLoading, hideLoading } = useGlobalLoading();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  
  const [jobworkNumber, setJobworkNumber] = useState<string>("");
  const [jobwork, setJobwork] = useState<any | null>(null);
  const [error, setError] = useState<string>("");
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [items, setItems] = useState<Item[]>([]);
  const [itemsForJobwork, setItemsForJobWork] = useState([]);

  const handleCopyJobworkNumber = () => {
    if (jobwork?.jobworkNumber) {
      navigator.clipboard.writeText(jobwork.jobworkNumber);
      notify("Jobwork number copied to clipboard", "success");
    }
  };

  const handleFind = async () => {
    const trimmed = jobworkNumber.trim().toUpperCase();

    if (!trimmed) return;

    const jobworkNumberRegex = /^JW-\d{8}-\d{3}$/;
    if (!jobworkNumberRegex.test(trimmed)) {
      setError("Jobwork Number format must be JW-YYYYMMDD-XXX");
      return;
    }
    
    // Clear previous state before fetching new jobwork
    setJobwork(null);
    setItemsForJobWork([]);
    setError("");
    
    showLoading();
    try {
      const res = await fetchJobworkDetail(trimmed);
      setJobwork(res);
    } catch (error) {
      notify("No jobwork found", "error");
      setJobwork(null);
    } finally {
      hideLoading();
    }
  };

  useEffect(() => {
    fetchItems().then((res) => setItems(res));
  }, []);

  useEffect(() => {
    if (jobwork && jobworkNumber && jobwork.jobworkType !== 'CUTTING') {
      getItemsForJobwork(jobworkNumber)
        .then((res) => setItemsForJobWork(res))
        .catch(() => {
          notify("Error fetching items given for jobwork", "error");
        });
    }
  }, [jobwork]);

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <Box sx={{ position: "relative", height: "100%", p: 2 }}>
      {/* Main Content Area - Full Width */}
      <Stack spacing={2}>
        {/* Search Bar Row */}
        <Stack direction="row" spacing={2} alignItems="center">
          <TextField
            label="Jobwork Number"
            value={jobworkNumber}
            onChange={(e) => {
              setJobworkNumber(e.target.value.toUpperCase());
              setError("");
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleFind();
              }
            }}
            sx={{ width: 360 }}
            error={Boolean(error)}
            helperText={error}
          />
          <Button
            sx={{ height: 40 }}
            variant="contained"
            onClick={handleFind}
            disabled={!jobworkNumber || loading}
            loading={loading}
            loadingPosition="start"
          >
            Find
          </Button>
          <Link
            href="/jobwork/employee-lookup"
            target="_blank"
            rel="noopener noreferrer"
            underline="hover"
            sx={{ 
              fontSize: "0.875rem", 
              cursor: "pointer",
              whiteSpace: "nowrap" 
            }}
          >
            Find by Employee
          </Link>
        </Stack>

        {/* Jobwork Header */}
        {jobwork && (
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="h6" fontWeight={700}>
              {jobwork.jobworkNumber}
            </Typography>
            <Tooltip title="Copy Jobwork Number">
              <IconButton onClick={handleCopyJobworkNumber} size="small" color="primary">
                <ContentCopyIcon />
              </IconButton>
            </Tooltip>
            <Chip 
              label={jobwork.jobworkStatus} 
              size="small" 
              color={
                jobwork.jobworkStatus === JobworkStatus.CLOSED ? "success" :
                jobwork.jobworkStatus === JobworkStatus.IN_PROGRESS ? "primary" :
                jobwork.jobworkStatus === JobworkStatus.AWAITING_APPROVAL ? "warning" : "default"
              }
              sx={{ ml: 1 }}
            />
          </Stack>
        )}

        {/* Warning Alert */}
        {jobwork?.jobworkStatus === JobworkStatus.AWAITING_APPROVAL && (
          <Alert severity="warning">
            This jobwork has a receipt raised already and is still pending approval. 
            No further actions can be taken until the receipt is approved or rejected.
          </Alert>
        )}

        {/* Jobwork Items Table - Main Content */}
        {jobwork && (
          <JobworkItemsTable
            key={jobwork.jobworkNumber}
            setJobwork={setJobwork}
            jobwork={jobwork}
            allItems={jobwork?.jobworkType == 'CUTTING' ? items : itemsForJobwork}
            setJobworkNumber={setJobworkNumber}
          />
        )}
      </Stack>

      {/* Floating Action Button - Show when jobwork is loaded and drawer is closed */}
      {jobwork?.jobworkType && !drawerOpen && (
        <Fab
          color="primary"
          sx={{
            position: "fixed",
            right: 24,
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: theme.zIndex.fab,
          }}
          onClick={toggleDrawer}
        >
          <Tooltip title="View Jobwork Details" placement="left">
            <InfoIcon />
          </Tooltip>
        </Fab>
      )}

      {/* Drawer for Jobwork Summary */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={toggleDrawer}
        sx={{
          zIndex: theme.zIndex.modal,
        }}
        PaperProps={{
          sx: {
            width: { xs: "100%", sm: 400, md: 450 },
            p: 3,
            zIndex: theme.zIndex.modal,
          },
        }}
      >
        <Box sx={{ position: "relative", height: "100%" }}>
          {/* Close Button */}
          <IconButton
            onClick={toggleDrawer}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
            }}
          >
            <CloseIcon />
          </IconButton>

          {/* Jobwork Summary Content */}
          {jobwork?.jobworkType && (
            <JobworkSummary jobwork={jobwork} />
          )}
        </Box>
      </Drawer>
    </Box>
  );
}
