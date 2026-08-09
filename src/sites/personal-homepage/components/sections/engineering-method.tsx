"use client";

import Image from "next/image";
import { ArrowUpRight, Blocks, Braces, FlaskConical, RadioTower } from "lucide-react";
import { clsx } from "clsx";
import { memo, useState } from "react";
import { cstdProfile } from "../../content/profile";
import { CstdLink } from "../site/cstd-link";

const methods = [
  {
    code: "BOUNDARY",
    title: "先定义所有权，再写功能。",
    detail: "请求、状态、失败和发布分别属于谁，必须先成为可读契约。边界清楚以后，技术选型才有意义。",
    signal: "OWNER → CONTRACT",
    evidence: "/notes/host-boundaries-in-one-next-deployment",
    evidenceLabel: "Host 边界札记",
    icon: Blocks,
  },
  {
    code: "CORE",
    title: "确定性核心，智能留在边缘。",
    detail: "公式、权限和状态转换保持可复现；模型负责综合与解释，但不能替代业务事实。",
    signal: "INPUT → DETERMINISM",
    evidence: "/notes/deterministic-core-ai-edge",
    evidenceLabel: "确定性核心札记",
    icon: Braces,
  },
  {
    code: "PROOF",
    title: "叙事之前，先留下证据。",
    detail: "测试、工件、版本与失败路径和结论一起发布。作品展示的是判断，不是只展示结果截图。",
    signal: "CLAIM → REPLAY",
    evidence: "/lab/proof-museum",
    evidenceLabel: "进入证据博物馆",
    icon: FlaskConical,
  },
  {
    code: "RELEASE",
    title: "发布不是结束，是闭环。",
    detail: "本地闸门、真实浏览器、CI、部署状态和线上复验共同决定一次升级是否真正完成。",
    signal: "BUILD → LIVE",
    evidence: "/observatory.json",
    evidenceLabel: "查看工程观测数据",
    icon: RadioTower,
  },
] as const;

function EngineeringMethod() {
  const [selected, setSelected] = useState(0);
  const active = methods[selected];
  const ActiveIcon = active.icon;

  return (
    <section
      id="method"
      data-cstd-chapter="method"
      data-cstd-method
      data-cstd-method-active={active.code.toLowerCase()}
      aria-labelledby="cstd-method-heading"
      className="relative z-20 overflow-hidden border-b border-[#24e0ff]/25 bg-[#080b0e] px-5 py-24 text-[#f2efe7] md:px-10 lg:px-16 lg:py-32"
    >
      <Image
        src="/cstd-universe/cstd-method-bench-v3.webp"
        alt="清晨工程工作台、原型设备与手绘设计笔记"
        fill
        sizes="100vw"
        className="object-cover object-[58%_50%] opacity-55"
      />
      <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,7,9,0.99)_0%,rgba(5,7,9,0.9)_48%,rgba(5,7,9,0.36)_100%)]" />
      <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(0deg,rgba(5,7,9,0.96),transparent_55%,rgba(5,7,9,0.68))]" />

      <div className="relative mx-auto max-w-[1540px]">
        <header className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_28rem] lg:items-end">
          <div>
            <p className="flex items-center gap-3 font-mono text-[10px] font-black text-[#24e0ff]">
              <Braces aria-hidden="true" className="h-4 w-4" /> 03 / HOW I BUILD
            </p>
            <h2 id="cstd-method-heading" className="mt-6 max-w-5xl text-5xl font-semibold leading-[0.92] md:text-7xl xl:text-8xl">
              技术栈会变化，<span className="text-[#f4d431]">工程判断必须留下。</span>
            </h2>
          </div>
          <p className="text-base leading-8 text-[#bcc4c6]">
            从化工的边界与守恒，到数据、产品和 AI 系统，我反复使用的是同一套工作方法：明确所有权、约束核心、留下证据、完成发布闭环。
          </p>
        </header>

        <div className="mt-14 grid border-y border-white/15 bg-[#050709]/70 backdrop-blur-md xl:grid-cols-[23rem_minmax(0,1fr)]">
          <div className="border-b border-white/15 xl:border-b-0 xl:border-r">
            {methods.map((method, index) => {
              const Icon = method.icon;
              const isActive = selected === index;
              return (
                <button
                  key={method.code}
                  type="button"
                  data-cstd-method-option={method.code.toLowerCase()}
                  aria-pressed={isActive}
                  onClick={() => setSelected(index)}
                  onFocus={() => setSelected(index)}
                  className={clsx(
                    "grid min-h-24 w-full grid-cols-[2.25rem_1fr_auto] items-center gap-3 border-b border-white/15 px-4 py-4 text-left transition-[background-color,color] last:border-b-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#24e0ff]",
                    isActive ? "bg-[#f4d431] text-[#050709]" : "text-[#aeb8bb] hover:bg-white/8 hover:text-white",
                  )}
                >
                  <span className="font-mono text-[9px] font-black">0{index + 1}</span>
                  <span>
                    <span className="block font-mono text-[8px] font-black opacity-65">{method.code}</span>
                    <span className="mt-2 block text-sm font-semibold leading-6">{method.title}</span>
                  </span>
                  <Icon aria-hidden="true" className="h-4 w-4" />
                </button>
              );
            })}
          </div>

          <div className="relative min-h-[31rem] overflow-hidden p-5 md:p-8 lg:p-12">
            <span aria-hidden="true" className="absolute right-4 top-0 font-mono text-[9rem] font-black leading-none text-white/[0.035] md:text-[15rem]">
              0{selected + 1}
            </span>
            <div className="relative flex h-full flex-col justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-3 font-mono text-[9px] font-black">
                  <span className="inline-flex items-center gap-2 text-[#f4d431]"><ActiveIcon aria-hidden="true" className="h-4 w-4" /> ACTIVE PROTOCOL</span>
                  <span className="border-l border-white/20 pl-3 text-[#24e0ff]">{active.signal}</span>
                </div>
                <h3 className="mt-7 max-w-3xl text-3xl font-semibold leading-tight text-white md:text-5xl">{active.title}</h3>
                <p className="mt-5 max-w-2xl text-base leading-8 text-[#c0c9cb]">{active.detail}</p>
              </div>

              <div className="mt-12">
                <div className="grid grid-cols-4 gap-2" aria-label="工程方法闭环">
                  {methods.map((method, index) => (
                    <div key={method.code} className="relative pt-5">
                      <span className={clsx("absolute inset-x-0 top-0 h-px", index <= selected ? "bg-[#f4d431] shadow-[0_0_12px_rgba(244,212,49,0.7)]" : "bg-white/15")} />
                      <span className={clsx("block h-2 w-2", index <= selected ? "bg-[#24e0ff] shadow-[0_0_12px_rgba(36,224,255,0.8)]" : "bg-white/20")} />
                      <span className="mt-3 block font-mono text-[7px] font-black text-[#8f9a9e] sm:text-[8px]">{method.code}</span>
                    </div>
                  ))}
                </div>
                <CstdLink href={active.evidence} className="mt-8 inline-flex items-center gap-2 border-b border-[#24e0ff]/60 pb-1 font-mono text-[9px] font-black text-[#24e0ff] hover:text-white">
                  {active.evidenceLabel} <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
                </CstdLink>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-px border-y border-white/15 bg-white/10 sm:grid-cols-3" data-cstd-now-rail>
          <div className="bg-[#07090b]/90 px-5 py-5"><p className="font-mono text-[8px] font-black text-[#24e0ff]">BASED</p><p className="mt-2 text-sm font-semibold">{cstdProfile.location.zh}</p></div>
          <div className="bg-[#07090b]/90 px-5 py-5"><p className="font-mono text-[8px] font-black text-[#3dff8f]">NOW</p><p className="mt-2 text-sm font-semibold">{cstdProfile.availability.zh}</p></div>
          <CstdLink href="/now" className="group flex items-center justify-between gap-4 bg-[#07090b]/90 px-5 py-5 hover:bg-[#f4d431] hover:text-black">
            <span><span className="block font-mono text-[8px] font-black text-[#f4d431] group-hover:text-black/60">CURRENT FOCUS</span><span className="mt-2 block text-sm font-semibold">打开 Now 日志</span></span>
            <ArrowUpRight aria-hidden="true" className="h-5 w-5" />
          </CstdLink>
        </div>
      </div>
    </section>
  );
}

export const MemoizedEngineeringMethod = memo(EngineeringMethod);
