export type UserRole = "hr_admin";

export type JobStatus = "open" | "closed";

export type CandidateStatus =
  | "applied"
  | "form_submitted"
  | "interview_scheduled"
  | "offer_sent"
  | "hired"
  | "rejected";

export type InterviewType = "screening" | "technical";
export type InterviewStatus = "scheduled" | "completed";
export type InterviewRecommendation = "hire" | "no_hire" | "maybe";
export type DocumentType = "resume" | "offer_letter" | "nda";

export interface ApiMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiSuccess<T> {
  success: true;
  data: T;
  meta?: ApiMeta;
}

export interface ApiError {
  success: false;
  error: { message: string; code?: string; details?: unknown };
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export interface Job {
  _id: string;
  title: string;
  description: string;
  requiredSkills: string[];
  status: JobStatus;
  candidateCount?: number;
  createdAt: string;
  updatedAt?: string;
}

export interface Salary {
  currency: string;
  amount: number;
}

export interface Candidate {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  currentRole?: string;
  noticePeriod?: string;
  salaryExpectation?: Salary;
  linkedInUrl?: string;
  jobId: string | Job;
  status: CandidateStatus;
  lastActivityAt: string;
  rejectionReason?: string;
  hiredAt?: string;
  rejectedAt?: string;
  createdAt?: string;
}

export interface Interview {
  _id: string;
  candidateId: string | Candidate;
  scheduledAt: string;
  type: InterviewType;
  interviewerName: string;
  notes?: string;
  meetLink?: string;
  googleCalendarEventId?: string;
  status: InterviewStatus;
  feedback?: {
    recommendation: InterviewRecommendation;
    note: string;
    recordedAt: string;
  };
}

export interface GoogleMeetIntegrationMeta {
  configured: boolean;
  meetLinkGenerated?: boolean;
  calendarId?: string | null;
}

export interface GoogleMeetIntegrationStatus {
  configured: boolean;
  provider: string;
  features: {
    autoMeetLinkOnSchedule: boolean;
    calendarInvites: boolean;
  };
  setupSteps: { step: number; title: string; description: string; link?: string }[];
  envVars: string[];
}

export interface Document {
  _id: string;
  candidateId: string;
  type: DocumentType;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  generatedAt: string;
}

export interface TimelineEvent {
  _id: string;
  type: string;
  title: string;
  description?: string;
  createdAt: string;
  actorType: string;
}

export interface DashboardData {
  overview: {
    totalCandidates: number;
    totalJobs: number;
    openJobs: number;
    closedJobs: number;
    upcomingInterviews: number;
    pendingApplications: number;
    activePipeline: number;
    offersPending: number;
    hiredCount: number;
    rejectedCount: number;
  };
  candidatesByStatus: Record<CandidateStatus, number>;
  pipelineStages: { key: CandidateStatus; label: string; count: number }[];
  recentCandidates: Candidate[];
  system: { database: string; storage: string };
}

export interface CandidateDetail {
  candidate: Candidate;
  timeline: TimelineEvent[];
  interviews: Interview[];
  documents: Document[];
  statusLabel: string;
}

export interface ScheduleInterviewResult {
  interview: Interview;
  candidate: Candidate;
  googleMeetIntegration: GoogleMeetIntegrationMeta;
}

export interface InterviewDetailResult {
  interview: Interview;
  googleMeetIntegration: GoogleMeetIntegrationMeta;
}

export interface CompleteInterviewResult {
  interview: Interview;
  candidate?: Candidate;
}

export interface ApplyContext {
  candidate: { name: string; email: string; status: CandidateStatus; statusLabel: string };
  job: { title: string; description: string; status: JobStatus };
}
