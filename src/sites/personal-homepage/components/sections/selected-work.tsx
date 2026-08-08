"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { clsx } from "clsx";
import { memo, type PointerEvent as ReactPointerEvent } from "react";
import { ProjectBroadcast } from "../project-broadcast";
import { cstdProjects } from "../../content/projects";
import { cstdLiveObjectIds, cstdProofs, getCstdProjectsById, type CstdProof } from "../../content/systems";
import { getCstdLinkTargetProps } from "../../domain/link-target";

const proofProjects = getCstdProjectsById(
  cstdProjects,
  cstdProofs.map((proof) => proof.projectId),
);
const liveProjects = getCstdProjectsById(cstdProjects, cstdLiveObjectIds);
const proofAccents = ["#f4d431", "#24e0ff", "#ff3b30"] as const;
const proofSurfaces = ["bg-[#090c0f]", "bg-[#0b1418]", "bg-[#140a0a]"] as const;
const proofBroadcasts: Record<string, string> = {
  rocodex: "/cstd-broadcasts/rocodex-broadcast-v1.webm",
  alpha: "/cstd-broadcasts/alpha-broadcast-v1.webm",
  crm: "/cstd-broadcasts/crm-broadcast-v1.webm",
};

function moveLiveFeed(event: ReactPointerEvent<HTMLElement>) {
  const bounds = event.currentTarget.getBoundingClientRect();
  const x = (event.clientX - bounds.left) / bounds.width - 0.5;
  const y = (event.clientY - bounds.top) / bounds.height - 0.5;
  event.currentTarget.style.setProperty("--feed-x", `${x * -16}px`);
  event.currentTarget.style.setProperty("--feed-y", `${y * -12}px`);
  event.currentTarget.style.setProperty("--feed-rx", `${y * -2.4}deg`);
  event.currentTarget.style.setProperty("--feed-ry", `${x * 3.2}deg`);
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

  return (
    <article
      id={`proof-${proof.projectId}`}
      data-cstd-proof={proof.projectId}
      className={clsx("flex min-h-[72svh] items-center border-t border-white/10 px-5 py-20 text-[#f2efe7] contain-paint md:px-10 lg:px-16 lg:py-24", proofSurfaces[index])}
    >
      <div className={clsx("mx-auto grid w-full max-w-[1540px] items-center gap-12 lg:grid-cols-[minmax(20rem,0.78fr)_minmax(0,1.22fr)] lg:gap-20", index % 2 === 1 && "lg:[&>*:first-child]:order-2")}>
        <div className="max-w-xl self-center">
          <div className="flex items-center gap-4 font-mono text-[10px] font-bold uppercase text-[#718087]">
            <span style={{ color: accent }}>{String(index + 1).padStart(2, "0")} // DATA SHARD</span>
            <span aria-hidden="true" className="h-px flex-1 bg-white/15" />
            <span>[{proof.lens}]</span>
          </div>
          <h3 className="mt-8 text-5xl font-semibold leading-[0.92] tracking-[0] text-[#f2efe7] md:text-7xl">{project.title}</h3>
          <p className="mt-7 text-2xl font-semibold leading-tight text-[#d9dfe1] md:text-3xl">{proof.statement}</p>
          <p className="mt-5 text-base leading-8 text-[#8f9ba0]">{proof.detail}</p>
          <a
            href={project.href}
            {...targetProps}
            className="mt-9 inline-flex items-center gap-3 border-b-2 pb-2 font-mono text-sm font-black text-[#f2efe7] transition-[gap,color] hover:gap-5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f4d431]"
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
          className="cstd-live-feed group relative aspect-[16/10] min-h-0 overflow-hidden border border-white/15 bg-[#050709] shadow-[0_24px_70px_rgba(0,0,0,0.45)] [clip-path:polygon(0_0,100%_0,100%_calc(100%-18px),calc(100%-18px)_100%,0_100%)]"
        >
          <ProjectBroadcast
            src={proofBroadcasts[project.id]}
            poster={project.preview.src}
            alt={project.preview.alt}
            position={project.preview.position}
            reducedMotion={reducedMotion}
          />
          <div aria-hidden="true" className="absolute inset-0 bg-black/10 transition-colors group-hover:bg-transparent" />
          <div aria-hidden="true" className="absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(255,255,255,0.16)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.16)_1px,transparent_1px)] [background-size:48px_48px]" />
          <div aria-hidden="true" className="cstd-feed-scan absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <span aria-hidden="true" className="absolute left-[var(--feed-scan-x,50%)] top-[var(--feed-scan-y,50%)] h-12 w-12 -translate-x-1/2 -translate-y-1/2 border border-white/55 opacity-0 transition-opacity group-hover:opacity-100">
            <span className="absolute -left-1 -top-1 h-2 w-2 bg-white" />
          </span>
          <div className="absolute right-3 top-3 hidden min-w-32 border-r-2 border-[#24e0ff] bg-[#050709]/82 px-3 py-2 text-right font-mono text-[9px] font-black text-[#8f9ba0] backdrop-blur-md sm:block">
            <p className="text-[#3dff8f]">● LIVE / 00{index + 1}</p>
            <p className="mt-1">SYNC {99 - index * 2}.8%</p>
            <p>LATENCY {12 + index * 7}MS</p>
          </div>
          <figcaption className="absolute left-4 top-4 border-l-2 bg-[#050709]/90 px-3 py-2 font-mono text-[10px] font-bold uppercase text-white backdrop-blur-md" style={{ borderColor: accent }}>
            LIVE NODE / {project.kicker}
          </figcaption>
          <div className="absolute inset-x-0 bottom-0 hidden grid-cols-3 border-t border-white/15 bg-[#050709]/86 backdrop-blur-md sm:grid">
            {project.metrics.map(([value, label]) => (
              <div key={label} className="border-r border-white/10 px-3 py-3 last:border-r-0">
                <p className="font-mono text-xs font-black" style={{ color: accent }}>{value}</p>
                <p className="mt-1 font-mono text-[8px] font-bold uppercase text-[#718087]">{label}</p>
              </div>
            ))}
          </div>
        </figure>
      </div>
    </article>
  );
}

function SelectedWork({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <section
      id="proof"
      data-cstd-chapter="proof"
      aria-labelledby="proof-heading"
      className="relative z-20 bg-[#090c0f] text-[#f2efe7] contain-paint [content-visibility:auto] [contain-intrinsic-size:auto_2600px]"
    >
      <header className="relative overflow-hidden bg-[#f4d431] px-5 pb-16 pt-24 text-[#050709] md:px-10 md:pt-32 lg:px-16">
        <span aria-hidden="true" className="absolute -right-6 bottom-[-3rem] font-mono text-[13rem] font-black leading-none text-black/[0.08] md:text-[22rem]">02</span>
        <div className="mx-auto grid max-w-[1540px] gap-8 lg:grid-cols-[1fr_28rem] lg:items-end">
          <div>
            <p className="font-mono text-[11px] font-black uppercase text-[#050709]">02 // LIVE DATA SHARDS</p>
            <h2 id="proof-heading" className="mt-5 max-w-5xl text-5xl font-semibold leading-[0.94] tracking-[0] md:text-7xl xl:text-8xl">
              少而真实的作品，胜过拥挤的目录。
            </h2>
          </div>
          <p className="relative text-base font-medium leading-8 text-[#34320f]">
            三个代表项目以动态广播持续发送真实界面与交付证据。镜头只在进入视野时运行，离开即暂停。
          </p>
        </div>
      </header>

      <div data-cstd-proof-reel>
        {cstdProofs.map((proof, index) => (
          <ProofChapter key={proof.projectId} proof={proof} index={index} reducedMotion={reducedMotion} />
        ))}
      </div>

      <div className="border-t border-[#f4d431]/25 bg-[#070a0c] px-5 py-16 md:px-10 lg:px-16">
        <div className="mx-auto grid max-w-[1540px] gap-8 md:grid-cols-[18rem_1fr]">
          <div>
            <p className="font-mono text-[10px] font-bold uppercase text-[#24e0ff]">SECONDARY NODES</p>
            <p className="mt-3 text-2xl font-semibold text-[#f2efe7]">仍在发送信号的个人表面。</p>
          </div>
          <div className="border-t border-white/15">
            {liveProjects.map((project, index) => {
              const targetProps = getCstdLinkTargetProps(project.href);
              return (
                <div key={project.id} data-cstd-live-object={project.id} className="border-b border-white/15">
                  <a
                    href={project.href}
                    {...targetProps}
                    className="group grid grid-cols-[2rem_1fr_auto] items-center gap-4 py-5 text-[#d9dfe1] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#24e0ff] md:grid-cols-[2rem_6rem_1fr_auto]"
                  >
                    <span className="font-mono text-[10px] font-bold text-[#68757b]">0{index + 1}</span>
                    {project.preview ? (
                      <span className="relative hidden aspect-[16/9] overflow-hidden border border-white/15 bg-black md:block">
                        <Image
                          src={project.preview.src}
                          alt=""
                          fill
                          loading="lazy"
                          sizes="96px"
                          className="object-cover saturate-50 transition-[transform,filter] duration-500 group-hover:scale-110 group-hover:saturate-100"
                          style={{ objectPosition: project.preview.position }}
                        />
                      </span>
                    ) : null}
                    <span className="text-xl font-semibold md:text-2xl">{project.title}</span>
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
