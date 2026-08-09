"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ComponentProps, MouseEvent } from "react";
import { createCstdNavigationSnapshot } from "../../domain/route-transition";

type CstdLinkProps = Omit<ComponentProps<typeof Link>, "href"> & {
  href: string;
};

type TransitionDocument = Document & {
  startViewTransition?: (callback: () => void | Promise<void>) => { finished: Promise<void> };
};

const navigationStateKey = "cstd:last-navigation";
const routeKindMetric = { work: 1, reading: 2, path: 3, execute: 4, district: 5 } as const;

function getLocalDevelopmentHref(href: string) {
  if (!href.startsWith("/") || href.startsWith("/cstd")) return href;
  return href === "/" ? "/cstd" : `/cstd${href}`;
}

export function CstdLink({ href, onClick, ...props }: CstdLinkProps) {
  const router = useRouter();

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.(event);
    if (
      event.defaultPrevented
      || event.button !== 0
      || event.metaKey
      || event.ctrlKey
      || event.shiftKey
      || event.altKey
      || props.target === "_blank"
      || !href.startsWith("/")
    ) return;

    const host = window.location.hostname.toLowerCase();
    const resolvedHref = host === "custard.top" || host === "www.custard.top" ? href : getLocalDevelopmentHref(href);
    const snapshot = createCstdNavigationSnapshot(`${window.location.pathname}${window.location.search}`, href, window.scrollY);
    try {
      window.sessionStorage.setItem(navigationStateKey, JSON.stringify(snapshot));
    } catch {
      // Navigation remains functional when session storage is unavailable.
    }
    window.dispatchEvent(new CustomEvent("cstd:metric", { detail: { name: "route_transition", value: routeKindMetric[snapshot.kind] } }));
    const transitionDocument = document as TransitionDocument;
    if (!transitionDocument.startViewTransition && resolvedHref === href) return;

    event.preventDefault();
    if (transitionDocument.startViewTransition) {
      document.documentElement.dataset.cstdRouteTransition = snapshot.kind;
      document.documentElement.dataset.cstdRouteFrom = snapshot.from;
      document.documentElement.dataset.cstdRouteTo = snapshot.to;
      const transition = transitionDocument.startViewTransition(async () => {
        router.push(resolvedHref);
        await new Promise<void>((resolve) => {
          window.requestAnimationFrame(() => window.requestAnimationFrame(() => resolve()));
        });
      });
      void transition.finished.finally(() => {
        delete document.documentElement.dataset.cstdRouteTransition;
        delete document.documentElement.dataset.cstdRouteFrom;
        delete document.documentElement.dataset.cstdRouteTo;
      });
    } else {
      router.push(resolvedHref);
    }
  }

  return <Link href={href} prefetch={false} onClick={handleClick} {...props} />;
}
