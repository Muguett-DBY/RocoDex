"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, type ComponentProps, type FocusEvent, type MouseEvent } from "react";
import { createCstdNavigationSnapshot } from "../../domain/route-transition";

type CstdLinkProps = Omit<ComponentProps<typeof Link>, "href" | "prefetch"> & {
  href: string;
  eagerPrefetch?: boolean;
};

const navigationStateKey = "cstd:last-navigation";
const routeKindMetric = { work: 1, reading: 2, path: 3, execute: 4, district: 5 } as const;

function getLocalDevelopmentHref(href: string) {
  if (!href.startsWith("/") || href.startsWith("/cstd")) return href;
  return href === "/" ? "/cstd" : `/cstd${href}`;
}

function resolveCstdHref(href: string) {
  const host = window.location.hostname.toLowerCase();
  return host === "custard.top" || host === "www.custard.top" ? href : getLocalDevelopmentHref(href);
}

export function CstdLink({
  href,
  eagerPrefetch = false,
  onClick,
  onFocus,
  onMouseEnter,
  ...props
}: CstdLinkProps) {
  const router = useRouter();

  const prefetchRoute = useCallback(() => {
    if (!href.startsWith("/")) return;
    router.prefetch(resolveCstdHref(href));
  }, [href, router]);

  useEffect(() => {
    if (eagerPrefetch) prefetchRoute();
  }, [eagerPrefetch, prefetchRoute]);

  function handleFocus(event: FocusEvent<HTMLAnchorElement>) {
    onFocus?.(event);
    if (!event.defaultPrevented) prefetchRoute();
  }

  function handleMouseEnter(event: MouseEvent<HTMLAnchorElement>) {
    onMouseEnter?.(event);
    if (!event.defaultPrevented) prefetchRoute();
  }

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

    const resolvedHref = resolveCstdHref(href);
    const snapshot = createCstdNavigationSnapshot(`${window.location.pathname}${window.location.search}`, href, window.scrollY);
    try {
      window.sessionStorage.setItem(navigationStateKey, JSON.stringify(snapshot));
    } catch {
      // Navigation remains functional when session storage is unavailable.
    }
    window.dispatchEvent(new CustomEvent("cstd:metric", { detail: { name: "route_transition", value: routeKindMetric[snapshot.kind] } }));
    event.preventDefault();
    document.documentElement.dataset.cstdNavigationPending = snapshot.kind;
    document.documentElement.dataset.cstdNavigationTarget = resolvedHref;
    router.push(resolvedHref);
    window.setTimeout(() => {
      delete document.documentElement.dataset.cstdNavigationPending;
    }, 1_200);
  }

  return (
    <Link
      href={href}
      prefetch={false}
      onClick={handleClick}
      onFocus={handleFocus}
      onMouseEnter={handleMouseEnter}
      {...props}
    />
  );
}
