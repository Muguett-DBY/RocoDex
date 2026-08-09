import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import vm from "node:vm";

const nextRoot = path.resolve(".next");
const routeKey = "/(personal)/cstd/page";
const clientManifestPath = path.join(
  nextRoot,
  "server/app/(personal)/cstd/page_client-reference-manifest.js",
);
const loadableManifestPath = path.join(
  nextRoot,
  "server/app/(personal)/cstd/page/react-loadable-manifest.json",
);
const initialBudget = 150_000;
const webglEntryBudget = 1_000_000;
const liteWebglBudget = 20_000;
const webglBudget = 1_500_000;

function assetPath(asset) {
  return path.join(nextRoot, asset.replace(/^\/_next\//, "").replace(/^_next\//, ""));
}

function unique(items) {
  return [...new Set(items)];
}

function bytesFor(assets) {
  return assets.reduce((total, asset) => total + statSync(assetPath(asset)).size, 0);
}

const sandbox = { globalThis: { __RSC_MANIFEST: {} } };
vm.runInNewContext(readFileSync(clientManifestPath, "utf8"), sandbox, {
  filename: clientManifestPath,
  timeout: 1_000,
});

const routeManifest = sandbox.globalThis.__RSC_MANIFEST[routeKey];
if (!routeManifest?.entryJSFiles) {
  throw new Error(`Missing client entry manifest for ${routeKey}`);
}

const initialAssets = unique(Object.values(routeManifest.entryJSFiles).flat());
const initialBytes = bytesFor(initialAssets);
const initialAssetReport = initialAssets.map((asset) => ({ asset, bytes: statSync(assetPath(asset)).size }));
const initialContainsThree = initialAssets.some((asset) => {
  const source = readFileSync(assetPath(asset), "utf8");
  return source.includes("THREE.WebGLRenderer") || source.includes("@react-three/fiber");
});

const loadableManifest = JSON.parse(readFileSync(loadableManifestPath, "utf8"));
const loadableEntries = Object.values(loadableManifest);
const entryIncludes = (entry, marker) =>
  (entry.files ?? []).some((asset) => readFileSync(assetPath(asset), "utf8").includes(marker));
const webglEntry = loadableEntries.find((entry) => entryIncludes(entry, "THREE.WebGLRenderer"));
const liteWebglEntry = loadableEntries.find((entry) => entryIncludes(entry, "data-cstd-lite-immersive"));
const webglAssets = unique(webglEntry?.files ?? []);
const liteWebglAssets = unique(liteWebglEntry?.files ?? []);
const webglBytes = bytesFor(webglAssets);
const liteWebglBytes = bytesFor(liteWebglAssets);
const highQualityAssets = readdirSync(path.join(nextRoot, "static/chunks"))
  .filter((asset) => asset.endsWith(".js"))
  .map((asset) => `static/chunks/${asset}`)
  .filter((asset) => {
    const source = readFileSync(assetPath(asset), "utf8");
    return source.includes("ChromaticAberration") && source.includes("mipmapBlur");
  });
const highQualityBytes = bytesFor(highQualityAssets);
const fullWebglBytes = webglBytes + highQualityBytes;

if (initialContainsThree) {
  throw new Error("Three.js code is present in the personal homepage initial entry");
}
if (initialBytes > initialBudget) {
  console.error(JSON.stringify({ initialBytes, initialBudget, initialAssets: initialAssetReport }, null, 2));
  throw new Error(`Personal homepage initial JS is ${initialBytes} bytes; budget is ${initialBudget}`);
}
if (webglAssets.length === 0) {
  throw new Error("Could not find the personal homepage WebGL async chunk");
}
if (webglAssets.some((asset) => initialAssets.includes(asset))) {
  throw new Error("The personal homepage WebGL chunk is no longer asynchronous");
}
if (webglBytes > webglEntryBudget) {
  throw new Error(`Personal homepage base WebGL JS is ${webglBytes} bytes; budget is ${webglEntryBudget}`);
}
if (liteWebglAssets.length === 0) {
  throw new Error("Could not find the lightweight WebGL fallback chunk");
}
if (liteWebglAssets.some((asset) => initialAssets.includes(asset) || webglAssets.includes(asset))) {
  throw new Error("The lightweight WebGL fallback is not isolated from initial or full WebGL code");
}
if (liteWebglBytes > liteWebglBudget) {
  throw new Error(`Personal homepage lite WebGL JS is ${liteWebglBytes} bytes; budget is ${liteWebglBudget}`);
}
if (highQualityAssets.length === 0) {
  throw new Error("Could not find the high-quality WebGL postprocessing chunk");
}
if (highQualityAssets.some((asset) => initialAssets.includes(asset) || webglAssets.includes(asset))) {
  throw new Error("High-quality WebGL postprocessing is no longer conditionally loaded");
}
if (fullWebglBytes > webglBudget) {
  throw new Error(`Personal homepage full WebGL JS is ${fullWebglBytes} bytes; budget is ${webglBudget}`);
}

console.log(
  `Personal homepage bundle OK: ${initialBytes} initial bytes, ${liteWebglBytes} lite WebGL bytes, ${webglBytes} base WebGL bytes, ${highQualityBytes} conditional postprocessing bytes, ${fullWebglBytes} full WebGL bytes.`,
);
