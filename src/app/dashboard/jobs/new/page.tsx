"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";

import { MarkdownEditor } from "@/components/MarkdownEditor";
import { PageHeader } from "@/components/ui/PageHeader";
import { SoftCard } from "@/components/ui/SoftCard";
import { queryKeys } from "@/lib/query-keys";
import { createJob } from "@/lib/services";

export default function NewJobPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const form = new FormData(e.currentTarget);
    const skills = String(form.get("requiredSkills"))
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    if (description.trim().length < 20) {
      setError("Description must be at least 20 characters.");
      setLoading(false);
      return;
    }

    try {
      const job = await createJob({
        title: String(form.get("title")),
        description,
        requiredSkills: skills,
        status: String(form.get("status")),
      });
      await queryClient.invalidateQueries({ queryKey: ["hr", "jobs"] });
      await queryClient.invalidateQueries({ queryKey: queryKeys.hr.dashboard });
      router.push(`/dashboard/jobs/${job._id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create job");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <PageHeader title="New job" subtitle="Create a new position with a rich markdown description" />

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <SoftCard sx={{ maxWidth: 760 }}>
        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              id="title"
              name="title"
              label="Title"
              required
              slotProps={{ htmlInput: { minLength: 3 } }}
            />
            <Box>
              <MarkdownEditor
                id="description"
                value={description}
                onChange={setDescription}
                required
                minLength={20}
                placeholder={"## About the role\n\nDescribe the position…"}
              />
            </Box>
            <TextField
              id="requiredSkills"
              name="requiredSkills"
              label="Required skills (comma-separated)"
              placeholder="React, TypeScript, Node.js"
            />
            <TextField id="status" name="status" label="Status" select defaultValue="open">
              <MenuItem value="open">Open</MenuItem>
              <MenuItem value="closed">Closed</MenuItem>
            </TextField>
            <Stack direction="row" spacing={1}>
              <Button type="submit" variant="contained" disabled={loading}>
                {loading ? "Creating…" : "Create job"}
              </Button>
              <Button component={Link} href="/dashboard/jobs" variant="outlined">
                Cancel
              </Button>
            </Stack>
          </Stack>
        </Box>
      </SoftCard>
    </>
  );
}
