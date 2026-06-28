"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import Box from "@mui/material/Box";
import LinkMui from "@mui/material/Link";

import { StatusBadge } from "@/components/StatusBadge";
import { MeetLink } from "@/components/MeetLink";
import { PageHeader } from "@/components/ui/PageHeader";
import { SoftCard } from "@/components/ui/SoftCard";
import { FilterBar } from "@/components/ui/FilterBar";
import { DataTable } from "@/components/ui/DataTable";
import { ErrorAlert, EmptyState, LoadingState } from "@/components/ui/StateMessage";
import { useInterviewsQuery } from "@/hooks/useQueries";
import { formatDateTime } from "@/lib/format";
import { candidateName } from "@/lib/labels";
import { useDebouncedValue } from "@/lib/useDebouncedValue";
import type { Interview } from "@/lib/types";

const INTERVIEW_STATUS_OPTIONS = [
  { value: "scheduled", label: "Scheduled" },
  { value: "completed", label: "Completed" },
];

function filterInterviews(interviews: Interview[], query: string) {
  if (!query.trim()) return interviews;
  const q = query.toLowerCase();
  return interviews.filter((interview) => {
    const candidate =
      typeof interview.candidateId === "string"
        ? ""
        : candidateName(interview.candidateId).toLowerCase();
    return (
      candidate.includes(q) ||
      interview.type.toLowerCase().includes(q) ||
      interview.interviewerName.toLowerCase().includes(q) ||
      (interview.meetLink?.toLowerCase().includes(q) ?? false)
    );
  });
}

export default function InterviewsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const debouncedSearch = useDebouncedValue(search);

  const params = useMemo(
    () => (statusFilter ? { status: statusFilter } : {}),
    [statusFilter]
  );

  const interviewsQuery = useInterviewsQuery(params);
  const allInterviews = interviewsQuery.data ?? [];
  const interviews = useMemo(
    () => filterInterviews(allInterviews, debouncedSearch),
    [allInterviews, debouncedSearch]
  );
  const hasFilters = Boolean(statusFilter || debouncedSearch);

  return (
    <>
      <PageHeader title="Interviews" subtitle="Upcoming and completed interviews" />

      <FilterBar
        search={search}
        searchPlaceholder="Search by candidate, type, or interviewer…"
        onSearchChange={setSearch}
        status={statusFilter}
        statusLabel="Filter by status"
        statusOptions={INTERVIEW_STATUS_OPTIONS}
        onStatusChange={setStatusFilter}
      />

      {interviewsQuery.error && (
        <ErrorAlert
          message={
            interviewsQuery.error instanceof Error
              ? interviewsQuery.error.message
              : "Failed to load interviews"
          }
        />
      )}

      <SoftCard flush>
        {interviewsQuery.isLoading ? (
          <Box sx={{ py: 4 }}>
            <LoadingState label="Loading interviews…" />
          </Box>
        ) : interviews.length === 0 ? (
          <Box sx={{ py: 4 }}>
            <EmptyState
              message={hasFilters ? "No interviews match your filters." : "No interviews found."}
            />
          </Box>
        ) : (
          <DataTable
            getRowId={(i) => i._id}
            rows={interviews}
            columns={[
              {
                id: "candidate",
                label: "Candidate",
                render: (interview) =>
                  typeof interview.candidateId === "string" ? (
                    "—"
                  ) : (
                    <LinkMui
                      component={Link}
                      href={`/dashboard/candidates/${interview.candidateId._id}`}
                      underline="hover"
                    >
                      {candidateName(interview.candidateId)}
                    </LinkMui>
                  ),
              },
              { id: "type", label: "Type", render: (i) => i.type },
              { id: "interviewer", label: "Interviewer", render: (i) => i.interviewerName },
              {
                id: "meet",
                label: "Google Meet",
                render: (i) =>
                  i.meetLink ? <MeetLink url={i.meetLink} variant="button" /> : "—",
              },
              {
                id: "scheduled",
                label: "Scheduled",
                render: (i) => formatDateTime(i.scheduledAt),
              },
              {
                id: "status",
                label: "Status",
                render: (i) => <StatusBadge status={i.status} />,
              },
            ]}
          />
        )}
      </SoftCard>
    </>
  );
}
