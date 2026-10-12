"use client";

import { useState } from "react";
import type { CstdLocale } from "../../content/content-types";

export function TimelineExpandButton({ locale }: { locale: CstdLocale }) {
  const [expanded, setExpanded] = useState(false);
  return <button type="button" className="cstd-timeline-expand" onClick={(event) => {
    const timeline = event.currentTarget.closest("[data-cstd-capability-timeline]");
    timeline?.querySelectorAll<HTMLDetailsElement>("details[data-cstd-timeline-detail]").forEach((detail) => { detail.open = !expanded; });
    setExpanded(!expanded);
  }}>{locale === "zh" ? (expanded ? "收起全部细节" : "展开全部细节") : (expanded ? "Collapse all details" : "Expand all details")}<span aria-hidden="true">{expanded ? "−" : "+"}</span></button>;
}
