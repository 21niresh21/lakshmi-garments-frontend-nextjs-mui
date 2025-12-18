import { Inventory } from "@/app/_types/Inventory";
import {
  Card,
  CardActionArea,
  CardContent,
  Typography,
  Box,
  LinearProgress,
} from "@mui/material";

interface Props {
  category: Inventory;
  onChange: (category: Inventory) => void;
}

export default function CategoryCard({ category, onChange }: Props) {
  return (
    <Card sx={{ height: "100%", width: "100%" }}>
      <CardActionArea
        onClick={() => {
          onChange(category);
        }}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          justifyContent: "flex-start", // force content start from top
          height: "100%",
        }}
      >
        <CardContent>
          <Typography gutterBottom variant="h5">
            {category.categoryName}
          </Typography>

          <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 1 }}>
            {category.subCategories.map((subCategory) => (
              <Box key={subCategory.subCategoryName}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 0.5,
                  }}
                >
                  <Typography variant="body2">
                    {subCategory.subCategoryName}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 500,
                      minWidth: 50,
                      textAlign: "right",
                    }}
                  >
                    {subCategory.count} pcs
                  </Typography>
                </Box>

                {/* Progress Bar */}
                <LinearProgress
                  color="primary"
                  variant="determinate"
                  value={subCategory.percentageOfCategory} // precomputed percentage
                  sx={{
                    height: 4,
                    borderRadius: 4,
                    bgcolor: "grey.300",
                  }}
                />
              </Box>
            ))}
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
