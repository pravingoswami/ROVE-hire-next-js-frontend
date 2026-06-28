"use client";

import { useParams } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

import { MarkdownContent } from "@/components/MarkdownContent";
import { SiteHeader } from "@/components/SiteHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { getApplyContext, submitApplication } from "@/lib/services";
import type { ApplyContext } from "@/lib/types";

export default function ApplyPage() {
  const { token } = useParams<{ token: string }>();
  const [context, setContext] = useState<ApplyContext | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getApplyContext(token)
      .then(setContext)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [token]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const form = new FormData(e.currentTarget);
    const amount = Number(form.get("amount"));

    try {
      await submitApplication(token, {
        phone: String(form.get("phone")),
        location: String(form.get("location")),
        currentRole: String(form.get("currentRole")),
        noticePeriod: String(form.get("noticePeriod")),
        salaryExpectation: {
          currency: String(form.get("currency")),
          amount,
        },
        linkedInUrl: String(form.get("linkedInUrl") || "") || undefined,
      });
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submission failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <SiteHeader />
      <main className="container page" style={{ maxWidth: "640px" }}>
        {loading && <div className="loading">Loading application…</div>}

        {error && !context && (
          <div className="alert alert-error">{error}</div>
        )}

        {success && (
          <div className="card">
            <div className="alert alert-success">
              Application submitted successfully. Our team will be in touch.
            </div>
          </div>
        )}

        {context && !success && (
          <>
            <div className="page-header">
              <h1>Application form</h1>
              <p>
                {context.job.title} — {context.candidate.name}
              </p>
            </div>

            <div className="card" style={{ marginBottom: "1rem" }}>
              <p style={{ marginBottom: "0.5rem" }}>
                <strong>Status:</strong>{" "}
                <StatusBadge status={context.candidate.status} />
              </p>
              <MarkdownContent content={context.job.description} />
            </div>

            {error && <div className="alert alert-error">{error}</div>}

            <form className="card" onSubmit={handleSubmit}>
              <div className="field">
                <label htmlFor="phone">Phone</label>
                <input id="phone" name="phone" required minLength={8} />
              </div>
              <div className="field">
                <label htmlFor="location">Location</label>
                <input id="location" name="location" required minLength={2} />
              </div>
              <div className="field">
                <label htmlFor="currentRole">Current role</label>
                <input id="currentRole" name="currentRole" required minLength={2} />
              </div>
              <div className="field">
                <label htmlFor="noticePeriod">Notice period</label>
                <input id="noticePeriod" name="noticePeriod" required />
              </div>
              <div className="field-row">
                <div className="field">
                  <label htmlFor="currency">Salary currency</label>
                  <select id="currency" name="currency" defaultValue="USD">
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                    <option value="INR">INR</option>
                  </select>
                </div>
                <div className="field">
                  <label htmlFor="amount">Expected salary</label>
                  <input
                    id="amount"
                    name="amount"
                    type="number"
                    required
                    min={0}
                  />
                </div>
              </div>
              <div className="field">
                <label htmlFor="linkedInUrl">LinkedIn URL (optional)</label>
                <input id="linkedInUrl" name="linkedInUrl" type="url" />
              </div>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={submitting}
              >
                {submitting ? "Submitting…" : "Submit application"}
              </button>
            </form>
          </>
        )}
      </main>
    </>
  );
}
