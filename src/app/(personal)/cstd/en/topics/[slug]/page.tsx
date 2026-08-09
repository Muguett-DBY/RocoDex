import { CstdTopicPage, cstdTopicStaticParams } from "@/sites/personal-homepage/routes";
import { getCstdTopicMetadata } from "@/sites/personal-homepage/metadata";

export const dynamicParams = false;

export function generateStaticParams() {
  return cstdTopicStaticParams;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return getCstdTopicMetadata(slug, "en");
}

export default async function TopicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <CstdTopicPage locale="en" slug={slug} />;
}
