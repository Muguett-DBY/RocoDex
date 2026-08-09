export type CstdRuntimeTier = "full" | "lite" | "image";

export type CstdRuntimeReason =
  | "no-webgl"
  | "data-saver"
  | "constrained-network"
  | "software-renderer"
  | "limited-texture"
  | "limited-device"
  | "dense-display"
  | "full-capability";

export type CstdRuntimeCapabilities = Readonly<{
  tier: CstdRuntimeTier;
  backend: "webgl2" | "webgl" | "image";
  webgpu: boolean;
  hardwareConcurrency: number;
  deviceMemory: number | null;
  dpr: number;
  viewportPixels: number;
  saveData: boolean;
  effectiveType: string | null;
  reason: CstdRuntimeReason;
}>;

export type CstdRuntimeProbe = Omit<CstdRuntimeCapabilities, "tier" | "reason"> & Readonly<{
  renderer: string;
  maximumTexture: number;
}>;

type RuntimeConnection = Readonly<{ saveData?: boolean; effectiveType?: string }>;
type RuntimeNavigator = Navigator & { deviceMemory?: number; gpu?: unknown; connection?: RuntimeConnection };

const softwareRendererPattern = /swiftshader|llvmpipe|software rasterizer|softpipe/i;

export function selectCstdRuntimeTier(probe: CstdRuntimeProbe): CstdRuntimeCapabilities {
  const { renderer, maximumTexture, ...capabilities } = probe;
  if (probe.backend === "image") return { ...capabilities, tier: "image", reason: "no-webgl" };
  if (probe.saveData) return { ...capabilities, tier: "lite", reason: "data-saver" };
  if (probe.effectiveType === "slow-2g" || probe.effectiveType === "2g") {
    return { ...capabilities, tier: "lite", reason: "constrained-network" };
  }
  if (softwareRendererPattern.test(renderer)) return { ...capabilities, tier: "lite", reason: "software-renderer" };
  if (maximumTexture < 8192) return { ...capabilities, tier: "lite", reason: "limited-texture" };
  if (probe.hardwareConcurrency < 4 || (probe.deviceMemory !== null && probe.deviceMemory < 4)) {
    return { ...capabilities, tier: "lite", reason: "limited-device" };
  }
  const constrainedDenseDisplay = probe.viewportPixels > 5_000_000
    && probe.dpr > 1.5
    && (probe.hardwareConcurrency < 8 || (probe.deviceMemory !== null && probe.deviceMemory < 8));
  if (constrainedDenseDisplay) return { ...capabilities, tier: "lite", reason: "dense-display" };
  return { ...capabilities, tier: "full", reason: "full-capability" };
}

export function detectCstdRuntimeCapabilities(): CstdRuntimeCapabilities {
  const runtimeNavigator = navigator as RuntimeNavigator;
  const hardwareConcurrency = runtimeNavigator.hardwareConcurrency || 4;
  const deviceMemory = typeof runtimeNavigator.deviceMemory === "number" ? runtimeNavigator.deviceMemory : null;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const viewportPixels = Math.round(window.innerWidth * window.innerHeight * dpr * dpr);
  const saveData = Boolean(runtimeNavigator.connection?.saveData);
  const effectiveType = runtimeNavigator.connection?.effectiveType ?? null;
  const canvas = document.createElement("canvas");
  const webgl2 = canvas.getContext("webgl2", { powerPreference: "high-performance" });
  const webgl = webgl2 ?? canvas.getContext("webgl", { powerPreference: "high-performance" });
  const base = {
    backend: webgl2 ? "webgl2" as const : webgl ? "webgl" as const : "image" as const,
    webgpu: Boolean(runtimeNavigator.gpu),
    hardwareConcurrency,
    deviceMemory,
    dpr,
    viewportPixels,
    saveData,
    effectiveType,
  };

  if (!webgl) return selectCstdRuntimeTier({ ...base, renderer: "", maximumTexture: 0 });

  const debugInfo = webgl.getExtension("WEBGL_debug_renderer_info") as { UNMASKED_RENDERER_WEBGL: number } | null;
  const renderer = String(webgl.getParameter(debugInfo?.UNMASKED_RENDERER_WEBGL ?? webgl.RENDERER));
  const maximumTexture = Number(webgl.getParameter(webgl.MAX_TEXTURE_SIZE));
  webgl.getExtension("WEBGL_lose_context")?.loseContext();
  return selectCstdRuntimeTier({ ...base, renderer, maximumTexture });
}
