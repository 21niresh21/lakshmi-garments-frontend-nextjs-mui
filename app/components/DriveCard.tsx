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
        <Card sx={{ height: "100%" }}>
            <CardActionArea onClick={() => window.open(link, "_blank")}>
                <CardMedia
                    component="img"
                    height="400"
                    image={image}
                    alt={title}
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" fontWeight={600} component="div">
                        {title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {description}
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}
