/** The open C echoes the folded ribbon on the studio homepage. */
export function CstdBrandMark({ className = "" }: { className?: string }) {
  return (
    <svg className={`cstd-brand-mark ${className}`} viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <path d="M29.8 10.2a14 14 0 1 0 0 19.6" stroke="currentColor" strokeWidth="5.5" />
      <path d="m27.9 8.6 5.2 5.2-5.1 5.1M27.9 31.4l5.2-5.2-5.1-5.1" fill="currentColor" />
      <path d="M26.5 11.2a10.8 10.8 0 0 0-15.3 15.3" stroke="#b2945c" strokeWidth="1.5" />
    </svg>
  );
}
