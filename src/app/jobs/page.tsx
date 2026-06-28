import Link from "next/link";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import LinkMui from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";

import { MarkdownContent } from "@/components/MarkdownContent";
import { PublicNavbar } from "@/components/layout/PublicNavbar";
import { StatusBadge } from "@/components/StatusBadge";
import { getPublicJobs } from "@/lib/services";

export default async function PublicJobsPage() {
  let jobs: Awaited<ReturnType<typeof getPublicJobs>>["jobs"] = [];
  let error: string | null = null;

  try {
    const data = await getPublicJobs();
    jobs = data.jobs;
  } catch (e) {
    error = e instanceof Error ? e.message : "Failed to load jobs";
  }

  return (
    <>
      <PublicNavbar />
      <Box sx={{ bgcolor: "background.default", minHeight: "calc(100vh - 64px)", py: 4 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" gutterBottom>
            Open positions
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            Explore current opportunities at ROVE Hire.
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          {jobs.length === 0 && !error ? (
            <Card>
              <CardContent sx={{ textAlign: "center", py: 5 }}>
                <Typography color="text.secondary">No open positions right now.</Typography>
              </CardContent>
            </Card>
          ) : (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {jobs.map((job) => (
                <Card key={job._id}>
                  <CardContent>
                    <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2, mb: 1 }}>
                      <Typography variant="h6" component="h2">
                        <LinkMui component={Link} href={`/jobs/${job._id}`} underline="hover">
                          {job.title}
                        </LinkMui>
                      </Typography>
                      <StatusBadge status={job.status} />
                    </Box>
                    <Box sx={{ maxHeight: 160, overflow: "hidden", mb: 2 }}>
                      <MarkdownContent content={job.description} />
                    </Box>
                    {job.requiredSkills.length > 0 && (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75, mb: 1 }}>
                        {job.requiredSkills.map((skill) => (
                          <Chip key={skill} label={skill} size="small" variant="outlined" color="primary" />
                        ))}
                      </Box>
                    )}
                    <LinkMui component={Link} href={`/jobs/${job._id}`} variant="body2">
                      View full description →
                    </LinkMui>
                  </CardContent>
                </Card>
              ))}
            </Box>
          )}

          <Typography variant="body2" color="text.secondary" sx={{ mt: 3 }}>
            Received an application link?{" "}
            <LinkMui component={Link} href="/">Use the link from your email</LinkMui> to complete your form.
          </Typography>
        </Container>
      </Box>
    </>
  );
}
