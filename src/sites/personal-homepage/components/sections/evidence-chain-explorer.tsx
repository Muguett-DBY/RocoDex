"use client";

import { ArrowUpRight, CheckCircle2, ExternalLink, GitBranch } from "lucide-react";
import { useState, type KeyboardEvent } from "react";
import type { CstdLocale } from "../../content/content-types";
import type { HomepageEvidenceChain, HomepageEvidencePhaseId } from "../../content/homepage-experience";
import { CstdLink } from "../site/cstd-link";
import { ThemeCopy } from "../theme-copy";

function focusSiblingTab(event: KeyboardEvent<HTMLButtonElement>, nextIndex: number) {
  const tabs = event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>('[role="tab"]');
  tabs?.[nextIndex]?.focus();
}

export function EvidenceChainExplorer({ chains, locale }: { chains: readonly HomepageEvidenceChain[]; locale: CstdLocale }) {
  const [activeProjectId, setActiveProjectId] = useState(chains[0]?.id ?? "");
  const [activePhaseId, setActivePhaseId] = useState<HomepageEvidencePhaseId>("problem");
  const activeChain = chains.find((chain) => chain.id === activeProjectId) ?? chains[0];
  const activePhase = activeChain?.phases.find((phase) => phase.id === activePhaseId) ?? activeChain?.phases[0];

  if (!activeChain || !activePhase) return null;

  function selectProject(projectId: string) {
    setActiveProjectId(projectId);
    setActivePhaseId("problem");
  }

  function handleProjectKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight" && event.key !== "Home" && event.key !== "End") return;
    event.preventDefault();
    const nextIndex = event.key === "Home" ? 0 : event.key === "End" ? chains.length - 1 : (index + (event.key === "ArrowRight" ? 1 : -1) + chains.length) % chains.length;
    selectProject(chains[nextIndex].id);
    focusSiblingTab(event, nextIndex);
  }

  function handlePhaseKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const phases = activeChain.phases;
    if (event.key !== "ArrowUp" && event.key !== "ArrowDown" && event.key !== "ArrowLeft" && event.key !== "ArrowRight" && event.key !== "Home" && event.key !== "End") return;
    event.preventDefault();
    const forward = event.key === "ArrowDown" || event.key === "ArrowRight";
    const nextIndex = event.key === "Home" ? 0 : event.key === "End" ? phases.length - 1 : (index + (forward ? 1 : -1) + phases.length) % phases.length;
    setActivePhaseId(phases[nextIndex].id);
    focusSiblingTab(event, nextIndex);
  }

  return (
    <section data-cstd-evidence-chain aria-labelledby="evidence-chain-heading" className="mt-14">
      <header data-cstd-evidence-chain-header className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="flex items-center gap-2 font-mono text-[10px] font-black"><GitBranch aria-hidden="true" className="h-4 w-4" /> <ThemeCopy neon="TRACE / DECISION CHAIN" underworld={locale === "zh" ? "试炼谱 / 因果与证据" : "TRIAL MAP / CAUSE TO PROOF"} astral={locale === "zh" ? "冒险日志 / 选择与后果" : "ADVENTURE LOG / CHOICE & CONSEQUENCE"} /></p>
          <h3 id="evidence-chain-heading" className="mt-3 text-2xl font-semibold md:text-4xl">{locale === "zh" ? "别只看成品，沿着决定走一遍。" : "Do not stop at the outcome. Follow the decisions."}</h3>
        </div>
        <p className="max-w-md text-sm leading-6">{locale === "zh" ? "选择一个项目，再检查问题、取舍、系统和验证。每一段都来自对应案例与公开证据清单。" : "Choose a project, then inspect its problem, decision, system, and verification. Every step is projected from the case and proof manifest."}</p>
      </header>

      <div role="tablist" aria-label={locale === "zh" ? "选择项目证据链" : "Choose a project evidence chain"} data-cstd-evidence-project-tabs className="mt-7 grid md:grid-cols-3">
        {chains.map((chain, index) => {
          const active = chain.id === activeChain.id;
          return (
            <button
              key={chain.id}
              type="button"
              role="tab"
              id={`evidence-project-${chain.id}`}
              aria-selected={active}
              aria-controls="evidence-chain-panel"
              tabIndex={active ? 0 : -1}
              data-cstd-evidence-project-active={active ? "true" : "false"}
              onClick={() => selectProject(chain.id)}
              onKeyDown={(event) => handleProjectKeyDown(event, index)}
            >
              <span>0{index + 1}</span>
              <strong>{chain.title}</strong>
              <small>{chain.coverageScore}% / {chain.artifactCount} {locale === "zh" ? "项证据" : "artifacts"}</small>
            </button>
          );
        })}
      </div>

      <div id="evidence-chain-panel" role="tabpanel" aria-labelledby={`evidence-project-${activeChain.id}`} data-cstd-evidence-panel className="grid lg:grid-cols-[15rem_minmax(0,1fr)]">
        <div role="tablist" aria-label={locale === "zh" ? "选择证据阶段" : "Choose an evidence phase"} aria-orientation="vertical" data-cstd-evidence-phase-tabs>
          {activeChain.phases.map((phase, index) => {
            const active = phase.id === activePhase.id;
            return (
              <button
                key={phase.id}
                type="button"
                role="tab"
                id={`evidence-phase-${activeChain.id}-${phase.id}`}
                aria-selected={active}
                aria-controls="evidence-phase-panel"
                tabIndex={active ? 0 : -1}
                data-cstd-evidence-phase-active={active ? "true" : "false"}
                onClick={() => setActivePhaseId(phase.id)}
                onKeyDown={(event) => handlePhaseKeyDown(event, index)}
              >
                <span>{String(index + 1).padStart(2, "0")}</span><strong>{phase.label}</strong><i aria-hidden="true" />
              </button>
            );
          })}
        </div>

        <article id="evidence-phase-panel" role="tabpanel" aria-labelledby={`evidence-phase-${activeChain.id}-${activePhase.id}`} data-cstd-evidence-phase-panel>
          <p data-cstd-evidence-signal>{activePhase.signal}</p>
          <h4>{activePhase.title}</h4>
          <p>{activePhase.detail}</p>
          <div data-cstd-evidence-meta>
            <span><CheckCircle2 aria-hidden="true" /> {locale === "zh" ? "证据覆盖" : "Proof coverage"} {activeChain.coverageScore}%</span>
            <span>{locale === "zh" ? "最近核验" : "Last verified"} {activeChain.verifiedAt}</span>
          </div>
          <div data-cstd-evidence-actions>
            <CstdLink href={activeChain.caseHref} eagerPrefetch>{locale === "zh" ? "读完整案例" : "Read the complete case"} <ArrowUpRight aria-hidden="true" /></CstdLink>
            {activeChain.liveHref ? <CstdLink href={activeChain.liveHref}>{locale === "zh" ? "打开线上系统" : "Open the live system"} <ExternalLink aria-hidden="true" /></CstdLink> : null}
          </div>
        </article>
      </div>
    </section>
  );
}
