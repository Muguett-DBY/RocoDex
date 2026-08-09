import { CstdAudienceHomepagePage, cstdAudienceStaticParams } from "@/sites/personal-homepage/routes";
import { getCstdAudienceMetadata } from "@/sites/personal-homepage/metadata";

export const dynamicParams = false;

export function generateStaticParams() {
  return cstdAudienceStaticParams;
}

export async function generateMetadata({ params }: { params: Promise<{ audience: string }> }) {
  const { audience } = await params;
  return getCstdAudienceMetadata(audience);
}

export default async function CstdAudiencePage({ params }: { params: Promise<{ audience: string }> }) {
  const { audience } = await params;
  return <CstdAudienceHomepagePage audience={audience} />;
}
