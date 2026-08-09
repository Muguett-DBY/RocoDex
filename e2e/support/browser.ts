import { expect, type Page } from "@playwright/test";

export function captureBrowserIssues(page: Page) {
  const issues: string[] = [];

  page.on("console", (message) => {
    if (message.type() === "warning" || message.type() === "error") {
      const text = message.text();
      if (text.includes("GL Driver Message") && text.includes("GPU stall due to ReadPixels")) return;
      if (text.includes("You have Reduced Motion enabled on your device")) return;
      if (
        text.includes("/_next/static/css/app/layout.css")
        && text.includes("was preloaded using link preload but not used")
        && message.location().url.startsWith("http://127.0.0.1:")
      ) return;
      const source = message.location().url;
      issues.push(`${message.type()}: ${text}${source ? ` @ ${source}` : ""}`);
    }
  });
  page.on("response", (response) => {
    if (response.status() === 404) issues.push(`response: 404 ${response.url()}`);
  });
  page.on("pageerror", (error) => issues.push(`pageerror: ${error.message}`));

  return issues;
}

export async function expectNoHorizontalOverflow(page: Page) {
  await expect
    .poll(() =>
      page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth),
    )
    .toBe(true);
}
