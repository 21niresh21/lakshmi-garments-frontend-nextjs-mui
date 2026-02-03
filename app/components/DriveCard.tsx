import {
    Card,
    CardActionArea,
    CardContent,
    Typography,
    Box,
    CardMedia,
} from "@mui/material";

interface DriveCardProps {
    title: string;
    image: string;
    link: string;
    description: string;

}

export default function DriveCard({ title, image, link, description }: DriveCardProps) {
    return (
        <Card sx={{ 
            height: "100%",
            transition: "transform 0.2s ease, box-shadow 0.2s ease",
            "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: (theme) => theme.shadows[8],
            }
        }}>
            <CardActionArea 
                onClick={() => window.open(link, "_blank")}
                sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "stretch",
                    "& .MuiCardActionArea-focusHighlight": {
                        bgcolor: "primary.main"
                    }
                }}
            >
                <CardMedia
                    component="img"
                    height="400"
                    image={image}
                    alt={title}
                    sx={{ objectFit: "cover" }}
                />
                <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column", gap: 1 }}>
                    <Typography gutterBottom variant="h5" fontWeight={600} component="div" sx={{ color: "text.primary" }}>
                        {title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', opacity: 0.8 }}>
                        {description}
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}
