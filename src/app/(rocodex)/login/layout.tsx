import type { ReactNode } from "react";
import { AuthUnavailable } from "@/components/auth-unavailable";
import { isAuthConfigured } from "@/lib/auth-availability";

export const dynamic = "force-dynamic";

export default function LoginLayout({ children }: { children: ReactNode }) {
  return isAuthConfigured() ? children : <AuthUnavailable />;
}
