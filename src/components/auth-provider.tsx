"use client";

import { usePathname } from "next/navigation";
import { SessionProvider } from "next-auth/react";
import type { ReactNode } from "react";
import { shouldDisableSessionProvider } from "@/lib/auth-provider-routing";

export function AuthProvider({ children, enabled }: { children: ReactNode; enabled: boolean }) {
  const pathname = usePathname();
  const hostname = typeof window === "undefined" ? "" : window.location.hostname;

  if (!enabled || shouldDisableSessionProvider(pathname, hostname)) {
    return <>{children}</>;
  }

  return <SessionProvider>{children}</SessionProvider>;
}
