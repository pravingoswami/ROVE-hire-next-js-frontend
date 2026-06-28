"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import LinkMui from "@mui/material/Link";
import PeopleIcon from "@mui/icons-material/People";
import WorkIcon from "@mui/icons-material/Work";
import EventIcon from "@mui/icons-material/Event";
import AssignmentIcon from "@mui/icons-material/Assignment";
import MailIcon from "@mui/icons-material/Mail";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import { CandidateFilters } from "@/components/CandidateFilters";
import { DashboardCharts } from "@/components/dashboard/DashboardCharts";
import { StatusBadge } from "@/components/StatusBadge";
import { PageHeader } from "@/components/ui/PageHeader";
import { SoftCard } from "@/components/ui/SoftCard";
import { StatCard } from "@/components/ui/StatCard";
import { DataTable } from "@/components/ui/DataTable";
import { ErrorAlert, EmptyState, LoadingState } from "@/components/ui/StateMessage";
import { useCandidatesQuery, useDashboardQuery } from "@/hooks/useQueries";
import { formatDateTime } from "@/lib/format";
import { jobTitle } from "@/lib/labels";
import { useDebouncedValue } from "@/lib/useDebouncedValue";

const STAT_CONFIG = [
  { label: "Active pipeline", key: "activePipeline" as const, icon: PeopleIcon, gradient: "info" as const },
  { label: "Open jobs", key: "openJobs" as const, icon: WorkIcon, gradient: "success" as const },
  { label: "Upcoming interviews", key: "upcomingInterviews" as const, icon: EventIcon, gradient: "warning" as const },
  { label: "Pending applications", key: "pendingApplications" as const, icon: AssignmentIcon, gradient: "secondary" as const },
  { label: "Offers pending", key: "offersPending" as const, icon: MailIcon, gradient: "primary" as const },
  { label: "Hired", key: "hiredCount" as const, icon: CheckCircleIcon, gradient: "success" as const },
];

export default function DashboardPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const debouncedSearch = useDebouncedValue(search);

  const candidateParams = useMemo(
    () => ({
      ...(statusFilter && { status: statusFilter }),
      ...(debouncedSearch && { search: debouncedSearch }),
    }),
    [statusFilter, debouncedSearch]
  );

  const dashboardQuery = useDashboardQuery();
  const candidatesQuery = useCandidatesQuery(candidateParams);

  const data = dashboardQuery.data;
  const candidates = candidatesQuery.data ?? [];
  const error = dashboardQuery.error ?? candidatesQuery.error;
  const hasFilters = Boolean(statusFilter || debouncedSearch);

  if (error && !data) {
    return <ErrorAlert message={error instanceof Error ? error.message : "Failed to load dashboard"} />;
  }

  if (dashboardQuery.isLoading && !data) {
    return <LoadingState label="Loading dashboard…" />;
  }

  if (!data) return null;

  const { overview, pipelineStages, candidatesByStatus } = data;

  return (
    <>
      <PageHeader
        title="Dashboard"
        subtitle="Recruitment pipeline overview and hiring analytics"
      />

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {STAT_CONFIG.map((stat) => (
          <Grid key={stat.key} size={{ xs: 12, sm: 6, lg: 4 }}>
            <StatCard
              label={stat.label}
              value={overview[stat.key]}
              icon={stat.icon}
              gradient={stat.gradient}
            />
          </Grid>
        ))}
      </Grid>

      <DashboardCharts
        overview={overview}
        pipelineStages={pipelineStages}
        candidatesByStatus={candidatesByStatus}
      />

      <SoftCard
        title="Candidates"
        subtitle="Search by name, role, skill, email, or job"
        flush
        sx={{ mt: 3 }}
      >
        <Box sx={{ px: 2.5, pb: 2, pt: 2.5 }}>
          <CandidateFilters
            search={search}
            status={statusFilter}
            onSearchChange={setSearch}
            onStatusChange={setStatusFilter}
            compact
          />
        </Box>

        {candidatesQuery.isFetching ? (
          <Box sx={{ py: 4 }}>
            <LoadingState label="Searching candidates…" />
          </Box>
        ) : candidates.length === 0 ? (
          <Box sx={{ py: 4 }}>
            <EmptyState
              message={hasFilters ? "No candidates match your filters." : "No candidates yet."}
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
