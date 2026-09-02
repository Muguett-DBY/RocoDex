"use client";

import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  BookOpen,
  Box,
  BriefcaseBusiness,
  FlaskConical,
  LocateFixed,
  Map as MapIcon,
  Maximize2,
  Pause,
  Pickaxe,
  Play,
  Radio,
  RotateCcw,
  Save,
  Sparkles,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { CstdLink } from "../components/site/cstd-link";
import type { CstdLocale } from "../content/content-types";
import { useCstdTheme } from "../experience/theme-store";
import { getVoxelThemeLayout, type VoxelExhibitId } from "./voxel-landmarks";
import type { VoxelPortfolioData, VoxelPortfolioExhibit } from "./voxel-portfolio";
import type { VoxelGameEngine, VoxelGameState, VoxelMovement } from "./voxel-game-engine";
import { parseVoxelSnapshot, voxelBlockKinds, type VoxelBlockKind } from "./voxel-world";
import styles from "./voxel-sandbox.module.css";

const initialState: VoxelGameState = {
  active: false,
  blockCount: 0,
  cycle: "day",
  landmarkDistance: null,
  landmarkId: null,
  position: [0, 0, 0],
  selectedIndex: 0,
  shards: 0,
  target: null,
};

const worldCopy = {
  "neon-district": {
    zh: {
      eyebrow: "CSTD // PORTFOLIO NETWORK",
      world: "作品城 77",
      mood: "六座已交付系统成为城市节点。沿着信号走，进入作品真正运行过的地方。",
      portal: "接入作品城",
      landmark: "数据节点",
      directory: "城区索引",
      travel: "接入节点",
      open: "读取项目档案",
    },
    en: {
      eyebrow: "CSTD // PORTFOLIO NETWORK",
      world: "PORTFOLIO//CITY 77",
      mood: "Six shipped systems become city nodes. Follow the signal into the places where the work actually ran.",
      portal: "JACK INTO PORTFOLIO CITY",
      landmark: "Data node",
      directory: "District index",
      travel: "Jack into node",
      open: "Read project dossier",
    },
  },
  "underworld-forge": {
    zh: {
      eyebrow: "冥府 // 已完成的试炼",
      world: "冥火作品神殿",
      mood: "每座神殿封存一次产品试炼：约束、抉择、失败，以及最后留下的证据。",
      portal: "踏入冥火神殿",
      landmark: "试炼遗物",
      directory: "冥府图谱",
      travel: "前往神殿",
      open: "翻开试炼铭文",
    },
    en: {
      eyebrow: "UNDERWORLD // COMPLETED TRIALS",
      world: "TEMPLE OF SHIPPED WORK",
      mood: "Each temple seals a product trial: constraints, decisions, failures, and the evidence that survived.",
      portal: "ENTER THE TEMPLE OF TRIALS",
      landmark: "Trial relic",
      directory: "Underworld atlas",
      travel: "Approach temple",
      open: "Unseal trial record",
    },
  },
  "astral-covenant": {
    zh: {
      eyebrow: "星界 // 奶黄包冒险档案",
      world: "星骰作品群岛",
      mood: "作品化为漂浮岛屿，技术札记与实验室则藏在岛链尽头。选择一条星路出发。",
      portal: "跃迁星骰群岛",
      landmark: "星界任务",
      directory: "冒险图鉴",
      travel: "跃迁浮岛",
      open: "开启任务编年史",
    },
    en: {
      eyebrow: "ASTRAL // CUSTARD'S CAMPAIGN ARCHIVE",
      world: "DICEBOUND PORTFOLIO ISLES",
      mood: "Work becomes a chain of floating islands, with notes and live labs waiting beyond the star roads.",
      portal: "LEAP INTO THE DICEBOUND ISLES",
      landmark: "Astral quest",
      directory: "Campaign codex",
      travel: "Leap to isle",
      open: "Open quest chronicle",
    },
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

function radarPosition(value: number, radius: number, invert = false) {
  const normalized = Math.max(0, Math.min(100, ((value + radius) / (radius * 2)) * 100));
  return `${invert ? 100 - normalized : normalized}%`;
}

function ExhibitIcon({ kind }: { kind: VoxelPortfolioExhibit["kind"] }) {
  if (kind === "notes") return <BookOpen aria-hidden="true" />;
  if (kind === "lab") return <FlaskConical aria-hidden="true" />;
  return <BriefcaseBusiness aria-hidden="true" />;
}

export function VoxelSandbox({ locale, portfolio }: { locale: CstdLocale; portfolio: VoxelPortfolioData }) {
  const theme = useCstdTheme();
  const copy = worldCopy[theme][locale];
  const layout = getVoxelThemeLayout(theme);
  const exhibitById = useMemo(() => new Map(portfolio.exhibits.map((entry) => [entry.id, entry])), [portfolio.exhibits]);
  const engineRef = useRef<VoxelGameEngine | null>(null);
  const mountRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLElement>(null);
  const saveTimerRef = useRef<number | null>(null);
  const discoveriesRef = useRef<Set<VoxelExhibitId>>(new Set());
  const [gameState, setGameState] = useState<VoxelGameState>(initialState);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [seed, setSeed] = useState(1707);
  const [announcement, setAnnouncement] = useState("");
  const [directoryOpen, setDirectoryOpen] = useState(false);
  const [discovered, setDiscovered] = useState<Set<VoxelExhibitId>>(new Set());

  const storageKey = `cstd-voxel-world-v2:${theme}`;
  const discoveryKey = `cstd-voxel-discoveries-v1:${theme}`;
  const focusedExhibit = gameState.landmarkId ? exhibitById.get(gameState.landmarkId) ?? null : null;
  const ui = locale === "zh" ? {
    title: "奶黄包三维作品世界",
    enter: "进入作品世界",
    save: "保存世界",
    saved: "世界已保存",
    reset: "生成新世界",
    fullscreen: "全屏",
    pause: "暂停",
    canvas: "奶黄包三维体素作品世界",
    coordinates: "坐标",
    cycle: "天色",
    day: "白昼",
    night: "夜晚",
    shards: "晶体",
    discoveries: "发现",
    signal: "寻找作品信标",
    loading: "世界生成中",
    unavailable: "这个浏览器没有成功启动 WebGL 世界。",
    breakBlock: "挖掘方块",
    placeBlock: "放置方块",
    ascend: "向上飞行",
    descend: "向下飞行",
    close: "关闭",
    capabilities: "技术能力",
    directorySummary: "六个作品、技术札记与可执行实验共同组成这张三维作品地图。",
    locate: "定位",
    work: "已交付作品",
    notes: "技术札记",
    lab: "可执行实验",
  } : {
    title: "Custard's 3D portfolio world",
    enter: "Enter portfolio world",
    save: "Save world",
    saved: "World saved",
    reset: "Generate new world",
    fullscreen: "Fullscreen",
    pause: "Pause",
    canvas: "Custard's 3D voxel portfolio world",
    coordinates: "Position",
    cycle: "Sky",
    day: "Day",
    night: "Night",
    shards: "Shards",
    discoveries: "Found",
    signal: "Locate a portfolio beacon",
    loading: "Generating world",
    unavailable: "This browser could not start the WebGL world.",
    breakBlock: "Break block",
    placeBlock: "Place block",
    ascend: "Fly up",
    descend: "Fly down",
    close: "Close",
    capabilities: "Capabilities",
    directorySummary: "Six shipped systems, technical notes, and executable labs form this explorable portfolio map.",
    locate: "Locate",
    work: "Shipped work",
    notes: "Technical notes",
    lab: "Executable lab",
  };

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    let disposed = false;
    let engine: VoxelGameEngine | null = null;
    setReady(false);
    setError(null);
    setGameState(initialState);
    setDirectoryOpen(false);

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
        try {
          const value = JSON.parse(window.localStorage.getItem(discoveryKey) ?? "[]") as unknown;
          const ids = Array.isArray(value)
            ? value.filter((id): id is VoxelExhibitId => typeof id === "string" && exhibitById.has(id as VoxelExhibitId))
            : [];
          discoveriesRef.current = new Set(ids);
        } catch {
          discoveriesRef.current = new Set();
        }
        setDiscovered(new Set(discoveriesRef.current));
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
            if (disposed) return;
            setGameState(state);
            const id = state.landmarkId;
            if (state.active && id && !discoveriesRef.current.has(id)) {
              discoveriesRef.current = new Set(discoveriesRef.current).add(id);
              setDiscovered(new Set(discoveriesRef.current));
              try {
                window.localStorage.setItem(discoveryKey, JSON.stringify([...discoveriesRef.current]));
              } catch {
                // Discovery remains visible for the current session.
              }
            }
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
          onInteract: (id) => {
            const link = document.querySelector<HTMLAnchorElement>(`[data-cstd-voxel-exhibit-link="${id}"]`);
            link?.click();
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
  }, [discoveryKey, exhibitById, storageKey, theme, ui.canvas, ui.unavailable]);

  useEffect(() => {
    if (!directoryOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.code === "Escape") setDirectoryOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [directoryOpen]);

  useEffect(() => () => {
    if (saveTimerRef.current) window.clearTimeout(saveTimerRef.current);
  }, []);

  useEffect(() => {
    const suspendForNavigation = () => engineRef.current?.suspend();
    window.addEventListener("cstd:navigation-start", suspendForNavigation);
    return () => window.removeEventListener("cstd:navigation-start", suspendForNavigation);
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

  function openDirectory() {
    engineRef.current?.pause();
    setDirectoryOpen(true);
  }

  function travelTo(id: VoxelExhibitId) {
    const engine = engineRef.current;
    if (!engine) return;
    engine.travelToLandmark(id);
    setDirectoryOpen(false);
    engine.enter();
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
        data-cstd-voxel-landmark-count={layout.landmarks.length}
        data-cstd-voxel-focus={gameState.landmarkId ?? "none"}
        data-cstd-voxel-discovered={discovered.size}
        className={styles.stage}
        aria-label={ui.title}
      >
        <div ref={mountRef} className={styles.canvasHost} />
        <div aria-hidden="true" className={styles.vignette} />
        <div aria-hidden="true" className={styles.themeTexture} />

        <div className={styles.topHud}>
          <div className={styles.worldIdentity}>
            <p className={styles.eyebrow}>{copy.eyebrow}</p>
            <h1 className={styles.worldTitle}>{copy.world}</h1>
          </div>
          <dl className={styles.telemetry}>
            <div><dt>{ui.coordinates}</dt><dd>{gameState.position.map(formatCoordinate).join(" / ")}</dd></div>
            <div><dt>{ui.discoveries}</dt><dd>{String(discovered.size).padStart(2, "0")} / {String(portfolio.exhibits.length).padStart(2, "0")}</dd></div>
            <div><dt>{ui.cycle}</dt><dd>{gameState.cycle === "day" ? ui.day : ui.night}</dd></div>
            <div><dt>{ui.shards}</dt><dd>{String(gameState.shards).padStart(2, "0")}</dd></div>
          </dl>
        </div>

        <div className={styles.utilityBar}>
          <button type="button" data-cstd-voxel-directory-button onClick={openDirectory} aria-label={copy.directory} title={copy.directory} className={styles.iconButton}>
            <MapIcon aria-hidden="true" />
          </button>
          {gameState.active ? (
            <button type="button" onClick={() => engineRef.current?.pause()} aria-label={ui.pause} title={ui.pause} className={styles.iconButton}>
              <Pause aria-hidden="true" />
            </button>
          ) : null}
          <button type="button" onClick={saveWorld} disabled={!ready} aria-label={ui.save} title={ui.save} className={styles.iconButton}>
            <Save aria-hidden="true" />
          </button>
          <button type="button" onClick={resetWorld} disabled={!ready} aria-label={ui.reset} title={ui.reset} className={styles.iconButton}>
            <RotateCcw aria-hidden="true" />
          </button>
          <button type="button" onClick={() => void toggleFullscreen()} aria-label={ui.fullscreen} title={ui.fullscreen} className={styles.iconButton}>
            <Maximize2 aria-hidden="true" />
          </button>
        </div>

        <aside className={styles.radar} aria-label={copy.directory}>
          <div className={styles.radarHeading}><Radio aria-hidden="true" /> {copy.landmark}</div>
          <div className={styles.radarField} aria-hidden="true">
            {layout.landmarks.map((landmark) => (
              <span
                key={landmark.id}
                data-current={gameState.landmarkId === landmark.id ? "true" : "false"}
                data-discovered={discovered.has(landmark.id) ? "true" : "false"}
                className={styles.radarNode}
                style={{ left: radarPosition(landmark.x, layout.mapRadius), top: radarPosition(landmark.z, layout.mapRadius, true) }}
              />
            ))}
            <span
              className={styles.radarPlayer}
              style={{ left: radarPosition(gameState.position[0], layout.mapRadius), top: radarPosition(gameState.position[2], layout.mapRadius, true) }}
            />
          </div>
          <p>{String(discovered.size).padStart(2, "0")} / {String(layout.landmarks.length).padStart(2, "0")}</p>
        </aside>

        <div aria-hidden="true" className={styles.crosshair} />

        {!gameState.active && !directoryOpen && !error ? (
          <div className={styles.enterLayer}>
            <div className={styles.enterPanel}>
              <div className={styles.enterLead}>
                <span aria-hidden="true" className={styles.enterMark}><Box /></span>
                <div>
                  <p className={styles.enterIndex}>06 SHIPPED / 08 LANDMARKS</p>
                  <h2 className={styles.enterTitle}>{copy.portal}</h2>
                </div>
              </div>
              <p className={styles.enterMood}>{copy.mood}</p>
              <div className={styles.capabilityStrip} aria-label={ui.capabilities}>
                {portfolio.capabilities.map((capability) => (
                  <div key={capability.label}>
                    <strong>{capability.label}</strong>
                    <span>{capability.value}</span>
                  </div>
                ))}
              </div>
              <button type="button" disabled={!ready} onClick={() => engineRef.current?.enter()} className={styles.enterButton}>
                <Play aria-hidden="true" /> {ready ? ui.enter : ui.loading}
              </button>
            </div>
          </div>
        ) : null}

        {gameState.active && focusedExhibit ? (
          <section className={styles.proximityPanel} aria-live="polite" data-cstd-voxel-proximity>
            <div className={styles.proximitySignal}>
              <ExhibitIcon kind={focusedExhibit.kind} />
              <span>{copy.landmark} / {gameState.landmarkDistance?.toFixed(1)}m</span>
            </div>
            <p className={styles.proximityKicker}>{focusedExhibit.kicker}</p>
            <h2>{focusedExhibit.title}</h2>
            <p className={styles.proximitySummary}>{focusedExhibit.summary}</p>
            <div className={styles.techTags}>{focusedExhibit.technologies.map((technology) => <span key={technology}>{technology}</span>)}</div>
            <div className={styles.proximityFooter}>
              <div className={styles.metricRail}>
                {focusedExhibit.metrics.map((metric) => <span key={metric.label}><strong>{metric.value}</strong>{metric.label}</span>)}
              </div>
              <CstdLink
                href={focusedExhibit.href}
                data-cstd-voxel-exhibit-link={focusedExhibit.id}
                aria-keyshortcuts="E"
                onClick={() => engineRef.current?.pause()}
                className={styles.openExhibit}
              >
                {copy.open} <ArrowUpRight aria-hidden="true" />
              </CstdLink>
            </div>
          </section>
        ) : null}

        {directoryOpen ? (
          <>
            <button type="button" className={styles.directoryBackdrop} onClick={() => setDirectoryOpen(false)} aria-label={ui.close} />
            <aside className={styles.directory} role="dialog" aria-labelledby="voxel-directory-title">
              <header>
                <div>
                  <p className={styles.eyebrow}>{copy.landmark} / 08</p>
                  <h2 id="voxel-directory-title">{copy.directory}</h2>
                  <p>{ui.directorySummary}</p>
                </div>
                <button type="button" onClick={() => setDirectoryOpen(false)} aria-label={ui.close} title={ui.close} className={styles.iconButton}>
                  <X aria-hidden="true" />
                </button>
              </header>
              <div className={styles.directoryList}>
                {portfolio.exhibits.map((exhibit, index) => (
                  <article key={exhibit.id} data-cstd-voxel-exhibit={exhibit.id} data-discovered={discovered.has(exhibit.id) ? "true" : "false"} className={styles.directoryItem}>
                    <span className={styles.directoryNumber}>{String(index + 1).padStart(2, "0")}</span>
                    <span className={styles.directoryIcon}><ExhibitIcon kind={exhibit.kind} /></span>
                    <div>
                      <p>{exhibit.kind === "work" ? ui.work : exhibit.kind === "notes" ? ui.notes : ui.lab}</p>
                      <CstdLink
                        href={exhibit.href}
                        data-cstd-voxel-exhibit-link={exhibit.id}
                        onClick={() => engineRef.current?.pause()}
                      >
                        {exhibit.title} <ArrowUpRight aria-hidden="true" />
                      </CstdLink>
                      <span>{exhibit.technologies.join(" · ")}</span>
                    </div>
                    <button type="button" onClick={() => travelTo(exhibit.id)} aria-label={`${copy.travel}: ${exhibit.title}`} title={`${copy.travel}: ${exhibit.title}`} className={styles.locateButton}>
                      <LocateFixed aria-hidden="true" />
                    </button>
                  </article>
                ))}
              </div>
              <footer className={styles.directoryCapabilities}>
                <strong>{ui.capabilities}</strong>
                <span>{portfolio.capabilities.map((entry) => entry.value).join(" / ")}</span>
              </footer>
            </aside>
          </>
        ) : null}

        <div className={styles.bottomHud}>
          <p className={styles.statusLine}><Sparkles aria-hidden="true" /> {focusedExhibit ? `${copy.landmark} / ${focusedExhibit.title}` : `${ui.signal} / ${targetLabel}`}</p>
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
            <button type="button" aria-label={locale === "zh" ? "向前" : "Forward"} title={locale === "zh" ? "向前" : "Forward"} className={styles.touchButton} onPointerDown={(event) => startMovement("forward", event)} onPointerUp={(event) => stopMovement("forward", event)} onPointerCancel={(event) => stopMovement("forward", event)}><ArrowUp aria-hidden="true" /></button>
            <button type="button" aria-label={locale === "zh" ? "向左" : "Left"} title={locale === "zh" ? "向左" : "Left"} className={styles.touchButton} onPointerDown={(event) => startMovement("left", event)} onPointerUp={(event) => stopMovement("left", event)} onPointerCancel={(event) => stopMovement("left", event)}><ArrowLeft aria-hidden="true" /></button>
            <button type="button" aria-label={locale === "zh" ? "向后" : "Backward"} title={locale === "zh" ? "向后" : "Backward"} className={styles.touchButton} onPointerDown={(event) => startMovement("backward", event)} onPointerUp={(event) => stopMovement("backward", event)} onPointerCancel={(event) => stopMovement("backward", event)}><ArrowDown aria-hidden="true" /></button>
            <button type="button" aria-label={locale === "zh" ? "向右" : "Right"} title={locale === "zh" ? "向右" : "Right"} className={styles.touchButton} onPointerDown={(event) => startMovement("right", event)} onPointerUp={(event) => stopMovement("right", event)} onPointerCancel={(event) => stopMovement("right", event)}><ArrowRight aria-hidden="true" /></button>
          </div>
          <div className={styles.actionPad}>
            <button type="button" aria-label={ui.ascend} title={ui.ascend} className={styles.touchButton} onPointerDown={(event) => startMovement("up", event)} onPointerUp={(event) => stopMovement("up", event)} onPointerCancel={(event) => stopMovement("up", event)}><ArrowUp aria-hidden="true" /></button>
            <button type="button" aria-label={ui.descend} title={ui.descend} className={styles.touchButton} onPointerDown={(event) => startMovement("down", event)} onPointerUp={(event) => stopMovement("down", event)} onPointerCancel={(event) => stopMovement("down", event)}><ArrowDown aria-hidden="true" /></button>
            <button type="button" aria-label={ui.breakBlock} title={ui.breakBlock} onClick={() => engineRef.current?.edit("break")} className={styles.touchButton}><Pickaxe aria-hidden="true" /></button>
            <button type="button" aria-label={ui.placeBlock} title={ui.placeBlock} onClick={() => engineRef.current?.edit("place")} className={styles.touchButton}><Box aria-hidden="true" /></button>
          </div>
        </div>

        {announcement ? <p role="status" className={styles.savePulse}>{announcement}</p> : null}
        {error ? <div role="alert" className={styles.errorLayer}><div><Box aria-hidden="true" /><p>{ui.unavailable}</p></div></div> : null}
        <span className="sr-only">{seed} / {gameState.blockCount}</span>
      </section>
    </main>
  );
}
