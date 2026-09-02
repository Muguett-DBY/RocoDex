"use client";

import { Pickaxe } from "lucide-react";
import { clsx } from "clsx";
import type { CstdLocale } from "../content/content-types";
import { getLocalizedCstdHref } from "../infrastructure/i18n";
import { CstdLink } from "../components/site/cstd-link";
import styles from "./voxel-nav-link.module.css";

export function VoxelNavLink({ locale, compact = false, className }: { locale: CstdLocale; compact?: boolean; className?: string }) {
  const fullLabel = locale === "zh" ? "算了，玩会我的世界吧" : "Never mind. Let's mine a while.";
  const visibleLabel = compact ? (locale === "zh" ? "方块世界" : "Voxel world") : fullLabel;

  return (
    <CstdLink
      href={getLocalizedCstdHref("/voxel", locale)}
      data-cstd-voxel-nav
      aria-label={fullLabel}
      title={fullLabel}
      className={clsx(styles.navLink, className)}
    >
      <Pickaxe aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
      <span>{visibleLabel}</span>
    </CstdLink>
  );
}
