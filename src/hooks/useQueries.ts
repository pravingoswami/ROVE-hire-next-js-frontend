"use client";

import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/lib/query-keys";
import {
  getCandidate,
  getCandidates,
  getDashboard,
  getInterviews,
  getGoogleMeetIntegration,
  getJob,
  getJobs,
  getPublicJobs,
} from "@/lib/services";

type ListParams = Record<string, string | undefined>;

export function useDashboardQuery() {
  return useQuery({
    queryKey: queryKeys.hr.dashboard,
    queryFn: getDashboard,
  });
}

export function useJobsQuery(params: ListParams = {}) {
  return useQuery({
    queryKey: queryKeys.hr.jobs(params),
    queryFn: () => getJobs(params).then((d) => d.jobs),
  });
}

export function useJobQuery(id: string) {
  return useQuery({
    queryKey: queryKeys.hr.job(id),
    queryFn: () => getJob(id),
    enabled: !!id,
  });
}

export function useCandidatesQuery(params: ListParams = {}) {
  return useQuery({
    queryKey: queryKeys.hr.candidates(params),
    queryFn: () => getCandidates(params).then((d) => d.candidates),
  });
}

export function useCandidateQuery(id: string) {
  return useQuery({
    queryKey: queryKeys.hr.candidate(id),
    queryFn: () => getCandidate(id),
    enabled: !!id,
  });
}

export function useInterviewsQuery(params: ListParams = {}) {
  return useQuery({
    queryKey: queryKeys.hr.interviews(params),
    queryFn: () => getInterviews(params).then((d) => d.interviews),
  });
}

export function useGoogleMeetIntegrationQuery() {
  return useQuery({
    queryKey: ["hr", "google-meet-integration"] as const,
    queryFn: getGoogleMeetIntegration,
    staleTime: 1000 * 60 * 5,
  });
}

export function usePublicJobsQuery(params: ListParams = {}) {
  return useQuery({
    queryKey: queryKeys.public.jobs(params),
    queryFn: () => getPublicJobs(params).then((d) => d.jobs),
  });
}
