"use client";

import { Check, Quote } from "lucide-react";
import { useState } from "react";

export function CitationButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  return (
    <button type="button" onClick={() => void copy()} className="mt-6 inline-flex items-center gap-2 border-b border-black/35 pb-1 font-mono text-[11px] font-black text-black/75 hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black">
      {copied ? <Check aria-hidden="true" className="h-3.5 w-3.5" /> : <Quote aria-hidden="true" className="h-3.5 w-3.5" />}
      {label}
    </button>
  );
}
