"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useCstdMotionMode } from "../../experience/motion-store";

export function AtelierReveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const motion = useCstdMotionMode();

  useEffect(() => {
    const node = ref.current;
    if (!node || motion === "calm") return;
    // Content is visible in the server HTML; motion never gates reading the page.
    const animation = node.animate(
      [{ opacity: 0.65, transform: "translateY(12px)" }, { opacity: 1, transform: "none" }],
      { duration: 720, easing: "cubic-bezier(0.16, 1, 0.3, 1)" },
    );
    return () => animation.cancel();
  }, [motion]);

  return <div ref={ref} className={className}>{children}</div>;
}
