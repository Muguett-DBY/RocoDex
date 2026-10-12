import Image from "next/image";
import type { CstdLocale } from "../../content/content-types";
import type { CstdCaseStudy } from "../../content/case-studies";

export function AtelierProjectCover({ entry, locale }: { entry: CstdCaseStudy; locale: CstdLocale }) {
  const kind = entry.slug === "melbourne-pedestrian-microclimate" ? "melbourne"
    : entry.slug === "rocodex-platform" ? "rocodex"
      : entry.slug === "alpha-research-system" ? "alpha" : "archive";
  const isZh = locale === "zh";
  return (
    <div className="atelier-cover" data-atelier-cover={kind}>
      {kind === "melbourne" ? (
        <>
          <div className="atelier-cover-city" aria-hidden="true">
            <svg viewBox="0 0 400 400" fill="none">
              <g stroke="currentColor" strokeWidth="1">
                <path d="m-40 160 360-210M-20 205 380-25M0 250 400 20M20 295 420 65M40 340 440 110M60 385 460 155M80 430 480 200M100 475 500 245M20-20 260 400M70-30 310 390M120-40 360 380M170-50 410 370M220-60 460 360" />
                <path d="m-30 270 100-45 65 55 75-10 100 65 120-25" strokeWidth="12" opacity=".35" />
              </g>
            </svg>
          </div>
          <div className="atelier-cover-heading"><span>MELBOURNE</span><strong>Patterns<br />in a city.</strong><small>{isZh ? "行人活动 × 城市微气候" : "Pedestrians × microclimate"}</small></div>
          <div className="atelier-cover-sheet">
            <Image src={entry.image.src} alt={entry.image.alt[locale]} fill sizes="(min-width: 1024px) 65vw, 92vw" className="atelier-cover-image" />
          </div>
          <div className="atelier-cover-foot"><span>1.47M {isZh ? "条记录" : "RECORDS"}</span><span>R · data.table · ggplot2</span></div>
        </>
      ) : kind === "rocodex" || kind === "alpha" ? (
        <>
          <div className="atelier-cover-label"><span>{kind === "rocodex" ? "ROCODEX" : "CSTD ALPHA"}</span><span>{kind === "rocodex" ? "PRODUCT / 01" : "RESEARCH / 02"}</span></div>
          <div className="atelier-cover-browser">
            <div className="atelier-cover-browser-bar" aria-hidden="true"><i /><i /><i /><span>{kind === "rocodex" ? "rocodex.custard.top" : "alpha.custard.top"}</span></div>
            <div className="atelier-cover-screen"><Image src={entry.image.src} alt={entry.image.alt[locale]} fill sizes="(min-width: 1024px) 52vw, 92vw" className="atelier-cover-image" style={{ objectPosition: entry.image.position ?? "50% 50%" }} /></div>
          </div>
          <div className="atelier-cover-caption"><strong>{kind === "rocodex" ? (isZh ? "两个站点，一套系统。" : "Two sites. One system.") : (isZh ? "让研究，有据可查。" : "Research, with a record.")}</strong><span>{kind === "rocodex" ? "Next.js · React · TypeScript" : "Evidence · DCF · Versioning"}</span></div>
        </>
      ) : <Image src={entry.image.src} alt={entry.image.alt[locale]} fill sizes="(min-width: 1024px) 52vw, 92vw" className="atelier-cover-image" style={{ objectPosition: entry.image.position ?? "50% 50%" }} />}
    </div>
  );
}
