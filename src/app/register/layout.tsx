import type { ReactNode } from "react";
import { AuthUnavailable } from "@/components/auth-unavailable";
import { isAuthConfigured } from "@/lib/auth-availability";

export default function RegisterLayout({ children }: { children: ReactNode }) {
  return isAuthConfigured() ? children : <AuthUnavailable />;
}
