"use client";

import { FilterBar } from "@/components/ui/FilterBar";

const JOB_STATUS_OPTIONS = [
  { value: "open", label: "Open" },
  { value: "closed", label: "Closed" },
];

interface JobFiltersProps {
  search: string;
  status: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
}

export function JobFilters(props: JobFiltersProps) {
  return (
    <FilterBar
      search={props.search}
      searchPlaceholder="Search by title, skill, role, or description…"
      onSearchChange={props.onSearchChange}
      status={props.status}
      statusLabel="Status"
      statusOptions={JOB_STATUS_OPTIONS}
      onStatusChange={props.onStatusChange}
    />
  );
}
