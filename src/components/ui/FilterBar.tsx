"use client";

import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";

export type FilterOption = { value: string; label: string };

type FilterBarProps = {
  search?: string;
  searchPlaceholder?: string;
  onSearchChange?: (value: string) => void;
  status?: string;
  statusLabel?: string;
  statusOptions?: FilterOption[];
  onStatusChange?: (value: string) => void;
  compact?: boolean;
};

export function FilterBar({
  search,
  searchPlaceholder = "Search…",
  onSearchChange,
  status,
  statusLabel = "Status",
  statusOptions = [],
  onStatusChange,
  compact,
}: FilterBarProps) {
  return (
    <Grid container spacing={2} sx={{ mb: compact ? 0 : 2.5 }}>
      {onSearchChange !== undefined && (
        <Grid size={{ xs: 12, md: 8 }}>
          <TextField
            placeholder={searchPlaceholder}
            value={search ?? ""}
            onChange={(e) => onSearchChange(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" color="action" />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Grid>
      )}
      {onStatusChange !== undefined && (
        <Grid size={{ xs: 12, md: onSearchChange ? 4 : 12 }}>
          <TextField
            select
            label={statusLabel}
            value={status ?? ""}
            onChange={(e) => onStatusChange(e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            {statusOptions.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      )}
    </Grid>
  );
}
