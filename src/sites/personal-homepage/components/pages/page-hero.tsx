import Image from "next/image";
import { ArrowDown } from "lucide-react";
import type { CSSProperties } from "react";
import type { ContentImage, ContentMetric, CstdLocale } from "../../content/content-types";

export function CstdPageHero({
  locale,
  eyebrow,
  title,
  summary,
  image,
  metrics = [],
  compact = false,
  transitionName = "cstd-page-hero",
}: {
  locale: CstdLocale;
  eyebrow: string;
  title: string;
  summary: string;
  image: ContentImage;
  metrics?: readonly ContentMetric[];
  compact?: boolean;
  transitionName?: string;
}) {
  return (
    <header
      data-cstd-page-hero
      className={`relative flex overflow-hidden border-b border-white/15 ${compact ? "min-h-[68svh]" : "min-h-[82svh]"}`}
      style={{ viewTransitionName: transitionName } as CSSProperties}
    >
      <Image
        data-cstd-page-hero-image
        src={image.src}
        alt={image.alt[locale]}
        fill
        loading="eager"
        sizes="100vw"
        className="object-cover"
        style={{ objectPosition: image.position ?? "50% 50%" }}
      />
      <div data-cstd-page-hero-overlay aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,7,9,0.96)_0%,rgba(5,7,9,0.78)_46%,rgba(5,7,9,0.18)_100%)]" />
      <div data-cstd-page-hero-grid aria-hidden="true" className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,0.09)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.09)_1px,transparent_1px)] [background-size:64px_64px]" />
      <div data-cstd-page-hero-content className="relative mx-auto flex w-full max-w-[1540px] flex-col justify-end px-5 pb-16 pt-28 md:px-10 lg:px-16 lg:pb-20">
        <div className="max-w-5xl">
          <p data-cstd-page-hero-eyebrow className="font-mono text-[11px] font-black text-[#f4d431]">{eyebrow}</p>
          <h1 data-cstd-page-hero-title className="mt-6 text-balance text-[2.375rem] font-semibold leading-[0.94] tracking-[0] text-white sm:text-5xl md:text-7xl md:leading-[0.9] lg:text-8xl xl:text-[7rem]">{title}</h1>
          <p data-cstd-page-hero-summary className="mt-7 max-w-3xl text-lg leading-8 text-[#c3c9cb] md:text-xl md:leading-9">{summary}</p>
        </div>

        {metrics.length > 0 ? (
          <dl data-cstd-page-hero-metrics className="mt-10 grid max-w-4xl grid-cols-2 border-y border-white/20 md:grid-cols-3">
            {metrics.map((metric) => (
              <div key={`${metric.value}-${metric.label[locale]}`} className="border-white/15 py-4 pr-5 odd:border-r md:border-r md:last:border-r-0 md:px-5 md:first:pl-0">
                <dt className="font-mono text-[11px] font-black uppercase text-[#8a969b]">{metric.label[locale]}</dt>
                <dd className="mt-2 whitespace-nowrap text-xl font-semibold text-[#24e0ff] sm:text-2xl">{metric.value}</dd>
              </div>
            ))}
          </dl>
        ) : null}

        <div data-cstd-page-hero-scroll aria-hidden="true" className="mt-9 flex items-center gap-3 font-mono text-[11px] font-black text-[#748187]">
          <ArrowDown className="h-3.5 w-3.5 animate-bounce text-[#f4d431]" /> SCROLL / CONTINUE TRACE
        </div>
      </div>
    </header>
  );
}
