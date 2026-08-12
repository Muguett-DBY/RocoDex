import { VercelObservability } from "@/sites/shared/vercel-observability";
import type { Metadata } from "next";
import "./globals.css";
import "./cstd-themes.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://rocodex.custard.top"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full">{children}<VercelObservability enabled={process.env.VERCEL === "1"} /></body>
    </html>
  );
}
