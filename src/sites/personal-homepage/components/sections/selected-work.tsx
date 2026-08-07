"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { clsx } from "clsx";
import { memo } from "react";
import { cstdProjects } from "../../content/projects";
import { cstdLiveObjectIds, cstdProofs, getCstdProjectsById, type CstdProof } from "../../content/systems";
import { getCstdLinkTargetProps } from "../../domain/link-target";

const proofProjects = getCstdProjectsById(
  cstdProjects,
  cstdProofs.map((proof) => proof.projectId),
);
const liveProjects = getCstdProjectsById(cstdProjects, cstdLiveObjectIds);
const proofAccents = ["#e3aa29", "#2b8e98", "#d55f50"] as const;

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
      data-cstd-proof={proof.projectId}
      className="flex min-h-[72svh] items-center border-t border-black/10 px-5 py-20 contain-paint md:px-10 lg:px-16 lg:py-24"
    >
      <div className={clsx("mx-auto grid w-full max-w-[1540px] items-center gap-12 lg:grid-cols-[minmax(20rem,0.78fr)_minmax(0,1.22fr)] lg:gap-20", index % 2 === 1 && "lg:[&>*:first-child]:order-2")}>
        <div className="max-w-xl self-center">
          <div className="flex items-center gap-4 font-mono text-[10px] font-bold uppercase text-[#65696a]">
            <span style={{ color: accent }}>{String(index + 1).padStart(2, "0")} / Case study</span>
            <span aria-hidden="true" className="h-px flex-1 bg-black/15" />
            <span>{proof.lens}</span>
          </div>
          <h3 className="mt-8 text-5xl font-semibold leading-[0.92] tracking-[0] text-[#111315] md:text-7xl">{project.title}</h3>
          <p className="mt-7 text-2xl font-semibold leading-tight text-[#202427] md:text-3xl">{proof.statement}</p>
          <p className="mt-5 text-base leading-8 text-[#5f6568]">{proof.detail}</p>
          <a
            href={project.href}
            {...targetProps}
            className="mt-9 inline-flex items-center gap-3 border-b-2 pb-2 font-mono text-sm font-black text-[#111315] transition-[gap,color] hover:gap-5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#111315]"
            style={{ borderColor: accent }}
          >
            {project.action}
            <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
          </a>
        </div>

        <figure
          data-cstd-project-plane={proof.projectId}
          className="group relative aspect-[16/10] min-h-0 overflow-hidden rounded-lg border border-black/15 bg-[#111315] shadow-[0_24px_70px_rgba(22,25,27,0.18)]"
        >
          <Image
            src={project.preview.src}
            alt={project.preview.alt}
            fill
            loading="lazy"
            sizes="(min-width: 1024px) 58vw, 100vw"
            className={clsx(
              "object-cover transition-[transform,filter] ease-out group-hover:saturate-100",
              reducedMotion ? "duration-0" : "duration-700 group-hover:scale-[1.035]",
            )}
            style={{ objectPosition: project.preview.position }}
          />
          <div aria-hidden="true" className="absolute inset-0 bg-black/5 transition-colors group-hover:bg-transparent" />
          <figcaption className="absolute bottom-4 left-4 rounded-md bg-[#111315]/90 px-3 py-2 font-mono text-[10px] font-bold uppercase text-white backdrop-blur-md">
            Live / {project.kicker}
          </figcaption>
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
      className="relative z-20 bg-[#e9e5dc] text-[#111315] contain-paint [content-visibility:auto] [contain-intrinsic-size:auto_2600px]"
    >
      <header className="px-5 pb-16 pt-24 md:px-10 md:pt-32 lg:px-16">
        <div className="mx-auto grid max-w-[1540px] gap-8 lg:grid-cols-[1fr_28rem] lg:items-end">
          <div>
            <p className="font-mono text-[11px] font-bold uppercase text-[#2b8e98]">02 / Selected proof</p>
            <h2 id="proof-heading" className="mt-5 max-w-5xl text-5xl font-semibold leading-[0.94] tracking-[0] md:text-7xl xl:text-8xl">
              少而真实的作品，胜过拥挤的目录。
            </h2>
          </div>
          <p className="text-base leading-8 text-[#5f6568]">
            三个代表项目，分别验证信息结构、研究过程与业务系统。每一个都面向真实需求，并持续运行。
          </p>
        </div>
      </header>

      <div data-cstd-proof-reel>
        {cstdProofs.map((proof, index) => (
          <ProofChapter key={proof.projectId} proof={proof} index={index} reducedMotion={reducedMotion} />
        ))}
      </div>

      <div className="border-t border-black/10 bg-[#dcd7cc] px-5 py-16 md:px-10 lg:px-16">
        <div className="mx-auto grid max-w-[1540px] gap-8 md:grid-cols-[18rem_1fr]">
          <div>
            <p className="font-mono text-[10px] font-bold uppercase text-[#65696a]">Other live surfaces</p>
            <p className="mt-3 text-2xl font-semibold">更轻、更个人的持续输出。</p>
          </div>
          <div className="border-t border-black/15">
            {liveProjects.map((project, index) => {
              const targetProps = getCstdLinkTargetProps(project.href);
              return (
                <div key={project.id} data-cstd-live-object={project.id} className="border-b border-black/15">
                  <a
                    href={project.href}
                    {...targetProps}
                    className="group grid grid-cols-[2rem_1fr_auto] items-center gap-4 py-5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#111315]"
                  >
                    <span className="font-mono text-[10px] font-bold text-[#777b7d]">0{index + 1}</span>
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
