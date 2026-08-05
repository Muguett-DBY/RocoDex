"use client";

import { lazy, memo, Suspense } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import * as m from "framer-motion/m";
import { getCstdLinkTargetProps } from "../../domain/link-target";
import { cstdLiveObjectIds, cstdProofs, getCstdProjectsById, type CstdProof } from "../../content/systems";
import { cstdProjects } from "../../content/projects";

const LetterReveal = dynamic(() => import("../letter-reveal").then((module) => module.LetterReveal));
const LazyTiltFrame = lazy(() => import("../tilt-frame").then((module) => ({ default: module.TiltFrame })));
const LazyOrb = lazy(() => import("../reactbits/orb").then((module) => ({ default: module.Orb })));
const LazyFocusTitle = lazy(() => import("../reactbits/focus-title").then((module) => ({ default: module.FocusTitle })));

const proofProjects = getCstdProjectsById(
  cstdProjects,
  cstdProofs.map((proof) => proof.projectId),
);

const liveProjects = getCstdProjectsById(cstdProjects, cstdLiveObjectIds);

function ProofChapter({ proof, index, reducedMotion }: { proof: CstdProof; index: number; reducedMotion: boolean }) {
  const project = proofProjects.find((candidate) => candidate.id === proof.projectId);
  if (!project?.preview) return null;
  const targetProps = getCstdLinkTargetProps(project.href);

  return (
    <article
      data-cstd-proof={proof.projectId}
      className="group relative grid min-h-svh items-center overflow-hidden px-5 py-24 contain-paint md:px-10 lg:grid-cols-[0.82fr_1.18fr] lg:gap-14 lg:px-16"
    >
      {/* 超大编号背景字 */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-4 top-10 select-none font-mono text-[11rem] font-black leading-none text-[#33ff66]/[0.05] md:text-[18rem]"
      >
        {String(index + 1).padStart(2, "0")}
      </span>

      <div className="relative z-10 max-w-2xl self-center font-mono lg:pr-8">
        <div className="flex items-center gap-4 text-xs font-bold text-[#8a8f98]">
          <span className="rounded-sm border border-[#2a2d33] bg-[#101214] px-2 py-1 text-[#33ff66]">
            [OK] 0{index + 1}
          </span>
          <span aria-hidden="true" className="h-px w-12 bg-[#2a2d33]" />
          <span>{proof.lens.toUpperCase()}</span>
        </div>
        <h3 className="mt-8 text-5xl font-black leading-[0.95] tracking-[0] md:text-7xl xl:text-8xl">{project.title}</h3>
        <p className="mt-8 max-w-xl text-2xl font-bold leading-tight md:text-3xl">{proof.statement}</p>
        <p className="mt-5 max-w-lg text-base leading-7 text-[#8a8f98] md:text-lg">{proof.detail}</p>
        <a
          href={project.href}
          {...targetProps}
          className="mt-10 inline-flex items-center gap-3 rounded-md border border-[#33ff66]/60 bg-[#33ff66]/[0.08] px-5 py-3 font-mono text-sm font-bold text-[#33ff66] shadow-[0_0_24px_rgba(51,255,102,0.12)] transition-all duration-300 hover:bg-[#33ff66] hover:text-[#0b0c0e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#33ff66]"
        >
          $ open {project.action}
          <ArrowUpRight aria-hidden="true" className="h-4 w-4" strokeWidth={2.4} />
        </a>
      </div>

      <Suspense fallback={null}>
      <LazyTiltFrame
        disabled={reducedMotion}
        rotateAmplitude={5}
        scaleOnHover={1.02}
        className="mt-14 min-h-0 lg:mt-0"
      >
        <m.figure
          data-cstd-project-plane={proof.projectId}
          className="group relative aspect-[16/11] min-h-0 overflow-hidden rounded-lg border border-[#2a2d33] bg-black shadow-[0_20px_50px_rgba(0,0,0,0.5)] lg:mt-0"
          initial={{ clipPath: "polygon(6% 0%, 100% 0%, 94% 100%, 0% 100%)" }}
          whileHover={{ clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* hover 时 conic 扫描边框 */}
          {!reducedMotion && (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              style={{
                background:
                  "conic-gradient(from 0deg, transparent 0deg, rgba(51,255,102,0.9) 42deg, transparent 90deg, transparent 180deg, rgba(91,141,255,0.55) 222deg, transparent 270deg)",
                animation: "cstd-spin 2.6s linear infinite",
              }}
            />
          )}
          <m.div
            className="absolute inset-[-2%]"
            whileHover={{ scale: 1.06, rotate: index % 2 === 0 ? -0.8 : 0.8 }}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          >
            <Image
              src={project.preview.src}
              alt={project.preview.alt}
              fill
              sizes="(min-width: 1024px) 58vw, 100vw"
              className="object-cover"
              style={{ objectPosition: project.preview.position }}
            />
          </m.div>
          <div aria-hidden="true" className="absolute inset-0 rounded-lg border-[6px] border-[#0b0c0e]/20" />
          <figcaption className="absolute bottom-4 left-4 rounded-sm border border-[#33ff66]/50 bg-[#0b0c0e]/85 px-3 py-1.5 font-mono text-[10px] font-bold text-[#33ff66]">
            [LIVE] {project.kicker.toUpperCase()}
          </figcaption>
        </m.figure>
      </LazyTiltFrame>
      </Suspense>
    </article>
  );
}

function SelectedWork({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <section
      id="proof"
      data-cstd-chapter="proof"
      aria-labelledby="proof-heading"
      className="relative z-20 bg-[#0e1013] text-[#d7d7d7] contain-paint [content-visibility:auto] [contain-intrinsic-size:auto_900px]"
    >
      {/* 终端暗纹：极淡网格 */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.35]" style={{ backgroundImage: "linear-gradient(#ffffff08 1px, transparent 1px), linear-gradient(90deg, #ffffff08 1px, transparent 1px)", backgroundSize: "48px 48px" }} />
      {/* ReactBits 风格光球背景（calm 下静态） */}
      <Suspense fallback={null}>
        <LazyOrb disabled={reducedMotion} />
      </Suspense>

      <header className="relative border-b border-[#2a2d33] px-5 pb-10 pt-24 md:px-10 lg:px-16 lg:pb-14 lg:pt-32">
        <div className="mx-auto flex max-w-[1540px] flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div>
            <p className="font-mono text-xs font-black text-[#5b8dff]">$ ls ~/projects/ ▍</p>
            <h2 id="proof-heading" className="mt-5 text-5xl font-black leading-[0.95] tracking-[0] md:text-7xl xl:text-8xl">
              <span className="block">
                <LetterReveal trigger="view" disabled={reducedMotion} staggerDelay={34} duration={860} fromY={95} fromRotate={3}>
                  不陈列全部，
                </LetterReveal>
              </span>
              <span className="block">
                <LetterReveal trigger="view" disabled={reducedMotion} staggerDelay={34} duration={860} delay={210} fromY={95} fromRotate={3}>
                  只放真实运行的证据。
                </LetterReveal>
              </span>
            </h2>
          </div>
          <p className="max-w-md font-mono text-sm leading-7 text-[#8a8f98]">三个项目，分别验证资料结构、研究过程和业务边界。画面可以夸张，结果必须能用。</p>
        </div>
      </header>

      <div data-cstd-proof-reel className="relative">
        {cstdProofs.map((proof, index) => (
          <ProofChapter key={proof.projectId} proof={proof} index={index} reducedMotion={reducedMotion} />
        ))}
      </div>

      <div className="relative border-t border-[#2a2d33] px-5 py-16 md:px-10 lg:px-16">
        <div className="mx-auto grid max-w-[1540px] gap-3 font-mono md:grid-cols-2 md:gap-4">
          {liveProjects.map((project) => {
            const targetProps = getCstdLinkTargetProps(project.href);
            return (
              <div
                key={project.id}
                data-cstd-live-object={project.id}
                className="group rounded-lg border border-[#2a2d33] bg-[#101214] px-5 py-6 shadow-[0_10px_24px_rgba(0,0,0,0.3)] transition-all duration-300 hover:-translate-y-1 hover:border-[#33ff66]/40"
              >
                <p className="text-[10px] font-bold tracking-[0.12em] text-[#5a5f66]">[LIVE OBJECT] {project.kicker.toUpperCase()}</p>
                <a
                  href={project.href}
                  {...targetProps}
                  className="mt-3 flex items-center justify-between gap-4 text-2xl font-black transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#33ff66] md:text-3xl"
                >
                  <Suspense fallback={<>{project.title}</>}>
                    <LazyFocusTitle
                      text={project.title}
                      disabled={reducedMotion}
                      blurRadius={5}
                      className="md:inline-block"
                    />
                  </Suspense>
                  <span className="flex h-10 w-10 flex-none items-center justify-center rounded-md border border-[#33ff66]/40 text-[#33ff66] transition-all duration-300 group-hover:rotate-45 group-hover:bg-[#33ff66] group-hover:text-[#0b0c0e]">
                    <ArrowUpRight aria-hidden="true" className="h-5 w-5" />
                  </span>
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export const MemoizedSelectedWork = memo(SelectedWork);
