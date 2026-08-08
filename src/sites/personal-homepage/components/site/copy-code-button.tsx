"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

export function CopyCodeButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  return (
    <button
      type="button"
      onClick={() => void copy()}
      aria-label={label}
      title={label}
      className="flex h-9 w-9 items-center justify-center border border-white/15 text-[#91a0a5] transition-colors hover:border-[#24e0ff] hover:text-[#24e0ff] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#24e0ff]"
    >
      {copied ? <Check aria-hidden="true" className="h-4 w-4 text-[#3dff8f]" /> : <Copy aria-hidden="true" className="h-4 w-4" />}
    </button>
  );
}
