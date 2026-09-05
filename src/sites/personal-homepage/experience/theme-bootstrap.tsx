import type { CstdLocale } from "../content/content-types";
import { cstdThemeFontAssets, cstdThemeStageAssets } from "../media/asset-manifest";

const serializedThemeStageAssets = JSON.stringify(Object.fromEntries(
  Object.entries(cstdThemeStageAssets).map(([theme, asset]) => [theme, asset.src]),
));
const serializedThemeFontAssets = JSON.stringify(cstdThemeFontAssets);

function createCstdThemeBootstrapScript(locale: CstdLocale) {
  const serializedLocale = JSON.stringify(locale);

  return String.raw`(() => {
  const storageKey = "cstd-world-theme";
  const kinds = {
    "atelier": "editorial-studio",
    "neon-district": "cyberpunk",
    "underworld-forge": "mythic-underworld",
    "astral-covenant": "fantasy-codex"
  };
  let theme = "atelier";
  try {
    const stored = window.localStorage.getItem(storageKey);
    const retired = ["solar-lab", "ink-protocol", "press-room", "pixel-quest"];
    const normalized = stored && retired.includes(stored) ? "atelier" : stored;
    if (normalized && Object.prototype.hasOwnProperty.call(kinds, normalized)) theme = normalized;
  } catch {}

  const html = document.documentElement;
  const kind = kinds[theme];
  const locale = ${serializedLocale};
  const stageAssets = ${serializedThemeStageAssets};
  const fontAssets = ${serializedThemeFontAssets};
  const voxelGamePaths = ["/cstd/voxel", "/cstd/en/voxel"];
  const onVoxelGame = voxelGamePaths.includes(window.location.pathname.replace(/\/+$/, ""));

  if (!onVoxelGame) {
    for (const href of fontAssets[theme][locale]) {
      const fontPreload = document.createElement("link");
      fontPreload.rel = "preload";
      fontPreload.as = "font";
      fontPreload.type = "font/woff2";
      fontPreload.href = href;
      fontPreload.crossOrigin = "anonymous";
      fontPreload.dataset.cstdFontPreload = theme;
      document.head.appendChild(fontPreload);
    }
  }

  const homepagePath = window.location.pathname.replace(/\/+$/, "");
  if (["", "/cstd", "/en", "/cstd/en"].includes(homepagePath)) {
    const stagePreload = document.createElement("link");
    stagePreload.rel = "preload";
    stagePreload.as = "image";
    stagePreload.href = stageAssets[theme];
    stagePreload.fetchPriority = "high";
    stagePreload.dataset.cstdStagePreload = theme;
    document.head.appendChild(stagePreload);
  }

  html.dataset.cstdTheme = theme;
  html.dataset.cstdThemeKind = kind;
  html.dataset.cstdLocale = locale;

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
}

export function CstdThemeBootstrapScript({ locale }: { locale: CstdLocale }) {
  return <script id="cstd-theme-bootstrap" dangerouslySetInnerHTML={{ __html: createCstdThemeBootstrapScript(locale) }} />;
}
