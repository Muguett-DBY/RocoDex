import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import vm from "node:vm";

if (process.env.VERCEL === "1") {
  console.log("Personal homepage bundle verification is enforced in CI; Vercel owns the finalized chunk output.");
  process.exit(0);
}

const nextRoot = path.resolve(".next");
const performanceContract = JSON.parse(readFileSync(path.resolve("src/sites/personal-homepage/content/performance-contract.json"), "utf8"));
const routeKey = "/(personal)/cstd/page";
const clientManifestPath = path.join(
  nextRoot,
  "server/app/(personal)/cstd/page_client-reference-manifest.js",
);
const loadableManifestPath = path.join(
  nextRoot,
  "server/app/(personal)/cstd/page/react-loadable-manifest.json",
);
const initialBudget = performanceContract.budgets.initialJavascriptBytes;
const startupBudget = performanceContract.budgets.startupJavascriptBytes;
const webglEntryBudget = performanceContract.budgets.baseWebglBytes;
const liteWebglBudget = performanceContract.budgets.liteWebglBytes;
const webglBudget = performanceContract.budgets.fullWebglBytes;
const webgpuBudget = performanceContract.budgets.webgpuBytes;
const originalVisualBudget = performanceContract.budgets.universeAssetBytes;
const originalVisualFileBudget = performanceContract.budgets.sceneAssetBytes;

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
const prerenderedHtmlPath = path.join(nextRoot, "server/app/cstd.html");
if (!existsSync(prerenderedHtmlPath)) {
  throw new Error(`Missing prerendered personal homepage HTML at ${prerenderedHtmlPath}`);
}
const prerenderedHtml = readFileSync(prerenderedHtmlPath, "utf8");
const htmlJavascriptAssets = [...prerenderedHtml.matchAll(/(?:src|href)=["']\/_next\/([^"']+?\.js)(?:\?[^"']*)?["']/g)]
  .map((match) => match[1]);
const startupAssets = unique([...initialAssets, ...htmlJavascriptAssets]);
const startupBytes = bytesFor(startupAssets);
const startupAssetReport = startupAssets.map((asset) => ({ asset, bytes: statSync(assetPath(asset)).size }));
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
const webgpuEntry = loadableEntries.find((entry) => entryIncludes(entry, "data-cstd-webgpu-field"));
const webglAssets = unique(webglEntry?.files ?? []);
const liteWebglAssets = unique(liteWebglEntry?.files ?? []);
const webglBytes = bytesFor(webglAssets);
const liteWebglBytes = bytesFor(liteWebglAssets);
const webgpuAssets = unique(webgpuEntry?.files ?? []);
const webgpuBytes = bytesFor(webgpuAssets);
const highQualityAssets = readdirSync(path.join(nextRoot, "static/chunks"))
  .filter((asset) => asset.endsWith(".js"))
  .map((asset) => `static/chunks/${asset}`)
  .filter((asset) => {
    const source = readFileSync(assetPath(asset), "utf8");
    return source.includes("ChromaticAberration") && source.includes("mipmapBlur");
  });
const highQualityBytes = bytesFor(highQualityAssets);
const fullWebglBytes = webglBytes + highQualityBytes;
const originalVisuals = readdirSync(path.resolve("public/cstd-universe"))
  .filter((asset) => asset.endsWith(".webp"))
  .map((asset) => `public/cstd-universe/${asset}`);
const originalVisualBytes = originalVisuals.reduce((total, asset) => total + statSync(path.resolve(asset)).size, 0);
const oversizedOriginalVisual = originalVisuals.find((asset) => statSync(path.resolve(asset)).size > originalVisualFileBudget);

if (initialContainsThree) {
  throw new Error("Three.js code is present in the personal homepage initial entry");
}
if (initialBytes > initialBudget) {
  console.error(JSON.stringify({ initialBytes, initialBudget, initialAssets: initialAssetReport }, null, 2));
  throw new Error(`Personal homepage initial JS is ${initialBytes} bytes; budget is ${initialBudget}`);
}
if (startupBytes > startupBudget) {
  console.error(JSON.stringify({ startupBytes, startupBudget, startupAssets: startupAssetReport }, null, 2));
  throw new Error(`Personal homepage eager startup JS is ${startupBytes} bytes; budget is ${startupBudget}`);
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
if (webgpuAssets.length === 0) {
  throw new Error("Could not find the optional WebGPU signal-field chunk");
}
if (webgpuAssets.some((asset) => initialAssets.includes(asset) || webglAssets.includes(asset))) {
  throw new Error("The WebGPU signal field is not isolated from initial or WebGL code");
}
if (webgpuBytes > webgpuBudget) {
  throw new Error(`Personal homepage WebGPU JS is ${webgpuBytes} bytes; budget is ${webgpuBudget}`);
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
if (originalVisualBytes > originalVisualBudget) {
  throw new Error(`CSTD 17.0 universe visuals total ${originalVisualBytes} bytes; budget is ${originalVisualBudget}`);
}
if (oversizedOriginalVisual) {
  throw new Error(`CSTD 17.0 universe visual ${oversizedOriginalVisual} exceeds ${originalVisualFileBudget} bytes`);
}

console.log(
  `Personal homepage bundle OK: ${initialBytes} entry bytes, ${startupBytes} eager startup bytes, ${liteWebglBytes} lite WebGL bytes, ${webgpuBytes} WebGPU bytes, ${webglBytes} base WebGL bytes, ${highQualityBytes} conditional postprocessing bytes, ${fullWebglBytes} full WebGL bytes, ${originalVisualBytes} original visual bytes.`,
);
