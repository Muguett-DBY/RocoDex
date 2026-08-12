import type { Metadata } from "next";

import type { CstdLocale } from "./content/content-types";
import { cstdContentHealth } from "./content/content-health";
import { getCstdCaseStudy } from "./content/case-studies";
import { getCstdLab } from "./content/labs";
import { getCstdTechnicalNote } from "./content/technical-notes";
import { getCstdNarrative, parseCstdNarrativeShareSlug } from "./content/narratives";
import { getCstdTopic } from "./content/topics";
import { cstdLocaleConfig, getCstdLanguageAlternates } from "./infrastructure/i18n";

const CSTD_ORIGIN = "https://custard.top";

export function getPersonalHomepageMetadata(locale: CstdLocale): Metadata {
  return createCstdMetadata({
    locale,
    path: locale === "en" ? "/en" : "/",
    title: locale === "zh" ? "奶黄包 / Custard | 产品工程师与创意系统构建者" : "Custard | Product engineer and creative systems builder",
    description: locale === "zh" ? "奶黄包的独立技术工作室：把产品、数据、AI、研究与边缘系统编译成真正运行的作品。" : "Custard's independent engineering studio, compiling product, data, AI, research, and edge systems into work that actually runs.",
    image: "/cstd-og-v2.webp",
    type: "profile",
  });
}

export const personalHomepageMetadata = getPersonalHomepageMetadata("zh");

export function getPersonalHomepageStructuredData(locale: CstdLocale) {
  const prefix = locale === "en" ? "/en" : "";
  return [
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Custard / CSTD",
    url: `${CSTD_ORIGIN}${prefix || "/"}`,
    inLanguage: cstdLocaleConfig[locale].htmlLang,
    description: locale === "zh" ? "奶黄包的个人工程工作室，展示已交付产品、证据优先 AI、数据系统、研究与视觉工程。" : "Custard's personal engineering studio for shipped products, evidence-first AI, data systems, research, and visual engineering.",
  },
  {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    name: locale === "zh" ? "奶黄包 / CSTD" : "Custard / CSTD",
    url: `${CSTD_ORIGIN}${prefix || "/"}`,
    inLanguage: cstdLocaleConfig[locale].htmlLang,
    mainEntity: {
      "@type": "Person",
      name: locale === "zh" ? "奶黄包" : "Custard",
      alternateName: locale === "zh" ? "Custard" : "奶黄包",
      jobTitle: locale === "zh" ? "产品工程师与创意系统构建者" : "Product engineer and creative systems builder",
      knowsAbout: locale === "zh"
        ? ["产品工程", "证据优先 AI", "数据系统", "量化研究", "浏览器视觉工程"]
        : ["Product engineering", "Evidence-first AI", "Data systems", "Quantitative research", "Visual engineering"],
      sameAs: ["https://github.com/Muguett-DBY"],
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: locale === "zh" ? "CSTD 工程观测站" : "CSTD engineering observatory",
    description: locale === "zh"
      ? "custard.top 的构建关联验证、公开证据、内容健康度与发布来源记录。"
      : "Build-linked verification, public proof, content health, and release provenance for custard.top.",
    url: `${CSTD_ORIGIN}${prefix}/observatory.json`,
    inLanguage: cstdLocaleConfig[locale].htmlLang,
    dateModified: cstdContentHealth.generatedAt,
    version: "CSTD-17.0",
    isAccessibleForFree: true,
    creator: {
      "@type": "Person",
      name: locale === "zh" ? "奶黄包" : "Custard",
      alternateName: locale === "zh" ? "Custard" : "奶黄包",
    },
    distribution: [
      { "@type": "DataDownload", encodingFormat: "application/json", contentUrl: `${CSTD_ORIGIN}${prefix}/observatory.json` },
      { "@type": "DataDownload", encodingFormat: "application/json", contentUrl: `${CSTD_ORIGIN}${prefix}/content-health.json` },
      { "@type": "DataDownload", encodingFormat: "application/json", contentUrl: `${CSTD_ORIGIN}${prefix}/performance.json` },
      { "@type": "DataDownload", encodingFormat: "application/json", contentUrl: `${CSTD_ORIGIN}${prefix}/experience.json` },
    ],
  },
] as const;
}

export const personalHomepageStructuredData = getPersonalHomepageStructuredData("zh");

type CstdMetadataInput = {
  title: string;
  description: string;
  path: string;
  locale: CstdLocale;
  image?: string;
  type?: "website" | "article" | "profile";
  publishedAt?: string;
};

function stripEnglishPrefix(path: string) {
  if (path === "/en") return "/";
  return path.startsWith("/en/") ? path.slice(3) : path;
}

export function createCstdMetadata({
  title,
  description,
  path,
  locale,
  image = "/cstd-og-v2.webp",
  type = "website",
  publishedAt,
}: CstdMetadataInput): Metadata {
  const canonicalPath = locale === "en" ? (path.startsWith("/en") ? path : `/en${path}`) : stripEnglishPrefix(path);
  const canonical = new URL(canonicalPath, CSTD_ORIGIN).toString();
  const imageUrl = new URL(image, CSTD_ORIGIN).toString();
  const config = cstdLocaleConfig[locale];
  const alternates = getCstdLanguageAlternates(canonicalPath);

  return {
    metadataBase: new URL(CSTD_ORIGIN),
    title: `${title} | CSTD`,
    description,
    alternates: {
      canonical,
      languages: {
        "zh-CN": new URL(alternates["zh-CN"], CSTD_ORIGIN).toString(),
        "en-AU": new URL(alternates["en-AU"], CSTD_ORIGIN).toString(),
        "x-default": new URL(alternates["x-default"], CSTD_ORIGIN).toString(),
      },
    },
    manifest: locale === "en" ? "/en/manifest.webmanifest" : "/manifest.webmanifest",
    other: { "content-language": config.htmlLang },
    openGraph: {
      type,
      siteName: "Custard / CSTD",
      title,
      description,
      url: canonical,
      locale: config.openGraphLocale,
      alternateLocale: [cstdLocaleConfig[locale === "zh" ? "en" : "zh"].openGraphLocale],
      images: [{ url: imageUrl, width: 1920, height: 1080, alt: title }],
      ...(type === "article" && publishedAt ? { publishedTime: publishedAt } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export function getCstdWorkMetadata(locale: CstdLocale) {
  return createCstdMetadata({
    locale,
    path: locale === "en" ? "/en/work" : "/work",
    title: locale === "zh" ? "作品档案" : "Work archive",
    description: locale === "zh" ? "奶黄包的真实产品案例：问题、约束、架构、证据与复盘。" : "Shipped product cases by Custard, including problems, constraints, architecture, evidence, and lessons.",
    image: "/cstd-universe/cstd-broadcast-nexus-v1.webp",
  });
}

export function getCstdCaseStudyMetadata(slug: string, locale: CstdLocale) {
  const entry = getCstdCaseStudy(slug);
  if (!entry) return {};
  const path = locale === "en" ? `/en/work/${slug}` : `/work/${slug}`;
  return createCstdMetadata({ title: entry.title[locale], description: entry.summary[locale], path, locale, image: entry.image.src });
}

export function getCstdCaseStudyOpenGraphData(slug: string) {
  const entry = getCstdCaseStudy(slug);
  if (!entry) return null;
  return { title: entry.title.en, summary: entry.summary.en, technologies: entry.technologies } as const;
}

export function getCstdNotesMetadata(locale: CstdLocale) {
  return createCstdMetadata({
    locale,
    path: locale === "en" ? "/en/notes" : "/notes",
    title: locale === "zh" ? "技术札记" : "Technical notes",
    description: locale === "zh" ? "关于系统边界、证据优先 AI、确定性计算、数据与浏览器视觉工程的长期技术札记。" : "Durable technical notes on system boundaries, evidence-first AI, deterministic computation, data, and browser visual engineering.",
    image: "/cstd-archive/cstd-archive-notebook-v1.webp",
  });
}

export function getCstdTechnicalNoteMetadata(slug: string, locale: CstdLocale) {
  const note = getCstdTechnicalNote(slug);
  if (!note) return {};
  const path = locale === "en" ? `/en/notes/${slug}` : `/notes/${slug}`;
  return createCstdMetadata({ title: note.title[locale], description: note.summary[locale], path, locale, image: note.image.src, type: "article", publishedAt: note.publishedAt });
}

export function getCstdTechnicalNoteOpenGraphData(slug: string) {
  const note = getCstdTechnicalNote(slug);
  if (!note) return null;
  return { title: note.title.en, summary: note.summary.en, readingMinutes: note.readingMinutes } as const;
}

export function getCstdAudienceMetadata(audience: string, locale: CstdLocale = "zh") {
  const mode = parseCstdNarrativeShareSlug(audience);
  if (!mode) return {};
  const narrative = getCstdNarrative(mode);
  return createCstdMetadata({
    title: locale === "zh" ? `${narrative.label.zh}观看路径` : `${narrative.label.en} viewing path`,
    description: narrative.description[locale],
    path: locale === "en" ? `/en/for/${audience}` : `/for/${audience}`,
    locale,
    image: "/cstd-universe/cstd-neural-gate-v1.webp",
  });
}

export function getCstdLabMetadata(slug: string | undefined, locale: CstdLocale) {
  const lab = slug ? getCstdLab(slug) : undefined;
  if (slug && !lab) return {};
  const path = locale === "en" ? `/en/lab${slug ? `/${slug}` : ""}` : `/lab${slug ? `/${slug}` : ""}`;
  return createCstdMetadata({
    title: lab?.title[locale] ?? (locale === "zh" ? "交互实验室" : "Interactive lab"),
    description: lab?.summary[locale] ?? (locale === "zh" ? "可操作的架构、Agent、DCF 与渲染预算实验。" : "Interactive experiments for architecture, agents, DCF, and render budgets."),
    path,
    locale,
    image: lab?.image.src ?? "/cstd-universe/cstd-skill-reactor-v1.webp",
  });
}

export function getCstdTopicMetadata(slug: string | undefined, locale: CstdLocale) {
  const topic = slug ? getCstdTopic(slug) : undefined;
  if (slug && !topic) return {};
  const path = locale === "en" ? `/en/topics${slug ? `/${slug}` : ""}` : `/topics${slug ? `/${slug}` : ""}`;
  return createCstdMetadata({
    title: topic?.title[locale] ?? (locale === "zh" ? "工程主题路径" : "Engineering topic paths"),
    description: topic?.summary[locale] ?? (locale === "zh" ? "按工程判断连接真实案例、技术札记与可运行实验。" : "Curated engineering judgments connected to shipped cases, technical notes, and executable labs."),
    path,
    locale,
    image: topic?.image.src ?? "/cstd-universe/cstd-knowledge-loom-v2.webp",
  });
}

export function getCstdProfileMetadata(page: "about" | "now" | "resume" | "en", locale: CstdLocale) {
  const values = {
    about: {
      title: locale === "zh" ? "关于奶黄包" : "About Custard",
      description: locale === "zh" ? "奶黄包的跨学科工程路径、工作原则与能力面。" : "Custard's interdisciplinary engineering path, principles, and capabilities.",
      image: "/cstd-archive/cstd-archive-studio-v1.webp",
      type: "profile" as const,
    },
    now: {
      title: locale === "zh" ? "现在" : "Now",
      description: locale === "zh" ? "奶黄包此刻正在构建与学习的内容。" : "What Custard is building and learning now.",
      image: "/cstd-universe/cstd-departure-city-v1.webp",
      type: "website" as const,
    },
    resume: {
      title: locale === "zh" ? "技术履历" : "Technical resume",
      description: locale === "zh" ? "奶黄包的产品工程、数据、AI、研究与视觉工程履历。" : "Custard's product engineering, data, AI, research, and visual engineering resume.",
      image: "/cstd-og-v2.webp",
      type: "profile" as const,
    },
    en: {
      title: "Custard / CSTD",
      description: "Product engineer and creative systems builder. Shipped systems, technical notes, and interactive labs.",
      image: "/cstd-universe/cstd-night-workstation-v1.webp",
      type: "profile" as const,
    },
  }[page];
  const path = page === "en" ? "/en" : locale === "en" ? `/en/${page}` : `/${page}`;
  return createCstdMetadata({ ...values, path, locale });
}
