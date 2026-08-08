"use client";

import Image from "next/image";
import { clsx } from "clsx";
import { useEffect, useRef, useState } from "react";

export function ProjectBroadcast({
  sources,
  poster,
  alt,
  position,
  reducedMotion,
}: {
  sources: { webm: string; mp4: string };
  poster: string;
  alt: string;
  position?: string;
  reducedMotion: boolean;
}) {
  const frameRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setMounted(entry.isIntersecting);
        setVisible(entry.intersectionRatio >= 0.18);
      },
      { rootMargin: "75% 0px", threshold: [0, 0.18] },
    );
    observer.observe(frame);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !mounted || reducedMotion) {
      video?.pause();
      return;
    }
    if (visible) void video.play().catch(() => undefined);
    else video.pause();
  }, [mounted, reducedMotion, visible]);

  return (
    <div
      ref={frameRef}
      data-cstd-project-broadcast
      data-cstd-broadcast-mounted={mounted ? "true" : "false"}
      data-cstd-broadcast-active={visible && !reducedMotion ? "true" : "false"}
      className="absolute inset-0"
    >
      {mounted ? (
        <>
          <Image
            src={poster}
            alt={alt}
            fill
            loading="eager"
            sizes="(min-width: 1024px) 58vw, 100vw"
            className="object-cover saturate-[0.78]"
            style={{ objectPosition: position }}
          />
          <video
            ref={videoRef}
            poster={poster}
            muted
            loop
            playsInline
            preload="metadata"
            aria-label={`${alt}动态展示`}
            className={clsx(
              "cstd-live-feed-image absolute inset-0 h-full w-full object-cover saturate-[0.82] transition-[opacity,filter] duration-500 group-hover:saturate-100",
              reducedMotion ? "opacity-0" : "opacity-100",
            )}
            style={{ objectPosition: position }}
          >
            <source src={sources.webm} type="video/webm" />
            <source src={sources.mp4} type="video/mp4" />
          </video>
        </>
      ) : (
        <div className="absolute inset-0 bg-[#050709]" />
      )}
    </div>
  );
}
