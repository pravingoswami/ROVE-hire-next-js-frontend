"use client";

import { BarChart } from "@mui/x-charts/BarChart";
import { PieChart } from "@mui/x-charts/PieChart";
import Grid from "@mui/material/Grid";

import { SoftCard } from "@/components/ui/SoftCard";
import { EmptyState } from "@/components/ui/StateMessage";
import { chartColors, palette } from "@/lib/theme";
import type { CandidateStatus, DashboardData } from "@/lib/types";

const STATUS_ORDER: CandidateStatus[] = [
  "applied",
  "form_submitted",
  "interview_scheduled",
  "offer_sent",
  "hired",
  "rejected",
];

type Props = {
  overview: DashboardData["overview"];
  pipelineStages: DashboardData["pipelineStages"];
  candidatesByStatus: DashboardData["candidatesByStatus"];
};

const chartSx = {
  "& .MuiChartsAxis-line, & .MuiChartsAxis-tick": { stroke: palette.border },
  "& .MuiChartsAxis-tickLabel": { fill: palette.muted, fontSize: 12 },
  "& .MuiChartsLegend-label": { fill: palette.slate, fontSize: 12 },
};

export function DashboardCharts({
  overview,
  pipelineStages,
  candidatesByStatus,
}: Props) {
  const pipelineLabels = pipelineStages.map((s) => s.label);
  const pipelineCounts = pipelineStages.map((s) => s.count);

  const pieData = STATUS_ORDER.map((key, index) => ({
    id: index,
    value: candidatesByStatus[key] ?? 0,
    label: key.replace(/_/g, " "),
    color: chartColors[index % chartColors.length],
  })).filter((d) => d.value > 0);

  const jobLabels = ["Open", "Closed"];
  const jobCounts = [overview.openJobs, overview.closedJobs];

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, lg: 6 }}>
        <SoftCard title="Pipeline funnel" subtitle="Candidates at each hiring stage">
          <BarChart
            height={280}
            sx={chartSx}
            series={[{ data: pipelineCounts, label: "Candidates", color: palette.brand }]}
            xAxis={[
              {
                data: pipelineLabels,
                scaleType: "band",
                tickLabelStyle: { angle: -20, textAnchor: "end", fontSize: 11 },
              },
            ]}
            margin={{ left: 48, right: 16, top: 24, bottom: 72 }}
            borderRadius={6}
            grid={{ horizontal: true }}
          />
        </SoftCard>
      </Grid>

      <Grid size={{ xs: 12, lg: 6 }}>
        <SoftCard title="Status distribution" subtitle="Share of candidates by current status">
          {pieData.length === 0 ? (
            <EmptyState message="No candidate data yet." />
          ) : (
            <PieChart
              height={280}
              sx={chartSx}
              series={[
                {
                  data: pieData,
                  innerRadius: 52,
                  outerRadius: 100,
                  paddingAngle: 2,
                  cornerRadius: 4,
                  highlightScope: { fade: "global", highlight: "item" },
                },
              ]}
              margin={{ left: 8, right: 120, top: 16, bottom: 16 }}
              slotProps={{
                legend: {
                  direction: "vertical",
                  position: { vertical: "middle", horizontal: "end" },
                },
              }}
            />
          )}
        </SoftCard>
      </Grid>

      <Grid size={{ xs: 12 }}>
        <SoftCard title="Job openings" subtitle="Open vs closed positions">
          <BarChart
            height={220}
            sx={chartSx}
            layout="horizontal"
            series={[{ data: jobCounts, label: "Jobs", color: palette.cadet }]}
            yAxis={[{ data: jobLabels, scaleType: "band" }]}
            xAxis={[{ min: 0 }]}
            margin={{ left: 72, right: 24, top: 16, bottom: 32 }}
            borderRadius={6}
            grid={{ vertical: true }}
          />
        </SoftCard>
      </Grid>
    </Grid>
  );
}
