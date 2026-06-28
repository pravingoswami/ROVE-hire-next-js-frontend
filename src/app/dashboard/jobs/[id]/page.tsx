"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { MarkdownContent } from "@/components/MarkdownContent";
import { MarkdownEditor } from "@/components/MarkdownEditor";
import { StatusBadge } from "@/components/StatusBadge";
import { useJobQuery } from "@/hooks/useQueries";
import { queryKeys } from "@/lib/query-keys";
import { deleteJob, updateJob } from "@/lib/services";

export default function EditJobPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const jobQuery = useJobQuery(id);
  const job = jobQuery.data ?? null;
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (job) setDescription(job.description);
  }, [job]);

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
      const updated = await updateJob(id, {
        title: String(form.get("title")),
        description,
        requiredSkills: skills,
        status: String(form.get("status")),
      });
      await queryClient.invalidateQueries({ queryKey: ["hr", "jobs"] });
      await queryClient.invalidateQueries({ queryKey: queryKeys.hr.job(id) });
      await queryClient.invalidateQueries({ queryKey: queryKeys.hr.dashboard });
      setDescription(updated.description);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Delete this job? Only allowed when there are no candidates.")) return;
    try {
      await deleteJob(id);
      await queryClient.invalidateQueries({ queryKey: ["hr", "jobs"] });
      await queryClient.invalidateQueries({ queryKey: queryKeys.hr.dashboard });
      router.push("/dashboard/jobs");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    }
  }

  if (jobQuery.isLoading && !job) return <div className="loading">Loading job…</div>;
  if (jobQuery.error && !job) {
    return (
      <div className="alert alert-error">
        {jobQuery.error instanceof Error ? jobQuery.error.message : "Failed to load job"}
      </div>
    );
  }

  if (!job && !error) return <div className="loading">Loading job…</div>;

  return (
    <>
      <div className="page-header">
        <h1>Edit job</h1>
        {job && (
          <p>
            <StatusBadge status={job.status} /> · {job.candidateCount ?? 0} candidates
          </p>
        )}
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {job && (
        <div className="grid" style={{ gap: "1.5rem", maxWidth: "760px" }}>
          <form className="card" onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="title">Title</label>
              <input id="title" name="title" required defaultValue={job.title} />
            </div>
            <div className="field">
              <label htmlFor="description">Description</label>
              <MarkdownEditor
                id="description"
                value={description}
                onChange={setDescription}
                required
                minLength={20}
              />
            </div>
            <div className="field">
              <label htmlFor="requiredSkills">Required skills</label>
              <input
                id="requiredSkills"
                name="requiredSkills"
                defaultValue={job.requiredSkills.join(", ")}
              />
            </div>
            <div className="field">
              <label htmlFor="status">Status</label>
              <select id="status" name="status" defaultValue={job.status}>
                <option value="open">Open</option>
                <option value="closed">Closed</option>
              </select>
            </div>
            <div className="actions-row">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? "Saving…" : "Save changes"}
              </button>
              <Link href="/dashboard/jobs" className="btn btn-secondary">
                Back
              </Link>
              <button type="button" className="btn btn-danger" onClick={handleDelete}>
                Delete
              </button>
            </div>
          </form>

          <div className="card">
            <h2 className="card-title">Live preview</h2>
            <MarkdownContent content={description} />
          </div>
        </div>
      )}
    </>
  );
}
