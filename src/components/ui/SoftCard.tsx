"use client";

import Card, { type CardProps } from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";

type SoftCardProps = CardProps & {
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  /** Table layout — no inner padding; table sits flush in the card */
  flush?: boolean;
};

export function SoftCard({
  title,
  subtitle,
  action,
  children,
  flush,
  ...props
}: SoftCardProps) {
  const hasHeader = Boolean(title || subtitle || action);

  return (
    <Card {...props}>
      {hasHeader && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 2,
            px: 2.5,
            pt: 2.5,
            pb: flush ? 2 : subtitle ? 0 : 1,
          }}
        >
          <Box>
            {title && (
              <Typography variant="h6" color="text.primary">
                {title}
              </Typography>
            )}
            {subtitle && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.25, mb: flush ? 1.5 : 0 }}
              >
                {subtitle}
              </Typography>
            )}
          </Box>
          {action}
        </Box>
      )}

      {flush ? (
        <>
          {hasHeader && <Divider />}
          <Box sx={{ px: hasHeader ? 0 : 0, py: 0 }}>{children}</Box>
        </>
      ) : (
        <CardContent sx={{ pt: hasHeader ? 1.5 : 2.5 }}>{children}</CardContent>
      )}
    </Card>
  );
}
