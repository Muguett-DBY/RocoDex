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
    <section data-cstd-chapter="operator" data-cstd-scene="operator" data-cstd-executable-evidence data-cstd-home-replay={replay.id} aria-labelledby="executable-evidence-heading" className="relative z-20 border-b border-white/10 bg-[#050709] px-5 py-20 text-[#f2efe7] md:px-10 lg:px-16 lg:py-28">
      <div data-cstd-evidence-layout className="mx-auto grid max-w-[1320px] gap-10 xl:grid-cols-[minmax(25rem,0.9fr)_minmax(0,1.1fr)] xl:items-start xl:gap-16">
        <div>
          <p className="flex items-center gap-3 font-mono text-[11px] font-black text-[#24e0ff]"><FlaskConical aria-hidden="true" className="h-4 w-4" /> <ThemeChapterLabel neon="04 / EXECUTABLE EVIDENCE" ink={locale === "zh" ? "第四卷 / 实证" : "SCROLL IV / PROOF IN MOTION"} press={locale === "zh" ? "栏目 C / 测试台" : "SECTION C / TEST BENCH"} pixel={locale === "zh" ? "关卡 04 / BOSS 实验室" : "LEVEL 04 / BOSS LAB"} /></p>
          <h2 id="executable-evidence-heading" className="mt-5 text-4xl font-semibold leading-[1] md:text-6xl xl:text-[3.75rem]">
            <ThemeCopy
              neon={locale === "zh" ? <>案例不只可读，<span className="block text-[#f4d431]">还可以运行。</span></> : <>A case is not only readable.<span className="block text-[#f4d431]">It can be executed.</span></>}
              ink={locale === "zh" ? <>纸上得来浅，<span className="block text-[#f4d431]">实证方成章。</span></> : <>Paper records the claim.<span className="block text-[#f4d431]">Execution completes the proof.</span></>}
              press={locale === "zh" ? <>编辑部不刊登，<span className="block text-[#f4d431]">未经复核的结论。</span></> : <>This desk does not publish<span className="block text-[#f4d431]">an unverified conclusion.</span></>}
              pixel={locale === "zh" ? <>进入 BOSS LAB，<span className="block text-[#f4d431]">亲自运行结果。</span></> : <>Enter the BOSS LAB.<span className="block text-[#f4d431]">Run the result yourself.</span></>}
            />
          </h2>
          <p className="mt-5 max-w-xl text-base leading-8 text-[#aeb7ba]">
            <ThemeCopy
              neon={locale === "zh" ? "不放一段录屏糊弄过去。这里把输入、计算和结果摊开，让你亲手触发一次边界。" : "No screen recording standing in for the work. Inputs, computation, and outcome are exposed so you can trigger the boundary yourself."}
              ink={locale === "zh" ? "纸上写的是方法，手上跑出来的才是实证。改一个条件，看结果怎样落款。" : "The page records the method; the run supplies the proof. Change one condition and watch the result take shape."}
              press={locale === "zh" ? "编辑部只收能复核的稿件。改动输入，重新运行，再看哪一条结论仍然站得住。" : "This desk only runs copy that can be checked. Change the input, run it again, and see which conclusion still holds."}
              pixel={locale === "zh" ? "别只看战报，自己按下运行。改一个参数，看看这个边界能不能过关。" : "Do not only read the battle report. Run it yourself, change a parameter, and see whether the boundary clears."}
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
