import { Inventory } from "@/app/_types/Inventory";
import { Card, CardActionArea, CardContent, Typography, Box, LinearProgress } from "@mui/material";

interface Props {
  category: Inventory;
  onChange?: (category: Inventory) => void;
  readOnly?: boolean;
}

export default function CategoryCard({ category, onChange, readOnly }: Props) {
  return (
    <Card sx={{ height: "100%" }}>
      <CardActionArea
        onClick={() => !readOnly && onChange?.(category)}
        sx={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "stretch" }}
      >
        <CardContent>
          <Typography variant="h6" noWrap>{category.categoryName}</Typography>
          <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 1.5 }}>
            {category.subCategories.map((sub) => (
              <Box key={sub.subCategoryName}>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                  <Typography variant="caption">{sub.subCategoryName}</Typography>
                  <Typography variant="caption" fontWeight={600}>{sub.count} pcs</Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={sub.percentageOfCategory} 
                  sx={{ height: 6, borderRadius: 3 }} 
                />
              </Box>
            ))}
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}