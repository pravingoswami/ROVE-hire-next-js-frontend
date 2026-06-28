"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { StatusBadge } from "@/components/StatusBadge";
import { MeetLink } from "@/components/MeetLink";
import { formatDateTime, formatSalary } from "@/lib/format";
import { jobTitle } from "@/lib/labels";
import { queryKeys } from "@/lib/query-keys";
import {
  completeInterview,
  downloadDocument,
  generateOffer,
  getCandidate,
  getMagicLink,
  scheduleInterview,
  updateCandidateStatus,
} from "@/lib/services";
import { useGoogleMeetIntegrationQuery } from "@/hooks/useQueries";
import type { CandidateDetail, Interview } from "@/lib/types";

function mergeInterview(
  detail: CandidateDetail,
  interview: Interview,
  candidate = detail.candidate
): CandidateDetail {
  const exists = detail.interviews.some((item) => item._id === interview._id);
  return {
    ...detail,
    candidate,
    interviews: exists
      ? detail.interviews.map((item) => (item._id === interview._id ? interview : item))
      : [...detail.interviews, interview],
  };
}

export default function CandidateDetailPage() {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const googleMeetQuery = useGoogleMeetIntegrationQuery();
  const [detail, setDetail] = useState<CandidateDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const invalidateHrCaches = useCallback(async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: queryKeys.hr.candidate(id) }),
      queryClient.invalidateQueries({ queryKey: ["hr", "interviews"] }),
      queryClient.invalidateQueries({ queryKey: ["hr", "candidates"] }),
      queryClient.invalidateQueries({ queryKey: queryKeys.hr.dashboard }),
    ]);
  }, [queryClient, id]);

  const load = useCallback(() => {
    getCandidate(id)
      .then(setDetail)
      .catch((e) => setError(e.message));
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleSchedule(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setLoading(true);
    setError(null);
    setMessage(null);
    const formData = new FormData(form);
    const meetLinkRaw = String(formData.get("meetLink") || "").trim();
    const durationRaw = String(formData.get("durationMinutes") || "").trim();
    try {
      const result = await scheduleInterview(id, {
        scheduledAt: new Date(String(formData.get("scheduledAt"))).toISOString(),
        type: String(formData.get("type")),
        interviewerName: String(formData.get("interviewerName")),
        notes: String(formData.get("notes") || "") || undefined,
        meetLink: meetLinkRaw || undefined,
        durationMinutes: durationRaw ? Number(durationRaw) : undefined,
      });
      setDetail((prev) => (prev ? mergeInterview(prev, result.interview, result.candidate) : prev));
      if (result.googleMeetIntegration.meetLinkGenerated && result.interview.meetLink) {
        setMessage(`Interview scheduled. Google Meet link created and sent to the candidate.`);
      } else if (result.interview.meetLink) {
        setMessage("Interview scheduled with Meet link.");
      } else {
        setMessage("Interview scheduled.");
      }
      form.reset();
      await invalidateHrCaches();
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleCompleteInterview(
    interviewId: string,
    e: FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();
    const form = e.currentTarget;
    setLoading(true);
    setError(null);
    setMessage(null);
    const formData = new FormData(form);
    try {
      const result = await completeInterview(interviewId, {
        recommendation: String(formData.get("recommendation")),
        note: String(formData.get("note")),
      });
      setDetail((prev) =>
        prev
          ? mergeInterview(prev, result.interview, result.candidate ?? prev.candidate)
          : prev
      );
      setMessage("Interview feedback saved.");
      form.reset();
      await invalidateHrCaches();
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleGenerateOffer(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const form = new FormData(e.currentTarget);
    try {
      await generateOffer(id, {
        roleTitle: String(form.get("roleTitle")),
        salary: {
          currency: String(form.get("currency")),
          amount: Number(form.get("amount")),
        },
        startDate: String(form.get("startDate")),
        reportingManager: String(form.get("reportingManager")),
        location: String(form.get("location")),
      });
      setMessage("Offer documents generated.");
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleStatus(status: "hired" | "rejected", reason?: string) {
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      const result = await updateCandidateStatus(id, { status, reason });
      setDetail((prev) => (prev ? { ...prev, candidate: result.candidate } : prev));
      setMessage(`Candidate marked as ${status}.`);
      await invalidateHrCaches();
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleMagicLink() {
    setLoading(true);
    setError(null);
    try {
      const result = await getMagicLink(id);
      setMessage(`New magic link: ${result.magicLink}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleDownload(docId: string) {
    try {
      const result = await downloadDocument(docId);
      if (result?.downloadUrl) {
        window.open(result.downloadUrl, "_blank");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Download failed");
    }
  }

  if (!detail && !error) return <div className="loading">Loading candidate…</div>;

  const { candidate, timeline, interviews, documents, statusLabel } = detail ?? {
    candidate: null,
    timeline: [],
    interviews: [],
    documents: [],
    statusLabel: "",
  };

  const isTerminal = candidate?.status === "hired" || candidate?.status === "rejected";

  return (
    <>
      <div className="page-header">
        <Link href="/dashboard/candidates" style={{ fontSize: "0.875rem" }}>
          ← Back to candidates
        </Link>
        {candidate && (
          <>
            <h1 style={{ marginTop: "0.5rem" }}>{candidate.name}</h1>
            <p>
              {candidate.email} · {jobTitle(candidate.jobId)} ·{" "}
              <StatusBadge status={candidate.status} /> ({statusLabel})
            </p>
          </>
        )}
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {message && <div className="alert alert-success">{message}</div>}

      {candidate && (
        <div className="grid grid-2">
          <div className="card">
            <h2 className="card-title">Profile</h2>
            <p><strong>Phone:</strong> {candidate.phone ?? "—"}</p>
            <p><strong>Location:</strong> {candidate.location ?? "—"}</p>
            <p><strong>Current role:</strong> {candidate.currentRole ?? "—"}</p>
            <p><strong>Notice period:</strong> {candidate.noticePeriod ?? "—"}</p>
            <p><strong>Salary expectation:</strong> {formatSalary(candidate.salaryExpectation)}</p>
            {candidate.linkedInUrl && (
              <p>
                <strong>LinkedIn:</strong>{" "}
                <a href={candidate.linkedInUrl} target="_blank" rel="noreferrer">
                  Profile
                </a>
              </p>
            )}
            <p style={{ marginTop: "0.5rem", fontSize: "0.875rem", color: "var(--muted)" }}>
              Last activity: {formatDateTime(candidate.lastActivityAt)}
            </p>

            {!isTerminal && (
              <div className="actions-row">
                {candidate.status === "applied" && (
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={handleMagicLink}
                    disabled={loading}
                  >
                    Regenerate magic link
                  </button>
                )}
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => handleStatus("hired")}
                  disabled={loading}
                >
                  Mark hired
                </button>
                <button
                  type="button"
                  className="btn btn-danger btn-sm"
                  onClick={() => {
                    const reason = prompt("Rejection reason (min 10 chars):");
                    if (reason && reason.length >= 10) handleStatus("rejected", reason);
                  }}
                  disabled={loading}
                >
                  Reject
                </button>
              </div>
            )}
          </div>

          <div className="card">
            <h2 className="card-title">Timeline</h2>
            {timeline.length === 0 ? (
              <p className="empty">No events yet.</p>
            ) : (
              <ul className="timeline">
                {timeline.map((event) => (
                  <li key={event._id}>
                    <div className="timeline-title">{event.title}</div>
                    {event.description && (
                      <div style={{ fontSize: "0.875rem" }}>{event.description}</div>
                    )}
                    <div className="timeline-meta">
                      {formatDateTime(event.createdAt)} · {event.actorType}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      <section className="section">
        <div className="card">
          <h2 className="card-title">Interviews</h2>
          {interviews.length === 0 ? (
            <p style={{ color: "var(--muted)", marginBottom: "1rem" }}>No interviews yet.</p>
          ) : (
            interviews.map((interview) => (
              <div key={interview._id} style={{ marginBottom: "1rem", paddingBottom: "1rem", borderBottom: "1px solid var(--border)" }}>
                <p>
                  <strong>{interview.type}</strong> with {interview.interviewerName} ·{" "}
                  {formatDateTime(interview.scheduledAt)} ·{" "}
                  <StatusBadge status={interview.status} />
                </p>
                {interview.meetLink && (
                  <p style={{ marginTop: "0.35rem" }}>
                    <MeetLink url={interview.meetLink} />
                  </p>
                )}
                {interview.feedback && (
                  <p style={{ fontSize: "0.875rem" }}>
                    Feedback: {interview.feedback.recommendation} — {interview.feedback.note}
                  </p>
                )}
                {interview.status === "scheduled" && (
                  <form
                    onSubmit={(e) => handleCompleteInterview(interview._id, e)}
                    style={{ marginTop: "0.75rem" }}
                  >
                    <div className="field-row">
                      <div className="field">
                        <label>Recommendation</label>
                        <select name="recommendation" required>
                          <option value="hire">Hire</option>
                          <option value="maybe">Maybe</option>
                          <option value="no_hire">No hire</option>
                        </select>
                      </div>
                    </div>
                    <div className="field">
                      <label>Notes</label>
                      <textarea name="note" required minLength={5} rows={2} />
                    </div>
                    <button type="submit" className="btn btn-secondary btn-sm" disabled={loading}>
                      Complete interview
                    </button>
                  </form>
                )}
              </div>
            ))
          )}

          {candidate && candidate.status !== "applied" && !isTerminal && (
            <form onSubmit={handleSchedule}>
              <h3 style={{ fontSize: "0.9375rem", marginBottom: "0.75rem" }}>Schedule interview</h3>
              {googleMeetQuery.data?.configured && (
                <p style={{ fontSize: "0.8125rem", color: "rgb(103, 116, 142)", marginBottom: "0.75rem" }}>
                  A Google Meet link will be created automatically and emailed to the candidate.
                </p>
              )}
              <div className="field-row">
                <div className="field">
                  <label>Date & time</label>
                  <input name="scheduledAt" type="datetime-local" required />
                </div>
                <div className="field">
                  <label>Type</label>
                  <select name="type" required>
                    <option value="screening">Screening</option>
                    <option value="technical">Technical</option>
                  </select>
                </div>
              </div>
              <div className="field-row">
                <div className="field">
                  <label>Interviewer</label>
                  <input name="interviewerName" required minLength={2} />
                </div>
                <div className="field">
                  <label>Duration (minutes)</label>
                  <input
                    name="durationMinutes"
                    type="number"
                    min={15}
                    max={240}
                    defaultValue={60}
                    placeholder="60"
                  />
                </div>
              </div>
              <div className="field">
                <label>Notes (optional)</label>
                <textarea name="notes" rows={2} />
              </div>
              {!googleMeetQuery.data?.configured && (
                <div className="field">
                  <label>Google Meet link (optional)</label>
                  <input
                    name="meetLink"
                    type="url"
                    placeholder="https://meet.google.com/xxx-yyyy-zzz"
                  />
                  <span style={{ fontSize: "0.75rem", color: "rgb(103, 116, 142)" }}>
                    Provide a Meet link manually when Google Calendar integration is not configured.
                  </span>
                </div>
              )}
              <button type="submit" className="btn btn-primary btn-sm" disabled={loading}>
                Schedule
              </button>
            </form>
          )}
        </div>
      </section>

      <section className="section">
        <div className="card">
          <h2 className="card-title">Documents</h2>
          {documents.length === 0 ? (
            <p style={{ color: "var(--muted)" }}>No documents yet.</p>
          ) : (
            <ul style={{ listStyle: "none", marginBottom: "1rem" }}>
              {documents.map((doc) => (
                <li key={doc._id} style={{ marginBottom: "0.5rem" }}>
                  {doc.type.replace(/_/g, " ")} — {doc.fileName}{" "}
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => handleDownload(doc._id)}
                  >
                    Download
                  </button>
                </li>
              ))}
            </ul>
          )}

          {candidate && !isTerminal && (
            <form onSubmit={handleGenerateOffer}>
              <h3 style={{ fontSize: "0.9375rem", marginBottom: "0.75rem" }}>Generate offer</h3>
              <div className="field-row">
                <div className="field">
                  <label>Role title</label>
                  <input name="roleTitle" required />
                </div>
                <div className="field">
                  <label>Start date</label>
                  <input name="startDate" required placeholder="2026-07-01" />
                </div>
              </div>
              <div className="field-row">
                <div className="field">
                  <label>Currency</label>
                  <select name="currency" defaultValue="USD">
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                  </select>
                </div>
                <div className="field">
                  <label>Salary</label>
                  <input name="amount" type="number" required min={0} />
                </div>
              </div>
              <div className="field-row">
                <div className="field">
                  <label>Reporting manager</label>
                  <input name="reportingManager" required />
                </div>
                <div className="field">
                  <label>Location</label>
                  <input name="location" required />
                </div>
              </div>
              <button type="submit" className="btn btn-primary btn-sm" disabled={loading}>
                Generate offer & NDA
              </button>
            </form>
          )}
        </div>
      </section>
    </>
  );
}
