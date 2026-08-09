export type CstdSceneQuality = "full" | "lite";

type WebGLRendererLike = {
  getContext: () => WebGLRenderingContext | WebGL2RenderingContext;
};

export type CstdFrameBudgetDecision = Readonly<{
  action: "decline";
  fps: number;
  lowWindows: number;
}>;

const softwareRendererPattern = /swiftshader|llvmpipe|software rasterizer|softpipe/i;

export function detectInitialSceneQuality(renderer: WebGLRendererLike): CstdSceneQuality {
  const context = renderer.getContext();
  const debugInfo = context.getExtension("WEBGL_debug_renderer_info") as {
    UNMASKED_RENDERER_WEBGL: number;
  } | null;
  const rendererName = String(
    context.getParameter(debugInfo?.UNMASKED_RENDERER_WEBGL ?? context.RENDERER),
  );
  const maximumTexture = Number(context.getParameter(context.MAX_TEXTURE_SIZE));
  return softwareRendererPattern.test(rendererName) || maximumTexture < 8192 ? "lite" : "full";
}

export class CstdFrameBudgetController {
  private elapsed = 0;
  private frames = 0;
  private lowWindows = 0;
  private lastFps = 0;

  sample(deltaSeconds: number): CstdFrameBudgetDecision | null {
    this.elapsed += deltaSeconds;
    this.frames += 1;
    if (this.elapsed < 1) return null;

    this.lastFps = this.frames / this.elapsed;
    this.elapsed = 0;
    this.frames = 0;
    this.lowWindows = this.lastFps < 42 ? this.lowWindows + 1 : 0;
    return this.lowWindows >= 2
      ? { action: "decline", fps: Math.round(this.lastFps), lowWindows: this.lowWindows }
      : null;
  }

  snapshot() {
    return { fps: this.lastFps, lowWindows: this.lowWindows } as const;
  }
}
