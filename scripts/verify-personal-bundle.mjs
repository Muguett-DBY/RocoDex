import { readFileSync, statSync } from "node:fs";
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
const initialBudget = 290_000;
const webglBudget = 1_250_000;

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
const initialContainsWebgl = initialAssets.some((asset) =>
  readFileSync(assetPath(asset), "utf8").includes("WEBGL_debug_renderer_info"),
);

const loadableManifest = JSON.parse(readFileSync(loadableManifestPath, "utf8"));
const loadableAssets = unique(
  Object.values(loadableManifest).flatMap((entry) => entry.files ?? []),
);
const webglAssets = loadableAssets.filter((asset) => {
  const source = readFileSync(assetPath(asset), "utf8");
  return source.includes("WEBGL_debug_renderer_info") || source.includes("cstd-kinetic-studio-v2");
});
const webglBytes = bytesFor(webglAssets);

if (initialContainsWebgl) {
  throw new Error("Three.js/WebGL code is present in the personal homepage initial entry");
}
if (initialBytes > initialBudget) {
  throw new Error(`Personal homepage initial JS is ${initialBytes} bytes; budget is ${initialBudget}`);
}
if (webglAssets.length === 0) {
  throw new Error("Could not find the personal homepage WebGL async chunk");
}
if (webglAssets.some((asset) => initialAssets.includes(asset))) {
  throw new Error("The personal homepage WebGL chunk is no longer asynchronous");
}
if (webglBytes > webglBudget) {
  throw new Error(`Personal homepage WebGL JS is ${webglBytes} bytes; budget is ${webglBudget}`);
}

console.log(
  `Personal homepage bundle OK: ${initialBytes} initial bytes, ${webglBytes} async WebGL bytes.`,
);
