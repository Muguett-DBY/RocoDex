"use client";

import { usePathname } from "next/navigation";
import { SessionProvider } from "next-auth/react";
import type { ReactNode } from "react";

export function AuthProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  if (pathname === "/cstd") {
    return <>{children}</>;
  }

  return <SessionProvider>{children}</SessionProvider>;
}
