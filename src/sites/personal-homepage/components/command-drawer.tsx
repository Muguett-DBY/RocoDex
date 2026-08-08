"use client";

import { Activity, Boxes, Fingerprint, Route, X } from "lucide-react";
import { useCallback, useEffect, useRef } from "react";
import { cstdProjects } from "../content/projects";
import {
  cstdLiveObjectIds,
  cstdProofs,
  cstdSystems,
  getCstdProjectsById,
} from "../content/systems";
import { TerminalBar } from "./terminal-bar";
import { TerminalCommand, type TerminalLine } from "./terminal-command";

const projects = getCstdProjectsById(cstdProjects, [
  ...cstdProofs.map((proof) => proof.projectId),
  ...cstdLiveObjectIds,
]);

const bootLines: TerminalLine[] = [
  { text: "[NEURAL LINK ESTABLISHED] cstd cyberdeck online", tone: "accent", type: 7 },
  { text: "5 systems · 5 live nodes · neural city synchronized", tone: "dim", type: 6 },
  { text: "输入 scan 扫描网络；jack <project> 接入项目。", tone: "dim", type: 6 },
];

const quickLinks = [
  { id: "systems", label: "系统", icon: Boxes },
  { id: "proof", label: "作品", icon: Activity },
  { id: "operator", label: "身份", icon: Fingerprint },
  { id: "path", label: "路径", icon: Route },
] as const;

export function CommandDrawer({
  reducedMotion,
  onClose,
  onOverdrive,
}: {
  reducedMotion: boolean;
  onClose: () => void;
  onOverdrive: () => void;
}) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeButtonRef.current?.focus();
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const jumpTo = useCallback(
    (id: string) => {
      document.getElementById(id)?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
      window.setTimeout(onClose, reducedMotion ? 0 : 180);
    },
    [onClose, reducedMotion],
  );

  const handleCommand = useCallback(
    (raw: string, echo: (lines: TerminalLine[]) => void) => {
      const command = raw.trim();
      const [name, argument] = command.split(/\s+/, 2);

      switch (name.toLowerCase()) {
        case "help":
          echo([
            { text: "status · scan · signal · ls · tree · cd <chapter> · jack <project>", tone: "accent" },
            { text: "open <project> · breach · matrix · neofetch · ping · date · clear · exit", tone: "dim" },
            { text: "chapters: systems / work / operator / path", tone: "dim" },
          ]);
          break;
        case "whoami":
          echo([
            { text: "奶黄包 / product engineer / creative systems builder", tone: "accent" },
            { text: "把产品、数据、AI 与研究做成真正运行的系统。", tone: "dim" },
          ]);
          break;
        case "status":
        case "top":
          echo([
            { text: "CSTD://NIGHT-OPS                         ONLINE", tone: "accent" },
            { text: `SYSTEMS  ${String(cstdSystems.length).padStart(2, "0")}   PROJECT NODES  ${String(projects.length).padStart(2, "0")}   TRACE  CLEAN`, tone: "default" },
            { text: "RENDER   NEURAL CITY   LINK  STABLE   REGION  SYD", tone: "dim" },
          ]);
          break;
        case "scan":
          echo([
            { text: "scanning cstd neural bus...", tone: "dim", type: 4 },
            ...cstdSystems.map((system, index) => ({
              text: `[${String(index + 1).padStart(2, "0")}] ${system.track === "shipped" ? "SHIPPED " : "RESEARCH"}  ${system.title}`,
              tone: system.track === "shipped" ? "accent" as const : "default" as const,
            })),
            { text: `scan complete · ${projects.length}/${projects.length} project nodes responding`, tone: "accent" },
          ]);
          break;
        case "signal":
          echo([
            { text: "PRODUCT  ██████████  LOCKED", tone: "accent" },
            { text: "DATA     █████████░  98.4%", tone: "default" },
            { text: "AI       ████████░░  92.7%", tone: "default" },
            { text: "RESEARCH ███████░░░  87.1%", tone: "dim" },
          ]);
          break;
        case "ls":
          echo([
            { text: "~/projects", tone: "accent" },
            ...projects.map((project) => ({ text: `  ${project.id.padEnd(12)} ${project.title}`, tone: "default" as const })),
          ]);
          break;
        case "cd": {
          const targets: Record<string, string> = {
            systems: "systems",
            work: "proof",
            projects: "proof",
            operator: "operator",
            path: "path",
            "~": "top",
            "/": "top",
          };
          const id = targets[argument ?? ""];
          if (!id) {
            echo([{ text: `cd: no such chapter: ${argument ?? ""}`, tone: "error" }]);
            break;
          }
          document.getElementById(id)?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
          echo([{ text: `→ ~/${argument}`, tone: "accent" }]);
          break;
        }
        case "jack": {
          const project = projects.find((candidate) => candidate.id === argument);
          if (!project) {
            echo([{ text: `jack: unknown node: ${argument ?? ""}（试试 ls）`, tone: "error" }]);
            break;
          }
          const target = document.getElementById(`proof-${project.id}`) ?? document.querySelector(`[data-cstd-live-object="${project.id}"]`);
          target?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "center" });
          echo([{ text: `neural route locked → ${project.id}`, tone: "accent" }]);
          window.setTimeout(onClose, reducedMotion ? 0 : 220);
          break;
        }
        case "open": {
          const project = projects.find((candidate) => candidate.id === argument);
          if (!project) {
            echo([{ text: `open: unknown project: ${argument ?? ""}（试试 ls）`, tone: "error" }]);
            break;
          }
          echo([{ text: `opening ${project.id}...`, tone: "dim" }]);
          window.open(project.href, "_blank", "noopener,noreferrer");
          break;
        }
        case "date":
          echo([{ text: new Date().toLocaleString("zh-CN", { timeZone: "Australia/Sydney" }) + " (Sydney)", tone: "default" }]);
          break;
        case "exit":
          echo([{ text: "session closed", tone: "dim" }]);
          window.setTimeout(onClose, reducedMotion ? 0 : 160);
          break;
        case "ps":
          echo(cstdSystems.map((system, index) => ({
            text: `${String(index + 1).padStart(2, "0")}  RUNNING  ${system.title}`,
            tone: "default" as const,
          })));
          break;
        case "tree":
          echo([
            { text: "~/cstd", tone: "accent" },
            { text: "├─ systems/     product · edge · ai · research · data", tone: "default" },
            { text: "├─ proof/       rocodex · alpha · crm", tone: "default" },
            { text: "├─ operator/    cstd-01 · night-runner", tone: "default" },
            { text: "└─ path/        2022 → 2026", tone: "dim" },
          ]);
          break;
        case "neofetch":
        case "whois":
          echo([
            { text: "CSTD-01 @ custard.top", tone: "accent" },
            { text: "OS: independent product studio / Sydney", tone: "default" },
            { text: "Stack: TypeScript · React · Cloudflare · Python · Data · AI", tone: "dim" },
          ]);
          break;
        case "ping":
          echo([
            { text: `PING ${argument || "custard.top"}: 64 bytes`, tone: "dim" },
            { text: "reply: ttl=64 time=12ms · reply: ttl=64 time=11ms", tone: "accent" },
            { text: "0% packet loss", tone: "default" },
          ]);
          break;
        case "sudo":
          echo([{ text: "cstd-01 already owns this machine.", tone: "warn" }]);
          break;
        case "echo":
          echo([{ text: command.slice(name.length).trim(), tone: "default" }]);
          break;
        case "curl":
          echo([{ text: "HTTP/2 200 · server: cstd-edge · signal: online", tone: "accent" }]);
          break;
        case "breach":
          onOverdrive();
          echo([
            { text: "BREACH PROTOCOL ACCEPTED", tone: "warn", type: 5 },
            { text: "visual governor bypassed · overdrive online", tone: "accent", type: 5 },
          ]);
          break;
        case "clear":
          break;
        default:
          echo([{ text: `command not found: ${name}（试试 help）`, tone: "error" }]);
      }
    },
    [onClose, onOverdrive, reducedMotion],
  );

  return (
    <div className="fixed inset-0 z-[90] flex justify-end bg-black/55 p-3 backdrop-blur-sm md:p-5">
      <button
        type="button"
        aria-label="关闭控制台背景层"
        onClick={onClose}
        className="absolute inset-0 cursor-default focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-[#f4c95d]"
      />
      <aside
        id="cstd-command-drawer"
        aria-label="CSTD 控制台"
        className="relative z-10 mt-14 flex h-[min(78svh,720px)] w-full max-w-3xl flex-col overflow-hidden rounded-lg border border-white/15 bg-[#0a0b0d] shadow-[0_32px_120px_rgba(0,0,0,0.65)]"
      >
        <TerminalBar
          title="cstd://night-ops/cyberdeck"
          right={
            <button
              ref={closeButtonRef}
              type="button"
              aria-label="关闭控制台"
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-md border border-white/15 text-[#a5aaad] transition-colors hover:border-[#f4c95d]/60 hover:text-[#f4c95d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f4c95d]"
            >
              <X aria-hidden="true" className="h-4 w-4" />
            </button>
          }
        />
        <nav aria-label="Cyberdeck 快速链路" className="grid grid-cols-4 border-b border-white/10 bg-[#07090b]">
          {quickLinks.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => jumpTo(id)}
              className="flex min-h-14 items-center justify-center gap-2 border-r border-white/10 px-2 font-mono text-[10px] font-black text-[#8f9599] transition-colors last:border-r-0 hover:bg-[#24e0ff]/10 hover:text-[#24e0ff] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#24e0ff]"
            >
              <Icon aria-hidden="true" className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </nav>
        <div className="min-h-0 flex-1 p-4 md:p-6">
          <TerminalCommand
            bootLines={bootLines}
            disabled={reducedMotion}
            onCommand={handleCommand}
            placeholder="输入 help，或按 Tab 补全..."
            height="100%"
            className="h-full"
            completions={{
              cd: ["~", "/", "systems", "work", "projects", "operator", "path"],
              open: projects.map((project) => project.id),
              jack: projects.map((project) => project.id),
            }}
          />
        </div>
      </aside>
    </div>
  );
}
