import {
  Box,
  Button,
  Chip,
  Divider,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { SelectionState } from "./_types/models";
import { createBatch } from "@/app/api/batchApi";
import { useNotification } from "@/app/components/shared/NotificationProvider";
import { useUser } from "@/app/context/UserContext";
import { BatchStatus } from "@/app/_types/BatchStatus";
import { useState } from "react";

interface Props {
  serialCode: string;
  batchDetails: SelectionState;
  onClear: () => void;
}

export default function BatchPreview({
  serialCode,
  batchDetails,
  onClear,
}: Props) {
  const [loading, setLoading] = useState(false);
  const { notify } = useNotification();
  const { user } = useUser();
  const selectedItems =
    batchDetails?.items?.filter((item) => item.selected) || [];

  const submitBatch = async () => {
    setLoading(true);
    const getQty = (item: any) => (item.qty === "" ? item.maxQty : item.qty);
    const totalQuantity = selectedItems.reduce(
      (sum, item) => sum + getQty(item),
      0,
    );

    const payload = {
      ...batchDetails,
      serialCode,
      batchStatus: BatchStatus.CREATED,
      createdByID: user?.id,
      isUrgent: batchDetails.urgent,
      totalQuantity,
      subCategories: selectedItems.map((item) => ({
        subCategoryName: item.name,
        quantity: getQty(item),
      })),
    };

    try {
      await createBatch(payload);
      notify("Batch has been created.", "success");
      onClear();
    } catch {
      notify("Some error occurred", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Typography variant="h6" textAlign="center" mb={1}>
        Batch Preview
      </Typography>
      <Divider />

      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mt={2}
        mb={2}
      >
        <Typography variant="body2" fontWeight={700}>
          Serial Code: {serialCode}
        </Typography>
        {batchDetails.urgent && (
          <Chip
            label="Urgent"
            size="small"
            color="error"
            icon={<PriorityHighIcon />}
          />
        )}
      </Stack>

      <Box sx={{ flexGrow: 1, overflowY: "auto", mb: 2 }}>
        {selectedItems.map((item) => (
          <Box
            key={item.name}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              py: 1,
              borderBottom: "1px solid",
              borderColor: "grey.200",
            }}
          >
            <Typography variant="body2">{item.name}</Typography>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="body2" fontWeight={600}>
                {item.qty === "" ? item.maxQty : item.qty}
              </Typography>
              {item.qty === item.maxQty && (
                <Chip
                  label="MAX"
                  size="small"
                  color="warning"
                  sx={{ height: 16, fontSize: 9 }}
                />
              )}
            </Stack>
          </Box>
        ))}
        {batchDetails.remarks && (
          <Box sx={{ mt: 2, p: 1, bgcolor: "grey.50", borderRadius: 1 }}>
            <Typography variant="caption" color="text.secondary">
              Remarks:
            </Typography>
            <Typography variant="body2">{batchDetails.remarks}</Typography>
          </Box>
        )}
      </Box>

      {selectedItems.length > 0 && (
        <Button
          fullWidth
          onClick={submitBatch}
          startIcon={<CheckCircleIcon />}
          variant="contained"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Batch"}
        </Button>
      )}
    </Box>
  );
}
