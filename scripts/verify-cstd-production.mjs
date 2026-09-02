import { readFileSync } from "node:fs";
import path from "node:path";

const origin = (process.env.CSTD_ORIGIN ?? "https://custard.top").replace(/\/$/, "");
const timeoutMs = 15_000;
const performanceContract = JSON.parse(
  readFileSync(path.resolve("src/sites/personal-homepage/content/performance-contract.json"), "utf8"),
);

async function get(path) {
  const response = await fetch(`${origin}${path}`, {
    redirect: "follow",
    headers: { "user-agent": "CSTD-production-smoke/1.0" },
    signal: AbortSignal.timeout(timeoutMs),
  });
  if (!response.ok) throw new Error(`${path} returned ${response.status}`);
  return response;
}

const htmlSurfaces = [
  { path: "/", language: "zh-CN", marker: "奶黄包" },
  { path: "/topics", language: "zh-CN", marker: "CSTD" },
  { path: "/lab/proof-museum", language: "zh-CN", marker: "CSTD" },
  { path: "/voxel", language: "zh-CN", marker: "作品城 77" },
  { path: "/en", language: "en-AU", marker: "Custard" },
  { path: "/en/notes/host-boundaries-in-one-next-deployment", language: "en-AU", marker: "Next.js" },
  { path: "/en/for/research", language: "en-AU", marker: "Research" },
  { path: "/en/voxel", language: "en-AU", marker: "PORTFOLIO//CITY 77" },
];
const htmlResponses = new Map();
for (const { path, language, marker } of htmlSurfaces) {
  const response = await get(path);
  const body = await response.text();
  if (!response.headers.get("content-type")?.includes("text/html")) throw new Error(`${path} is not HTML`);
  if (response.headers.get("content-language") !== language) throw new Error(`${path} has the wrong Content-Language`);
  if (!new RegExp(`<html[^>]*\\blang=["']${language}["']`, "i").test(body)) throw new Error(`${path} has the wrong server-rendered html lang`);
  if (!body.includes(marker)) throw new Error(`${path} is missing the expected localized identity`);
  htmlResponses.set(path, response);
}

const homepage = htmlResponses.get("/");
const requiredHeaders = {
  "content-security-policy": "frame-ancestors 'none'",
  "strict-transport-security": "max-age=63072000",
  "x-content-type-options": "nosniff",
  "x-frame-options": "DENY",
  "origin-agent-cluster": "?1",
  "x-download-options": "noopen",
};
for (const [name, marker] of Object.entries(requiredHeaders)) {
  const value = homepage.headers.get(name) ?? "";
  if (!value.includes(marker)) throw new Error(`Missing ${name} marker: ${marker}`);
}

const jsonEndpoints = ["/proof.json", "/graph.json", "/status.json", "/studio.json", "/observatory.json", "/content-health.json", "/performance.json", "/experience.json", "/releases.json", "/topics.json"];
const payloads = {};
for (const path of jsonEndpoints) {
  const response = await get(path);
  if (!response.headers.get("content-type")?.includes("application/json")) throw new Error(`${path} is not JSON`);
  payloads[path] = await response.json();
}

if (payloads["/proof.json"].release !== "CSTD-17.0") throw new Error("Proof manifest release is not CSTD-17.0");
if (payloads["/studio.json"].provenance?.contract !== "cstd.studio-snapshot/v3") throw new Error("Studio provenance contract is missing");
if (!/^fnv1a32:[a-f0-9]{8}$/.test(payloads["/studio.json"].provenance?.digest ?? "")) throw new Error("Studio digest is invalid");
if (payloads["/topics.json"].entries?.length !== 5) throw new Error("Topic manifest does not contain five paths");
if (payloads["/observatory.json"].provenance?.contract !== "cstd.engineering-observatory/v2") throw new Error("Engineering observatory contract is missing");
if (payloads["/observatory.json"].verification?.length !== 4) throw new Error("Engineering observatory gates are incomplete");
if (payloads["/content-health.json"].score !== 100) throw new Error("Published content health is not 100");
for (const [name, expected] of Object.entries(performanceContract.budgets)) {
  const actual = payloads["/performance.json"].budgets?.[name];
  if (actual !== expected) throw new Error(`Performance budget ${name} is ${actual}; expected ${expected}`);
}
if (payloads["/performance.json"].cacheComponents?.status !== "evaluated-not-enabled") throw new Error("Cache Components decision is missing");
if (payloads["/experience.json"].schemaVersion !== 2 || payloads["/experience.json"].acts?.length !== 5) throw new Error("Experience contract does not contain the five-act stage");
if (payloads["/experience.json"].identity?.zh !== "奶黄包") throw new Error("Experience contract identity is invalid");

const security = await get("/.well-known/security.txt");
if (!(await security.text()).includes("Contact: mailto:cstd@custard.top")) throw new Error("security.txt is missing the contact method");
const manifest = await get("/manifest.webmanifest");
if (!manifest.headers.get("content-type")?.includes("application/manifest+json")) throw new Error("Web manifest content type is invalid");
if (manifest.headers.get("content-language") !== "zh-CN") throw new Error("Chinese web manifest language header is invalid");
const manifestPayload = await manifest.json();
if (manifestPayload.short_name !== "奶黄包" || manifestPayload.lang !== "zh-CN" || manifestPayload.start_url !== "/") throw new Error("Chinese web manifest identity is invalid");

const englishManifest = await get("/en/manifest.webmanifest");
if (!englishManifest.headers.get("content-type")?.includes("application/manifest+json")) throw new Error("English web manifest content type is invalid");
if (englishManifest.headers.get("content-language") !== "en-AU") throw new Error("English web manifest language header is invalid");
const englishManifestPayload = await englishManifest.json();
if (englishManifestPayload.short_name !== "Custard" || englishManifestPayload.lang !== "en-AU" || englishManifestPayload.start_url !== "/en") throw new Error("English web manifest identity is invalid");

const englishFeed = await get("/en/feed.json");
if (englishFeed.headers.get("content-language") !== "en-AU") throw new Error("English JSON Feed language header is invalid");
const englishFeedPayload = await englishFeed.json();
if (englishFeedPayload.language !== "en-AU" || englishFeedPayload.feed_url !== `${origin}/en/feed.json`) throw new Error("English JSON Feed identity is invalid");

const sitemap = await get("/sitemap.xml");
const sitemapBody = await sitemap.text();
if (!sitemapBody.includes('hreflang="zh-CN"') || !sitemapBody.includes('hreflang="en-AU"') || !sitemapBody.includes('hreflang="x-default"')) throw new Error("Sitemap locale alternates are incomplete");

const worker = await get("/cstd-case-worker.js");
if (!(await worker.text()).includes('"crm-lock"')) throw new Error("Production Worker is missing the CRM lock capsule");

console.log(`CSTD production smoke OK: ${origin}, ${htmlSurfaces.length} bilingual HTML surfaces, ${jsonEndpoints.length} public contracts, localized manifests/feed/sitemap, 5 experience acts, 5 topics, 4 proof capsules, content health 100.`);
