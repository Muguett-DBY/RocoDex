import { ArrowDown, ArrowRight, ArrowUpRight } from "lucide-react";
import Image from "next/image";

import type { CstdLocale } from "../../content/content-types";
import { cstdCaseStudies, getCaseStudyPath } from "../../content/case-studies";
import { cstdProfile } from "../../content/profile";
import { cstdTechnicalNotes, getTechnicalNotePath } from "../../content/technical-notes";
import { CstdChapterLink } from "../../components/site/cstd-chapter-link";
import { CstdLink } from "../../components/site/cstd-link";
import { AtelierMethod } from "../../components/theme-signature-experience";
import { AtelierMaterial } from "./atelier-material";
import { AtelierReveal } from "./atelier-reveal";
import { AtelierProjectCover } from "../../components/site/atelier-project-cover";
import { CstdBrandMark } from "../../components/site/cstd-brand-mark";

function SectionHeading({ title, description }: { title: string; description: string }) {
  return (
    <div className="atelier-section-heading">
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  );
}

export function AtelierHomepage({ locale }: { locale: CstdLocale }) {
  const isZh = locale === "zh";
  const href = (path: string) => locale === "en" ? `/en${path}` : path;
  const workCases = ["melbourne-pedestrian-microclimate", "rocodex-platform", "alpha-research-system"]
    .map((slug) => cstdCaseStudies.find((entry) => entry.slug === slug)!)
    .filter(Boolean);
  const latestNotes = [...cstdTechnicalNotes]
    .sort((left, right) => right.publishedAt.localeCompare(left.publishedAt))
    .slice(0, 3);
  const melbourne = workCases[0];

  return (
    <div data-cstd-home-atelier className="atelier-home">
      <section id="atelier-top" data-cstd-scene="hero" data-cstd-atelier-section="hero" className="atelier-hero">
        <div className="atelier-container atelier-hero-layout">
          <AtelierReveal className="atelier-hero-copy">
            <h1>{cstdProfile.name[locale]}<span className="atelier-name-stop" aria-hidden="true">.</span></h1>
            <p className="atelier-hero-statement">
              {isZh ? <>从数据里找到线索，<br />把想法做成产品。</> : <>Find the story in the data.<br />Build something useful.</>}
            </p>
            <p className="atelier-hero-intro">
              {cstdProfile.summary[locale]}
            </p>
            <div className="atelier-actions">
              <CstdChapterLink href="#atelier-proof" className="atelier-button">
                {isZh ? "浏览精选作品" : "Explore the work"}<ArrowUpRight aria-hidden="true" />
              </CstdChapterLink>
              <CstdLink href={href("/about")} className="atelier-text-link">
                {isZh ? "认识我" : "A little about me"}<ArrowRight aria-hidden="true" />
              </CstdLink>
            </div>
            <div className="atelier-hero-location">
              <span>{isZh ? "人工智能 · 博 0" : "Artificial Intelligence · PhD Year 0"}</span>
              <span>{isZh ? "分析 · 系统 · 交付" : "Analysis · Systems · Delivery"}</span>
            </div>
          </AtelierReveal>
          <AtelierMaterial locale={locale}>
            <Image
              src="/cstd-atelier/fold-study-v1.svg"
              alt={isZh ? "一条香槟金色的折叠带，构成开放的字母 C" : "An open letter C formed from a folded champagne-gold ribbon"}
              width={600}
              height={620}
              preload
              className="atelier-sculpture"
            />
          </AtelierMaterial>
        </div>
        <div className="atelier-container atelier-hero-foot">
          <p>{isZh ? "真实问题。清晰思考。可验证的作品。" : "Real questions. Clear thinking. Verifiable work."}</p>
          <CstdChapterLink href="#atelier-proof" aria-label={isZh ? "向下浏览作品" : "Scroll to selected work"}>
            <ArrowDown aria-hidden="true" />
          </CstdChapterLink>
        </div>
      </section>

      <section id="atelier-systems" data-cstd-scene="systems" data-cstd-atelier-section="method" className="atelier-section atelier-method-section">
        <span id="method" className="atelier-anchor" aria-hidden="true" />
        <div className="atelier-container atelier-method-layout">
          <SectionHeading
            title={isZh ? "复杂的问题，\n清楚地做。" : "Complex questions.\nClear work."}
            description={isZh ? "从对齐事实开始，以可以检验的结果收尾。" : "Start with the facts. Finish with something you can check."}
          />
          <AtelierMethod locale={locale} />
        </div>
      </section>

      <section id="atelier-proof" data-cstd-scene="proof" data-cstd-atelier-section="work" className="atelier-section atelier-work-section">
        <span id="work" className="atelier-anchor" aria-hidden="true" />
        <div className="atelier-container">
          <div className="atelier-section-top">
            <SectionHeading
              title={isZh ? "用作品说话。" : "The work speaks."}
              description={isZh ? "一份城市数据分析，两个产品系统。可以看结果，也可以看过程。" : "An urban data study and two product systems. Explore the results and the work behind them."}
            />
            <CstdLink href={href("/work")} className="atelier-text-link">
              {isZh ? "全部作品" : "All projects"}<ArrowUpRight aria-hidden="true" />
            </CstdLink>
          </div>
          <div className="atelier-work-grid">
            {workCases.map((entry, index) => (
              <article key={entry.slug} className={index === 0 ? "atelier-project atelier-project-featured" : "atelier-project"}>
                <CstdLink href={getCaseStudyPath(entry, locale)} className="atelier-project-link">
                  <div className="atelier-project-image" data-atelier-project={entry.slug}>
                    <AtelierProjectCover entry={entry} locale={locale} />
                    <span className="atelier-project-open"><ArrowUpRight aria-hidden="true" /></span>
                  </div>
                  <div className="atelier-project-caption">
                    <div>
                      <p className="atelier-project-meta">{entry.kicker[locale]}</p>
                      <h3>{entry.title[locale]}</h3>
                    </div>
                    <span className="atelier-project-year">{entry.year}</span>
                    <p className="atelier-project-summary">{entry.summary[locale]}</p>
                    <p className="atelier-project-tools">
                      <span className="sr-only">{isZh ? "使用的技术：" : "Built with: "}</span>
                      {entry.technologies.join(" · ")}
                    </p>
                  </div>
                </CstdLink>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section data-cstd-atelier-section="data" className="atelier-section atelier-data-section">
        <div className="atelier-container atelier-data-layout">
          <div className="atelier-data-copy">
            <h2>{isZh ? <>147 万行数据。<br /><span>让城市的节奏可见。</span></> : <>1.47 million rows.<br /><span>A city, made legible.</span></>}</h2>
            <p>{isZh
              ? "行人如何穿过墨尔本？温度、风和空气质量又怎样参与其中？三份官方开放数据，经过清洗、空间连接与建模，形成一条可以重跑的分析管线。"
              : "How do people move through Melbourne? What changes with temperature, wind, and air quality? Three official open datasets, cleaned, spatially joined, and modelled into one rerunnable pipeline."}</p>
            <CstdLink href={getCaseStudyPath(melbourne, locale)} className="atelier-text-link">
              {isZh ? "走进这份分析" : "Inside the analysis"}<ArrowUpRight aria-hidden="true" />
            </CstdLink>
            <div className="atelier-data-tools" aria-label={isZh ? "分析工具" : "Analysis tools"}>
              <span>R</span><span>data.table</span><span>ggplot2</span><span>lm</span>
            </div>
          </div>
          <figure className="atelier-data-figure">
            <Image
              src="/cstd-archive/cstd-archive-melbourne-coefficients-v1.webp"
              alt={isZh ? "温度、PM2.5、风速和周末因素与墨尔本行人活动的回归系数图" : "Regression coefficients relating temperature, PM2.5, wind speed, and weekends to Melbourne pedestrian activity"}
              width={2580}
              height={1380}
              sizes="(min-width: 1024px) 52vw, 92vw"
              className="atelier-data-chart"
            />
            <figcaption>{isZh ? "墨尔本 CBD · 环境因素与行人活动的回归分析" : "Melbourne CBD · regression analysis of environment and pedestrian activity"}</figcaption>
          </figure>
        </div>
      </section>

      <section id="atelier-path" data-cstd-scene="path" data-cstd-atelier-section="notes" className="atelier-section atelier-notes-section">
        <span id="notes" className="atelier-anchor" aria-hidden="true" />
        <div className="atelier-container">
          <div className="atelier-section-top">
            <SectionHeading title={isZh ? "思考，留下来。" : "Thinking, kept."} description={isZh ? "关于系统、数据和做事方式的技术札记。" : "Notes on systems, data, and the way the work gets done."} />
            <CstdLink href={href("/notes")} className="atelier-text-link">{isZh ? "全部札记" : "All notes"}<ArrowUpRight aria-hidden="true" /></CstdLink>
          </div>
          <div className="atelier-note-list">
            {latestNotes.map((note) => (
              <CstdLink key={note.slug} href={getTechnicalNotePath(note, locale)} className="atelier-note">
                <time dateTime={note.publishedAt}>{note.publishedAt.slice(0, 7).replace("-", " / ")}</time>
                <div><h3>{note.title[locale]}</h3><p>{note.summary[locale]}</p></div>
                <ArrowUpRight aria-hidden="true" />
              </CstdLink>
            ))}
          </div>
        </div>
      </section>

      <section className="atelier-lab">
        <div className="atelier-container atelier-lab-layout">
          <h2>{isZh ? <>让结论，<br />经得起再运行。</> : <>A conclusion worth<br />putting to the test.</>}</h2>
          <div><p>{isZh ? "估值怎么算，系统出了问题怎么处理？在实验室里动手试一试：从 DCF 模型到故障演练，看看输入变化后，结果为什么会变。" : "How does a valuation change? What happens when a system fails? Try a DCF model or a failure drill, change the inputs, and see why the result moves."}</p>
            <CstdLink href={href("/lab")} className="atelier-text-link">{isZh ? "探索实验室" : "Explore the labs"}<ArrowUpRight aria-hidden="true" /></CstdLink>
          </div>
        </div>
      </section>

      <section id="atelier-cstd-footer" data-cstd-scene="finale" data-cstd-atelier-section="contact" className="atelier-section atelier-contact-section">
        <span id="contact" className="atelier-anchor" aria-hidden="true" />
        <div className="atelier-container">
          <div className="atelier-contact-layout">
            <h2>{isZh ? <>好的想法，<br /><span>值得被做出来。</span></> : <>Good ideas deserve<br /><span>to become real.</span></>}</h2>
            <div className="atelier-contact-copy"><p>{isZh ? "如果你在找一个能把分析做成产品的人，可以从这里继续认识我。" : "If you are looking for someone who turns analysis into products, there is more to the story."}</p>
              <CstdLink href={href("/about")} className="atelier-button">{isZh ? "继续认识我" : "More about me"}<ArrowUpRight aria-hidden="true" /></CstdLink>
            </div>
          </div>
          <div className="atelier-footer-line">
            <p className="atelier-footer-brand"><CstdBrandMark />{isZh ? "奶黄包 · 个人工作室" : "CUSTARD / PERSONAL STUDIO"}</p>
            <nav aria-label={isZh ? "更多个人信息" : "More about Custard"}>
              <CstdLink href={href("/now")}>{isZh ? "现在" : "Now"}</CstdLink>
              <CstdLink href={href("/resume")}>{isZh ? "履历" : "Résumé"}</CstdLink>
              <CstdChapterLink href="#atelier-top">{isZh ? "回到顶部" : "Back to top"}<ArrowUpRight aria-hidden="true" /></CstdChapterLink>
            </nav>
          </div>
        </div>
      </section>
    </div>
  );
}
