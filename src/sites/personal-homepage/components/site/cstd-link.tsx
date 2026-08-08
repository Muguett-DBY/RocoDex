"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ComponentProps, MouseEvent } from "react";

type CstdLinkProps = Omit<ComponentProps<typeof Link>, "href"> & {
  href: string;
};

type TransitionDocument = Document & {
  startViewTransition?: (callback: () => void) => { finished: Promise<void> };
};

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
    const transitionDocument = document as TransitionDocument;
    if (!transitionDocument.startViewTransition && resolvedHref === href) return;

    event.preventDefault();
    if (transitionDocument.startViewTransition) {
      transitionDocument.startViewTransition(() => router.push(resolvedHref));
    } else {
      router.push(resolvedHref);
    }
  }

  return <Link href={href} prefetch={false} onClick={handleClick} {...props} />;
}
