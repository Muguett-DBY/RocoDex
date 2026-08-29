import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";

const contractPath = path.resolve("src/sites/personal-homepage/content/performance-contract.json");
const contract = JSON.parse(readFileSync(contractPath, "utf8"));
const nextConfig = readFileSync(path.resolve("next.config.ts"), "utf8");
const universeRoot = path.resolve("public/cstd-universe");
const universeAssets = readdirSync(universeRoot).filter((name) => name.endsWith(".webp"));
const universeBytes = universeAssets.reduce((total, name) => total + statSync(path.join(universeRoot, name)).size, 0);
const oversizedAsset = universeAssets.find((name) => statSync(path.join(universeRoot, name)).size > contract.budgets.sceneAssetBytes);
const themeRoot = path.resolve("public/cstd-themes");
const themeAssets = readdirSync(themeRoot).filter((name) => name.endsWith(".webp"));
const themeBytes = themeAssets.reduce((total, name) => total + statSync(path.join(themeRoot, name)).size, 0);
const oversizedThemeAsset = themeAssets.find((name) => statSync(path.join(themeRoot, name)).size > contract.budgets.sceneAssetBytes);
const materialRoot = path.resolve("public/cstd-materials");
const materialAssets = readdirSync(materialRoot).filter((name) => name.endsWith(".webp"));
const materialBytes = materialAssets.reduce((total, name) => total + statSync(path.join(materialRoot, name)).size, 0);
const oversizedMaterialAsset = materialAssets.find((name) => statSync(path.join(materialRoot, name)).size > contract.budgets.sceneAssetBytes);
const stageRoot = path.resolve("public/cstd-stage");
const stageAssets = readdirSync(stageRoot).filter((name) => name.endsWith(".webp"));
const stageBytes = stageAssets.reduce((total, name) => total + statSync(path.join(stageRoot, name)).size, 0);
const oversizedStageAsset = stageAssets.find((name) => statSync(path.join(stageRoot, name)).size > contract.budgets.sceneAssetBytes);
const fontRoot = path.resolve("public/fonts/cstd");
const fontAssets = readdirSync(fontRoot).filter((name) => name.endsWith(".woff2"));
const fontBytes = fontAssets.reduce((total, name) => total + statSync(path.join(fontRoot, name)).size, 0);
const oversizedFontAsset = fontAssets.find((name) => statSync(path.join(fontRoot, name)).size > contract.budgets.themeFontFileBytes);

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
if (themeBytes > contract.budgets.themeAssetBytes) {
  throw new Error(`CSTD theme assets total ${themeBytes} bytes; budget is ${contract.budgets.themeAssetBytes}`);
}
if (oversizedThemeAsset) {
  throw new Error(`CSTD theme asset ${oversizedThemeAsset} exceeds ${contract.budgets.sceneAssetBytes} bytes`);
}
if (materialBytes > contract.budgets.themeMaterialAssetBytes) {
  throw new Error(`CSTD theme materials total ${materialBytes} bytes; budget is ${contract.budgets.themeMaterialAssetBytes}`);
}
if (oversizedMaterialAsset) {
  throw new Error(`CSTD theme material ${oversizedMaterialAsset} exceeds ${contract.budgets.sceneAssetBytes} bytes`);
}
if (stageBytes > contract.budgets.stageAssetBytes) {
  throw new Error(`CSTD stage assets total ${stageBytes} bytes; budget is ${contract.budgets.stageAssetBytes}`);
}
if (oversizedStageAsset) {
  throw new Error(`CSTD stage asset ${oversizedStageAsset} exceeds ${contract.budgets.sceneAssetBytes} bytes`);
}
if (fontBytes > contract.budgets.themeFontAssetBytes) {
  throw new Error(`CSTD theme fonts total ${fontBytes} bytes; budget is ${contract.budgets.themeFontAssetBytes}`);
}
if (oversizedFontAsset) {
  throw new Error(`CSTD theme font ${oversizedFontAsset} exceeds ${contract.budgets.themeFontFileBytes} bytes`);
}

console.log(`CSTD performance contract OK: ${universeAssets.length} universe assets / ${universeBytes} bytes, ${stageAssets.length} stage assets / ${stageBytes} bytes, ${themeAssets.length} theme assets / ${themeBytes} bytes, ${materialAssets.length} materials / ${materialBytes} bytes, ${fontAssets.length} fonts / ${fontBytes} bytes, ${contract.delivery.immutableAssetRoots.length} immutable roots.`);
