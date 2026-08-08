import { VercelObservability } from "@/sites/shared/vercel-observability";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full">{children}<VercelObservability /></body>
    </html>
  );
}
