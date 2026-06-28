"use client";

import Link from "next/link";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

import { useAuth } from "@/hooks/useAuth";

export function HomeActions() {
  const { user, isLoading } = useAuth();

  if (isLoading) return null;

  return (
    <Box sx={{ display: "flex", gap: 1.5, justifyContent: "center", flexWrap: "wrap" }}>
      <Button component={Link} href="/jobs" variant="contained" size="large">
        Browse open jobs
      </Button>
      {user ? (
        <Button component={Link} href="/dashboard" variant="outlined" size="large">
          Go to dashboard
        </Button>
      ) : (
        <Button component={Link} href="/login" variant="outlined" size="large">
          HR portal
        </Button>
      )}
    </Box>
  );
}
