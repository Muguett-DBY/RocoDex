"use client";

import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Box, Maximize2, Pause, Pickaxe, Play, RotateCcw, Save, Sparkles } from "lucide-react";
import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import type { CstdLocale } from "../content/content-types";
import { useCstdTheme } from "../experience/theme-store";
import { CstdSiteChrome } from "../components/site/cstd-site-chrome";
import { parseVoxelSnapshot, voxelBlockKinds, type VoxelBlockKind } from "./voxel-world";
import type { VoxelGameEngine, VoxelGameState, VoxelMovement } from "./voxel-game-engine";
import styles from "./voxel-sandbox.module.css";

const initialState: VoxelGameState = {
  active: false,
  blockCount: 0,
  cycle: "day",
  position: [0, 0, 0],
  selectedIndex: 0,
  shards: 0,
  target: null,
};

const worldCopy = {
  "neon-district": {
    zh: { eyebrow: "CSTD // 非计划停工", world: "方块城 77", mood: "拆掉不顺眼的，搭起想留下的。" },
    en: { eyebrow: "CSTD // UNSCHEDULED DOWNTIME", world: "BLOCK//CITY 77", mood: "Break what feels wrong. Build what deserves to stay." },
  },
  "underworld-forge": {
    zh: { eyebrow: "冥府 // 锻造间歇", world: "冥火采石场", mood: "每一块黑曜石，都记得上一轮试炼。" },
    en: { eyebrow: "UNDERWORLD // FORGE RECESS", world: "ASHEN QUARRY", mood: "Every dark block remembers the previous trial." },
  },
  "astral-covenant": {
    zh: { eyebrow: "星界 // 冒险插曲", world: "星骰浮岛", mood: "浮岛没有既定道路，只有你放下的下一块。" },
    en: { eyebrow: "ASTRAL // CAMPAIGN DETOUR", world: "DICEBOUND ISLES", mood: "No fixed route. Only the next block you choose." },
  },
} as const;

const blockLabels: Record<VoxelBlockKind, { zh: string; en: string }> = {
  turf: { zh: "地表", en: "Turf" },
  soil: { zh: "土层", en: "Soil" },
  stone: { zh: "岩石", en: "Stone" },
  timber: { zh: "构件", en: "Frame" },
  crystal: { zh: "晶体", en: "Crystal" },
};

function formatCoordinate(value: number) {
  return Math.round(value * 10) / 10;
}

export function CstdVoxelGamePage({ locale }: { locale: CstdLocale }) {
  return (
    <CstdSiteChrome locale={locale} page="voxel" immersive>
      <VoxelSandbox locale={locale} />
    </CstdSiteChrome>
  );
}

function VoxelSandbox({ locale }: { locale: CstdLocale }) {
  const theme = useCstdTheme();
  const copy = worldCopy[theme][locale];
  const engineRef = useRef<VoxelGameEngine | null>(null);
  const mountRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLElement>(null);
  const saveTimerRef = useRef<number | null>(null);
  const [gameState, setGameState] = useState<VoxelGameState>(initialState);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [seed, setSeed] = useState(1707);
  const [announcement, setAnnouncement] = useState("");

  const storageKey = `cstd-voxel-world-v1:${theme}`;
  const ui = locale === "zh" ? {
    title: "奶黄包方块世界",
    enter: "进入世界",
    resume: "继续搭建",
    save: "保存世界",
    saved: "世界已保存",
    reset: "生成新世界",
    fullscreen: "全屏",
    pause: "暂停",
    canvas: "奶黄包方块世界三维游戏画面",
    coordinates: "坐标",
    cycle: "天色",
    day: "白昼",
    night: "夜晚",
    shards: "晶体",
    signal: "世界稳定",
    loading: "世界生成中",
    unavailable: "这个浏览器没有成功启动 WebGL 世界。",
    breakBlock: "挖掘方块",
    placeBlock: "放置方块",
    ascend: "向上飞行",
    descend: "向下飞行",
  } : {
    title: "Custard's Voxel World",
    enter: "Enter world",
    resume: "Keep building",
    save: "Save world",
    saved: "World saved",
    reset: "Generate new world",
    fullscreen: "Fullscreen",
    pause: "Pause",
    canvas: "Custard voxel world 3D game canvas",
    coordinates: "Position",
    cycle: "Sky",
    day: "Day",
    night: "Night",
    shards: "Shards",
    signal: "World stable",
    loading: "Generating world",
    unavailable: "This browser could not start the WebGL world.",
    breakBlock: "Break block",
    placeBlock: "Place block",
    ascend: "Fly up",
    descend: "Fly down",
  };

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    let disposed = false;
    let engine: VoxelGameEngine | null = null;
    setReady(false);
    setError(null);
    setGameState(initialState);

    const start = async () => {
      try {
        const stored = (() => {
          try {
            return window.localStorage.getItem(storageKey);
          } catch {
            return null;
          }
        })();
        const snapshot = parseVoxelSnapshot(stored, theme);
        const nextSeed = snapshot?.seed ?? (theme === "neon-district" ? 1707 : theme === "underworld-forge" ? 2771 : 7317);
        const { VoxelGameEngine: Engine } = await import("./voxel-game-engine");
        if (disposed) return;
        setSeed(nextSeed);
        engine = new Engine({
          mount,
          theme,
          seed: nextSeed,
          snapshot,
          canvasLabel: ui.canvas,
          onReady: (world) => {
            if (disposed) return;
            setReady(true);
            setSeed(world.seed);
          },
          onState: (state) => {
            if (!disposed) setGameState(state);
          },
          onWorldChange: (world) => {
            if (disposed) return;
            setSeed(world.seed);
            try {
              window.localStorage.setItem(storageKey, JSON.stringify(world));
            } catch {
              // The world remains playable for the current session.
            }
          },
          onError: (message) => {
            if (!disposed) setError(message);
          },
        });
        engineRef.current = engine;
      } catch (reason) {
        if (!disposed) setError(reason instanceof Error ? reason.message : ui.unavailable);
      }
    };

    void start();
    return () => {
      disposed = true;
      engineRef.current = null;
      engine?.destroy();
    };
  }, [storageKey, theme, ui.canvas, ui.unavailable]);

  useEffect(() => () => {
    if (saveTimerRef.current) window.clearTimeout(saveTimerRef.current);
  }, []);

  function announce(message: string) {
    setAnnouncement(message);
    if (saveTimerRef.current) window.clearTimeout(saveTimerRef.current);
    saveTimerRef.current = window.setTimeout(() => setAnnouncement(""), 1_400);
  }

  function saveWorld() {
    const snapshot = engineRef.current?.getSnapshot();
    if (!snapshot) return;
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(snapshot));
      announce(ui.saved);
    } catch {
      announce(ui.unavailable);
    }
  }

  function resetWorld() {
    const values = new Uint32Array(1);
    window.crypto.getRandomValues(values);
    const nextSeed = (values[0] ?? Date.now()) % 1_000_000_000 || 1;
    engineRef.current?.reset(nextSeed);
    setSeed(nextSeed);
    announce(ui.reset);
  }

  async function toggleFullscreen() {
    const stage = stageRef.current;
    if (!stage) return;
    if (document.fullscreenElement) await document.exitFullscreen();
    else await stage.requestFullscreen();
  }

  function startMovement(direction: VoxelMovement, event: ReactPointerEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    engineRef.current?.setMovement(direction, true);
  }

  function stopMovement(direction: VoxelMovement, event: ReactPointerEvent<HTMLButtonElement>) {
    engineRef.current?.setMovement(direction, false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  }

  const selectedKind = voxelBlockKinds[gameState.selectedIndex] ?? "turf";
  const targetLabel = gameState.target ? blockLabels[gameState.target][locale] : blockLabels[selectedKind][locale];

  return (
    <main id="cstd-main" className={styles.page}>
      <section
        ref={stageRef}
        data-cstd-voxel-game
        data-cstd-voxel-ready={ready ? "true" : "false"}
        data-cstd-voxel-active={gameState.active ? "true" : "false"}
        data-cstd-voxel-theme={theme}
        data-cstd-voxel-block-count={gameState.blockCount}
        data-cstd-voxel-selected={selectedKind}
        className={styles.stage}
        aria-label={ui.title}
      >
        <div ref={mountRef} className={styles.canvasHost} />
        <div aria-hidden="true" className={styles.vignette} />

        <div className={styles.topHud}>
          <div className={styles.worldIdentity}>
            <p className={styles.eyebrow}>{copy.eyebrow}</p>
            <h1 className={styles.worldTitle}>{copy.world}</h1>
          </div>
          <dl className={styles.telemetry}>
            <div><dt>{ui.coordinates}</dt><dd>{gameState.position.map(formatCoordinate).join(" / ")}</dd></div>
            <div><dt>{ui.cycle}</dt><dd>{gameState.cycle === "day" ? ui.day : ui.night}</dd></div>
            <div><dt>{ui.shards}</dt><dd>{String(gameState.shards).padStart(2, "0")}</dd></div>
          </dl>
        </div>

        <div className={styles.utilityBar}>
          {gameState.active ? (
            <button type="button" onClick={() => engineRef.current?.pause()} aria-label={ui.pause} title={ui.pause} className={styles.iconButton}>
              <Pause aria-hidden="true" className="h-4 w-4" />
            </button>
          ) : null}
          <button type="button" onClick={saveWorld} disabled={!ready} aria-label={ui.save} title={ui.save} className={styles.iconButton}>
            <Save aria-hidden="true" className="h-4 w-4" />
          </button>
          <button type="button" onClick={resetWorld} disabled={!ready} aria-label={ui.reset} title={ui.reset} className={styles.iconButton}>
            <RotateCcw aria-hidden="true" className="h-4 w-4" />
          </button>
          <button type="button" onClick={() => void toggleFullscreen()} aria-label={ui.fullscreen} title={ui.fullscreen} className={styles.iconButton}>
            <Maximize2 aria-hidden="true" className="h-4 w-4" />
          </button>
        </div>

        <div aria-hidden="true" className={styles.crosshair} />

        {!gameState.active && !error ? (
          <div className={styles.enterLayer}>
            <div className={styles.enterPanel}>
              <span aria-hidden="true" className={styles.enterMark}><Box className="h-5 w-5" /></span>
              <h2 className={styles.enterTitle}>{ui.title}</h2>
              <p className={styles.enterMood}>{copy.mood}</p>
              <button type="button" disabled={!ready} onClick={() => engineRef.current?.enter()} className={styles.enterButton}>
                <Play aria-hidden="true" className="h-4 w-4" /> {ready ? ui.enter : ui.loading}
              </button>
            </div>
          </div>
        ) : null}

        <div className={styles.bottomHud}>
          <p className={styles.statusLine}><Sparkles aria-hidden="true" className="mr-1.5 inline h-3 w-3" /> {ui.signal} / {targetLabel}</p>
          <div role="toolbar" aria-label={locale === "zh" ? "方块快捷栏" : "Block hotbar"} className={styles.hotbar}>
            {voxelBlockKinds.map((kind, index) => (
              <button
                key={kind}
                type="button"
                data-kind={kind}
                data-selected={gameState.selectedIndex === index ? "true" : "false"}
                aria-pressed={gameState.selectedIndex === index}
                aria-label={blockLabels[kind][locale]}
                title={blockLabels[kind][locale]}
                onClick={() => engineRef.current?.selectBlock(index)}
                className={styles.hotbarButton}
              >
                <span aria-hidden="true" />
                <small>{index + 1}</small>
              </button>
            ))}
          </div>
        </div>

        <div className={styles.touchControls}>
          <div className={styles.movePad}>
            <button type="button" aria-label={locale === "zh" ? "向前" : "Forward"} title={locale === "zh" ? "向前" : "Forward"} className={styles.touchButton} onPointerDown={(event) => startMovement("forward", event)} onPointerUp={(event) => stopMovement("forward", event)} onPointerCancel={(event) => stopMovement("forward", event)}><ArrowUp aria-hidden="true" className="h-4 w-4" /></button>
            <button type="button" aria-label={locale === "zh" ? "向左" : "Left"} title={locale === "zh" ? "向左" : "Left"} className={styles.touchButton} onPointerDown={(event) => startMovement("left", event)} onPointerUp={(event) => stopMovement("left", event)} onPointerCancel={(event) => stopMovement("left", event)}><ArrowLeft aria-hidden="true" className="h-4 w-4" /></button>
            <button type="button" aria-label={locale === "zh" ? "向后" : "Backward"} title={locale === "zh" ? "向后" : "Backward"} className={styles.touchButton} onPointerDown={(event) => startMovement("backward", event)} onPointerUp={(event) => stopMovement("backward", event)} onPointerCancel={(event) => stopMovement("backward", event)}><ArrowDown aria-hidden="true" className="h-4 w-4" /></button>
            <button type="button" aria-label={locale === "zh" ? "向右" : "Right"} title={locale === "zh" ? "向右" : "Right"} className={styles.touchButton} onPointerDown={(event) => startMovement("right", event)} onPointerUp={(event) => stopMovement("right", event)} onPointerCancel={(event) => stopMovement("right", event)}><ArrowRight aria-hidden="true" className="h-4 w-4" /></button>
          </div>
          <div className={styles.actionPad}>
            <button type="button" aria-label={ui.ascend} title={ui.ascend} className={styles.touchButton} onPointerDown={(event) => startMovement("up", event)} onPointerUp={(event) => stopMovement("up", event)} onPointerCancel={(event) => stopMovement("up", event)}><ArrowUp aria-hidden="true" className="h-4 w-4" /></button>
            <button type="button" aria-label={ui.descend} title={ui.descend} className={styles.touchButton} onPointerDown={(event) => startMovement("down", event)} onPointerUp={(event) => stopMovement("down", event)} onPointerCancel={(event) => stopMovement("down", event)}><ArrowDown aria-hidden="true" className="h-4 w-4" /></button>
            <button type="button" aria-label={ui.breakBlock} title={ui.breakBlock} onClick={() => engineRef.current?.edit("break")} className={styles.touchButton}><Pickaxe aria-hidden="true" className="h-4 w-4" /></button>
            <button type="button" aria-label={ui.placeBlock} title={ui.placeBlock} onClick={() => engineRef.current?.edit("place")} className={styles.touchButton}><Box aria-hidden="true" className="h-4 w-4" /></button>
          </div>
        </div>

        {announcement ? <p role="status" className={styles.savePulse}>{announcement}</p> : null}
        {error ? <div role="alert" className={styles.errorLayer}><div><Box aria-hidden="true" className="mx-auto h-10 w-10 text-[#f4d431]" /><p className="mt-5 text-lg font-bold">{ui.unavailable}</p></div></div> : null}
        <span className="sr-only">{seed} / {gameState.blockCount}</span>
      </section>
    </main>
  );
}
