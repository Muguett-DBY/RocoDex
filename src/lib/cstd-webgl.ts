type WebglWindow = {
  navigator?: {
    webdriver?: boolean;
  };
  document?: {
    createElement?: (tagName: "canvas") => {
      getContext?: (
        contextId: string,
        options?: { failIfMajorPerformanceCaveat: boolean },
      ) => unknown;
    };
  };
};

export function canUseCstdWebgl(targetWindow?: WebglWindow) {
  const webglWindow = targetWindow ?? (typeof window === "undefined" ? undefined : window);
  if (!webglWindow?.document?.createElement) return false;
  if (webglWindow.navigator?.webdriver) return false;

  try {
    const canvas = webglWindow.document.createElement("canvas") as {
      getContext?: (
        contextId: string,
        options?: { failIfMajorPerformanceCaveat: boolean },
      ) => unknown;
    };
    const contextOptions = { failIfMajorPerformanceCaveat: true };
    return Boolean(
      canvas.getContext?.("webgl2", contextOptions) ??
        canvas.getContext?.("webgl", contextOptions) ??
        canvas.getContext?.("experimental-webgl", contextOptions),
    );
  } catch {
    return false;
  }
}
