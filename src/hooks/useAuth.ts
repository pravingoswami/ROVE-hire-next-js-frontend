"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import { clearToken, hasToken } from "@/lib/api";
import { queryKeys } from "@/lib/query-keys";
import { getMe, login, logout } from "@/lib/services";
import type { User } from "@/lib/types";

export function useAuth() {
  const queryClient = useQueryClient();
  const [tokenReady, setTokenReady] = useState(false);

  useEffect(() => {
    setTokenReady(true);
  }, []);

  const meQuery = useQuery({
    queryKey: queryKeys.auth.me,
    queryFn: getMe,
    enabled: tokenReady && hasToken(),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  useEffect(() => {
    if (meQuery.isError) {
      clearToken();
      queryClient.removeQueries({ queryKey: queryKeys.auth.me });
    }
  }, [meQuery.isError, queryClient]);

  const loginMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      login(email, password),
    onSuccess: (user) => {
      queryClient.setQueryData<User>(queryKeys.auth.me, user);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSettled: () => {
      clearToken();
      queryClient.removeQueries({ queryKey: queryKeys.auth.me });
      queryClient.removeQueries({ queryKey: ["hr"] });
    },
  });

  return {
    user: meQuery.data ?? null,
    isAuthenticated: !!meQuery.data,
    isLoading:
      !tokenReady ||
      (hasToken() && meQuery.isLoading && !meQuery.isError),
    isVerifying: hasToken() && meQuery.isLoading && !meQuery.isError,
    isFetched: meQuery.isFetched,
    login: loginMutation,
    logout: logoutMutation,
  };
}
