export function isAuthConfigured(environment: Record<string, string | undefined> = process.env as Record<string, string | undefined>) {
  return [environment.AUTH_SECRET, environment.NEXTAUTH_SECRET].some((value) => Boolean(value?.trim()));
}
