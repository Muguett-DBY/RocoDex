export function resolveDarkThemePreference(stored: string | null, prefersDark: boolean) {
  if (stored === "dark") return true;
  if (stored === "light") return false;
  return prefersDark;
}
