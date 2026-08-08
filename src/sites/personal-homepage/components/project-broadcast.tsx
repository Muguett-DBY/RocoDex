"use client";

import Image from "next/image";
import { clsx } from "clsx";
import { useEffect, useRef, useState } from "react";

export function ProjectBroadcast({
  src,
  poster,
  alt,
  position,
  reducedMotion,
}: {
  src: string;
  poster: string;
  alt: string;
  position?: string;
  reducedMotion: boolean;
}) {
  const frameRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [armed, setArmed] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
        if (entry.isIntersecting) setArmed(true);
      },
      { rootMargin: "180px 0px", threshold: 0.18 },
    );
    observer.observe(frame);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !armed || reducedMotion) {
      video?.pause();
      return;
    }
    if (visible) void video.play().catch(() => undefined);
    else video.pause();
  }, [armed, reducedMotion, visible]);

  return (
    <div
      ref={frameRef}
      data-cstd-project-broadcast
      data-cstd-broadcast-active={visible && !reducedMotion ? "true" : "false"}
      className="absolute inset-0"
    >
      <Image
        src={poster}
        alt={alt}
        fill
        loading="lazy"
        sizes="(min-width: 1024px) 58vw, 100vw"
        className="object-cover saturate-[0.78]"
        style={{ objectPosition: position }}
      />
      {armed ? (
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          muted
          loop
          playsInline
          preload="none"
          aria-label={`${alt}动态展示`}
          className={clsx(
            "cstd-live-feed-image absolute inset-0 h-full w-full object-cover saturate-[0.82] transition-[opacity,filter] duration-500 group-hover:saturate-100",
            reducedMotion ? "opacity-0" : "opacity-100",
          )}
          style={{ objectPosition: position }}
        />
      ) : null}
    </div>
  );
}
