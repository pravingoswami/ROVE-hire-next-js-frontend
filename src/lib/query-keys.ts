export const queryKeys = {
  auth: {
    me: ["auth", "me"] as const,
  },
  hr: {
    dashboard: ["hr", "dashboard"] as const,
    jobs: (params: Record<string, string | undefined>) =>
      ["hr", "jobs", params] as const,
    job: (id: string) => ["hr", "job", id] as const,
    candidates: (params: Record<string, string | undefined>) =>
      ["hr", "candidates", params] as const,
    candidate: (id: string) => ["hr", "candidate", id] as const,
    interviews: (params: Record<string, string | undefined>) =>
      ["hr", "interviews", params] as const,
  },
  public: {
    jobs: (params?: Record<string, string | undefined>) =>
      ["public", "jobs", params ?? {}] as const,
    job: (id: string) => ["public", "job", id] as const,
  },
};
