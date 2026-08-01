import { isPersonalSiteHost } from "@/sites/personal-homepage/server";

const CSTD_SITEMAP_URL = "https://custard.top/sitemap.xml";
const ROCODEX_SITEMAP_URL = "https://rocodex.custard.top/sitemap.xml";

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

export function getRobotsSitemapUrl(host: string) {
  return isPersonalSiteHost(host) ? CSTD_SITEMAP_URL : ROCODEX_SITEMAP_URL;
}

export function buildRobotsTxt(host: string) {
  const restrictedBotRules = AI_RESTRICTED_BOTS.map((bot) => `User-agent: ${bot}\nDisallow: /`).join("\n\n");

  return [
    "# Crawler policy for custard.top and rocodex.custard.top.",
    "# Search indexing is allowed. AI training is reserved.",
    "",
    "User-agent: *",
    "Content-Signal: search=yes,ai-train=no,use=reference",
    "Allow: /",
    "",
    restrictedBotRules,
    "",
    `Sitemap: ${getRobotsSitemapUrl(host)}`,
    "",
  ].join("\n");
}
