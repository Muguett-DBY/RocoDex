import { ArrowUpRight, FlaskConical } from "lucide-react";
import { cstdCaseReplays } from "../../content/case-replays";
import { CstdLink } from "../site/cstd-link";
import { ExecutableCaseReplay } from "../site/executable-case-replay";
import { ThemeChapterLabel, ThemeCopy } from "../theme-copy";
import type { CstdLocale } from "../../content/content-types";
import { getLocalizedCstdHref } from "../../infrastructure/i18n";

export function ExecutableEvidence({ locale }: { locale: CstdLocale }) {
  const replay = cstdCaseReplays[0];

  return (
    <section data-cstd-chapter="operator" data-cstd-evidence-subchapter data-cstd-executable-evidence data-cstd-home-replay={replay.id} aria-labelledby="executable-evidence-heading" className="relative z-20 border-b border-white/10 bg-[#050709] px-5 py-20 text-[#f2efe7] md:px-10 lg:px-16 lg:py-28">
      <span id="operator" aria-hidden="true" className="absolute left-0 top-0 h-px w-px scroll-mt-20" />
      <div data-cstd-evidence-layout className="mx-auto grid max-w-[1320px] gap-10 xl:grid-cols-[minmax(25rem,0.9fr)_minmax(0,1.1fr)] xl:items-start xl:gap-16">
        <div>
          <p className="flex items-center gap-3 font-mono text-[11px] font-black text-[#24e0ff]"><FlaskConical aria-hidden="true" className="h-4 w-4" /> <ThemeChapterLabel neon="03B / EXECUTABLE EVIDENCE" underworld={locale === "zh" ? "试炼场 / 可执行证据" : "TRIAL CHAMBER / EXECUTABLE PROOF"} astral={locale === "zh" ? "命运判定 / 可执行证据" : "FATE CHECK / EXECUTABLE PROOF"} /></p>
          <h2 id="executable-evidence-heading" className="mt-5 text-4xl font-semibold leading-[1] md:text-6xl xl:text-[3.75rem]">
            <ThemeCopy
              neon={locale === "zh" ? <>案例不只可读，<span className="block text-[#f4d431]">还可以运行。</span></> : <>A case is not only readable.<span className="block text-[#f4d431]">It can be executed.</span></>}
              underworld={locale === "zh" ? <>别把结果写成传说，<span className="block text-[#f4d431]">运行才算证词。</span></> : <>Do not turn the result into legend.<span className="block text-[#f4d431]">The run is the testimony.</span></>}
              astral={locale === "zh" ? <>结果不能靠传闻，<span className="block text-[#f4d431]">掷下骰子，亲自过一次判定。</span></> : <>A result cannot live on hearsay.<span className="block text-[#f4d431]">Make the roll and test it yourself.</span></>}
            />
          </h2>
          <p className="mt-5 max-w-xl text-base leading-8 text-[#aeb7ba]">
            <ThemeCopy
              neon={locale === "zh" ? "不放一段录屏糊弄过去。这里把输入、计算和结果摊开，让你亲手触发一次边界。" : "No screen recording standing in for the work. Inputs, computation, and outcome are exposed so you can trigger the boundary yourself."}
              underworld={locale === "zh" ? "每个系统都要进试炼场。改动条件、重新点火，看看哪条结论还能从熔炉里完整走出来。" : "Every system enters the trial chamber. Change a condition, light the forge again, and see which conclusion emerges intact."}
              astral={locale === "zh" ? "每个结论都要接受一次判定。改动条件、重新运行，看看成功究竟来自运气，还是来自系统本身。" : "Every conclusion has to face a check. Change the conditions, run it again, and see whether success came from luck or from the system itself."}
            />
          </p>
          <div className="mt-6 flex flex-wrap gap-6">
            <CstdLink href={replay.sourceHref[locale]} className="inline-flex items-center gap-2 font-mono text-[11px] font-black text-[#24e0ff] hover:text-white">{locale === "zh" ? "查看完整技术案例" : "Read the complete technical case"} <ArrowUpRight aria-hidden="true" className="h-4 w-4" /></CstdLink>
            <CstdLink href={getLocalizedCstdHref("/lab/proof-museum", locale)} className="inline-flex items-center gap-2 font-mono text-[11px] font-black text-[#899499] hover:text-white">{locale === "zh" ? "证据博物馆" : "Proof museum"} <ArrowUpRight aria-hidden="true" className="h-4 w-4" /></CstdLink>
          </div>
        </div>

        <ExecutableCaseReplay key={replay.id} replay={replay} locale={locale} />
      </div>
    </section>
  );
}
