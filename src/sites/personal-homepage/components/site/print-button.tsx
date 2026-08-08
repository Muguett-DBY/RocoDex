"use client";

import { Download } from "lucide-react";

export function PrintButton({ label }: { label: string }) {
  return <button type="button" onClick={() => window.print()} className="cstd-print-trigger inline-flex items-center gap-3 border border-black px-4 py-3 font-mono text-[9px] font-black transition-colors hover:bg-black hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black"><Download aria-hidden="true" className="h-4 w-4" />{label}</button>;
}
