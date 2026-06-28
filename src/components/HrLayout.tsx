"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

import { hasToken } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";

const NAV = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/dashboard/jobs", label: "Jobs" },
  { href: "/dashboard/candidates", label: "Candidates" },
  { href: "/dashboard/interviews", label: "Interviews" },
];

function isNavActive(pathname: string, href: string) {
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname.startsWith(href);
}

export function HrLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading, isFetched, logout } = useAuth();

  useEffect(() => {
    if (isFetched && !hasToken()) {
      router.replace("/login");
      return;
    }
    if (isFetched && hasToken() && !user) {
      router.replace("/login");
    }
  }, [isFetched, user, router]);

  async function handleLogout() {
    await logout.mutateAsync();
    router.replace("/login");
  }

  if (isLoading) return <div className="loading">Loading…</div>;
  if (!user) return null;

  return (
    <div className="hr-layout">
      <aside className="hr-sidebar">
        <div className="hr-sidebar-brand">
          <span className="logo-mark" aria-hidden>
            RV
          </span>
          <div>
            <div className="user-name">{user.name}</div>
            <div className="user-role">HR Admin</div>
          </div>
        </div>
        <nav>
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={isNavActive(pathname, item.href) ? "active" : ""}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          style={{ marginTop: "1.5rem", width: "100%" }}
          onClick={handleLogout}
          disabled={logout.isPending}
        >
          Log out
        </button>
      </aside>
      <main className="hr-content">{children}</main>
    </div>
  );
}
