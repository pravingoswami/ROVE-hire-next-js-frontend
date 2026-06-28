"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import AppBar from "@mui/material/AppBar";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import DashboardIcon from "@mui/icons-material/Dashboard";
import WorkIcon from "@mui/icons-material/Work";
import PeopleIcon from "@mui/icons-material/People";
import EventIcon from "@mui/icons-material/Event";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";

import { hasToken } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { LoadingState } from "@/components/ui/StateMessage";
import { softColors, softShadow, pxToRem } from "@/lib/soft-ui";
import { softUiGradients } from "@/lib/mui-theme";

const DRAWER_WIDTH = 250;

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: DashboardIcon },
  { href: "/dashboard/jobs", label: "Jobs", icon: WorkIcon },
  { href: "/dashboard/candidates", label: "Candidates", icon: PeopleIcon },
  { href: "/dashboard/interviews", label: "Interviews", icon: EventIcon },
];

function isNavActive(pathname: string, href: string) {
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname.startsWith(href);
}

function NavItem({
  href,
  label,
  icon: Icon,
  active,
  onNavigate,
}: {
  href: string;
  label: string;
  icon: typeof DashboardIcon;
  active: boolean;
  onNavigate?: () => void;
}) {
  return (
    <ListItemButton
      component={Link}
      href={href}
      onClick={onNavigate}
      sx={{
        borderRadius: pxToRem(8),
        mx: 2,
        mb: 0.5,
        py: pxToRem(10.8),
        px: pxToRem(12.8),
        bgcolor: active ? softColors.white : "transparent",
        color: active ? softColors.dark : softColors.text,
        boxShadow: active ? softShadow.xxl : "none",
        transition: "box-shadow 150ms ease-in-out",
        "&:hover": {
          bgcolor: active ? softColors.white : "transparent",
        },
      }}
    >
      <ListItemIcon sx={{ minWidth: pxToRem(44) }}>
        <Box
          sx={{
            width: pxToRem(32),
            height: pxToRem(32),
            borderRadius: pxToRem(8),
            display: "grid",
            placeItems: "center",
            bgcolor: active ? softColors.info : softColors.light,
            color: active ? softColors.white : softColors.dark,
            boxShadow: softShadow.md,
          }}
        >
          <Icon sx={{ fontSize: pxToRem(16) }} />
        </Box>
      </ListItemIcon>
      <ListItemText
        primary={label}
        slotProps={{
          primary: {
            sx: {
              fontWeight: active ? 500 : 400,
              fontSize: pxToRem(14),
              color: active ? softColors.dark : softColors.text,
            },
          },
        }}
      />
    </ListItemButton>
  );
}

function SidebarContent({
  pathname,
  userName,
  onLogout,
  logoutPending,
  onNavigate,
}: {
  pathname: string;
  userName: string;
  onLogout: () => void;
  logoutPending: boolean;
  onNavigate?: () => void;
}) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Box sx={{ px: 2.5, py: 2.5, textAlign: "center" }}>
        <Box sx={{ display: "inline-flex", alignItems: "center", gap: 1.25 }}>
          <Avatar
            sx={{
              width: 36,
              height: 36,
              fontSize: "0.75rem",
              fontWeight: 700,
              background: softUiGradients.info,
            }}
          >
            RV
          </Avatar>
          <Typography variant="h6" sx={{ fontWeight: 700, color: softColors.dark }}>
            ROVE Hire
          </Typography>
        </Box>
      </Box>

      <Divider />

      <Box sx={{ px: 2, py: 2 }}>
        <Box
          sx={{
            p: 1.5,
            borderRadius: pxToRem(8),
            bgcolor: softColors.grey[100],
            border: `1px solid ${softColors.light}`,
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 500, color: softColors.dark }}>
            {userName}
          </Typography>
          <Typography
            variant="caption"
            sx={{ textTransform: "uppercase", letterSpacing: "0.06em", color: softColors.text }}
          >
            HR Admin
          </Typography>
        </Box>
      </Box>

      <List sx={{ flex: 1, px: 0.5 }}>
        {NAV.map((item) => (
          <NavItem
            key={item.href}
            {...item}
            active={isNavActive(pathname, item.href)}
            onNavigate={onNavigate}
          />
        ))}
      </List>

      <Box sx={{ px: 2, pb: 2.5, pt: 1 }}>
        <Button
          fullWidth
          variant="outlined"
          color="inherit"
          startIcon={<LogoutIcon />}
          onClick={onLogout}
          disabled={logoutPending}
          sx={{ py: 1.25, px: 2 }}
        >
          Log out
        </Button>
      </Box>
    </Box>
  );
}

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading, isFetched, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (isFetched && !hasToken()) router.replace("/login");
    else if (isFetched && hasToken() && !user && !isLoading) router.replace("/login");
  }, [isFetched, user, isLoading, router]);

  async function handleLogout() {
    await logout.mutateAsync();
    router.replace("/login");
  }

  if (isLoading && hasToken()) return <LoadingState label="Loading workspace…" />;
  if (!user) return null;

  const pageTitle =
    NAV.find((n) => isNavActive(pathname, n.href))?.label ?? "Dashboard";

  const drawer = (
    <SidebarContent
      pathname={pathname}
      userName={user.name}
      onLogout={handleLogout}
      logoutPending={logout.isPending}
      onNavigate={() => setMobileOpen(false)}
    />
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", xl: "none" },
          "& .MuiDrawer-paper": { width: DRAWER_WIDTH, boxSizing: "border-box" },
        }}
      >
        {drawer}
      </Drawer>

      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", xl: "block" },
          width: DRAWER_WIDTH + 16,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: DRAWER_WIDTH,
            boxSizing: "border-box",
            position: "fixed",
            top: pxToRem(16),
            left: pxToRem(16),
            height: `calc(100vh - ${pxToRem(32)})`,
            overflowY: "auto",
            margin: 0,
          },
        }}
        open
      >
        {drawer}
      </Drawer>

      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
        }}
      >
        <AppBar position="sticky">
          <Toolbar sx={{ gap: 1, px: { xs: 2, md: 3 }, minHeight: 64 }}>
            <IconButton
              edge="start"
              onClick={() => setMobileOpen(true)}
              sx={{ display: { xl: "none" } }}
            >
              <MenuIcon />
            </IconButton>
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="caption"
                sx={{ textTransform: "uppercase", letterSpacing: "0.08em", color: softColors.text }}
              >
                HR Portal
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700, color: softColors.dark }}>
                {pageTitle}
              </Typography>
            </Box>
            <Button component={Link} href="/jobs" variant="text" color="inherit" size="small">
              Public jobs
            </Button>
          </Toolbar>
        </AppBar>

        <Box component="main" sx={{ flex: 1, p: { xs: 2, md: 3 } }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
