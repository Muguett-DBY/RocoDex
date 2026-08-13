import { ArrowLeft } from "lucide-react";
import type { CstdLocale } from "../../content/content-types";

const copy = {
  zh: {
    eyebrow: "CSTD // DEAD CHANNEL",
    heading: "信号丢失 / 路径未接入",
    body: "这条神经链路不存在，或已经从 CSTD 网络中断开。返回主节点，继续浏览正在运行的系统。",
    action: "返回 CSTD://ROOT",
    signal: "丢包率 100% / 追踪已终止",
  },
  en: {
    eyebrow: "CSTD // DEAD CHANNEL",
    heading: "Signal lost / Route disconnected",
    body: "This neural route does not exist or has disconnected from the CSTD network. Return to the root node and continue through the systems still online.",
    action: "Return to CSTD://ROOT",
    signal: "PACKET LOSS 100% / TRACE TERMINATED",
  },
} as const;

export function CstdNotFoundPage({ locale }: { locale: CstdLocale }) {
  const text = copy[locale];
  return (
    <main data-cstd-not-found data-cstd-locale={locale} className="grid min-h-screen place-items-center overflow-hidden bg-[#050709] px-5 text-[#f2efe7]">
      <section className="relative w-full max-w-5xl border-y border-[#24e0ff]/30 py-16 md:py-24" aria-labelledby="cstd-not-found-heading">
        <div aria-hidden="true" className="absolute inset-x-0 top-0 h-0.5 bg-[#f4d431]" />
        <p className="font-mono text-[11px] font-black uppercase text-[#24e0ff]">{text.eyebrow}</p>
        <p aria-hidden="true" className="mt-8 font-mono text-[clamp(6rem,22vw,15rem)] font-black leading-[0.72] text-[#f4d431]">404</p>
        <h1 id="cstd-not-found-heading" className="mt-10 max-w-4xl text-3xl font-semibold leading-tight md:text-6xl">{text.heading}</h1>
        <p className="mt-5 max-w-2xl text-sm leading-7 text-[#9da8ab] md:text-base md:leading-8">{text.body}</p>
        <a href={locale === "en" ? "/en" : "/"} className="mt-8 inline-flex items-center gap-3 bg-[#f4d431] px-5 py-4 font-mono text-xs font-black uppercase text-[#050709] transition-colors hover:bg-[#24e0ff]">
          <ArrowLeft aria-hidden="true" className="h-4 w-4" />
          {text.action}
        </a>
        <p className="mt-8 font-mono text-[10px] font-black uppercase text-[#ff5a50] md:absolute md:bottom-6 md:right-0 md:mt-0">{text.signal}</p>
      </section>
    </main>
  );
}
