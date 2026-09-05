import type { ReactNode } from "react";

export function ThemeCopy({
  atelier,
  neon,
  underworld,
  astral,
}: {
  atelier?: ReactNode;
  neon: ReactNode;
  underworld: ReactNode;
  astral: ReactNode;
}) {
  return (
    <>
      <span data-cstd-theme-copy="atelier">{atelier ?? neon}</span>
      <span data-cstd-theme-copy="neon">{neon}</span>
      <span data-cstd-theme-copy="underworld">{underworld}</span>
      <span data-cstd-theme-copy="astral">{astral}</span>
    </>
  );
}

export function ThemeChapterLabel({
  atelier,
  neon,
  underworld,
  astral,
}: {
  atelier?: string;
  neon: string;
  underworld: string;
  astral: string;
}) {
  return <ThemeCopy atelier={atelier} neon={neon} underworld={underworld} astral={astral} />;
}
