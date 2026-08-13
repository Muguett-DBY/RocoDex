import { ArrowUp, ArrowUpRight, RadioTower } from "lucide-react";
import { getCstdNarrative, getCstdNarrativeSharePath, type CstdNarrativeMode } from "../../content/narratives";
import { CstdLink } from "../site/cstd-link";
import { ThemeChapterLabel, ThemeCopy } from "../theme-copy";
import type { CstdLocale, LocalizedText } from "../../content/content-types";

const finalNodes = [
  { code: "PRODUCT", tone: "product" },
  { code: "AGENT", tone: "agent" },
  { code: "DATA", tone: "data" },
  { code: "EDGE", tone: "edge" },
  { code: "RESEARCH", tone: "research" },
] as const;

const collaborationCopy = {
  builder: {
    brief: { zh: "适合一起拆边界、写实现、做发布验收。", en: "A good fit for defining boundaries, implementing systems, and validating releases together." },
    signal: "SYSTEM DELIVERY",
  },
  researcher: {
    brief: { zh: "适合一起把数据、假设、模型与证据链做扎实。", en: "A good fit for making data, assumptions, models, and evidence chains rigorous together." },
    signal: "RESEARCH SYSTEM",
  },
  collaborator: {
    brief: { zh: "适合从真实目标出发，把产品价值一路交付到线上。", en: "A good fit for taking a real objective from product value through to a live release." },
    signal: "PRODUCT COLLABORATION",
  },
} as const satisfies Record<CstdNarrativeMode, { brief: LocalizedText; signal: string }>;

export function Finale({ narrativeMode, locale }: { narrativeMode: CstdNarrativeMode; locale: CstdLocale }) {
  const narrative = getCstdNarrative(narrativeMode);
  const collaboration = collaborationCopy[narrativeMode];
  return (
    <footer
      id="cstd-footer"
      data-cstd-finale
      data-cstd-scene="finale"
      data-cstd-generated-visual="departure-city-v1"
      className="relative z-20 min-h-[76svh] border-t border-[#f4d431]/30 text-[#f2efe7]"
    >
      <div className="relative flex min-h-[76svh] items-end overflow-hidden px-5 pb-12 pt-28 md:px-10 md:pb-16 lg:px-16">
        <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,7,9,0.98)_0%,rgba(5,7,9,0.8)_48%,rgba(5,7,9,0.22)_88%)]" />
        <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(0deg,#050709_0%,rgba(5,7,9,0.28)_38%,transparent_76%)]" />
        <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-[#f4d431]/60" />

        <div data-cstd-finale-layout className="relative mx-auto grid w-full max-w-[1320px] gap-12 lg:grid-cols-[minmax(0,1fr)_21rem] lg:items-end lg:gap-20">
          <div className="max-w-6xl">
            <p className="flex items-center gap-3 font-mono text-[11px] font-black uppercase text-[#24e0ff]">
              <RadioTower aria-hidden="true" className="h-4 w-4" />
              <ThemeChapterLabel neon="06 / FINAL TRANSMISSION" ink={locale === "zh" ? "卷尾 / 山高水长" : "CLOSING SCROLL / THE PATH CONTINUES"} press="BACK PAGE / LATE EDITION" pixel="FINAL STAGE / CONTINUE?" />
            </p>
            <h2 className="cstd-finale-title mt-8 text-5xl font-black leading-[0.9] tracking-[0] md:text-7xl lg:text-[6.5rem]">
              <ThemeCopy
                neon={locale === "zh" ? <>仍在<span className="block text-[#f4d431]">构建。</span></> : <>STILL<span className="block text-[#f4d431]">BUILDING.</span></>}
                ink={locale === "zh" ? <>山水未尽<span className="block text-[#f4d431]">工程长流。</span></> : <>THE SCROLL CONTINUES<span className="block text-[#f4d431]">BEYOND THIS FRAME.</span></>}
                press={locale === "zh" ? <>下一期<span className="block text-[#f4d431]">正在编辑中。</span></> : <>THE NEXT EDITION<span className="block text-[#f4d431]">IS IN PROGRESS.</span></>}
                pixel={locale === "zh" ? <>任务完成<span className="block text-[#f4d431]">新游戏+</span></> : <>QUEST CLEAR<span className="block text-[#f4d431]">NEW GAME+</span></>}
              />
            </h2>
            <p className="mt-7 max-w-2xl text-lg font-semibold leading-8 text-[#cbd3d5] md:text-xl md:leading-9">
              {collaboration.brief[locale]} {locale === "zh" ? "每条能力仍在继续向前连接。" : "Every capability keeps connecting to what comes next."}
            </p>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 font-mono text-[11px] font-black">
              {finalNodes.map((node) => (
                <span key={node.code} data-cstd-final-tone={node.tone} className="cstd-final-capability flex items-center gap-2">
                  <span className="cstd-final-node h-1 w-1 bg-current" />
                  {node.code}
                </span>
              ))}
            </div>
          </div>

          <div className="cstd-finale-contact border-l pl-6 font-mono md:pl-8">
            <p className="text-[11px] font-black text-[#24e0ff]">{collaboration.signal}</p>
            <p className="cstd-finale-context mt-4 text-xs leading-6">{locale === "zh" ? "当前观看路径：" : "Current viewing path: "}<span className="text-[#f4d431]">{narrative.label[locale]}</span></p>
            <a
              href={`mailto:cstd@custard.top?subject=${encodeURIComponent(`CSTD / ${collaboration.signal}`)}`}
              className="cstd-finale-address mt-5 block text-base font-black transition-colors hover:text-[#f4d431] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f4d431]"
            >
              cstd@custard.top
            </a>
            <p className="cstd-finale-meta mt-3 text-[11px] leading-5">{locale === "zh" ? "奶黄包个人技术工作室" : "CUSTARD PERSONAL ENGINEERING STUDIO"} / SYDNEY</p>
            <div className="mt-7 flex items-center gap-5">
              <CstdLink href={getCstdNarrativeSharePath(narrativeMode, locale)} aria-label={locale === "zh" ? "分享这条观看路径" : "Share this viewing path"} className="inline-flex h-10 w-10 items-center justify-center border border-[#24e0ff]/35 text-[#24e0ff] hover:bg-[#24e0ff] hover:text-[#050709]">
                <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
              </CstdLink>
              <a
                href="#top"
                aria-label={locale === "zh" ? "返回页面顶部" : "Back to top"}
                className="inline-flex h-10 w-10 items-center justify-center border border-[#f4d431]/45 text-[#f4d431] transition-colors hover:bg-[#f4d431] hover:text-[#050709] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f4d431]"
              >
                <ArrowUp aria-hidden="true" className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
