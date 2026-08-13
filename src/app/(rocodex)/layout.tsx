import { AuthProvider } from "@/components/auth-provider";
import { isAuthConfigured } from "@/lib/auth-availability";
import { rocodexMetadata } from "@/sites/rocodex/metadata";
import { VercelObservability } from "@/sites/shared/vercel-observability";
import "../globals.css";
import "../cstd-themes.css";
import "../cstd-theme-compositions.css";

export const metadata = {
  metadataBase: new URL("https://rocodex.custard.top"),
  ...rocodexMetadata,
};

export default function RocoDexLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN" dir="ltr" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full">
        <AuthProvider enabled={isAuthConfigured()}>
          <div className="min-h-screen bg-[#f7f6f1] text-slate-950 dark:bg-slate-950 dark:text-slate-100">
            {children}
          </div>
        </AuthProvider>
        <VercelObservability enabled={process.env.VERCEL === "1"} />
      </body>
    </html>
  );
}
