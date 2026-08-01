import { defineConfig, devices } from "@playwright/test";

const port = 3100;
const baseURL = `http://127.0.0.1:${port}`;
const inheritedEnvironment = Object.fromEntries(
  Object.entries(process.env).filter((entry): entry is [string, string] => typeof entry[1] === "string"),
);

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: "line",
  timeout: 45_000,
  expect: { timeout: 10_000 },
  use: {
    baseURL,
    contextOptions: {
      reducedMotion: process.env.CI ? "reduce" : "no-preference",
    },
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "desktop-chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "mobile-chromium",
      use: { ...devices["Pixel 5"] },
    },
  ],
  webServer: {
    command: `npm run dev -- --hostname 127.0.0.1 --port ${port}`,
    url: `${baseURL}/api/auth/session`,
    reuseExistingServer: false,
    timeout: 180_000,
    env: {
      ...inheritedEnvironment,
      AUTH_SECRET: "rocodex-e2e-only-secret-with-sufficient-length",
      AUTH_TRUST_HOST: "true",
      NEXTAUTH_URL: baseURL,
      UPSTASH_REDIS_REST_TOKEN: "",
      UPSTASH_REDIS_REST_URL: "",
      UPSTASH_REDIS_TOKEN: "",
      UPSTASH_REDIS_URL: "",
    },
  },
});
