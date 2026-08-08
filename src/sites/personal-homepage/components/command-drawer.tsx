"use client";

import { X } from "lucide-react";
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
  { text: "输入 help 查看命令；breach 可启动视觉超载。", tone: "dim", type: 7 },
];

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

  const handleCommand = useCallback(
    (raw: string, echo: (lines: TerminalLine[]) => void) => {
      const command = raw.trim();
      const [name, argument] = command.split(/\s+/, 2);

      switch (name.toLowerCase()) {
        case "help":
          echo([
            { text: "help · whoami · ls · cd <chapter> · open <project> · breach · matrix · date · clear · exit", tone: "accent" },
            { text: "chapters: systems / work / path", tone: "dim" },
          ]);
          break;
        case "whoami":
          echo([
            { text: "奶黄包 / product engineer / creative systems builder", tone: "accent" },
            { text: "把产品、数据、AI 与研究做成真正运行的系统。", tone: "dim" },
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
        <div className="min-h-0 flex-1 p-4 md:p-6">
          <TerminalCommand
            bootLines={bootLines}
            disabled={reducedMotion}
            onCommand={handleCommand}
            placeholder="输入 help，或按 Tab 补全..."
            height="100%"
            className="h-full"
            completions={{
              cd: ["~", "/", "systems", "work", "projects", "path"],
              open: projects.map((project) => project.id),
            }}
          />
        </div>
      </aside>
    </div>
  );
}
