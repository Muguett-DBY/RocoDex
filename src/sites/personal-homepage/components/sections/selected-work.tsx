"use client";

import { ArrowUpRight, Braces, RadioTower } from "lucide-react";
import { memo, type PointerEvent as ReactPointerEvent } from "react";
import { cstdProjects } from "../../content/projects";
import { cstdLiveObjectIds, cstdProofs, getCstdProjectsById, type CstdProof } from "../../content/systems";
import { getCstdLinkTargetProps } from "../../domain/link-target";
import { cstdBroadcasts } from "../../media/asset-manifest";
import { ProjectBroadcast } from "../project-broadcast";

const proofProjects = getCstdProjectsById(
  cstdProjects,
  cstdProofs.map((proof) => proof.projectId),
);
const liveProjects = getCstdProjectsById(cstdProjects, cstdLiveObjectIds);
const proofAccents = ["#f4d431", "#24e0ff", "#ff3b30"] as const;

function moveLiveFeed(event: ReactPointerEvent<HTMLElement>) {
  const bounds = event.currentTarget.getBoundingClientRect();
  const x = (event.clientX - bounds.left) / bounds.width - 0.5;
  const y = (event.clientY - bounds.top) / bounds.height - 0.5;
  event.currentTarget.style.setProperty("--feed-x", `${x * -14}px`);
  event.currentTarget.style.setProperty("--feed-y", `${y * -10}px`);
  event.currentTarget.style.setProperty("--feed-rx", `${y * -2.2}deg`);
  event.currentTarget.style.setProperty("--feed-ry", `${x * 3}deg`);
  event.currentTarget.style.setProperty("--feed-scan-x", `${(x + 0.5) * 100}%`);
  event.currentTarget.style.setProperty("--feed-scan-y", `${(y + 0.5) * 100}%`);
}

function resetLiveFeed(event: ReactPointerEvent<HTMLElement>) {
  event.currentTarget.style.setProperty("--feed-x", "0px");
  event.currentTarget.style.setProperty("--feed-y", "0px");
  event.currentTarget.style.setProperty("--feed-rx", "0deg");
  event.currentTarget.style.setProperty("--feed-ry", "0deg");
  event.currentTarget.style.setProperty("--feed-scan-x", "50%");
  event.currentTarget.style.setProperty("--feed-scan-y", "50%");
}

function ProofChapter({
  proof,
  index,
  reducedMotion,
}: {
  proof: CstdProof;
  index: number;
  reducedMotion: boolean;
}) {
  const project = proofProjects.find((candidate) => candidate.id === proof.projectId);
  if (!project?.preview) return null;
  const targetProps = getCstdLinkTargetProps(project.href);
  const accent = proofAccents[index];
  const sources = cstdBroadcasts[proof.projectId];

  return (
    <article
      id={`proof-${proof.projectId}`}
      data-cstd-proof={proof.projectId}
      data-cstd-broadcast-scene={String(index + 1).padStart(2, "0")}
      className="relative border-t border-white/15 lg:min-h-[140svh]"
    >
      <div className="relative flex min-h-svh items-center overflow-hidden px-5 pb-16 pt-24 md:px-10 lg:sticky lg:top-0 lg:px-16">
        <div aria-hidden="true" className="absolute inset-0 bg-[#050709]/35 backdrop-blur-[1px]" />
        <div aria-hidden="true" className="absolute inset-x-0 top-16 h-px" style={{ backgroundColor: `${accent}80` }} />
        <span aria-hidden="true" className="absolute right-5 top-24 hidden font-mono text-[11rem] font-black leading-none text-white/[0.035] lg:block xl:text-[16rem]">0{index + 1}</span>

        <div className="relative mx-auto grid w-full max-w-[1540px] items-center gap-10 lg:grid-cols-[minmax(19rem,0.7fr)_minmax(0,1.3fr)] lg:gap-14 xl:gap-20">
          <div className="max-w-xl">
            <div className="flex items-center gap-3 font-mono text-[9px] font-black text-[#8f9ba0]">
              <RadioTower aria-hidden="true" className="h-4 w-4" style={{ color: accent }} />
              BROADCAST {String(index + 1).padStart(2, "0")} / {proof.lens.toUpperCase()}
              <span className="h-px flex-1 bg-white/15" />
            </div>
            <p className="mt-9 font-mono text-[10px] font-black" style={{ color: accent }}>{project.kicker.toUpperCase()} / LIVE SYSTEM</p>
            <h3 className="mt-4 text-5xl font-semibold leading-[0.9] tracking-[0] text-[#f2efe7] md:text-7xl">{project.title}</h3>
            <p className="mt-7 text-2xl font-semibold leading-tight text-[#e4e8e9] md:text-3xl">{proof.statement}</p>
            <p className="mt-5 text-base leading-8 text-[#9aa4a8]">{proof.detail}</p>

            <div className="mt-8 border-y border-white/15 py-5">
              <p className="font-mono text-[8px] font-black text-[#68757b]">ENGINEERING DECISION</p>
              <p className="mt-3 text-sm leading-7 text-[#c9d0d2]">{proof.decision}</p>
              <p className="mt-4 font-mono text-[9px] font-black" style={{ color: accent }}>SIGNAL / {proof.signal}</p>
            </div>

            <a
              href={project.href}
              {...targetProps}
              className="mt-8 inline-flex items-center gap-3 border-b-2 pb-2 font-mono text-sm font-black text-[#f2efe7] transition-[gap,color] hover:gap-5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f4d431]"
              style={{ borderColor: accent }}
            >
              {project.action}
              <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
            </a>
          </div>

          <figure
            data-cstd-project-plane={proof.projectId}
            data-cstd-live-feed={proof.projectId}
            onPointerMove={reducedMotion ? undefined : moveLiveFeed}
            onPointerLeave={reducedMotion ? undefined : resetLiveFeed}
            className="cstd-live-feed cstd-broadcast-aperture group relative aspect-[16/10] min-h-0 overflow-hidden border border-white/20 bg-[#050709] shadow-[0_32px_90px_rgba(0,0,0,0.58)] [clip-path:polygon(0_0,100%_0,100%_calc(100%-20px),calc(100%-20px)_100%,0_100%)]"
          >
            <ProjectBroadcast
              sources={sources}
              poster={project.preview.src}
              alt={project.preview.alt}
              position={project.preview.position}
              reducedMotion={reducedMotion}
            />
            <div aria-hidden="true" className="absolute inset-0 bg-black/5 transition-colors group-hover:bg-transparent" />
            <div aria-hidden="true" className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,0.14)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.14)_1px,transparent_1px)] [background-size:48px_48px]" />
            <div aria-hidden="true" className="cstd-feed-scan absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <span aria-hidden="true" className="absolute left-[var(--feed-scan-x,50%)] top-[var(--feed-scan-y,50%)] h-12 w-12 -translate-x-1/2 -translate-y-1/2 border border-white/55 opacity-0 transition-opacity group-hover:opacity-100">
              <span className="absolute -left-1 -top-1 h-2 w-2 bg-white" />
            </span>
            <figcaption className="absolute left-4 top-4 border-l-2 bg-[#050709]/90 px-3 py-2 font-mono text-[9px] font-black text-white backdrop-blur-md" style={{ borderColor: accent }}>
              VERIFIED UI FEED / {project.id.toUpperCase()}
            </figcaption>
            <div className="absolute right-3 top-3 hidden min-w-32 border-r-2 bg-[#050709]/86 px-3 py-2 text-right font-mono text-[8px] font-black text-[#8f9ba0] backdrop-blur-md sm:block" style={{ borderColor: accent }}>
              <p className="text-[#3dff8f]">LIVE / BUFFERED</p>
              <p className="mt-1">WEBM + H264</p>
              <p>VIEWPORT SYNC</p>
            </div>
          </figure>
        </div>
      </div>
    </article>
  );
}

function SelectedWork({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <section
      id="proof"
      data-cstd-chapter="proof"
      data-cstd-scene="proof"
      aria-labelledby="proof-heading"
      className="relative z-20 text-[#f2efe7] contain-paint [content-visibility:auto] [contain-intrinsic-size:auto_3600px]"
    >
      <header className="relative flex min-h-[78svh] items-end overflow-hidden border-y border-[#f4d431]/35 bg-[#050709]/38 px-5 pb-16 pt-28 backdrop-blur-[2px] md:px-10 lg:px-16 lg:pb-20">
        <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,7,9,0.94)_0%,rgba(5,7,9,0.55)_48%,rgba(5,7,9,0.14)_100%)]" />
        <span aria-hidden="true" className="absolute -right-8 bottom-[-3rem] font-mono text-[14rem] font-black leading-none text-[#f4d431]/[0.08] md:text-[23rem]">02</span>
        <div className="relative mx-auto grid w-full max-w-[1540px] gap-8 lg:grid-cols-[1fr_28rem] lg:items-end">
          <div>
            <p className="flex items-center gap-3 font-mono text-[10px] font-black text-[#f4d431]">
              <Braces aria-hidden="true" className="h-4 w-4" /> 02 // PROJECT BROADCAST NEXUS
            </p>
            <h2 id="proof-heading" className="mt-6 max-w-5xl text-5xl font-semibold leading-[0.9] tracking-[0] md:text-7xl xl:text-8xl">
              不展示目录。
              <span className="block text-[#24e0ff]">直接接入正在运行的系统。</span>
            </h2>
          </div>
          <p className="text-base leading-8 text-[#b0b8bb]">
            三段真实界面广播分别回答价值、工程决策与交付证据。媒体只在当前和相邻镜头挂载，离开窗口即释放。
          </p>
        </div>
      </header>

      <div data-cstd-proof-reel>
        {cstdProofs.map((proof, index) => (
          <ProofChapter key={proof.projectId} proof={proof} index={index} reducedMotion={reducedMotion} />
        ))}
      </div>

      <div className="border-y border-[#24e0ff]/25 bg-[#050709]/92 px-5 py-16 backdrop-blur-xl md:px-10 lg:px-16">
        <div className="mx-auto grid max-w-[1540px] gap-8 md:grid-cols-[20rem_1fr]">
          <div>
            <p className="font-mono text-[9px] font-black text-[#24e0ff]">SECONDARY UPLINKS</p>
            <p className="mt-3 text-2xl font-semibold">另外两个仍在持续运行的个人表面。</p>
          </div>
          <div className="border-t border-white/15">
            {liveProjects.map((project, index) => {
              const targetProps = getCstdLinkTargetProps(project.href);
              return (
                <div key={project.id} data-cstd-live-object={project.id} className="border-b border-white/15">
                  <a
                    href={project.href}
                    {...targetProps}
                    className="group grid grid-cols-[2rem_1fr_auto] items-center gap-4 py-5 text-[#d9dfe1] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#24e0ff]"
                  >
                    <span className="font-mono text-[9px] font-black text-[#68757b]">0{index + 1}</span>
                    <span>
                      <span className="block text-xl font-semibold md:text-2xl">{project.title}</span>
                      <span className="mt-1 block font-mono text-[9px] font-black text-[#718087]">{project.kicker.toUpperCase()} / LIVE</span>
                    </span>
                    <ArrowUpRight aria-hidden="true" className="h-5 w-5 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export const MemoizedSelectedWork = memo(SelectedWork);
