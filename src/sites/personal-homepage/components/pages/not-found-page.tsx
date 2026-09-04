import { ArrowLeft } from "lucide-react";

import { cstdNotFoundCopy, getCstdNotFoundEntryPath } from "../../infrastructure/not-found";
import type { CstdLocale } from "../../content/content-types";

export function CstdNotFoundPage({ locale }: { locale: CstdLocale }) {
  const text = cstdNotFoundCopy[locale];
  return (
    <main data-cstd-not-found data-cstd-locale={locale} className="grid min-h-screen place-items-center overflow-hidden bg-[#050709] px-5 text-[#f2efe7]">
      <section className="relative w-full max-w-5xl border-y border-[#24e0ff]/30 py-16 md:py-24" aria-labelledby="cstd-not-found-heading">
        <div aria-hidden="true" className="absolute inset-x-0 top-0 h-0.5 bg-[#f4d431]" />
        <p className="font-mono text-[11px] font-black uppercase text-[#24e0ff]">{text.eyebrow}</p>
        <p aria-hidden="true" className="mt-8 font-mono text-[clamp(6rem,22vw,15rem)] font-black leading-[0.72] text-[#f4d431]">404</p>
        <h1 id="cstd-not-found-heading" className="mt-10 max-w-4xl text-3xl font-semibold uppercase leading-tight md:text-6xl">{text.heading}</h1>
        <p className="mt-5 max-w-2xl text-sm leading-7 text-[#9da8ab] md:text-base md:leading-8">{text.body}</p>
        <a href={getCstdNotFoundEntryPath(locale)} className="mt-8 inline-flex items-center gap-3 bg-[#f4d431] px-5 py-4 font-mono text-xs font-black uppercase text-[#050709] transition-colors hover:bg-[#24e0ff]">
          <ArrowLeft aria-hidden="true" className="h-4 w-4" />
          {text.action}
        </a>
        <p className="mt-8 font-mono text-[10px] font-black uppercase text-[#ff5a50] md:absolute md:bottom-6 md:right-0 md:mt-0">{text.signal}</p>
      </section>
    </main>
  );
}
