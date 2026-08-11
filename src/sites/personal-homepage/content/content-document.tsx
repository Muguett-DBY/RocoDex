import { readFile } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { compileMDX } from "next-mdx-remote/rsc";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { cache, isValidElement, type ReactNode } from "react";
import type { CstdLocale } from "./content-types";
import { CstdLink } from "../components/site/cstd-link";
import { CopyCodeButton } from "../components/site/copy-code-button";

type ContentKind = "cases" | "notes";
type ContentVariant = "case" | "note";

function extractText(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractText).join("");
  if (isValidElement<{ children?: ReactNode }>(node)) return extractText(node.props.children);
  return "";
}

function createComponents(locale: CstdLocale, variant: ContentVariant) {
  const dark = variant === "case";
  return {
    LocaleBlock: ({ locale: blockLocale, children }: { locale: CstdLocale; children: ReactNode }) => blockLocale === locale ? children : null,
    ArchiveSection: ({ id, eyebrow, title, children }: { id: string; eyebrow?: string; title: string; children: ReactNode }) => dark ? (
      <section id={id} className="scroll-mt-24 border-b border-white/12 px-5 py-20 md:px-10 lg:px-16 lg:py-28">
        <div className="mx-auto grid max-w-[1320px] gap-10 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-20">
      <div><p className="font-mono text-[11px] font-black text-[#f4d431]">{eyebrow ?? id.toUpperCase()}</p><span aria-hidden="true" className="mt-5 block h-px w-16 bg-[#24e0ff]" /></div>
          <div><h2 className="max-w-4xl text-4xl font-semibold leading-[1.02] text-white md:text-6xl">{title}</h2><div className="cstd-mdx-prose cstd-mdx-prose-dark">{children}</div></div>
        </div>
      </section>
    ) : (
      <section id={id} className="scroll-mt-28 border-t border-black/15 py-12 first:border-t-0 first:pt-0">
        <p className="font-mono text-[11px] font-black text-[#0b6473]">{eyebrow ?? id.toUpperCase()}</p>
        <h2 className="mt-4 text-3xl font-semibold leading-tight md:text-4xl">{title}</h2>
        <div className="cstd-mdx-prose cstd-mdx-prose-light">{children}</div>
      </section>
    ),
    CodeSample: ({ language, label, children }: { language: string; label: string; children: ReactNode }) => {
      const value = extractText(children).trim();
      return (
        <div className={dark ? "mt-9 overflow-hidden border-l-2 border-[#24e0ff] bg-black/45" : "mt-8 overflow-hidden bg-[#0a0c0e] text-[#d9f9ff] shadow-[12px_12px_0_#e3b800]"}>
      <div className="flex items-center justify-between gap-4 border-b border-white/10 px-5 py-3 font-mono text-[11px] font-black text-[#24e0ff]">
            <span>{label.toUpperCase()} / {language}</span>
            <CopyCodeButton value={value} label={locale === "zh" ? "复制代码" : "Copy code"} />
          </div>
          {children}
        </div>
      );
    },
    a: ({ href = "", children }: { href?: string; children: ReactNode }) => href.startsWith("/") ? (
      <CstdLink href={href} className="font-semibold text-[#0b6473] underline decoration-current/30 underline-offset-4 hover:decoration-current">{children}</CstdLink>
    ) : (
      <a href={href} target="_blank" rel="noreferrer" className="font-semibold text-[#0b6473] underline decoration-current/30 underline-offset-4 hover:decoration-current">{children}</a>
    ),
    table: ({ children }: { children: ReactNode }) => <div className="mt-8 overflow-x-auto"><table className="w-full border-collapse text-left text-sm">{children}</table></div>,
  th: ({ children }: { children: ReactNode }) => <th className="border-b border-current/25 px-3 py-3 font-mono text-[11px] font-black uppercase">{children}</th>,
    td: ({ children }: { children: ReactNode }) => <td className="border-b border-current/15 px-3 py-3 align-top leading-6">{children}</td>,
    blockquote: ({ children }: { children: ReactNode }) => <blockquote className="mt-7 border-l-2 border-[#f4d431] pl-5 text-lg font-semibold leading-8">{children}</blockquote>,
  };
}

export const loadCstdContentDocument = cache(async (
  kind: ContentKind,
  slug: string,
  locale: CstdLocale,
) => {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new Error("Invalid CSTD content slug");
  const sourcePath = path.join(process.cwd(), "src", "sites", "personal-homepage", "content", "documents", kind, `${slug}.mdx`);
  const source = await readFile(sourcePath, "utf8");
  const document = matter(source);
  const result = await compileMDX({
    source: document.content,
    components: createComponents(locale, kind === "cases" ? "case" : "note"),
    options: {
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
          [rehypePrettyCode, { theme: "github-dark-dimmed", keepBackground: false }],
          rehypeSlug,
        ],
      },
    },
  });
  return result.content;
});
