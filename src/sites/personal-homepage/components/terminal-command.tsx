"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { clsx } from "clsx";

export type TerminalLine = {
  /** 内容（支持 \n 换行） */
  text: string;
  /** 行样式 */
  tone?: "default" | "dim" | "accent" | "warn" | "error";
  /** 显示为命令提示符行 */
  prompt?: boolean;
  /** 该行打字机速度（ms/字符），undefined = 立即 */
  type?: number;
};

type TerminalCommandProps = {
  /** 初始启动日志 */
  bootLines: TerminalLine[];
  /** calm 模式：关闭打字机与光标闪烁，直接渲染 */
  disabled?: boolean;
  /** 输入占位 */
  placeholder?: string;
  /** 命令处理器：返回输出行（可含跳转副作用） */
  onCommand: (command: string, echo: (lines: TerminalLine[]) => void) => void;
  /** 可选：已知命令提示列表 */
  className?: string;
  /** 内容区高度 */
  height?: string;
};

const TONE_CLASS: Record<NonNullable<TerminalLine["tone"]>, string> = {
  default: "text-[#d7d7d7]",
  dim: "text-[#8a8f98]",
  accent: "text-[#33ff66]",
  warn: "text-[#febc2e]",
  error: "text-[#ff5f57]",
};

/**
 * 可交互命令终端：启动日志打字机 + 真命令输入（help/ls/cd/clear...）+ 历史导航。
 * 终端极客风的灵魂交互。
 */
export function TerminalCommand({
  bootLines,
  disabled = false,
  placeholder = "type 'help' for commands",
  onCommand,
  className = "",
  height = "320px",
}: TerminalCommandProps) {
  const [lines, setLines] = useState<TerminalLine[]>(disabled ? bootLines : []);
  const [input, setInput] = useState("");
  const historyRef = useRef<string[]>([]);
  const historyIndexRef = useRef(-1);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const typeRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const bootDoneRef = useRef(disabled);

  // 打字机：逐行逐字渲染 bootLines
  useEffect(() => {
    if (disabled || bootDoneRef.current) {
      setLines(bootLines);
      return;
    }
    bootDoneRef.current = true;
    let lineIndex = 0;
    let charIndex = 0;
    let rendered: TerminalLine[] = [];

    const tick = () => {
      if (lineIndex >= bootLines.length) {
        if (typeRef.current) clearInterval(typeRef.current);
        typeRef.current = null;
        return;
      }
      const line = bootLines[lineIndex];
      const speed = line.type ?? 0;
      if (speed <= 0) {
        rendered = [...rendered, { ...line, text: line.text }];
        setLines(rendered);
        lineIndex += 1;
        return;
      }
      charIndex += 1;
      const slice = line.text.slice(0, charIndex);
      setLines([...rendered, { ...line, text: slice }]);
      if (charIndex >= line.text.length) {
        rendered = [...rendered, { ...line, text: line.text }];
        lineIndex += 1;
        charIndex = 0;
      }
    };

    typeRef.current = setInterval(tick, 16);
    return () => {
      if (typeRef.current) clearInterval(typeRef.current);
    };
  }, [bootLines, disabled]);

  // 自动滚底
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines, input]);

  const echo = useCallback((output: TerminalLine[]) => {
    setLines((current) => [...current, ...output]);
  }, []);

  function handleSubmit() {
    const raw = input.trim();
    if (raw === "clear") {
      setLines([]);
      setInput("");
      return;
    }
    if (!raw) return;
    historyRef.current.push(raw);
    historyIndexRef.current = historyRef.current.length;
    setLines((current) => [...current, { text: raw, prompt: true }]);
    onCommand(raw, echo);
    setInput("");
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      handleSubmit();
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      if (historyIndexRef.current > 0) {
        historyIndexRef.current -= 1;
        setInput(historyRef.current[historyIndexRef.current] ?? "");
      }
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      if (historyIndexRef.current < historyRef.current.length) {
        historyIndexRef.current += 1;
        setInput(historyRef.current[historyIndexRef.current] ?? "");
      }
    }
  }

  return (
    <div className={clsx("font-mono text-[13px] leading-6 md:text-sm", className)}>
      <div
        ref={scrollRef}
        role="button"
        tabIndex={-1}
        aria-label="聚焦终端输入"
        className="overflow-y-auto pr-1"
        style={{ height }}
        onClick={() => inputRef.current?.focus()}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            inputRef.current?.focus();
          }
        }}
      >
        {lines.map((line, index) => (
          <p
            key={index}
            className={clsx("whitespace-pre-wrap break-words", TONE_CLASS[line.tone ?? "default"])}
          >
            {line.prompt ? (
              <>
                <span className="text-[#33ff66]">$ </span>
                <span className="text-[#d7d7d7]">{line.text}</span>
              </>
            ) : (
              line.text
            )}
          </p>
        ))}
        {/* 输入行 + 闪烁光标块 */}
        <p className="flex items-center gap-2">
          <span className="text-[#33ff66]">$</span>
          <input
            ref={inputRef}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            aria-label="终端命令输入"
            className="min-w-0 flex-1 border-none bg-transparent text-[#d7d7d7] caret-transparent outline-none placeholder:text-[#3a3f47]"
          />
          <span
            aria-hidden="true"
            className="inline-block h-[1.1em] w-[0.55em] flex-none bg-[#33ff66]"
            style={{ animation: disabled ? undefined : "cstd-blink 1.1s step-end infinite" }}
          />
        </p>
      </div>
    </div>
  );
}
