import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

import { HomeActions } from "@/components/HomeActions";
import { PublicNavbar } from "@/components/layout/PublicNavbar";
import { softColors } from "@/lib/soft-ui";
export default function HomePage() {
  return (
    <>
      <PublicNavbar />
      <Box
        sx={{
          background: `linear-gradient(180deg, ${softColors.grey[100]} 0%, ${softColors.background} 70%)`,
          minHeight: "calc(100vh - 64px)",
        }}
      >
        <Container maxWidth="md" sx={{ py: { xs: 6, md: 10 } }}>
          <Card>
            <CardContent sx={{ px: { xs: 3, md: 6 }, py: { xs: 5, md: 7 }, textAlign: "center" }}>
              <Typography variant="h3" gutterBottom sx={{ fontWeight: 700, color: softColors.dark }}>
                Hire smarter with ROVE
              </Typography>
              <Typography
                variant="h6"
                color="text.secondary"
                sx={{ maxWidth: 520, mx: "auto", mb: 4, fontWeight: 400 }}
              >
                A modern recruitment portal for managing jobs, candidates, interviews,
                and your entire hiring pipeline — built for HR teams.
              </Typography>
              <HomeActions />
            </CardContent>
          </Card>
        </Container>
      </Box>
    </>
  );
}
