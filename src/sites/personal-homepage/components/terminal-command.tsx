"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { clsx } from "clsx";
import { terminalSound } from "./terminal-sound";

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
  /** Tab 补全候选：命令名 → 候选列表（cd/open 等） */
  completions?: Record<string, string[]>;
  /** 可选：已知命令提示列表 */
  className?: string;
  /** 内容区高度 */
  height?: string;
};

const BUILTIN_COMMANDS = ["help", "whoami", "ls", "cd", "ps", "open", "neofetch", "date", "clear", "exit", "sudo", "top", "ping", "tree", "echo", "whois", "curl", "history", "matrix"];
const HISTORY_KEY = "cstd-terminal-history";

/** matrix 数字雨：4 秒自动停止；calm 下只渲染静态帧 */
function MatrixRain({ disabled }: { disabled: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = wrap.clientWidth;
    const height = 200;
    const fontSize = 14;
    canvas.width = width;
    canvas.height = height;
    const cols = Math.max(1, Math.floor(width / fontSize));
    const drops = Array.from({ length: cols }, () => Math.random() * -30);

    if (disabled) {
      // 静态一帧
      ctx.fillStyle = "#0b0c0e";
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = "#33ff66";
      ctx.font = `${fontSize}px monospace`;
      for (let i = 0; i < cols; i += 1) {
        const y = (Math.abs(drops[i]) % (height / fontSize)) * fontSize;
        ctx.fillText(MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)], i * fontSize, y);
      }
      return;
    }

    let raf = 0;
    const start = performance.now();
    const draw = () => {
      ctx.fillStyle = "rgba(11,12,14,0.12)";
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = "#33ff66";
      ctx.font = `${fontSize}px monospace`;
      for (let i = 0; i < cols; i += 1) {
        const ch = MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)];
        ctx.fillText(ch, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > height && Math.random() > 0.975) drops[i] = 0;
        drops[i] += 1;
      }
      if (performance.now() - start < 4000) {
        raf = requestAnimationFrame(draw);
      } else {
        ctx.fillStyle = "#0b0c0e";
        ctx.fillRect(0, 0, width, height);
      }
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, [disabled]);

  return (
    <div ref={wrapRef} className="my-1 overflow-hidden rounded border border-[#33ff66]/20">
      <canvas ref={canvasRef} className="block h-[200px] w-full" />
    </div>
  );
}
const MATRIX_CHARS = "01アイウエオカキクケコサシスセソタチツテト0123ABCDEF";

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
  completions,
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
  const [muted, setMuted] = useState(terminalSound.isMuted());
  const [matrixActive, setMatrixActive] = useState(false);
  // echo 打字机队列
  const echoQueueRef = useRef<TerminalLine[]>([]);
  const echoTypingRef = useRef(false);
  const echoTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // 命令历史持久化（↑ 可回翻上次会话）
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(HISTORY_KEY);
      if (saved) {
        const parsed: unknown = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          historyRef.current = parsed.filter((item): item is string => typeof item === "string").slice(-50);
          historyIndexRef.current = historyRef.current.length;
        }
      }
    } catch {
      // 存储不可用时历史仅存于本次会话
    }
  }, []);


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

  // echo：支持打字机输出（type>0 的行逐字打出），普通行立即追加
  const echo = useCallback((output: TerminalLine[]) => {
    // 用户输入打断 boot 打字机
    if (typeRef.current) {
      clearInterval(typeRef.current);
      typeRef.current = null;
    }
    // 错误行提示音
    if (output.some((line) => line.tone === "error")) {
      terminalSound.error();
    }
    echoQueueRef.current.push(...output);
    if (echoTypingRef.current) return;
    echoTypingRef.current = true;

    const pump = () => {
      if (echoQueueRef.current.length === 0) {
        echoTypingRef.current = false;
        if (echoTimerRef.current) {
          clearInterval(echoTimerRef.current);
          echoTimerRef.current = null;
        }
        return;
      }
      const line = echoQueueRef.current.shift() as TerminalLine;
      const speed = line.type ?? 0;
      if (speed <= 0) {
        setLines((current) => [...current, line]);
        pump();
        return;
      }
      let charIndex = 0;
      echoTimerRef.current = setInterval(() => {
        charIndex += 1;
        setLines((current) => [...current.slice(0, -1), { ...line, text: line.text.slice(0, charIndex) }]);
        if (charIndex >= line.text.length) {
          if (echoTimerRef.current) {
            clearInterval(echoTimerRef.current);
            echoTimerRef.current = null;
          }
          pump();
        }
      }, speed);
    };
    pump();
  }, []);

  function handleSubmit() {
    const raw = input.trim();
    terminalSound.enter();
    // 组件内置命令
    if (raw === "history") {
      setLines((current) => [...current, { text: raw, prompt: true }]);
      if (historyRef.current.length === 0) {
        echo([{ text: "history: 还没有命令记录", tone: "dim" }]);
      } else {
        echo(
          historyRef.current.map((command, index) => ({
            text: `${String(index + 1).padStart(4)}  ${command}`,
            tone: "dim" as const,
          })),
        );
      }
      setInput("");
      return;
    }
    if (raw === "matrix") {
      setLines((current) => [...current, { text: raw, prompt: true }]);
      setMatrixActive(true);
      setInput("");
      echo([
        { text: "Wake up, Neo...", tone: "accent", type: 6 },
      ]);
      return;
    }
    if (raw === "clear") {
      setLines([]);
      setInput("");
      return;
    }
    if (!raw) return;
    historyRef.current.push(raw);
    historyIndexRef.current = historyRef.current.length;
    try {
      window.localStorage.setItem(HISTORY_KEY, JSON.stringify(historyRef.current.slice(-50)));
    } catch {
      // 存储不可用则历史仅存于本次会话
    }
    setLines((current) => [...current, { text: raw, prompt: true }]);
    onCommand(raw, echo);
    setInput("");
  }

  /** Tab 补全：命令名 / cd 目录 / open 项目 */
  function handleTab() {
    const current = input;
    const parts = current.split(/\s+/);
    const last = parts[parts.length - 1] ?? "";
    if (!last) {
      setInput("help ");
      return;
    }
    const head = parts[0] ?? "";
    const candidates =
      parts.length === 1
        ? BUILTIN_COMMANDS
        : (completions?.[head] ?? []);
    const matches = candidates.filter((candidate) => candidate.startsWith(last));
    if (matches.length === 0) return;
    if (matches.length === 1) {
      parts[parts.length - 1] = matches[0];
      setInput(parts.join(" ") + (parts.length === 1 ? " " : ""));
      return;
    }
    // 多个候选：公共前缀 + 提示
    let common = matches[0];
    for (const candidate of matches) {
      while (!candidate.startsWith(common)) {
        common = common.slice(0, -1);
      }
    }
    if (common.length > last.length) {
      parts[parts.length - 1] = common;
      setInput(parts.join(" "));
    }
    echo([{ text: matches.join("   "), tone: "dim" }]);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      handleSubmit();
    } else if (event.key === "Tab") {
      event.preventDefault();
      terminalSound.tab();
      handleTab();
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
    } else if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "l") {
      // Ctrl+L：清屏（终端标准）
      event.preventDefault();
      terminalSound.enter();
      setLines([]);
    } else if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "c") {
      // Ctrl+C：中断打字机输出（终端标准）
      if (echoTypingRef.current || typeRef.current || echoQueueRef.current.length > 0) {
        event.preventDefault();
        if (echoTimerRef.current) {
          clearInterval(echoTimerRef.current);
          echoTimerRef.current = null;
        }
        if (typeRef.current) {
          clearInterval(typeRef.current);
          typeRef.current = null;
        }
        echoQueueRef.current = [];
        echoTypingRef.current = false;
        terminalSound.error();
        setLines((current) => [...current, { text: "^C", tone: "dim" }]);
      }
    } else if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
      terminalSound.key();
    }
  }

  // zsh 风格自动补全建议
  const suggestion = useMemo(() => {
    if (!input || disabled) return "";
    const parts = input.split(/\s+/);
    const last = parts[parts.length - 1] ?? "";
    if (!last) return "";
    const head = parts[0] ?? "";
    const candidates =
      parts.length === 1
        ? BUILTIN_COMMANDS
        : (completions?.[head] ?? []);
    const match = candidates.find((candidate) => candidate.startsWith(last) && candidate !== last);
    return match ? match.slice(last.length) : "";
  }, [input, completions, disabled]);

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
        {matrixActive ? <MatrixRain disabled={disabled} /> : null}
        {/* 输入槽：明显的可输入区域 */}
        <div className="relative mt-1 flex items-center gap-2 rounded-md border border-[#33ff66]/25 bg-[#0e1114] px-3 py-2.5 transition-colors focus-within:border-[#33ff66]/70 focus-within:bg-[#101418]">
          <span className="flex-none font-bold text-[#33ff66]">$</span>
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
          {/* zsh 风格自动补全建议（灰字，点击补全） */}
          {suggestion ? (
            <button
              type="button"
              onClick={() => setInput((current) => current + suggestion)}
              aria-label={`补全为 ${suggestion}`}
              className="absolute inset-y-0 z-10 flex items-center pr-3 font-mono text-[#3a3f47] hover:text-[#33ff66]/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#33ff66]"
              style={{ left: `calc(0.6ch + 0.5rem + 0.75rem + ${input.length}ch)` }}
            >
              {suggestion}
            </button>
          ) : null}
          <span
            aria-hidden="true"
            className="inline-block h-[1.1em] w-[0.55em] flex-none bg-[#33ff66]"
            style={{ animation: disabled ? undefined : "cstd-blink 1.1s step-end infinite" }}
          />
          <button
            type="button"
            onClick={() => {
              const next = !muted;
              setMuted(next);
              terminalSound.toggle(next);
            }}
            aria-label={muted ? "开启终端音效" : "静音终端音效"}
            aria-pressed={muted}
            title={muted ? "开启音效" : "静音"}
            className="flex h-10 w-10 flex-none items-center justify-center rounded border border-transparent text-sm leading-none text-[#5b616b] transition-colors hover:border-[#33ff66]/40 hover:text-[#33ff66] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#33ff66]"
          >
            {muted ? "🔇" : "🔊"}
          </button>
        </div>
      </div>
    </div>
  );
}
