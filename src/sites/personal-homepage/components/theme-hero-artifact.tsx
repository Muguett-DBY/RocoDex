import type { CstdLocale, LocalizedText } from "../content/content-types";

const pixelStats = [
  { label: { zh: "产品", en: "PRODUCT" }, value: "88" },
  { label: { zh: "AI / 数据", en: "AI / DATA" }, value: "92" },
  { label: { zh: "交付", en: "DELIVERY" }, value: "96" },
] as const;

const inkColophon: readonly LocalizedText[] = [
  { zh: "以工程为骨", en: "ENGINEERING AS FORM" },
  { zh: "以求真为墨", en: "TRUTH AS INK" },
];

export function ThemeHeroArtifact({ locale }: { locale: CstdLocale }) {
  return (
    <div aria-hidden="true" data-cstd-theme-hero-artifact>
      <div data-cstd-hero-artifact="neon" className="cstd-neon-console">
        <div className="cstd-neon-console-reticle"><span /></div>
        <div className="cstd-neon-console-readout">
          <span>{locale === "zh" ? "核心 / 在线" : "CORE / ONLINE"}</span>
          <strong>017.26</strong>
          <span>{locale === "zh" ? "悉尼节点" : "SYDNEY NODE"}</span>
        </div>
        <div className="cstd-neon-console-wave"><i /><i /><i /><i /><i /><i /></div>
      </div>

      <div data-cstd-hero-artifact="ink" className="cstd-ink-colophon">
        {inkColophon.map((line) => <p key={line.en}>{line[locale]}</p>)}
        <span>{locale === "zh" ? "造物" : "CRAFT"}</span>
        <small>{locale === "zh" ? "丙午年 · 悉尼" : "SYDNEY · 2026"}</small>
      </div>

      <aside data-cstd-hero-artifact="press" className="cstd-press-front-index">
        <p className="cstd-press-front-index-kicker">{locale === "zh" ? "本期导读" : "INSIDE THIS EDITION"}</p>
        <ol>
          <li><span>A</span><strong>{locale === "zh" ? "真正交付的系统" : "Systems that ship"}</strong><small>{locale === "zh" ? "能力版" : "Capability desk"}</small></li>
          <li><span>B</span><strong>{locale === "zh" ? "来自现场的证据" : "Evidence from the field"}</strong><small>{locale === "zh" ? "代表作品" : "Selected work"}</small></li>
          <li><span>C</span><strong>{locale === "zh" ? "亲自运行结论" : "Run the claim"}</strong><small>{locale === "zh" ? "复核台" : "Test bench"}</small></li>
        </ol>
        <p className="cstd-press-front-quote">{locale === "zh" ? "构建 · 验证 · 发布" : "BUILD. VERIFY. PUBLISH."}</p>
      </aside>

      <div data-cstd-hero-artifact="pixel" className="cstd-pixel-player-card">
        <div className="cstd-pixel-avatar"><span /><i /></div>
        <div className="cstd-pixel-player-copy">
          <p>{locale === "zh" ? "玩家 01" : "PLAYER 01"}</p>
          <strong>{locale === "zh" ? "奶黄包" : "CUSTARD"}</strong>
          <small>{locale === "zh" ? "职业 / 系统构建者" : "CLASS / SYSTEM BUILDER"}</small>
        </div>
        <dl>
          {pixelStats.map((stat) => (
            <div key={stat.label.en}>
              <dt>{stat.label[locale]}</dt>
              <dd><span style={{ width: `${stat.value}%` }} />{stat.value}</dd>
            </div>
          ))}
        </dl>
        <p className="cstd-pixel-quest-ready">{locale === "zh" ? "任务就绪！" : "QUEST READY!"}</p>
      </div>
    </div>
  );
}
