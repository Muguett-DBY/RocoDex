import type { Metadata } from "next";
import { AuthProvider } from "@/components/auth-provider";
import "./globals.css";
import { isAuthConfigured } from "@/lib/auth-availability";

export const metadata: Metadata = {
  title: "洛克图鉴 / RocoDex",
  description: "非官方《洛克王国世界》中文精灵图鉴，收录 347 只精灵并提供搜索、对比、PVP 阵容和技能浏览。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full bg-[#f7f6f1] text-slate-950 dark:bg-slate-950 dark:text-slate-100">
        <AuthProvider enabled={isAuthConfigured()}>{children}</AuthProvider>
      </body>
    </html>
  );
}
