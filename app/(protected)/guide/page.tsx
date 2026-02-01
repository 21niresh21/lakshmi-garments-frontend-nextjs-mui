"use client";

import { Grid, Typography } from "@mui/material";
import applicationGuideCards from "../data/applicationGuideCards";
import DriveCard from "@/app/components/DriveCard";


export default function Page() {
    return (
        <Grid container spacing={4}>
            {/* Title */}
            <Grid size={12}>
                <Typography variant="h4" fontWeight={600}>
                    Application Guide
                </Typography>
            </Grid>

            {/* Cards */}
            <Grid size={12}>
                <Grid container spacing={3}>
                    {applicationGuideCards.map((card, index) => (
                        <Grid size={{ md: 4, xs: 12 }} key={index}>
                            <DriveCard
                                title={card.title}
                                image={card.image}
                                link={card.link}
                                description={card.description}
                                
                            />
                        </Grid>
                    ))}
                </Grid>
            </Grid>
        </Grid>
    );
}
