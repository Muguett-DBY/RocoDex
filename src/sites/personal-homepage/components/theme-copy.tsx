import type { ReactNode } from "react";

export function ThemeCopy({
  neon,
  ink,
  press,
  pixel,
  underworld,
  astral,
}: {
  neon: ReactNode;
  ink: ReactNode;
  press: ReactNode;
  pixel: ReactNode;
  underworld: ReactNode;
  astral: ReactNode;
}) {
  return (
    <>
      <span data-cstd-theme-copy="neon">{neon}</span>
      <span data-cstd-theme-copy="ink">{ink}</span>
      <span data-cstd-theme-copy="press">{press}</span>
      <span data-cstd-theme-copy="pixel">{pixel}</span>
      <span data-cstd-theme-copy="underworld">{underworld}</span>
      <span data-cstd-theme-copy="astral">{astral}</span>
    </>
  );
}

export function ThemeChapterLabel({
  neon,
  ink,
  press,
  pixel,
  underworld,
  astral,
}: {
  neon: string;
  ink: string;
  press: string;
  pixel: string;
  underworld: string;
  astral: string;
}) {
  return <ThemeCopy neon={neon} ink={ink} press={press} pixel={pixel} underworld={underworld} astral={astral} />;
}
