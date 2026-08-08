import { CstdTechnicalNotePage, cstdTechnicalNoteStaticParams } from "@/sites/personal-homepage/routes";
import { getCstdTechnicalNoteMetadata } from "@/sites/personal-homepage/metadata";

export const dynamicParams = false;

export function generateStaticParams() {
  return cstdTechnicalNoteStaticParams;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return getCstdTechnicalNoteMetadata(slug, "zh");
}

export default async function TechnicalNotePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <CstdTechnicalNotePage locale="zh" slug={slug} />;
}
