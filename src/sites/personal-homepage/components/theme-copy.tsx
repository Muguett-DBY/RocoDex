import type { ReactNode } from "react";

export function ThemeCopy({
  neon,
  underworld,
  astral,
}: {
  neon: ReactNode;
  underworld: ReactNode;
  astral: ReactNode;
}) {
  return (
    <>
      <span data-cstd-theme-copy="neon">{neon}</span>
      <span data-cstd-theme-copy="underworld">{underworld}</span>
      <span data-cstd-theme-copy="astral">{astral}</span>
    </>
  );
}

export function ThemeChapterLabel({
  neon,
  underworld,
  astral,
}: {
  neon: string;
  underworld: string;
  astral: string;
}) {
  return <ThemeCopy neon={neon} underworld={underworld} astral={astral} />;
}
