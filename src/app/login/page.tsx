"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import Avatar from "@mui/material/Avatar";

import { PublicNavbar } from "@/components/layout/PublicNavbar";
import { LoadingState } from "@/components/ui/StateMessage";
import { hasToken } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { softColors } from "@/lib/soft-ui";
import { softUiGradients } from "@/lib/mui-theme";

export default function LoginPage() {
  const router = useRouter();
  const { user, isVerifying, login } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) router.replace("/dashboard");
  }, [user, router]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = new FormData(e.currentTarget);

    try {
      await login.mutateAsync({
        email: String(form.get("email")),
        password: String(form.get("password")),
      });
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    }
  }

  if (isVerifying && hasToken()) {
    return (
      <>
        <PublicNavbar />
        <LoadingState label="Verifying session…" />
      </>
    );
  }

  if (user) return null;

  return (
    <>
      <PublicNavbar />
      <Box
        sx={{
          minHeight: "calc(100vh - 64px)",
          display: "flex",
          alignItems: "center",
          py: 6,
          background: `linear-gradient(180deg, ${softColors.grey[100]} 0%, ${softColors.background} 60%)`,
        }}
      >
        <Container maxWidth="sm">
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <Avatar
              sx={{
                width: 56,
                height: 56,
                mx: "auto",
                mb: 2,
                fontWeight: 700,
                background: softUiGradients.info,
              }}
            >
              RV
            </Avatar>
            <Typography variant="h4" gutterBottom sx={{ color: softColors.dark }}>
              HR Login
            </Typography>
            <Typography color="text.secondary">
              Sign in to manage recruitment and hiring pipeline
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Card>
            <CardContent sx={{ p: 3 }}>
              <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <TextField
                  id="email"
                  name="email"
                  label="Email"
                  type="email"
                  required
                  defaultValue="hr@rovehire.demo"
                />
                <TextField
                  id="password"
                  name="password"
                  label="Password"
                  type="password"
                  required
                  defaultValue="RoveHire2026!"
                />
                <Button type="submit" variant="contained" size="large" disabled={login.isPending}>
                  {login.isPending ? "Signing in…" : "Sign in"}
                </Button>
              </Box>
            </CardContent>
          </Card>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: "center" }}>
            <Link href="/jobs">View public job board</Link>
          </Typography>
        </Container>
      </Box>
    </>
  );
}
