import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ROVE Hire",
  description: "Internal recruitment platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
