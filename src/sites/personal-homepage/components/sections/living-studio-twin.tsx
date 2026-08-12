import Image from "next/image";
import { Activity, ArrowUpRight, GitCommitHorizontal } from "lucide-react";
import { cstdArtBible, type CstdDistrictArt } from "../../content/art-bible";
import { getNarrativeSystems, type CstdNarrativeMode } from "../../content/narratives";
import type { CstdHomepageObservatory } from "../../content/observatory";
import { cstdStudioSnapshot } from "../../content/studio-status";
import type { CstdSystem } from "../../content/systems";
import { getCstdLinkTargetProps } from "../../domain/link-target";
import { StudioSystemExplorer, type StudioSystemArt } from "./studio-system-explorer";
import { ThemeChapterLabel, ThemeCopy } from "../theme-copy";
import type { CstdLocale } from "../../content/content-types";

export function LivingStudioTwin({
  narrativeMode,
  observatory,
  locale,
}: {
  narrativeMode: CstdNarrativeMode;
  observatory: CstdHomepageObservatory;
  locale: CstdLocale;
}) {
  const systems = getNarrativeSystems(narrativeMode);
  const systemIds = new Set<CstdSystem["id"]>(systems.map((system) => system.id));
  const statuses = cstdStudioSnapshot.districts.filter((status) => systemIds.has(status.id));
  const artBySystem = Object.fromEntries(
    systems.map((system) => [system.id, toStudioSystemArt(cstdArtBible[system.id])]),
  ) as Record<CstdSystem["id"], StudioSystemArt>;

  return (
    <section
      data-cstd-chapter="systems"
      data-cstd-scene="systems"
      data-cstd-studio-twin
      aria-labelledby="studio-twin-heading"
      className="relative z-20 overflow-hidden border-y border-white/10 bg-[#07090b] px-5 py-20 text-[#f2efe7] md:px-10 lg:px-16 lg:py-28"
    >
      <Image
        src="/cstd-universe/cstd-core-world-v4.webp"
        alt={locale === "zh" ? "五个能力区域连接到奶黄包个人工作室核心" : "Five capability districts connected to the core of Custard's personal studio"}
        fill
        sizes="100vw"
        className="object-cover object-[64%_50%] opacity-15"
      />
      <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,7,9,0.99),rgba(5,7,9,0.93)_56%,rgba(5,7,9,0.8))]" />

      <div className="relative mx-auto max-w-[1320px]">
        <header data-cstd-chapter-header className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div>
            <p className="flex items-center gap-3 font-mono text-[11px] font-black text-[#24e0ff]">
              <Activity aria-hidden="true" className="h-4 w-4" />
              <ThemeChapterLabel
                neon="02 / CAPABILITY SYSTEM"
                ink={locale === "zh" ? "第二卷 / 器与术" : "SCROLL II / CRAFT & METHOD"}
                press="SECTION A / SYSTEMS DESK"
                pixel="LEVEL 02 / SKILL TREE"
              />
            </p>
            <h2 id="studio-twin-heading" className="mt-5 max-w-4xl text-4xl font-semibold leading-[1] md:text-6xl lg:text-[4rem]">
              <ThemeCopy
                neon={locale === "zh" ? <>我不收集技能图标，<span className="block text-[#f4d431]">我构建能上线的系统。</span></> : <>I do not collect skill badges.<span className="block text-[#f4d431]">I build systems that ship.</span></>}
                ink={locale === "zh" ? <>器有形，术有脉，<span className="block text-[#f4d431]">系统自成章。</span></> : <>Form gives craft a body;<span className="block text-[#f4d431]">method gives systems a pulse.</span></>}
                press={locale === "zh" ? <>五条能力链，<span className="block text-[#f4d431]">正在共同交付。</span></> : <>Five capability chains,<span className="block text-[#f4d431]">shipping as one desk.</span></>}
                pixel={locale === "zh" ? <>技能树不是收藏，<span className="block text-[#f4d431]">通关才算解锁。</span></> : <>A skill tree is not a collection.<span className="block text-[#f4d431]">It unlocks only when the quest clears.</span></>}
              />
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-[#aeb8bb]">
              {locale === "zh" ? "产品界面、智能能力、数据工程、边缘部署和研究模型共同组成一条完整交付链。选择一个方向，查看它如何落进真实作品。" : "Product surfaces, intelligent capability, data engineering, edge delivery, and research models form one complete delivery chain. Choose a direction to see where it lands in shipped work."}
            </p>
          </div>

          <a
            data-cstd-observatory-deployment
            href={observatory.deployment.sourceHref}
            {...getCstdLinkTargetProps(observatory.deployment.sourceHref)}
            className="group flex min-w-56 items-center gap-4 border-y border-white/12 py-4 font-mono transition-colors hover:border-[#24e0ff]/50"
          >
            <GitCommitHorizontal aria-hidden="true" className="h-4 w-4 text-[#24e0ff]" />
            <span>
              <span className="block text-[11px] font-black text-[#788489]">LIVE / {observatory.freshness.toUpperCase()}</span>
              <span className="mt-1 block text-sm font-black text-white">{observatory.deployment.shortCommit}</span>
            </span>
            <ArrowUpRight aria-hidden="true" className="ml-auto h-4 w-4 text-[#788489] transition-colors group-hover:text-[#24e0ff]" />
          </a>
        </header>

        <StudioSystemExplorer
          systems={systems}
          statuses={statuses}
          artBySystem={artBySystem}
          observatory={observatory}
          locale={locale}
        />
      </div>
    </section>
  );
}

function toStudioSystemArt(art: CstdDistrictArt): StudioSystemArt {
  return { accent: art.accent, image: art.image, imageAlt: art.imageAlt };
}
