const pixelStats = [
  { label: "PRODUCT", value: "88" },
  { label: "AI / DATA", value: "92" },
  { label: "DELIVERY", value: "96" },
] as const;

export function ThemeHeroArtifact() {
  return (
    <div aria-hidden="true" data-cstd-theme-hero-artifact>
      <div data-cstd-hero-artifact="neon" className="cstd-neon-console">
        <div className="cstd-neon-console-reticle"><span /></div>
        <div className="cstd-neon-console-readout">
          <span>CORE / ONLINE</span>
          <strong>017.26</strong>
          <span>SYDNEY NODE</span>
        </div>
        <div className="cstd-neon-console-wave"><i /><i /><i /><i /><i /><i /></div>
      </div>

      <div data-cstd-hero-artifact="ink" className="cstd-ink-colophon">
        <p>以工程为骨</p>
        <p>以求真为墨</p>
        <span>造物</span>
        <small>丙午年 · 悉尼</small>
      </div>

      <aside data-cstd-hero-artifact="press" className="cstd-press-front-index">
        <p className="cstd-press-front-index-kicker">INSIDE THIS EDITION</p>
        <ol>
          <li><span>A</span><strong>Systems that ship</strong><small>Capability desk</small></li>
          <li><span>B</span><strong>Evidence from the field</strong><small>Selected work</small></li>
          <li><span>C</span><strong>Run the claim</strong><small>Test bench</small></li>
        </ol>
        <p className="cstd-press-front-quote">BUILD. VERIFY. PUBLISH.</p>
      </aside>

      <div data-cstd-hero-artifact="pixel" className="cstd-pixel-player-card">
        <div className="cstd-pixel-avatar"><span /><i /></div>
        <div className="cstd-pixel-player-copy">
          <p>PLAYER 01</p>
          <strong>CUSTARD</strong>
          <small>CLASS / SYSTEM BUILDER</small>
        </div>
        <dl>
          {pixelStats.map((stat) => (
            <div key={stat.label}>
              <dt>{stat.label}</dt>
              <dd><span style={{ width: `${stat.value}%` }} />{stat.value}</dd>
            </div>
          ))}
        </dl>
        <p className="cstd-pixel-quest-ready">QUEST READY!</p>
      </div>
    </div>
  );
}
