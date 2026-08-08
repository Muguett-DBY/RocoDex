import { CstdCaseStudyPage, cstdCaseStudyStaticParams } from "@/sites/personal-homepage/routes";
import { getCstdCaseStudyMetadata } from "@/sites/personal-homepage/metadata";

export const dynamicParams = false;

export function generateStaticParams() {
  return cstdCaseStudyStaticParams;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return getCstdCaseStudyMetadata(slug, "en");
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <CstdCaseStudyPage locale="en" slug={slug} />;
}
