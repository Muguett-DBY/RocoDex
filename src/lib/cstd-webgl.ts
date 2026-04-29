type WebglWindow = {
  document?: {
    createElement?: (tagName: "canvas") => {
      getContext?: (contextId: string) => unknown;
    };
  };
};

export function canUseCstdWebgl(targetWindow?: WebglWindow) {
  const webglWindow = targetWindow ?? (typeof window === "undefined" ? undefined : window);
  if (!webglWindow?.document?.createElement) return false;

  try {
    const canvas = webglWindow.document.createElement("canvas") as {
      getContext?: (contextId: string) => unknown;
    };
    return Boolean(
      canvas.getContext?.("webgl2") ??
        canvas.getContext?.("webgl") ??
        canvas.getContext?.("experimental-webgl"),
    );
  } catch {
    return false;
  }
}
