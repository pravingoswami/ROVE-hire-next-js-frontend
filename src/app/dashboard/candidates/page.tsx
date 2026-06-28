"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import LinkMui from "@mui/material/Link";

import { CandidateFilters } from "@/components/CandidateFilters";
import { StatusBadge } from "@/components/StatusBadge";
import { PageHeader } from "@/components/ui/PageHeader";
import { SoftCard } from "@/components/ui/SoftCard";
import { DataTable } from "@/components/ui/DataTable";
import { ErrorAlert, EmptyState, LoadingState } from "@/components/ui/StateMessage";
import { useCandidatesQuery } from "@/hooks/useQueries";
import { formatDateTime } from "@/lib/format";
import { jobTitle } from "@/lib/labels";
import { useDebouncedValue } from "@/lib/useDebouncedValue";

export default function CandidatesPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const debouncedSearch = useDebouncedValue(search);

  const params = useMemo(
    () => ({
      ...(statusFilter && { status: statusFilter }),
      ...(debouncedSearch && { search: debouncedSearch }),
    }),
    [statusFilter, debouncedSearch]
  );

  const candidatesQuery = useCandidatesQuery(params);
  const candidates = candidatesQuery.data ?? [];
  const hasFilters = Boolean(statusFilter || debouncedSearch);

  return (
    <>
      <PageHeader
        title="Candidates"
        subtitle="Track applicants through the pipeline"
        action={
          <Button component={Link} href="/dashboard/candidates/new" variant="contained">
            Add candidate
          </Button>
        }
      />

      <CandidateFilters
        search={search}
        status={statusFilter}
        onSearchChange={setSearch}
        onStatusChange={setStatusFilter}
      />

      {candidatesQuery.error && (
        <ErrorAlert
          message={
            candidatesQuery.error instanceof Error
              ? candidatesQuery.error.message
              : "Failed to load candidates"
          }
        />
      )}

      <SoftCard flush>
        {candidatesQuery.isLoading ? (
          <Box sx={{ py: 4 }}>
            <LoadingState label="Loading candidates…" />
          </Box>
        ) : candidates.length === 0 ? (
          <Box sx={{ py: 4 }}>
            <EmptyState
              message={hasFilters ? "No candidates match your filters." : "No candidates found."}
            />
          </Box>
        ) : (
          <DataTable
            getRowId={(c) => c._id}
            rows={candidates}
            columns={[
              {
                id: "name",
                label: "Name",
                render: (c) => (
                  <LinkMui component={Link} href={`/dashboard/candidates/${c._id}`} underline="hover">
                    {c.name}
                  </LinkMui>
                ),
              },
              { id: "role", label: "Role", render: (c) => c.currentRole ?? "—" },
              { id: "email", label: "Email", render: (c) => c.email },
              { id: "job", label: "Job", render: (c) => jobTitle(c.jobId) },
              {
                id: "status",
                label: "Status",
                render: (c) => <StatusBadge status={c.status} />,
              },
              {
                id: "activity",
                label: "Last activity",
                render: (c) => formatDateTime(c.lastActivityAt),
              },
            ]}
          />
        )}
      </SoftCard>
    </>
  );
}
