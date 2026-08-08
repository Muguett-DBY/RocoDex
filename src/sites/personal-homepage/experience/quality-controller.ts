export type CstdSceneQuality = "full" | "lite";

type WebGLRendererLike = {
  getContext: () => WebGLRenderingContext | WebGL2RenderingContext;
};

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

  sample(deltaSeconds: number) {
    this.elapsed += deltaSeconds;
    this.frames += 1;
    if (this.elapsed < 1) return false;

    const fps = this.frames / this.elapsed;
    this.elapsed = 0;
    this.frames = 0;
    this.lowWindows = fps < 42 ? this.lowWindows + 1 : 0;
    return this.lowWindows >= 2;
  }
}
