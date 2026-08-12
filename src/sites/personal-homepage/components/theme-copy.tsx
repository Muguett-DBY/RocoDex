import type { ReactNode } from "react";

export function ThemeCopy({
  neon,
  ink,
  press,
  pixel,
}: {
  neon: ReactNode;
  ink: ReactNode;
  press: ReactNode;
  pixel: ReactNode;
}) {
  return (
    <>
      <span data-cstd-theme-copy="neon">{neon}</span>
      <span data-cstd-theme-copy="ink">{ink}</span>
      <span data-cstd-theme-copy="press">{press}</span>
      <span data-cstd-theme-copy="pixel">{pixel}</span>
    </>
  );
}

export function ThemeChapterLabel({
  neon,
  ink,
  press,
  pixel,
}: {
  neon: string;
  ink: string;
  press: string;
  pixel: string;
}) {
  return <ThemeCopy neon={neon} ink={ink} press={press} pixel={pixel} />;
}
