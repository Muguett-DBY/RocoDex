"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Reveals children with a quiet fade-and-rise once they enter the viewport.
 * One shared IntersectionObserver per element; disabled under reduced motion.
 */
export function AtelierReveal({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      node.dataset.cstdAtelierReveal = "visible";
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      }
    }, { rootMargin: "0px 0px -12% 0px" });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} data-cstd-atelier-reveal={visible ? "visible" : "hidden"} style={{ transitionDelay: `${delay}ms` }} className={className}>
      {children}
    </div>
  );
}
