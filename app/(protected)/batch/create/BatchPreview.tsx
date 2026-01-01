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
import { SelectionState } from "./_types/models";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
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
}: //   onClear,
Props) {
  const [loading, setLoading] = useState(false);
  const { notify } = useNotification();
  const { user } = useUser();
  const hasSelectedItems =
    batchDetails?.items?.some((item) => item.selected) ?? false;

  const submitBatch = () => {
    setLoading(true);
    const selectedItems = batchDetails.items.filter((i) => i.selected);

    const getQty = (item: any) => (item.qty === "" ? item.maxQty : item.qty);

    const totalQuantity = selectedItems.reduce(
      (sum, item) => sum + getQty(item),
      0
    );

    const payload = {
      ...batchDetails,
      serialCode,
      batchStatus: BatchStatus.CREATED,
      createdByID: user?.id,
      isUrgent: batchDetails.urgent,
      totalQuantity : totalQuantity,
      subCategories: selectedItems.map((item) => ({
        subCategoryName: item.name,
        quantity: getQty(item),
      })),
    };

    createBatch(payload)
      .then(() => {
        notify("Batch has been created.", "success");
        onClear();
      })
      .catch((err) => notify("Some error occured", "error"))
      .finally(() => setLoading(false));
  };

  return (
    <>
      <Typography variant="h6" textAlign="center" mb={2}>
        Batch Preview
      </Typography>

      <Divider />
      <Grid container mt={2}>
        <Grid size={12}>
          <Stack direction="row" justifyContent="space-between">
            <Typography>{`Serial Code: ${serialCode}`}</Typography>
            {batchDetails?.urgent && (
              <Chip
                label="Urgent"
                size="small"
                color="error"
                icon={<PriorityHighIcon />}
                sx={{ borderRadius: 1 }}
              />
            )}
          </Stack>
        </Grid>
        <Box
          sx={{
            flexGrow: 1,
            overflowY: "auto",
            pr: 1,
            my: 3,
          }}
        >
          {batchDetails?.items.map(
            (subCategory) =>
              subCategory.selected && (
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
                    <Typography variant="body1">{subCategory.name}</Typography>
                  </Box>
                  <Stack direction="row" columnGap={2} alignItems="center">
                    <Typography>
                      {subCategory.qty === ""
                        ? subCategory.maxQty
                        : subCategory.qty}
                    </Typography>
                    {(subCategory.qty === subCategory.maxQty ||
                      subCategory.qty === "") && (
                      <Chip
                        label="USING ALL"
                        size="small"
                        color="warning"
                        sx={{
                          height: 18,
                          fontSize: 10,
                          fontWeight: 700,
                          px: 0.5,
                          "& .MuiChip-label": {
                            px: 0.5,
                          },
                        }}
                      />
                    )}
                  </Stack>
                </Box>
              )
          )}
          {batchDetails?.remarks && (
            <Stack
              direction="row"
              justifyContent="space-between"
              mt={3}
              columnGap={2}
            >
              <Typography>Remarks</Typography>
              <Typography>{batchDetails.remarks}</Typography>
            </Stack>
          )}
        </Box>
      </Grid>
      {hasSelectedItems && (
        <Button
          onClick={submitBatch}
          sx={{ width: 100, alignSelf: "flex-end" }}
          startIcon={<CheckCircleIcon />}
          size="small"
          variant="contained"
          loading={loading}
          loadingPosition="start"
        >
          Create
        </Button>
      )}
    </>
  );
}
