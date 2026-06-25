"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { resolveDarkThemePreference } from "@/lib/theme-preference";

function readPreferredDarkTheme() {
  const stored = window.localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  return resolveDarkThemePreference(stored, prefersDark);
}

const THEME_CHANGE_EVENT = "rocodex:theme-change";

function subscribeToThemePreference(onStoreChange: () => void) {
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  const handleChange = () => onStoreChange();
  window.addEventListener("storage", handleChange);
  window.addEventListener(THEME_CHANGE_EVENT, handleChange);
  media.addEventListener("change", handleChange);
  return () => {
    window.removeEventListener("storage", handleChange);
    window.removeEventListener(THEME_CHANGE_EVENT, handleChange);
    media.removeEventListener("change", handleChange);
  };
}

export function ThemeToggle() {
  const dark = useSyncExternalStore(subscribeToThemePreference, readPreferredDarkTheme, () => false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  const toggle = useCallback(() => {
    const next = !readPreferredDarkTheme();
    localStorage.setItem("theme", next ? "dark" : "light");
    document.documentElement.classList.toggle("dark", next);
    window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
  }, []);

  return (
    <Button type="button" variant="ghost" className="h-9 w-9 p-0" onClick={toggle} aria-label={dark ? "切换到亮色模式" : "切换到暗色模式"}>
      {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  );
}
