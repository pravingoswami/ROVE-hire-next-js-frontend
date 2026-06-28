"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";

import { PageHeader } from "@/components/ui/PageHeader";
import { SoftCard } from "@/components/ui/SoftCard";
import { addCandidate, getJobs } from "@/lib/services";
import type { Job } from "@/lib/types";

export default function NewCandidatePage() {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [magicLink, setMagicLink] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getJobs({ status: "open" })
      .then((d) => setJobs(d.jobs))
      .catch((e) => setError(e.message));
  }, []);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMagicLink(null);

    const form = new FormData(e.currentTarget);

    try {
      const result = await addCandidate(form);
      setMagicLink(result.magicLink);
      setTimeout(() => router.push(`/dashboard/candidates/${result.candidate._id}`), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add candidate");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <PageHeader title="Add candidate" subtitle="Upload resume and send a magic application link" />

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {magicLink && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Candidate added. Magic link:{" "}
          <a href={magicLink} target="_blank" rel="noreferrer">
            {magicLink}
          </a>
        </Alert>
      )}

      <SoftCard sx={{ maxWidth: 640 }}>
        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              id="name"
              name="name"
              label="Full name"
              required
              slotProps={{ htmlInput: { minLength: 2 } }}
            />
            <TextField id="email" name="email" label="Email" type="email" required />
            <TextField id="jobId" name="jobId" label="Job" select required defaultValue="">
              <MenuItem value="" disabled>
                Select a job
              </MenuItem>
              {jobs.map((job) => (
                <MenuItem key={job._id} value={job._id}>
                  {job.title}
                </MenuItem>
              ))}
            </TextField>
            <Button variant="outlined" component="label">
              Upload resume (PDF)
              <input hidden id="resume" name="resume" type="file" accept="application/pdf" required />
            </Button>
            <Stack direction="row" spacing={1}>
              <Button type="submit" variant="contained" disabled={loading}>
                {loading ? "Adding…" : "Add candidate"}
              </Button>
              <Button component={Link} href="/dashboard/candidates" variant="outlined">
                Cancel
              </Button>
            </Stack>
          </Stack>
        </Box>
      </SoftCard>
    </>
  );
}
