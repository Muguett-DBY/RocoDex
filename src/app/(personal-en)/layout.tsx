import { VercelObservability } from "@/sites/shared/vercel-observability";
import { CstdThemeBootstrapScript } from "@/sites/personal-homepage/experience/theme-bootstrap";
import type { Metadata } from "next";
import "../globals.css";
import "../cstd-themes.css";
import "../cstd-theme-compositions.css";
import "../cstd-theme-foundations.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://custard.top"),
};

export default function PersonalEnglishRootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-AU" dir="ltr" className="h-full antialiased" suppressHydrationWarning>
      <head>
        <CstdThemeBootstrapScript />
      </head>
      <body className="min-h-full">
        {children}
        <VercelObservability enabled={process.env.VERCEL === "1"} />
      </body>
    </html>
  );
}
