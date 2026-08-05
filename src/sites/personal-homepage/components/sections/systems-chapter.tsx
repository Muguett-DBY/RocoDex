"use client";

import { lazy, memo, Suspense } from "react";
import dynamic from "next/dynamic";
import { clsx } from "clsx";
import * as m from "framer-motion/m";
import { cstdSystems, type CstdSystem } from "../../content/systems";
import { TerminalBar } from "../terminal-bar";

const LetterReveal = dynamic(() => import("../letter-reveal").then((module) => module.LetterReveal));
const LazyMeteors = lazy(() => import("../reactbits/meteors").then((module) => ({ default: module.Meteors })));
const LazyGlitchFx = lazy(() => import("../reactbits/glitch-fx").then((module) => ({ default: module.GlitchFx })));
const LazySpotlightCard = lazy(() => import("../spotlight-card").then((module) => ({ default: module.SpotlightCard })));
const LazyGauge = lazy(() => import("../reactbits/gauge").then((module) => ({ default: module.Gauge })));

// 统一 spring 物理参数
const springSoft = { type: "spring", stiffness: 90, damping: 18, mass: 0.7 } as const;
const springSnappy = { type: "spring", stiffness: 260, damping: 24, mass: 0.5 } as const;

/** 终端提示符 */
function Prompt({ children, dim = false }: { children: React.ReactNode; dim?: boolean }) {
  return (
    <span className={clsx("whitespace-pre-wrap", dim && "text-[#6b7280]")}>
      <span className="text-[#33ff66]">$ </span>
      {children}
    </span>
  );
}

function SystemsChapter({
  activeSystemId,
  setActiveSystemId,
  reducedMotion,
}: {
  activeSystemId: CstdSystem["id"];
  setActiveSystemId: (id: CstdSystem["id"]) => void;
  reducedMotion: boolean;
}) {
  const activeSystem = cstdSystems.find((system) => system.id === activeSystemId) ?? cstdSystems[0];

  return (
    <section
      id="systems"
      data-cstd-chapter="systems"
      aria-labelledby="systems-heading"
      className="relative z-10 min-h-[150svh] bg-[#0b0c0e] text-[#d7d7d7] contain-paint lg:min-h-[185svh]"
    >
      {/* ReactBits 风格流星背景（calm 下不渲染） */}
      <Suspense fallback={null}>
        <LazyMeteors disabled={reducedMotion} count={8} />
      </Suspense>
      <div className="sticky top-0 flex min-h-svh items-center px-5 py-24 md:px-10 lg:px-16">
        <div className="mx-auto grid w-full max-w-[1540px] gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div className="flex flex-col justify-between gap-12 lg:min-h-[66svh]">
            <div>
              <p className="font-mono text-xs font-bold text-[#33ff66]">
                <Suspense fallback={<>$ ps aux | grep cstd ▍</>}>
                  <LazyGlitchFx disabled={reducedMotion} interval={2600}>
                    $ ps aux | grep cstd ▍
                  </LazyGlitchFx>
                </Suspense>
              </p>
              <h2 id="systems-heading" className="mt-5 max-w-3xl text-5xl font-black leading-[0.98] tracking-[0] md:text-6xl xl:text-7xl">
                <span className="block">
                  <LetterReveal trigger="view" disabled={reducedMotion} staggerDelay={30} duration={820} fromY={90} fromRotate={3}>
                    五条能力轴，
                  </LetterReveal>
                </span>
                <span className="block">
                  <LetterReveal trigger="view" disabled={reducedMotion} staggerDelay={30} duration={820} delay={200} fromY={90} fromRotate={3}>
                    汇成一条流。
                  </LetterReveal>
                </span>
              </h2>
            </div>

            <Suspense fallback={null}>
            <LazySpotlightCard
              disabled={reducedMotion}
              spotlightColor="rgba(51, 255, 102, 0.1)"
              size={680}
              className="overflow-hidden rounded-lg border border-[#2a2d33] bg-[#101214] shadow-[0_16px_40px_rgba(0,0,0,0.4)]"
            >
              <TerminalBar title={`cstd@custard.top: ~/systems/${activeSystem.id}`} right="bash" />
              <m.div
                key={activeSystem.id}
                data-cstd-system-visual={activeSystem.id}
                initial={{ opacity: 0, y: 24, scale: 0.985 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={springSoft}
                className="max-w-xl p-6 font-mono md:p-8"
              >
                <Prompt dim>cat systems/{activeSystem.id}.md</Prompt>
                <p className="mt-3 text-base leading-7 text-[#d7d7d7] md:text-lg">{activeSystem.summary}</p>
                <p className="mt-3 text-sm leading-6 text-[#8a8f98]">{activeSystem.evidence}</p>
                <p className="mt-5 border-t border-[#2a2d33] pt-4 text-xs font-bold leading-6 text-[#33ff66]">
                  $ stack: {activeSystem.stack.join("  /  ")}
                </p>
                {/* ReactBits 风格仪表（calm 下静态显示） */}
                <div className="mt-6 grid grid-cols-3 gap-4 border-t border-[#2a2d33] pt-5">
                  <Suspense fallback={null}>
                    <LazyGauge disabled={reducedMotion} value={92} label="HEALTH" unit="%" />
                    <LazyGauge disabled={reducedMotion} value={38} label="LOAD" unit="%" />
                    <LazyGauge disabled={reducedMotion} value={12} label="LATENCY" unit="ms" />
                  </Suspense>
                </div>
              </m.div>
            </LazySpotlightCard>
            </Suspense>
          </div>

          <div className="flex flex-col gap-2 font-mono md:gap-3">
            <p className="px-1 pb-1 text-[10px] font-bold tracking-[0.14em] text-[#8a8f98]">PID  CPU%  STATUS  PROCESS</p>
            {cstdSystems.map((system, index) => {
              const isActive = system.id === activeSystem.id;
              return (
                <m.button
                  type="button"
                  key={system.id}
                  data-cstd-system={system.id}
                  data-cstd-system-active={isActive ? "true" : "false"}
                  onPointerEnter={() => setActiveSystemId(system.id)}
                  onFocus={() => setActiveSystemId(system.id)}
                  className={clsx(
                    "group grid w-full grid-cols-[1.4rem_1fr_auto] items-center gap-3 rounded-md border px-4 py-3 text-left transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#33ff66] md:gap-4 md:px-5 md:py-4",
                    isActive
                      ? "border-[#33ff66]/50 bg-[#33ff66]/[0.06]"
                      : "border-[#2a2d33] bg-[#101214] hover:border-[#3a3f47] hover:bg-[#14161a]",
                  )}
                  animate={{ x: isActive ? 12 : 0 }}
                  transition={springSnappy}
                >
                  <span className={clsx("text-[10px] font-bold md:text-xs", isActive ? "text-[#33ff66]" : "text-[#6b7280]")}>
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className={clsx("text-base font-bold leading-none tracking-[0] md:text-xl xl:text-2xl", isActive ? "text-[#33ff66]" : "text-[#a8adb5] group-hover:text-[#d7d7d7]")}>
                    {system.title}
                  </span>
                  <span
                    aria-hidden="true"
                    className={clsx(
                      "text-[9px] font-bold tracking-widest md:text-[10px]",
                      isActive ? "text-[#33ff66]" : "text-[#5a5f66]",
                    )}
                  >
                    {isActive ? "[RUNNING]" : "[READY]"}
                  </span>
                </m.button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export const MemoizedSystemsChapter = memo(SystemsChapter);
