import { rocodexMetadata } from "@/sites/rocodex/metadata";
import "@/app/globals.css";
import "@/app/cstd-themes.css";
import "@/app/cstd-theme-compositions.css";

export const metadata = {
  metadataBase: new URL("https://rocodex.custard.top"),
  ...rocodexMetadata,
};

export default function RocoDexLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN" dir="ltr" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full">
          <div className="min-h-screen bg-[#f7f6f1] text-slate-950 dark:bg-slate-950 dark:text-slate-100">
            {children}
          </div>
      </body>
    </html>
  );
}
