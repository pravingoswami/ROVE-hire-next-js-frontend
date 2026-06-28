"use client";

import { FilterBar } from "@/components/ui/FilterBar";

const CANDIDATE_STATUS_OPTIONS = [
  { value: "applied", label: "Applied" },
  { value: "form_submitted", label: "Form submitted" },
  { value: "interview_scheduled", label: "Interview scheduled" },
  { value: "offer_sent", label: "Offer sent" },
  { value: "hired", label: "Hired" },
  { value: "rejected", label: "Rejected" },
];

interface CandidateFiltersProps {
  search: string;
  status: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  compact?: boolean;
}

export function CandidateFilters(props: CandidateFiltersProps) {
  return (
    <FilterBar
      search={props.search}
      searchPlaceholder="Search by name, role, skill, email, or job…"
      onSearchChange={props.onSearchChange}
      status={props.status}
      statusLabel="Status"
      statusOptions={CANDIDATE_STATUS_OPTIONS}
      onStatusChange={props.onStatusChange}
      compact={props.compact}
    />
  );
}

export { useDebouncedValue } from "@/lib/useDebouncedValue";
