"use client";

import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type { SvgIconComponent } from "@mui/icons-material";

import { softColors, softShadow, pxToRem } from "@/lib/soft-ui";
import { softUiGradients } from "@/lib/mui-theme";
import type { SoftGradientKey } from "@/lib/theme";

type StatCardProps = {
  label: string;
  value: number | string;
  icon: SvgIconComponent;
  gradient?: SoftGradientKey;
};

export function StatCard({
  label,
  value,
  icon: Icon,
  gradient = "info",
}: StatCardProps) {
  return (
    <Card sx={{ overflow: "visible" }}>
      <Box sx={{ p: 2, display: "flex", alignItems: "center", gap: 2 }}>
        <Box
          sx={{
            width: pxToRem(48),
            height: pxToRem(48),
            borderRadius: pxToRem(8),
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: softUiGradients[gradient],
            color: softColors.white,
            boxShadow: softShadow.md,
            flexShrink: 0,
          }}
        >
          <Icon sx={{ fontSize: pxToRem(18) }} />
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Typography
            variant="button"
            sx={{
              color: softColors.text,
              textTransform: "capitalize",
              fontWeight: 500,
              display: "block",
              lineHeight: 1.4,
            }}
          >
            {label}
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 700, color: softColors.dark }}>
            {value}
          </Typography>
        </Box>
      </Box>
    </Card>
  );
}
