"use client";

type TerminalBarProps = { title: string; right?: React.ReactNode };

/**
 * 终端标题栏：红黄绿圆点 + 标题 + 右侧信息。
 */
export function TerminalBar({ title, right }: TerminalBarProps) {
  return (
    <div className="flex items-center justify-between border-b border-[#33284f] bg-[#1b1430] px-4 py-2.5">
      <div className="flex items-center gap-2">
        <span aria-hidden="true" className="h-3 w-3 rounded-full bg-[#ff5f57]" />
        <span aria-hidden="true" className="h-3 w-3 rounded-full bg-[#ff2a6d]" />
        <span aria-hidden="true" className="h-3 w-3 rounded-full bg-[#05d9e8]" />
      </div>
      <span className="text-[10px] font-bold tracking-[0.12em] text-[#9d96bd]">{title}</span>
      {right ? <span className="text-[10px] font-bold text-[#9d96bd]">{right}</span> : <span aria-hidden="true" className="w-12" />}
    </div>
  );
}
