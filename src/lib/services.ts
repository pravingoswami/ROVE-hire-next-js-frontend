import {
  api,
  buildQuery,
  clearToken,
  getApiUrl,
  getToken,
  setToken,
  ApiRequestError,
} from "./api";
import type {
  ApplyContext,
  Candidate,
  CandidateDetail,
  CompleteInterviewResult,
  DashboardData,
  Document,
  GoogleMeetIntegrationStatus,
  Interview,
  InterviewDetailResult,
  Job,
  ScheduleInterviewResult,
  User,
} from "./types";

export async function login(email: string, password: string) {
  const data = await api<{ token: string; user: User }>("/auth/login", {
    method: "POST",
    body: { email, password },
  });
  setToken(data.token);
  return data.user;
}

export async function logout() {
  try {
    await api("/auth/logout", { method: "POST", auth: true });
  } finally {
    clearToken();
  }
}

export async function getMe() {
  return api<{ user: User }>("/auth/me", { auth: true }).then((d) => d.user);
}

export async function getDashboard() {
  return api<DashboardData>("/dashboard", { auth: true });
}

export async function getPublicJobs(params?: { search?: string; page?: number }) {
  return api<{ jobs: Job[] }>(`/jobs/public${buildQuery(params ?? {})}`);
}

export async function getJobs(params?: {
  status?: string;
  search?: string;
  page?: number;
}) {
  return api<{ jobs: Job[] }>(`/jobs${buildQuery(params ?? {})}`, { auth: true });
}

export async function getJob(id: string) {
  return api<{ job: Job }>(`/jobs/${id}`, { auth: true }).then((d) => d.job);
}

export async function createJob(body: {
  title: string;
  description: string;
  requiredSkills: string[];
  status?: string;
}) {
  return api<{ job: Job }>("/jobs", { method: "POST", body, auth: true }).then(
    (d) => d.job
  );
}

export async function updateJob(
  id: string,
  body: Partial<{ title: string; description: string; requiredSkills: string[]; status: string }>
) {
  return api<{ job: Job }>(`/jobs/${id}`, { method: "PATCH", body, auth: true }).then(
    (d) => d.job
  );
}

export async function deleteJob(id: string) {
  return api<{ message: string }>(`/jobs/${id}`, { method: "DELETE", auth: true });
}

export async function getCandidates(params?: {
  status?: string;
  search?: string;
  jobId?: string;
  page?: number;
}) {
  return api<{ candidates: Candidate[] }>(
    `/candidates${buildQuery(params ?? {})}`,
    { auth: true }
  );
}

export async function getCandidate(id: string) {
  return api<CandidateDetail>(`/candidates/${id}`, { auth: true });
}

export async function addCandidate(form: FormData) {
  return api<{
    candidate: Candidate;
    magicLink: string;
    magicLinkExpiresAt: string;
  }>("/candidates", { method: "POST", body: form, auth: true });
}

export async function updateCandidateStatus(
  id: string,
  body: { status: "hired" | "rejected"; reason?: string }
) {
  return api<{ candidate: Candidate }>(`/candidates/${id}/status`, {
    method: "PATCH",
    body,
    auth: true,
  });
}

export async function getMagicLink(id: string) {
  return api<{ magicLink: string; expiresAt: string }>(
    `/candidates/${id}/magic-link`,
    { auth: true }
  );
}

export async function scheduleInterview(
  candidateId: string,
  body: {
    scheduledAt: string;
    type: string;
    interviewerName: string;
    notes?: string;
    meetLink?: string;
    durationMinutes?: number;
  }
) {
  return api<ScheduleInterviewResult>(`/candidates/${candidateId}/interviews`, {
    method: "POST",
    body,
    auth: true,
  });
}

export async function getInterview(id: string) {
  return api<InterviewDetailResult>(`/interviews/${id}`, { auth: true });
}

export async function getGoogleMeetIntegration() {
  return api<GoogleMeetIntegrationStatus>("/integrations/google-meet", { auth: true });
}

export async function generateOffer(
  candidateId: string,
  body: {
    roleTitle: string;
    salary: { currency: string; amount: number };
    startDate: string;
    reportingManager: string;
    location: string;
  }
) {
  return api<{ documents: Document[] }>(
    `/candidates/${candidateId}/documents/generate`,
    { method: "POST", body, auth: true }
  );
}

export async function getInterviews(params?: {
  status?: string;
  page?: number;
}) {
  return api<{ interviews: Interview[] }>(
    `/interviews${buildQuery(params ?? {})}`,
    { auth: true }
  );
}

export async function completeInterview(
  id: string,
  body: { recommendation: string; note: string }
) {
  return api<CompleteInterviewResult>(`/interviews/${id}/complete`, {
    method: "PATCH",
    body,
    auth: true,
  });
}

export async function downloadDocument(id: string) {
  const token = getToken();
  const res = await fetch(`${getApiUrl()}/documents/${id}/download`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    credentials: "include",
  });

  if (!res.ok) {
    const json = await res.json().catch(() => null);
    throw new ApiRequestError(
      json?.error?.message ?? "Download failed",
      res.status,
      json?.error?.code
    );
  }

  const contentType = res.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    const json = await res.json();
    if (!json.success) {
      throw new ApiRequestError(json.error?.message ?? "Download failed", res.status);
    }
    return json.data as { downloadUrl?: string; document: Document };
  }

  const blob = await res.blob();
  const disposition = res.headers.get("content-disposition") ?? "";
  const match = disposition.match(/filename="([^"]+)"/);
  const fileName = match?.[1] ?? "document.pdf";
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
  return null;
}

export async function getApplyContext(token: string) {
  return api<ApplyContext>(`/apply/${token}`);
}

export async function submitApplication(
  token: string,
  body: {
    phone: string;
    location: string;
    currentRole: string;
    noticePeriod: string;
    salaryExpectation: { currency: string; amount: number };
    linkedInUrl?: string;
  }
) {
  return api<{ message: string }>(`/apply/${token}`, {
    method: "POST",
    body,
  });
}
