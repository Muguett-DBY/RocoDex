import type { CstdLocale } from "../content/content-types";
import { cstdThemeFontAssets } from "../media/asset-manifest";

const serializedThemeFontAssets = JSON.stringify(cstdThemeFontAssets);

function createCstdThemeBootstrapScript(locale: CstdLocale) {
  const serializedLocale = JSON.stringify(locale);

  return String.raw`(() => {
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
  const locale = ${serializedLocale};
  const fontAssets = ${serializedThemeFontAssets};

  fontAssets[theme][locale].forEach((href) => {
    if (document.head.querySelector('link[href="' + href + '"]')) return;
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "font";
    link.type = "font/woff2";
    link.crossOrigin = "anonymous";
    link.href = href;
    link.dataset.cstdThemeFont = theme;
    link.dataset.cstdThemeFontLocale = locale;
    document.head.appendChild(link);
  });

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
