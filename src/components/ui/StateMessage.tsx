"use client";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";

export function LoadingState({ label = "Loading…" }: { label?: string }) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", py: 6, gap: 2 }}>
      <CircularProgress size={32} />
      <Typography color="text.secondary">{label}</Typography>
    </Box>
  );
}

export function EmptyState({ message }: { message: string }) {
  return (
    <Box sx={{ textAlign: "center", py: 5 }}>
      <Typography color="text.secondary">{message}</Typography>
    </Box>
  );
}

export function ErrorAlert({ message }: { message: string }) {
  return <Alert severity="error" sx={{ mb: 2 }}>{message}</Alert>;
}
