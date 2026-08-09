"use client";

import type { AnchorHTMLAttributes, MouseEvent } from "react";

type CstdChapterLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  href: `#${string}`;
};

export function CstdChapterLink({ href, onClick, children, ...props }: CstdChapterLinkProps) {
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.(event);
    if (
      event.defaultPrevented
      || event.button !== 0
      || event.metaKey
      || event.ctrlKey
      || event.shiftKey
      || event.altKey
    ) return;

    const targetId = href.slice(1);
    const target = document.getElementById(targetId);
    if (!target) return;

    event.preventDefault();
    const startedAt = performance.now();
    document.documentElement.setAttribute("data-cstd-anchor-jump", targetId);

    const alignTarget = () => {
      const currentTarget = document.getElementById(targetId);
      if (!currentTarget) return;
      currentTarget.dataset.cstdRevealed = "true";
      const header = document.querySelector("[data-cstd-home-header]");
      const headerBottom = header instanceof HTMLElement ? header.getBoundingClientRect().bottom : 64;
      const targetTop = currentTarget.getBoundingClientRect().top + window.scrollY - headerBottom - 8;
      window.scrollTo({ top: Math.max(0, Math.round(targetTop)), behavior: "instant" });
    };

    alignTarget();
    document.documentElement.dataset.cstdAnchorTarget = targetId;
    document.documentElement.dataset.cstdAnchorResponseMs = (performance.now() - startedAt).toFixed(2);

    window.requestAnimationFrame(() => {
      alignTarget();
      window.requestAnimationFrame(() => {
        alignTarget();
        document.documentElement.removeAttribute("data-cstd-anchor-jump");
      });
    });
  }

  return <a href={href} onClick={handleClick} {...props}>{children}</a>;
}
