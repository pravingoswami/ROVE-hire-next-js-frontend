import Link from "next/link";
import { notFound } from "next/navigation";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import LinkMui from "@mui/material/Link";
import Typography from "@mui/material/Typography";

import { MarkdownContent } from "@/components/MarkdownContent";
import { PublicNavbar } from "@/components/layout/PublicNavbar";
import { StatusBadge } from "@/components/StatusBadge";
import { getApiUrl } from "@/lib/api";
import type { Job } from "@/lib/types";

async function getPublicJob(id: string): Promise<Job | null> {
  const res = await fetch(`${getApiUrl()}/jobs/public?limit=100`, {
    cache: "no-store",
  });
  if (!res.ok) return null;
  const json = await res.json();
  if (!json.success) return null;
  return json.data.jobs.find((job: Job) => job._id === id) ?? null;
}

export default async function PublicJobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const job = await getPublicJob(id);

  if (!job) notFound();

  return (
    <>
      <PublicNavbar />
      <Box sx={{ bgcolor: "background.default", minHeight: "calc(100vh - 64px)", py: 4 }}>
        <Container maxWidth="md">
          <LinkMui component={Link} href="/jobs" variant="body2" sx={{ display: "inline-block", mb: 1 }}>
            ← Back to jobs
          </LinkMui>
          <Typography variant="h4" gutterBottom>
            {job.title}
          </Typography>
          <Box sx={{ mb: 3 }}>
            <StatusBadge status={job.status} />
          </Box>

          <Card>
            <CardContent>
              <MarkdownContent content={job.description} />
              {job.requiredSkills.length > 0 && (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75, mt: 3 }}>
                  {job.requiredSkills.map((skill) => (
                    <Chip key={skill} label={skill} size="small" variant="outlined" color="primary" />
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        </Container>
      </Box>
    </>
  );
}
