import { access, mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import matter from "gray-matter";
import { caseDocumentSchema, noteDocumentSchema } from "../src/sites/personal-homepage/content/content-schema";
import { createCstdContentHealth } from "../src/sites/personal-homepage/content/content-health";
import { cstdLabs } from "../src/sites/personal-homepage/content/labs";
import { createCstdStudioSnapshot } from "../src/sites/personal-homepage/content/studio-status";
import { createCstdEngineeringObservatory } from "../src/sites/personal-homepage/content/observatory";
import { cstdTopics } from "../src/sites/personal-homepage/content/topics";

const contentRoot = path.join(process.cwd(), "src", "sites", "personal-homepage", "content", "documents");
const publicRoot = path.join(process.cwd(), "public");
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const sensitivePattern = /(?:api[_-]?key|access[_-]?token|client[_-]?secret|password)\s*[:=]\s*["']?[a-z0-9_-]{12,}/iu;

function quoted(value: string) {
  return JSON.stringify(value);
}

export function assertCstdSlug(slug: string) {
  if (!slugPattern.test(slug)) throw new Error("Slug must use lowercase letters, numbers, and single hyphens");
  return slug;
}

export function createCaseDraftTemplate(slug: string, date = new Date().toISOString().slice(0, 10)) {
  assertCstdSlug(slug);
  const title = slug.split("-").map((part) => part[0].toUpperCase() + part.slice(1)).join(" ");
  return `---
kind: "case"
schemaVersion: 1
slug: ${quoted(slug)}
projectId: ${quoted(slug)}
year: ${quoted(date.slice(0, 4))}
publicationStatus: "draft"
revision: 1
publishedAt: ${quoted(date)}
updatedAt: ${quoted(date)}
title: {"zh":${quoted(title)},"en":${quoted(title)}}
kicker: {"zh":"工程案例","en":"Engineering case"}
summary: {"zh":"用一句可验证的话说明问题、边界和结果。","en":"Describe the problem, boundary, and outcome in one verifiable sentence."}
film: {"durationSeconds":75,"logline":{"zh":"从约束到交付证据。","en":"From constraint to delivery evidence."},"beats":[{"id":"problem","phase":"problem","title":{"zh":"问题","en":"Problem"},"detail":{"zh":"说明真实问题。","en":"Describe the real problem."},"signal":{"zh":"问题信号","en":"Problem signal"}},{"id":"constraint","phase":"constraint","title":{"zh":"约束","en":"Constraint"},"detail":{"zh":"说明不可绕过的约束。","en":"Describe the non-negotiable constraint."},"signal":{"zh":"约束信号","en":"Constraint signal"}},{"id":"decision","phase":"decision","title":{"zh":"决策","en":"Decision"},"detail":{"zh":"说明关键工程决策。","en":"Describe the key engineering decision."},"signal":{"zh":"决策信号","en":"Decision signal"}},{"id":"evidence","phase":"evidence","title":{"zh":"证据","en":"Evidence"},"detail":{"zh":"说明如何验证结果。","en":"Describe how the result was verified."},"signal":{"zh":"证据信号","en":"Evidence signal"}}]}
role: {"zh":"产品与工程","en":"Product and engineering"}
runtimeStatus: {"zh":"草稿 / 未发布","en":"Draft / not published"}
liveHref: null
image: {"src":"/cstd-universe/cstd-night-workstation-v1.webp","alt":{"zh":"案例视觉占位图","en":"Case visual placeholder"},"position":"50% 50%"}
technologies: ["TypeScript","Next.js","Vitest","Playwright"]
metrics: [{"value":"1","label":{"zh":"核心问题","en":"core problem"}},{"value":"0","label":{"zh":"未解释边界","en":"unexplained boundaries"}}]
evidence: [{"label":{"zh":"实现","en":"Implementation"},"detail":{"zh":"补充实现证据。","en":"Add implementation evidence."}},{"label":{"zh":"测试","en":"Tests"},"detail":{"zh":"补充测试证据。","en":"Add test evidence."}},{"label":{"zh":"发布","en":"Release"},"detail":{"zh":"补充发布证据。","en":"Add release evidence."}}]
capabilityIds: ["product-surfaces"]
relatedNoteSlugs: ["host-boundaries-in-one-next-deployment"]
relatedLabSlugs: ["system-trace"]
artifacts: [{"kind":"note","label":{"zh":"决策记录","en":"Decision record"},"detail":{"zh":"替换为真实记录。","en":"Replace with a real record."},"href":{"zh":"/notes/host-boundaries-in-one-next-deployment","en":"/en/notes/host-boundaries-in-one-next-deployment"},"verifiedAt":${quoted(date)}},{"kind":"lab","label":{"zh":"可执行实验","en":"Executable lab"},"detail":{"zh":"替换为真实实验。","en":"Replace with a real lab."},"href":{"zh":"/lab/system-trace","en":"/en/lab/system-trace"},"verifiedAt":${quoted(date)}}]
toc: [{"id":"problem","eyebrow":{"zh":"01 / 问题","en":"01 / Problem"},"title":{"zh":"问题是什么？","en":"What was the problem?"}},{"id":"decision","eyebrow":{"zh":"02 / 决策","en":"02 / Decision"},"title":{"zh":"做了什么决定？","en":"What decision was made?"}},{"id":"evidence","eyebrow":{"zh":"03 / 证据","en":"03 / Evidence"},"title":{"zh":"如何证明？","en":"How was it verified?"}}]
---

<LocaleBlock locale="zh">

<ArchiveSection id="problem" title="问题是什么？" eyebrow="01 / 问题">

写清真实问题、受影响的人和失败边界。

</ArchiveSection>

<ArchiveSection id="decision" title="做了什么决定？" eyebrow="02 / 决策">

记录被选择的方案、被放弃的方案与原因。

</ArchiveSection>

<ArchiveSection id="evidence" title="如何证明？" eyebrow="03 / 证据">

链接实现、测试、发布与线上验收证据。

</ArchiveSection>

</LocaleBlock>

<LocaleBlock locale="en">

<ArchiveSection id="problem" title="What was the problem?" eyebrow="01 / Problem">

Describe the real problem, affected user, and failure boundary.

</ArchiveSection>

<ArchiveSection id="decision" title="What decision was made?" eyebrow="02 / Decision">

Record the selected approach, rejected alternatives, and reasoning.

</ArchiveSection>

<ArchiveSection id="evidence" title="How was it verified?" eyebrow="03 / Evidence">

Link implementation, test, release, and live acceptance evidence.

</ArchiveSection>

</LocaleBlock>
`;
}

export function createNoteDraftTemplate(slug: string, date = new Date().toISOString().slice(0, 10)) {
  assertCstdSlug(slug);
  const title = slug.split("-").map((part) => part[0].toUpperCase() + part.slice(1)).join(" ");
  return `---
kind: "note"
schemaVersion: 1
slug: ${quoted(slug)}
publicationStatus: "draft"
revision: 1
publishedAt: ${quoted(date)}
updatedAt: ${quoted(date)}
readingMinutes: 6
category: {"zh":"工程决策","en":"Engineering decision"}
series: {"zh":"CSTD 技术札记","en":"CSTD technical notes"}
title: {"zh":${quoted(title)},"en":${quoted(title)}}
summary: {"zh":"用一句话写出可复用的技术判断。","en":"State the reusable engineering judgment in one sentence."}
image: {"src":"/cstd-archive/cstd-archive-notebook-v1.webp","alt":{"zh":"技术札记视觉占位图","en":"Technical note visual placeholder"},"position":"50% 50%"}
relatedCaseSlugs: ["rocodex-platform"]
tags: ["Architecture","Evidence"]
corrections: []
toc: [{"id":"context","eyebrow":{"zh":"01 / 背景","en":"01 / Context"},"title":{"zh":"问题从哪里来？","en":"Where did the problem come from?"}},{"id":"decision","eyebrow":{"zh":"02 / 判断","en":"02 / Decision"},"title":{"zh":"核心判断是什么？","en":"What is the core judgment?"}},{"id":"limits","eyebrow":{"zh":"03 / 边界","en":"03 / Limits"},"title":{"zh":"它在哪里不成立？","en":"Where does it stop applying?"}}]
---

<LocaleBlock locale="zh">

<ArchiveSection id="context" title="问题从哪里来？" eyebrow="01 / 背景">补充上下文。</ArchiveSection>
<ArchiveSection id="decision" title="核心判断是什么？" eyebrow="02 / 判断">补充判断与证据。</ArchiveSection>
<ArchiveSection id="limits" title="它在哪里不成立？" eyebrow="03 / 边界">补充限制与反例。</ArchiveSection>

</LocaleBlock>

<LocaleBlock locale="en">

<ArchiveSection id="context" title="Where did the problem come from?" eyebrow="01 / Context">Add context.</ArchiveSection>
<ArchiveSection id="decision" title="What is the core judgment?" eyebrow="02 / Decision">Add the judgment and evidence.</ArchiveSection>
<ArchiveSection id="limits" title="Where does it stop applying?" eyebrow="03 / Limits">Add limits and counterexamples.</ArchiveSection>

</LocaleBlock>
`;
}

type ParsedDocument = { file: string; source: string; data: Record<string, unknown> };

async function readDocuments(kind: "cases" | "notes"): Promise<ParsedDocument[]> {
  const directory = path.join(contentRoot, kind);
  const files = (await readdir(directory)).filter((file) => file.endsWith(".mdx")).sort();
  return Promise.all(files.map(async (file) => {
    const source = await readFile(path.join(directory, file), "utf8");
    return { file: `${kind}/${file}`, source, data: matter(source).data };
  }));
}

export async function verifyCstdContent(now = new Date()) {
  const [caseDocuments, noteDocuments] = await Promise.all([readDocuments("cases"), readDocuments("notes")]);
  const cases = caseDocuments.map((document) => caseDocumentSchema.parse(document.data));
  const notes = noteDocuments.map((document) => noteDocumentSchema.parse(document.data));
  const knownPaths = new Set([
    "/", "/about", "/now", "/resume", "/map", "/work", "/notes", "/lab", "/topics",
    ...cases.map((entry) => `/work/${entry.slug}`),
    ...notes.map((entry) => `/notes/${entry.slug}`),
    ...cstdLabs.map((entry) => `/lab/${entry.slug}`),
    ...cstdTopics.map((entry) => `/topics/${entry.slug}`),
  ]);
  const issues: string[] = [];
  let artifacts = 0;

  for (const document of [...caseDocuments, ...noteDocuments]) {
    if (!document.source.includes('<LocaleBlock locale="zh">') || !document.source.includes('<LocaleBlock locale="en">')) issues.push(`${document.file}: missing bilingual blocks`);
    if (sensitivePattern.test(document.source)) issues.push(`${document.file}: possible secret in public content`);
    const image = document.data.image as { src?: unknown } | undefined;
    if (typeof image?.src === "string") {
      await access(path.join(publicRoot, image.src.replace(/^\//, ""))).catch(() => issues.push(`${document.file}: missing image ${image.src}`));
    }
  }

  for (const document of caseDocuments) {
    const entry = caseDocumentSchema.parse(document.data);
    const tocIds = entry.toc.map((item) => item.id);
    for (const locale of ["zh", "en"] as const) {
      const block = document.source.match(new RegExp(`<LocaleBlock locale="${locale}">([\\s\\S]*?)<\\/LocaleBlock>`))?.[1] ?? "";
      const sectionIds = [...block.matchAll(/<ArchiveSection\s+[^>]*\bid="([^"]+)"/g)].map((match) => match[1]);
      if (sectionIds.join("|") !== tocIds.join("|")) issues.push(`${document.file}: ${locale} section ids do not match toc order`);
    }
  }
  for (const document of noteDocuments) {
    const entry = noteDocumentSchema.parse(document.data);
    const tocIds = entry.toc.map((item) => item.id);
    for (const locale of ["zh", "en"] as const) {
      const block = document.source.match(new RegExp(`<LocaleBlock locale="${locale}">([\\s\\S]*?)<\\/LocaleBlock>`))?.[1] ?? "";
      const sectionIds = [...block.matchAll(/<ArchiveSection\s+[^>]*\bid="([^"]+)"/g)].map((match) => match[1]);
      if (sectionIds.join("|") !== tocIds.join("|")) issues.push(`${document.file}: ${locale} section ids do not match toc order`);
    }
    for (const correction of entry.corrections) {
      if (correction.date > entry.updatedAt) issues.push(`${document.file}: correction ${correction.date} is newer than updatedAt ${entry.updatedAt}`);
    }
  }

  for (const entry of cases.filter((candidate) => candidate.publicationStatus === "published")) {
    for (const artifact of entry.artifacts) {
      artifacts += 1;
      const ageDays = (now.getTime() - Date.parse(`${artifact.verifiedAt}T00:00:00Z`)) / 86_400_000;
      if (ageDays > 180) issues.push(`${entry.slug}: stale ${artifact.kind} artifact from ${artifact.verifiedAt}`);
      for (const href of [artifact.href.zh, artifact.href.en]) {
        if (!href.startsWith("/")) continue;
        const normalized = href.startsWith("/en/") ? href.slice(3) : href;
        if (!knownPaths.has(normalized)) issues.push(`${entry.slug}: broken internal artifact path ${href}`);
      }
    }
  }

  const health = createCstdContentHealth(now);
  if (health.issues.brokenRelations.length > 0) issues.push(...health.issues.brokenRelations.map((issue) => `broken relation ${issue}`));
  if (health.issues.orphanedEntries.length > 0) issues.push(...health.issues.orphanedEntries.map((issue) => `orphaned entry ${issue}`));
  if (issues.length > 0) throw new Error(`CSTD proof verification failed:\n${issues.join("\n")}`);
  return { cases: cases.length, notes: notes.length, artifacts, health: health.score, status: "verified" as const };
}

async function createDraft(kind: "case" | "note", slug: string) {
  const safeSlug = assertCstdSlug(slug);
  const directory = path.join(contentRoot, kind === "case" ? "cases" : "notes");
  const file = path.join(directory, `${safeSlug}.mdx`);
  await mkdir(directory, { recursive: true });
  await access(file).then(() => { throw new Error(`Refusing to overwrite ${file}`); }).catch((error: NodeJS.ErrnoException) => {
    if (error.message.startsWith("Refusing")) throw error;
    if (error.code !== "ENOENT") throw error;
  });
  await writeFile(file, kind === "case" ? createCaseDraftTemplate(safeSlug) : createNoteDraftTemplate(safeSlug), "utf8");
  return file;
}

async function main() {
  const [command, slug] = process.argv.slice(2);
  if (command === "new-case" && slug) return console.log(await createDraft("case", slug));
  if (command === "new-note" && slug) return console.log(await createDraft("note", slug));
  if (command === "verify-proof") return console.log(JSON.stringify(await verifyCstdContent(), null, 2));
  if (command === "content-health") return console.log(JSON.stringify(createCstdContentHealth(), null, 2));
  if (command === "snapshot") return console.log(JSON.stringify(createCstdStudioSnapshot(), null, 2));
  if (command === "release-candidate") {
    const verification = await verifyCstdContent();
    const observatory = createCstdEngineeringObservatory();
    return console.log(JSON.stringify({
      release: observatory.release,
      verification,
      deployment: observatory.deployment,
      gates: observatory.verification,
      provenance: observatory.provenance,
    }, null, 2));
  }
  if (command === "release-brief") {
    const snapshot = createCstdStudioSnapshot();
    return console.log(JSON.stringify({
      release: snapshot.release,
      generatedAt: snapshot.generatedAt,
      digest: snapshot.provenance.digest,
      totals: { ...snapshot.totals, topics: cstdTopics.length, labs: cstdLabs.length },
      refresh: snapshot.districts.filter((district) => district.state !== "online").map((district) => district.id),
    }, null, 2));
  }
  throw new Error("Usage: cstd-content-cli.mts <new-case|new-note|verify-proof|content-health|snapshot|release-brief|release-candidate> [slug]");
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) void main();
