"use client";

import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";

import { roveTheme } from "@/lib/mui-theme";

export function ThemeRegistry({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={roveTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
