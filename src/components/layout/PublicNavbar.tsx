"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";

import { useAuth } from "@/hooks/useAuth";
import { softColors } from "@/lib/soft-ui";
import { softUiGradients } from "@/lib/mui-theme";

export function PublicNavbar() {
  const router = useRouter();
  const { user, isLoading, logout } = useAuth();

  async function handleLogout() {
    await logout.mutateAsync();
    router.push("/");
  }

  return (
    <AppBar position="sticky">
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ minHeight: 64, gap: 1 }}>
          <Box component={Link} href="/" sx={{ display: "flex", alignItems: "center", gap: 1, flex: 1, textDecoration: "none", color: "inherit" }}>
            <Avatar
              sx={{
                width: 32,
                height: 32,
                fontSize: "0.7rem",
                fontWeight: 700,
                background: softUiGradients.info,
              }}
            >
              RV
            </Avatar>
            <Typography variant="h6" sx={{ fontWeight: 700, color: softColors.dark }}>
              ROVE Hire
            </Typography>
          </Box>

          <Button component={Link} href="/jobs" color="inherit">
            Public Jobs
          </Button>

          {!isLoading && user ? (
            <>
              <Button component={Link} href="/dashboard" variant="contained" size="small">
                Dashboard
              </Button>
              <Button variant="outlined" color="inherit" size="small" onClick={handleLogout} disabled={logout.isPending}>
                Log out
              </Button>
            </>
          ) : (
            !isLoading && (
              <Button component={Link} href="/login" variant="contained" size="small">
                HR Login
              </Button>
            )
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}
