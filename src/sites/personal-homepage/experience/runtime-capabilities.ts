export type CstdRuntimeTier = "full" | "lite" | "image";

export type CstdRuntimeCapabilities = Readonly<{
  tier: CstdRuntimeTier;
  backend: "webgl2" | "webgl" | "image";
  webgpu: boolean;
  hardwareConcurrency: number;
  deviceMemory: number | null;
  dpr: number;
  reason: "no-webgl" | "software-renderer" | "limited-texture" | "limited-device" | "full-capability";
}>;

type RuntimeNavigator = Navigator & { deviceMemory?: number; gpu?: unknown };

const softwareRendererPattern = /swiftshader|llvmpipe|software rasterizer|softpipe/i;

export function detectCstdRuntimeCapabilities(): CstdRuntimeCapabilities {
  const runtimeNavigator = navigator as RuntimeNavigator;
  const hardwareConcurrency = runtimeNavigator.hardwareConcurrency || 4;
  const deviceMemory = typeof runtimeNavigator.deviceMemory === "number" ? runtimeNavigator.deviceMemory : null;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const canvas = document.createElement("canvas");
  const webgl2 = canvas.getContext("webgl2", { powerPreference: "high-performance" });
  const webgl = webgl2 ?? canvas.getContext("webgl", { powerPreference: "high-performance" });

  if (!webgl) {
    return { tier: "image", backend: "image", webgpu: Boolean(runtimeNavigator.gpu), hardwareConcurrency, deviceMemory, dpr, reason: "no-webgl" };
  }

  const debugInfo = webgl.getExtension("WEBGL_debug_renderer_info") as { UNMASKED_RENDERER_WEBGL: number } | null;
  const renderer = String(webgl.getParameter(debugInfo?.UNMASKED_RENDERER_WEBGL ?? webgl.RENDERER));
  const maximumTexture = Number(webgl.getParameter(webgl.MAX_TEXTURE_SIZE));
  webgl.getExtension("WEBGL_lose_context")?.loseContext();

  const base = {
    backend: webgl2 ? "webgl2" as const : "webgl" as const,
    webgpu: Boolean(runtimeNavigator.gpu),
    hardwareConcurrency,
    deviceMemory,
    dpr,
  };
  if (softwareRendererPattern.test(renderer)) return { ...base, tier: "lite", reason: "software-renderer" };
  if (maximumTexture < 8192) return { ...base, tier: "lite", reason: "limited-texture" };
  if (hardwareConcurrency < 4 || (deviceMemory !== null && deviceMemory < 4)) return { ...base, tier: "lite", reason: "limited-device" };
  return { ...base, tier: "full", reason: "full-capability" };
}
