import { VercelObservability } from "@/sites/shared/vercel-observability";
import { CstdThemeBootstrapScript } from "@/sites/personal-homepage";
import type { Metadata } from "next";
import "../globals.css";
import "../cstd-themes.css";
import "../cstd-theme-compositions.css";
import "../cstd-theme-foundations.css";
import "../cstd-studio-stage.css";
import "../cstd-theme-underworld.css";
import "../cstd-theme-astral.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://custard.top"),
};

export default function PersonalChineseRootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN" dir="ltr" className="h-full antialiased" suppressHydrationWarning>
      <head>
        <CstdThemeBootstrapScript locale="zh" />
      </head>
      <body className="min-h-full">
        {children}
        <VercelObservability enabled={process.env.VERCEL === "1"} />
      </body>
    </html>
  );
}
