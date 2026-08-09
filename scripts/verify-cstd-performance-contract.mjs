import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";

const contractPath = path.resolve("src/sites/personal-homepage/content/performance-contract.json");
const contract = JSON.parse(readFileSync(contractPath, "utf8"));
const nextConfig = readFileSync(path.resolve("next.config.ts"), "utf8");
const universeRoot = path.resolve("public/cstd-universe");
const universeAssets = readdirSync(universeRoot).filter((name) => name.endsWith(".webp"));
const universeBytes = universeAssets.reduce((total, name) => total + statSync(path.join(universeRoot, name)).size, 0);
const oversizedAsset = universeAssets.find((name) => statSync(path.join(universeRoot, name)).size > contract.budgets.sceneAssetBytes);

if (contract.cacheComponents.status !== "evaluated-not-enabled") {
  throw new Error("Cache Components status must be explicitly reviewed before changing the static delivery contract");
}
if (nextConfig.includes("cacheComponents:")) {
  throw new Error("next.config enables Cache Components while the published compatibility decision says otherwise");
}
if (contract.delivery.defaultRuntimeTier !== "image" || contract.delivery.enhancedRuntimeTrigger !== "explicit-user-action") {
  throw new Error("The homepage must default to image rendering and require explicit user action before loading a GPU runtime");
}
if (!contract.invariants.includes("homepage-gpu-runtime-requires-explicit-opt-in")) {
  throw new Error("Missing the explicit GPU opt-in performance invariant");
}
for (const root of contract.delivery.immutableAssetRoots) {
  if (!nextConfig.includes(`"${root}"`) || !nextConfig.includes("source: `/${root}/:path*`")) {
    throw new Error(`Missing immutable cache header for /${root}`);
  }
}
if (universeBytes > contract.budgets.universeAssetBytes) {
  throw new Error(`CSTD universe assets total ${universeBytes} bytes; budget is ${contract.budgets.universeAssetBytes}`);
}
if (oversizedAsset) {
  throw new Error(`CSTD scene asset ${oversizedAsset} exceeds ${contract.budgets.sceneAssetBytes} bytes`);
}

console.log(`CSTD performance contract OK: ${universeAssets.length} universe assets, ${universeBytes} bytes, ${contract.delivery.immutableAssetRoots.length} immutable roots.`);
