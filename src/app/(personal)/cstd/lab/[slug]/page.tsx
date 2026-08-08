import { CstdLabDetailPage, cstdLabStaticParams } from "@/sites/personal-homepage/routes";
import { getCstdLabMetadata } from "@/sites/personal-homepage/metadata";

export const dynamicParams = false;

export function generateStaticParams() {
  return cstdLabStaticParams;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return getCstdLabMetadata(slug, "zh");
}

export default async function LabDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <CstdLabDetailPage locale="zh" slug={slug} />;
}
