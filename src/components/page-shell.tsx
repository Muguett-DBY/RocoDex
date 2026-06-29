import type { ReactNode } from "react";
import { SiteContextBar } from "@/components/site-context-bar";
import { SiteHeader } from "@/components/site-header";
import { isAuthConfigured } from "@/lib/auth-availability";

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <SiteHeader authEnabled={isAuthConfigured()} />
      <SiteContextBar />
      {children}
    </div>
  );
}
