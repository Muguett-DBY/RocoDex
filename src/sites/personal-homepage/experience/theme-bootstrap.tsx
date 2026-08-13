const cstdThemeBootstrapScript = String.raw`(() => {
  const storageKey = "cstd-world-theme";
  const kinds = {
    "neon-district": "cyberpunk",
    "ink-protocol": "ink-scroll",
    "press-room": "broadsheet",
    "pixel-quest": "pixel-game"
  };
  let theme = "neon-district";
  try {
    const stored = window.localStorage.getItem(storageKey);
    const normalized = stored === "solar-lab" ? "press-room" : stored;
    if (normalized && Object.prototype.hasOwnProperty.call(kinds, normalized)) theme = normalized;
  } catch {}

  const html = document.documentElement;
  const kind = kinds[theme];
  html.dataset.cstdTheme = theme;
  html.dataset.cstdThemeKind = kind;

  const applyTheme = () => {
    document.querySelectorAll("[data-cstd-kinetic-world], [data-cstd-deep-shell]").forEach((node) => {
      node.dataset.cstdTheme = theme;
      node.dataset.cstdThemeKind = kind;
    });
    document.querySelectorAll("[data-cstd-theme-world]").forEach((node) => {
      node.dataset.cstdThemeWorldKind = kind;
    });
    document.querySelectorAll("[data-cstd-theme-scene-rail]").forEach((node) => {
      node.dataset.cstdThemeSceneRail = theme;
    });
  };

  applyTheme();
  const observer = new MutationObserver(applyTheme);
  observer.observe(html, { childList: true, subtree: true });
  window.addEventListener("DOMContentLoaded", () => {
    applyTheme();
    window.requestAnimationFrame(() => observer.disconnect());
  }, { once: true });
})();`;

export function CstdThemeBootstrapScript() {
  return <script id="cstd-theme-bootstrap" dangerouslySetInnerHTML={{ __html: cstdThemeBootstrapScript }} />;
}
