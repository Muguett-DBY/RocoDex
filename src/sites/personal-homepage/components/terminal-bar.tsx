"use client";

type TerminalBarProps = { title: string; right?: React.ReactNode };

/**
 * 终端标题栏：红黄绿圆点 + 标题 + 右侧信息。
 */
export function TerminalBar({ title, right }: TerminalBarProps) {
  return (
    <div className="flex items-center justify-between border-b border-[#2a2d33] bg-[#14161a] px-4 py-2.5">
      <div className="flex items-center gap-2">
        <span aria-hidden="true" className="h-3 w-3 rounded-full bg-[#ff5f57]" />
        <span aria-hidden="true" className="h-3 w-3 rounded-full bg-[#febc2e]" />
        <span aria-hidden="true" className="h-3 w-3 rounded-full bg-[#28c840]" />
      </div>
      <span className="text-[10px] font-bold tracking-[0.12em] text-[#8a8f98]">{title}</span>
      {right ? <span className="text-[10px] font-bold text-[#8a8f98]">{right}</span> : <span aria-hidden="true" className="w-12" />}
    </div>
  );
}
