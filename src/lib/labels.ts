import type { CandidateStatus, InterviewStatus, JobStatus } from "./types";

export const STATUS_LABELS: Record<CandidateStatus, string> = {
  applied: "Applied",
  form_submitted: "Form Submitted",
  interview_scheduled: "Interview Scheduled",
  offer_sent: "Offer Sent",
  hired: "Hired",
  rejected: "Rejected",
};

export const JOB_STATUS_LABELS: Record<JobStatus, string> = {
  open: "Open",
  closed: "Closed",
};

export const INTERVIEW_STATUS_LABELS: Record<InterviewStatus, string> = {
  scheduled: "Scheduled",
  completed: "Completed",
};

export function jobTitle(jobId: string | { title: string }): string {
  return typeof jobId === "string" ? "—" : jobId.title;
}

export function candidateName(
  candidateId: string | { name: string }
): string {
  return typeof candidateId === "string" ? "—" : candidateId.name;
}
