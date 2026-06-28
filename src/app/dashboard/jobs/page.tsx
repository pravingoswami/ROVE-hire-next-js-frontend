"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

import { JobFilters } from "@/components/JobFilters";
import { StatusBadge } from "@/components/StatusBadge";
import { PageHeader } from "@/components/ui/PageHeader";
import { SoftCard } from "@/components/ui/SoftCard";
import { DataTable } from "@/components/ui/DataTable";
import { ErrorAlert, EmptyState, LoadingState } from "@/components/ui/StateMessage";
import { useJobsQuery } from "@/hooks/useQueries";
import { useDebouncedValue } from "@/lib/useDebouncedValue";

export default function HrJobsPage() {
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

  const jobsQuery = useJobsQuery(params);
  const jobs = jobsQuery.data ?? [];
  const hasFilters = Boolean(statusFilter || debouncedSearch);

  return (
    <>
      <PageHeader
        title="Jobs"
        subtitle="Manage open and closed positions"
        action={
          <Button component={Link} href="/dashboard/jobs/new" variant="contained">
            New job
          </Button>
        }
      />

      <JobFilters
        search={search}
        status={statusFilter}
        onSearchChange={setSearch}
        onStatusChange={setStatusFilter}
      />

      {jobsQuery.error && (
        <ErrorAlert
          message={jobsQuery.error instanceof Error ? jobsQuery.error.message : "Failed to load jobs"}
        />
      )}

      <SoftCard flush>
        {jobsQuery.isLoading ? (
          <Box sx={{ py: 4 }}>
            <LoadingState label="Loading jobs…" />
          </Box>
        ) : jobs.length === 0 ? (
          <Box sx={{ py: 4 }}>
            <EmptyState message={hasFilters ? "No jobs match your filters." : "No jobs found."} />
          </Box>
        ) : (
          <DataTable
            getRowId={(j) => j._id}
            rows={jobs}
            columns={[
              { id: "title", label: "Title", render: (j) => j.title },
              {
                id: "status",
                label: "Status",
                render: (j) => <StatusBadge status={j.status} />,
              },
              {
                id: "candidates",
                label: "Candidates",
                render: (j) => j.candidateCount ?? 0,
              },
              {
                id: "actions",
                label: "",
                align: "right",
                render: (j) => (
                  <Button
                    component={Link}
                    href={`/dashboard/jobs/${j._id}`}
                    variant="outlined"
                    size="small"
                  >
                    Edit
                  </Button>
                ),
              },
            ]}
          />
        )}
      </SoftCard>
    </>
  );
}
