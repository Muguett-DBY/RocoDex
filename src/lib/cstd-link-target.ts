export type CstdLinkTargetProps = {
  target?: "_blank";
  rel?: "noreferrer";
};

const CSTD_CANONICAL_HOSTS = new Set(["custard.top", "www.custard.top"]);

export function getCstdLinkTargetProps(href: string): CstdLinkTargetProps {
  if (!href.startsWith("http://") && !href.startsWith("https://")) return {};

  try {
    const url = new URL(href);
    if (CSTD_CANONICAL_HOSTS.has(url.hostname.toLowerCase())) return {};
  } catch {
    return {};
  }

  return {
    target: "_blank",
    rel: "noreferrer",
  };
}
