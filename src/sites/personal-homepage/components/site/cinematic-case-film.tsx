"use client";

import Image from "next/image";
import { CheckCircle2, ChevronLeft, ChevronRight, Clapperboard, Link2, TimerReset } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cstdArtBible } from "../../content/art-bible";
import type { CstdCaseStudy } from "../../content/content-models";
import type { CstdLocale } from "../../content/content-types";

export function CinematicCaseFilm({ caseStudy, locale }: { caseStudy: CstdCaseStudy; locale: CstdLocale }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const beatRefs = useRef<Array<HTMLElement | null>>([]);
  const art = cstdArtBible[caseStudy.capabilityIds[0]];
  const activeBeat = caseStudy.film.beats[activeIndex];

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((left, right) => right.intersectionRatio - left.intersectionRatio)[0];
      if (!visible) return;
      const index = Number((visible.target as HTMLElement).dataset.cstdFilmBeatIndex);
      if (Number.isInteger(index)) setActiveIndex(index);
    }, { rootMargin: "-26% 0px -42%", threshold: [0.15, 0.45, 0.75] });
    beatRefs.current.forEach((element) => element && observer.observe(element));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const requestedAct = new URLSearchParams(window.location.search).get("act");
    const requestedIndex = caseStudy.film.beats.findIndex((beat) => beat.id === requestedAct);
    if (requestedIndex < 0) return;

    const frame = window.requestAnimationFrame(() => {
      setActiveIndex(requestedIndex);
      beatRefs.current[requestedIndex]?.scrollIntoView({ behavior: "instant", block: "center" });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [caseStudy.film.beats]);

  function selectBeat(index: number) {
    setActiveIndex(index);
    beatRefs.current[index]?.scrollIntoView({ behavior: "smooth", block: "center" });
    const url = new URL(window.location.href);
    url.searchParams.set("act", caseStudy.film.beats[index].id);
    window.history.replaceState(window.history.state, "", url);
    window.dispatchEvent(new CustomEvent("cstd:metric", { detail: { name: "case_film_beat", value: index + 1 } }));
  }

  async function copyActiveBeat() {
    const url = new URL(window.location.href);
    url.searchParams.set("act", activeBeat.id);
    await navigator.clipboard?.writeText(url.toString());
    window.dispatchEvent(new CustomEvent("cstd:metric", { detail: { name: "case_act_share", value: activeIndex + 1 } }));
  }

  return (
    <section data-cstd-case-film data-cstd-case-film-active-beat={activeBeat.id} aria-labelledby="cstd-case-film-title" className="relative border-y border-white/12 bg-[#050709] text-[#f2efe7]">
      <div className="mx-auto grid max-w-[1540px] lg:grid-cols-[minmax(0,1.15fr)_minmax(24rem,0.85fr)]">
        <div className="relative min-h-[70svh] overflow-hidden border-b border-white/12 lg:sticky lg:top-16 lg:h-[calc(100svh-4rem)] lg:border-b-0 lg:border-r">
          <div className="absolute inset-0">
            <Image src={art.image} alt={art.imageAlt[locale]} fill sizes="(max-width: 1024px) 100vw, 58vw" className="cstd-film-district-image object-cover" style={{ objectPosition: "center", transform: `scale(${1.035 + activeIndex * 0.008}) translate3d(${activeIndex * -0.35}%, ${activeIndex * -0.18}%, 0)` }} />
          </div>
          <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,7,9,0.94)_0%,rgba(5,7,9,0.48)_56%,rgba(5,7,9,0.2)_100%)]" />
          <div aria-hidden="true" className="cstd-film-scan absolute inset-0" style={{ "--cstd-film-accent": art.accent } as React.CSSProperties} />
          <div className="relative flex h-full min-h-[70svh] flex-col justify-between p-5 pb-8 pt-20 md:p-10 md:pt-24 lg:min-h-0 lg:p-12">
            <div>
              <p className="flex items-center gap-3 font-mono text-[11px] font-black" style={{ color: art.accent }}><Clapperboard aria-hidden="true" className="h-4 w-4" /> CASE FILM / {caseStudy.year}</p>
              <h2 id="cstd-case-film-title" className="mt-5 max-w-3xl text-4xl font-semibold leading-[0.98] md:text-6xl">{caseStudy.film.logline[locale]}</h2>
            </div>

            <div className="mt-10 max-w-xl border-l-2 bg-[#050709]/76 p-5 backdrop-blur-lg" style={{ borderColor: art.accent }} aria-live="polite">
              <p className="font-mono text-[11px] font-black text-[#778388]">BEAT {String(activeIndex + 1).padStart(2, "0")} / {activeBeat.phase.toUpperCase()}</p>
              <p className="mt-3 text-2xl font-semibold">{activeBeat.title[locale]}</p>
              <p className="mt-3 text-sm leading-7 text-[#b4bdc0]">{activeBeat.detail[locale]}</p>
              <p className="mt-4 flex items-center gap-2 font-mono text-[11px] font-black" style={{ color: art.accent }}><CheckCircle2 aria-hidden="true" className="h-3.5 w-3.5" />{activeBeat.signal[locale]}</p>
            </div>

            <div className="mt-8">
              <div className="flex items-center justify-between font-mono text-[11px] font-black text-[#778388]"><span className="flex items-center gap-2"><TimerReset aria-hidden="true" className="h-3.5 w-3.5" />{caseStudy.film.durationSeconds} SEC STORY</span><span>{activeIndex + 1} / {caseStudy.film.beats.length}</span></div>
              <div className="mt-3 grid gap-1" style={{ gridTemplateColumns: `repeat(${caseStudy.film.beats.length}, minmax(0, 1fr))` }}>
                {caseStudy.film.beats.map((beat, index) => <button key={beat.id} type="button" aria-label={beat.title[locale]} aria-pressed={activeIndex === index} onClick={() => selectBeat(index)} className="h-1.5 bg-white/16 transition-[background-color,transform] hover:scale-y-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#24e0ff]" style={{ backgroundColor: activeIndex >= index ? art.accent : undefined }} />)}
              </div>
              <div className="mt-4 flex items-center gap-2">
                <button type="button" onClick={() => selectBeat((activeIndex - 1 + caseStudy.film.beats.length) % caseStudy.film.beats.length)} aria-label={locale === "zh" ? "上一镜" : "Previous act"} title={locale === "zh" ? "上一镜" : "Previous act"} className="flex h-9 w-9 items-center justify-center border border-white/18 text-[#aeb7ba] hover:border-[#24e0ff] hover:text-[#24e0ff] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#24e0ff]"><ChevronLeft aria-hidden="true" className="h-4 w-4" /></button>
                <button type="button" onClick={() => selectBeat((activeIndex + 1) % caseStudy.film.beats.length)} aria-label={locale === "zh" ? "下一镜" : "Next act"} title={locale === "zh" ? "下一镜" : "Next act"} className="flex h-9 w-9 items-center justify-center border border-white/18 text-[#aeb7ba] hover:border-[#24e0ff] hover:text-[#24e0ff] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#24e0ff]"><ChevronRight aria-hidden="true" className="h-4 w-4" /></button>
                <button type="button" onClick={() => void copyActiveBeat()} aria-label={locale === "zh" ? "复制当前镜头链接" : "Copy current act link"} title={locale === "zh" ? "复制当前镜头链接" : "Copy current act link"} className="ml-auto flex h-9 w-9 items-center justify-center border border-white/18 text-[#aeb7ba] hover:border-[#f4d431] hover:text-[#f4d431] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#f4d431]"><Link2 aria-hidden="true" className="h-4 w-4" /></button>
              </div>
            </div>
          </div>
        </div>

        <ol className="px-5 py-10 md:px-10 lg:px-12 lg:py-[22svh]">
          {caseStudy.film.beats.map((beat, index) => (
            <li key={beat.id}>
              <article ref={(element) => { beatRefs.current[index] = element; }} data-cstd-film-beat={beat.id} data-cstd-film-beat-index={index} data-cstd-film-beat-active={activeIndex === index ? "true" : "false"} onPointerEnter={() => setActiveIndex(index)} className="flex min-h-[42svh] items-center border-t border-white/12 py-10 first:border-t-0 lg:min-h-[48svh]">
                <button type="button" aria-pressed={activeIndex === index} onClick={() => selectBeat(index)} className="group w-full text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#24e0ff]">
                  <span className="font-mono text-[11px] font-black text-[#68757b]">{String(index + 1).padStart(2, "0")} / {beat.phase.toUpperCase()}</span>
                  <h3 className="mt-4 text-3xl font-semibold leading-tight text-[#a1aaad] transition-colors group-hover:text-white group-aria-pressed:text-white md:text-4xl">{beat.title[locale]}</h3>
                  <p className="mt-5 max-w-xl text-sm leading-7 text-[#7f8b90] md:text-base md:leading-8">{beat.detail[locale]}</p>
                  <span className="mt-5 block font-mono text-[11px] font-black" style={{ color: activeIndex === index ? art.accent : "#68757b" }}>SIGNAL / {beat.signal[locale]}</span>
                </button>
              </article>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
