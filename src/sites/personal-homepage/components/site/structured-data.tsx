export function StructuredData({ value }: { value: Record<string, unknown> | readonly Record<string, unknown>[] }) {
  const json = JSON.stringify(value).replaceAll("<", "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
