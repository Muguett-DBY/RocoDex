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

const studioIntro = {
  zh: {
    neon: "产品、AI、数据和发布是同一件事的不同侧面。点开一个方向，看它在真实项目里承担了什么。",
    ink: "这里不挂满术语。每一项能力都要落到一件做成的器物上，再留下可以回看的痕迹。",
    press: "本版按五个部门整理工作：产品、边缘交付、AI、研究和数据。它们不是栏目，而是同一张生产单上的协作关系。",
    pixel: "五条技能线，五种过关方式。打开一个节点，看看它用过什么装备，又在哪个项目里真正派上了用场。",
    underworld: "五条能力链就是五套铸具。打开一套，看它如何塑形、承受试炼，又在哪个真实项目里留下锻痕。",
    astral: "五条能力链像一支队伍：各自有专长，也必须在同一场冒险里互相接住。打开一条，看看它在哪个真实项目里改变了路线。",
  },
  en: {
    neon: "Product, AI, data, and release are different sides of the same job. Open a district to see what it carried in a real project.",
    ink: "This is not a wall of terms. Each skill has to become a made object, with a trace that can still be read later.",
    press: "This edition files the work under five desks: product, edge delivery, AI, research, and data. They are collaborators on one production sheet, not empty categories.",
    pixel: "Five skill lines, five ways to clear a level. Open a node to see the gear it used and the project where it had to work.",
    underworld: "Five capability chains, five sets of tools. Open one to see how it shapes a system, survives trial, and leaves a mark on real work.",
    astral: "Five capability chains form one party. Each has a specialty, but they still have to carry the same adventure. Open one to see where it changed a real project's route.",
  },
} as const;

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
                press={locale === "zh" ? "栏目 A / 系统部" : "SECTION A / SYSTEMS DESK"}
                pixel={locale === "zh" ? "关卡 02 / 技能树" : "LEVEL 02 / SKILL TREE"}
                underworld={locale === "zh" ? "第二殿 / 铸造系统" : "HALL II / SYSTEMS FORGE"}
                astral={locale === "zh" ? "第二章 / 队伍与法术书" : "CHAPTER II / PARTY & SPELLBOOK"}
              />
            </p>
            <h2 id="studio-twin-heading" className="mt-5 max-w-4xl text-4xl font-semibold leading-[1] md:text-6xl lg:text-[4rem]">
              <ThemeCopy
                neon={locale === "zh" ? <>我不收集技能图标，<span className="block text-[#f4d431]">我构建能上线的系统。</span></> : <>I do not collect skill badges.<span className="block text-[#f4d431]">I build systems that ship.</span></>}
                ink={locale === "zh" ? <>器有形，术有脉，<span className="block text-[#f4d431]">系统自成章。</span></> : <>Form gives craft a body;<span className="block text-[#f4d431]">method gives systems a pulse.</span></>}
                press={locale === "zh" ? <>五条能力链，<span className="block text-[#f4d431]">正在共同交付。</span></> : <>Five capability chains,<span className="block text-[#f4d431]">shipping as one desk.</span></>}
                pixel={locale === "zh" ? <>技能树不是收藏，<span className="block text-[#f4d431]">通关才算解锁。</span></> : <>A skill tree is not a collection.<span className="block text-[#f4d431]">It unlocks only when the quest clears.</span></>}
                underworld={locale === "zh" ? <>能力不是徽章，<span className="block text-[#f4d431]">是反复淬炼的工具。</span></> : <>Capability is not a badge.<span className="block text-[#f4d431]">It is a tool tempered through use.</span></>}
                astral={locale === "zh" ? <>能力不是技能栏，<span className="block text-[#f4d431]">是队伍里真正能接住局面的本事。</span></> : <>Capability is not a spell slot.<span className="block text-[#f4d431]">It is what the party can rely on.</span></>}
              />
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-[#aeb8bb]">
              <ThemeCopy
                neon={studioIntro[locale].neon}
                ink={studioIntro[locale].ink}
                press={studioIntro[locale].press}
                pixel={studioIntro[locale].pixel}
                underworld={studioIntro[locale].underworld}
                astral={studioIntro[locale].astral}
              />
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
