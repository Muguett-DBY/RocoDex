const origin = (process.env.CSTD_ORIGIN ?? "https://custard.top").replace(/\/$/, "");
const timeoutMs = 15_000;

async function get(path) {
  const response = await fetch(`${origin}${path}`, {
    redirect: "follow",
    headers: { "user-agent": "CSTD-production-smoke/1.0" },
    signal: AbortSignal.timeout(timeoutMs),
  });
  if (!response.ok) throw new Error(`${path} returned ${response.status}`);
  return response;
}

for (const path of ["/", "/topics", "/lab/proof-museum"]) {
  const response = await get(path);
  const body = await response.text();
  if (!response.headers.get("content-type")?.includes("text/html")) throw new Error(`${path} is not HTML`);
  if (!body.includes("CSTD")) throw new Error(`${path} is missing the CSTD identity`);
}

const homepage = await get("/");
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

const jsonEndpoints = ["/proof.json", "/graph.json", "/status.json", "/studio.json", "/observatory.json", "/content-health.json", "/releases.json", "/topics.json"];
const payloads = {};
for (const path of jsonEndpoints) {
  const response = await get(path);
  if (!response.headers.get("content-type")?.includes("application/json")) throw new Error(`${path} is not JSON`);
  payloads[path] = await response.json();
}

if (payloads["/proof.json"].release !== "CSTD-9.0") throw new Error("Proof manifest release is not CSTD-9.0");
if (payloads["/studio.json"].provenance?.contract !== "cstd.studio-snapshot/v3") throw new Error("Studio provenance contract is missing");
if (!/^fnv1a32:[a-f0-9]{8}$/.test(payloads["/studio.json"].provenance?.digest ?? "")) throw new Error("Studio digest is invalid");
if (payloads["/topics.json"].entries?.length !== 5) throw new Error("Topic manifest does not contain five paths");
if (payloads["/observatory.json"].provenance?.contract !== "cstd.engineering-observatory/v1") throw new Error("Engineering observatory contract is missing");
if (payloads["/observatory.json"].verification?.length !== 4) throw new Error("Engineering observatory gates are incomplete");
if (payloads["/content-health.json"].score !== 100) throw new Error("Published content health is not 100");

const security = await get("/.well-known/security.txt");
if (!(await security.text()).includes("Contact: mailto:cstd@custard.top")) throw new Error("security.txt is missing the contact method");
const manifest = await get("/manifest.webmanifest");
if (!manifest.headers.get("content-type")?.includes("application/manifest+json")) throw new Error("Web manifest content type is invalid");
if ((await manifest.json()).short_name !== "CSTD") throw new Error("Web manifest identity is invalid");

const worker = await get("/cstd-case-worker.js");
if (!(await worker.text()).includes('"crm-lock"')) throw new Error("Production Worker is missing the CRM lock capsule");

console.log(`CSTD production smoke OK: ${origin}, ${jsonEndpoints.length} evidence endpoints, 5 topics, 4 proof capsules, content health 100.`);
