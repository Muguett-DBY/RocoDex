import { CSTD_SITE_ORIGIN } from "@/sites/personal-homepage/server";

const CSTD_SITEMAP_URL = `${CSTD_SITE_ORIGIN}/sitemap.xml`;

const AI_RESTRICTED_BOTS = [
  "Amazonbot",
  "Applebot-Extended",
  "Bytespider",
  "CCBot",
  "ClaudeBot",
  "CloudflareBrowserRenderingCrawler",
  "Google-Extended",
  "GPTBot",
  "meta-externalagent",
] as const;

export function buildRobotsTxt() {
  const restrictedBotRules = AI_RESTRICTED_BOTS.map((bot) => `User-agent: ${bot}\nDisallow: /`).join("\n\n");

  return [
    "# Crawler policy for custard.top.",
    "# Search indexing is allowed. AI training is reserved.",
    "",
    "User-agent: *",
    "Content-Signal: search=yes,ai-train=no,use=reference",
    "Allow: /",
    "",
    restrictedBotRules,
    "",
    `Sitemap: ${CSTD_SITEMAP_URL}`,
    "",
  ].join("\n");
}
