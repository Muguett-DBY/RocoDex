"use client";

import { useEffect, useRef, useState, type ComponentType } from "react";
import {
  Check,
  Dices,
  Eye,
  FlaskConical,
  Flame,
  PenLine,
  RadioTower,
  RotateCcw,
  ScrollText,
  Shield,
  Sparkles,
  Sword,
  Terminal,
} from "lucide-react";
import type { CstdLocale } from "../content/content-types";

function emitSignatureMetric(name: "breach" | "boon" | "roll" | "method") {
  window.dispatchEvent(new CustomEvent("cstd:metric", { detail: { name: `signature_${name}`, value: 1 } }));
}

function NeonBreach({ locale }: { locale: CstdLocale }) {
  const nodes = locale === "zh"
    ? [
        { label: "定位", detail: "扫描真实问题" },
        { label: "解密", detail: "读出系统约束" },
        { label: "接管", detail: "交付可验证结果" },
      ]
    : [
        { label: "LOCATE", detail: "Scan the real problem" },
        { label: "DECRYPT", detail: "Read the constraints" },
        { label: "EXTRACT", detail: "Ship verifiable proof" },
      ];
  const [step, setStep] = useState(0);
  const complete = step === nodes.length;

  const breach = (index: number) => {
    if (index !== step) return;
    const next = step + 1;
    setStep(next);
    if (next === nodes.length) emitSignatureMetric("breach");
  };

  return (
    <section data-cstd-theme-encounter data-cstd-theme-encounter-theme="neon-district" aria-labelledby="cstd-neon-breach-title" className="cstd-theme-encounter cstd-neon-breach">
      <div className="cstd-encounter-inner">
        <header className="cstd-neon-breach-header">
          <div>
            <p><Terminal aria-hidden="true" /> CSTD://BREACH_SEQUENCE</p>
            <h2 id="cstd-neon-breach-title">{locale === "zh" ? "接入我的工作方式。" : "Breach my working method."}</h2>
          </div>
          <div data-cstd-neon-breach-status={complete ? "locked" : "scanning"} role="status" aria-live="polite">
            <RadioTower aria-hidden="true" />
            <span>{complete ? (locale === "zh" ? "信号锁定" : "SIGNAL LOCKED") : `${String(step).padStart(2, "0")} / 03`}</span>
          </div>
        </header>

        <div className="cstd-neon-breach-line" style={{ "--cstd-breach-progress": `${step / nodes.length}` } as React.CSSProperties}>
          {nodes.map((node, index) => {
            const state = index < step ? "complete" : index === step ? "active" : "locked";
            return (
              <button
                key={node.label}
                type="button"
                data-cstd-neon-breach-node={index + 1}
                data-cstd-neon-breach-node-state={state}
                disabled={index > step || complete}
                onClick={() => breach(index)}
              >
                <span>{index < step ? <Check aria-hidden="true" /> : String(index + 1).padStart(2, "0")}</span>
                <strong>{node.label}</strong>
                <small>{node.detail}</small>
              </button>
            );
          })}
        </div>

        <footer className="cstd-neon-breach-footer">
          <span>{complete ? (locale === "zh" ? "访问授权：作品、系统、判断" : "ACCESS GRANTED: WORK / SYSTEMS / JUDGMENT") : (locale === "zh" ? "依次击穿三个节点" : "BREACH THE NODES IN SEQUENCE")}</span>
          <button type="button" aria-label={locale === "zh" ? "重置入侵序列" : "Reset breach sequence"} title={locale === "zh" ? "重置" : "Reset"} onClick={() => setStep(0)}>
            <RotateCcw aria-hidden="true" />
          </button>
        </footer>
      </div>
    </section>
  );
}

type Boon = {
  id: "edge" | "insight" | "resolve";
  icon: ComponentType<{ "aria-hidden"?: "true" }>;
  title: string;
  oath: string;
  result: string;
};

function UnderworldBoon({ locale }: { locale: CstdLocale }) {
  const boons: Boon[] = locale === "zh"
    ? [
        { id: "edge", icon: Sword, title: "锋刃之赐", oath: "先斩断伪命题", result: "你选择了锋刃：删掉噪音，让最重要的问题先见血。" },
        { id: "insight", icon: Eye, title: "洞察之赐", oath: "先看见代价", result: "你选择了洞察：不急着写代码，先把约束和后果照亮。" },
        { id: "resolve", icon: Shield, title: "坚韧之赐", oath: "让系统活着归返", result: "你选择了坚韧：把性能、稳定与维护写进交付，而不是尾声。" },
      ]
    : [
        { id: "edge", icon: Sword, title: "BOON OF EDGE", oath: "Cut the false premise", result: "Edge chosen: remove the noise and let the real problem draw first blood." },
        { id: "insight", icon: Eye, title: "BOON OF SIGHT", oath: "Reveal the cost", result: "Sight chosen: illuminate constraints and consequences before writing code." },
        { id: "resolve", icon: Shield, title: "BOON OF RESOLVE", oath: "Return with the system whole", result: "Resolve chosen: performance, stability, and upkeep belong inside the delivery." },
      ];
  const [selected, setSelected] = useState<Boon["id"] | null>(null);
  const selectedBoon = boons.find((boon) => boon.id === selected);

  const chooseBoon = (boon: Boon) => {
    setSelected(boon.id);
    emitSignatureMetric("boon");
  };

  return (
    <section data-cstd-theme-encounter data-cstd-theme-encounter-theme="underworld-forge" data-cstd-boon-selected={selected ?? "none"} aria-labelledby="cstd-underworld-boon-title" className="cstd-theme-encounter cstd-underworld-boon">
      <div className="cstd-underworld-slash" aria-hidden="true" />
      <div className="cstd-encounter-inner">
        <header className="cstd-underworld-boon-header">
          <span><Flame aria-hidden="true" /></span>
          <div>
            <p>{locale === "zh" ? "冥河之前 / 选择一项神赐" : "BEFORE THE STYX / CHOOSE A BOON"}</p>
            <h2 id="cstd-underworld-boon-title">{locale === "zh" ? "每次交付，都从一种意志开始。" : "Every delivery begins with an intent."}</h2>
          </div>
        </header>

        <div className="cstd-underworld-boon-grid">
          {boons.map((boon, index) => {
            const Icon = boon.icon;
            const active = selected === boon.id;
            return (
              <button key={boon.id} type="button" data-cstd-underworld-boon={boon.id} data-cstd-underworld-boon-active={active ? "true" : "false"} aria-pressed={active} onClick={() => chooseBoon(boon)}>
                <span className="cstd-underworld-boon-number">{String(index + 1).padStart(2, "0")}</span>
                <span className="cstd-underworld-boon-sigil"><Icon aria-hidden="true" /></span>
                <strong>{boon.title}</strong>
                <small>{boon.oath}</small>
              </button>
            );
          })}
        </div>

        <p data-cstd-underworld-boon-result role="status" aria-live="polite">
          <Sparkles aria-hidden="true" />
          {selectedBoon?.result ?? (locale === "zh" ? "火焰在等待你的选择。" : "The flame awaits your choice.")}
        </p>
      </div>
    </section>
  );
}

function AstralRoll({ locale }: { locale: CstdLocale }) {
  const approaches = locale === "zh"
    ? [
        { id: "craft", label: "构筑", modifier: 2, note: "把想法做成系统" },
        { id: "lore", label: "学识", modifier: 4, note: "用研究缩短弯路" },
        { id: "party", label: "协作", modifier: 3, note: "让不同专长同行" },
      ]
    : [
        { id: "craft", label: "CRAFT", modifier: 2, note: "Turn intent into systems" },
        { id: "lore", label: "LORE", modifier: 4, note: "Use research to shorten detours" },
        { id: "party", label: "PARTY", modifier: 3, note: "Let different strengths travel together" },
      ];
  const rolls = [7, 13, 20] as const;
  const [approachIndex, setApproachIndex] = useState(0);
  const [attempt, setAttempt] = useState(0);
  const [roll, setRoll] = useState<number | null>(null);
  const [rolling, setRolling] = useState(false);
  const timerRef = useRef<number | undefined>(undefined);
  const approach = approaches[approachIndex];
  const total = roll === null ? null : roll + approach.modifier;
  const outcome = total === null
    ? (locale === "zh" ? "先选择专长，再让骰子回答。" : "Choose an approach, then let the die answer.")
    : roll === 20
      ? (locale === "zh" ? "大成功。答案不只成立，还留下了一条能继续走的路。" : "Critical success. The answer holds and leaves a path worth following.")
      : total >= 15
        ? (locale === "zh" ? "判定成功。方案经得住追问，可以写进旅记。" : "Success. The decision survives scrutiny and belongs in the journal.")
        : (locale === "zh" ? "成功，但有代价。保留这次摩擦，下一轮会更准确。" : "Success, with a cost. Keep the friction; the next pass will be sharper.");

  useEffect(() => () => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
  }, []);

  const castDie = () => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    setRolling(true);
    setRoll(null);
    const result = rolls[attempt % rolls.length];
    timerRef.current = window.setTimeout(() => {
      setRoll(result);
      setAttempt((value) => value + 1);
      setRolling(false);
      emitSignatureMetric("roll");
      timerRef.current = undefined;
    }, 640);
  };

  return (
    <section data-cstd-theme-encounter data-cstd-theme-encounter-theme="astral-covenant" data-cstd-astral-rolling={rolling ? "true" : "false"} aria-labelledby="cstd-astral-roll-title" className="cstd-theme-encounter cstd-astral-roll">
      <div className="cstd-astral-route-map" aria-hidden="true"><i /><i /><i /><i /><i /></div>
      <div className="cstd-encounter-inner">
        <header className="cstd-astral-roll-header">
          <p><ScrollText aria-hidden="true" /> {locale === "zh" ? "星界旅记 / 技能检定" : "ASTRAL JOURNAL / ABILITY CHECK"}</p>
          <h2 id="cstd-astral-roll-title">{locale === "zh" ? "选一项专长，把决定交给命运。" : "Choose an approach. Put the decision to fate."}</h2>
        </header>

        <div className="cstd-astral-roll-table">
          <div className="cstd-astral-approaches" role="radiogroup" aria-label={locale === "zh" ? "选择判定专长" : "Choose an ability"}>
            {approaches.map((candidate, index) => (
              <button key={candidate.id} type="button" role="radio" aria-checked={approachIndex === index} data-cstd-astral-approach={candidate.id} data-cstd-astral-approach-active={approachIndex === index ? "true" : "false"} onClick={() => { setApproachIndex(index); setRoll(null); }}>
                <span>{candidate.label}</span>
                <strong>+{candidate.modifier}</strong>
                <small>{candidate.note}</small>
              </button>
            ))}
          </div>

          <button type="button" data-cstd-astral-roll aria-label={locale === "zh" ? "掷二十面骰" : "Roll the twenty-sided die"} disabled={rolling} onClick={castDie} className="cstd-astral-d20-button">
            <span className="cstd-astral-d20-face"><Dices aria-hidden="true" /><strong>{rolling ? "…" : roll ?? "D20"}</strong></span>
            <small>{locale === "zh" ? "掷骰" : "ROLL"}</small>
          </button>

          <div data-cstd-astral-roll-result role="status" aria-live="polite" className="cstd-astral-roll-result">
            <span>{locale === "zh" ? "旅记条目" : "JOURNAL ENTRY"}</span>
            <strong>{total === null ? `+${approach.modifier}` : `${roll} + ${approach.modifier} = ${total}`}</strong>
            <p>{outcome}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function AtelierMethod({ locale }: { locale: CstdLocale }) {
  const steps = locale === "zh"
    ? [
        { id: "deconstruct", icon: Terminal, title: "拆解", detail: "把问题拆成可验证的小问题：数据在哪、口径是什么、约束有哪些。", signal: "先对齐事实，再谈方案" },
        { id: "build", icon: FlaskConical, title: "构建", detail: "用最少的合适技术把解法做出来——一条管线、一个界面或一个系统。", signal: "技术为问题服务" },
        { id: "verify", icon: Check, title: "验证", detail: "用证据收尾：可复算的结果、可重跑的流程、可访问的产品。", signal: "结论带着来路" },
      ] as const
    : [
        { id: "deconstruct", icon: Terminal, title: "Deconstruct", detail: "Split the problem into checkable pieces: where the data lives, what the definitions are, which constraints hold.", signal: "Facts before plans" },
        { id: "build", icon: FlaskConical, title: "Build", detail: "Ship the solution with the least suitable technology — a pipeline, an interface, or a system.", signal: "Technology serves the question" },
        { id: "verify", icon: Check, title: "Verify", detail: "Close with evidence: results that recompute, pipelines that rerun, products anyone can use.", signal: "Conclusions carry lineage" },
      ] as const;
  const [active, setActive] = useState(0);

  return (
    <section data-cstd-theme-encounter data-cstd-theme-encounter-theme="atelier" data-cstd-atelier-method={steps[active].id} aria-labelledby="cstd-atelier-method-title" className="cstd-theme-encounter cstd-atelier-method">
      <div className="cstd-encounter-inner">
        <header className="cstd-atelier-method-header">
          <p><PenLine aria-hidden="true" /> {locale === "zh" ? "工作室 / 工作方式" : "ATELIER / WORKING METHOD"}</p>
          <h2 id="cstd-atelier-method-title">{locale === "zh" ? "三步，把一件事做完。" : "Three steps. One finished thing."}</h2>
        </header>
        <div role="tablist" aria-label={locale === "zh" ? "工作方式三步" : "Three working steps"} className="cstd-atelier-method-steps">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const activeStep = active === index;
            return (
              <button
                key={step.id}
                type="button"
                role="tab"
                aria-selected={activeStep}
                data-cstd-atelier-step={step.id}
                data-cstd-atelier-step-active={activeStep ? "true" : "false"}
                onClick={() => { setActive(index); emitSignatureMetric("method"); }}
              >
                <span className="cstd-atelier-method-number">{String(index + 1).padStart(2, "0")}</span>
                <span className="cstd-atelier-method-icon" aria-hidden="true"><Icon /></span>
                <strong>{step.title}</strong>
                <small>{activeStep ? step.signal : ""}</small>
              </button>
            );
          })}
        </div>
        <div className="cstd-atelier-method-detail" role="tabpanel" aria-live="polite">
          <p>{steps[active].detail}</p>
        </div>
      </div>
    </section>
  );
}

export function ThemeSignatureExperience({ locale }: { locale: CstdLocale }) {
  return (
    <>
      <AtelierMethod locale={locale} />
      <NeonBreach locale={locale} />
      <UnderworldBoon locale={locale} />
      <AstralRoll locale={locale} />
    </>
  );
}
