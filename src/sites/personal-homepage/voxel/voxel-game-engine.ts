import * as THREE from "three";
import { PointerLockControls } from "three/addons/controls/PointerLockControls.js";
import type { CstdThemeId } from "../experience/theme-store";
import { getVoxelThemeLayout, type VoxelExhibitId, type VoxelThemeLayout } from "./voxel-landmarks";
import {
  createVoxelSnapshot,
  createVoxelWorld,
  getExposedVoxels,
  isEditableVoxelCoordinate,
  restoreVoxelWorld,
  voxelBlockKinds,
  voxelKey,
  type VoxelBlockKind,
  type VoxelCoordinate,
  type VoxelWorld,
  type VoxelWorldSnapshot,
} from "./voxel-world";

export type VoxelMovement = "forward" | "backward" | "left" | "right" | "up" | "down";
export type VoxelTravelMode = "walk" | "fly";

export type VoxelGameState = {
  active: boolean;
  blockCount: number;
  landmarkDistance: number | null;
  landmarkId: VoxelExhibitId | null;
  mode: VoxelTravelMode;
  position: readonly [number, number, number];
  selectedIndex: number;
  shards: number;
  sprinting: boolean;
  target: VoxelBlockKind | null;
};

type VoxelEngineOptions = {
  mount: HTMLElement;
  theme: CstdThemeId;
  seed: number;
  snapshot: VoxelWorldSnapshot | null;
  canvasLabel: string;
  exhibitTitles: Record<VoxelExhibitId, string>;
  onReady: (snapshot: VoxelWorldSnapshot) => void;
  onState: (state: VoxelGameState) => void;
  onWorldChange: (snapshot: VoxelWorldSnapshot) => void;
  onInteract: (id: VoxelExhibitId) => void;
  onError: (message: string) => void;
};

type LandmarkVisual = {
  id: VoxelExhibitId;
  group: THREE.Group;
  core: THREE.Mesh;
  halo: THREE.Mesh;
  sprite: THREE.Sprite;
  baseY: number;
  phase: number;
};

type VoxelPalette = {
  sky: number;
  fog: number;
  fogNear: number;
  fogFar: number;
  hemiSky: number;
  hemiGround: number;
  hemiIntensity: number;
  sun: number;
  sunIntensity: number;
  sunPosition: readonly [number, number, number];
  water: number;
  waterY: number;
  waterEmissive: number;
  waterOpacity: number;
  grid: number;
  particleColor: number;
  particleSize: number;
  blocks: Record<VoxelBlockKind, { base: number; fleck: number; emissive?: number; metalness?: number }>;
};

const palettes: Record<CstdThemeId, VoxelPalette> = {
  "neon-district": {
    sky: 0x030609,
    fog: 0x0a1219,
    fogNear: 18,
    fogFar: 74,
    hemiSky: 0x5fa8c4,
    hemiGround: 0x10161d,
    hemiIntensity: 1.2,
    sun: 0x8fd3ff,
    sunIntensity: 0.62,
    sunPosition: [-24, 38, -14],
    water: 0x06202c,
    waterY: 2.1,
    waterEmissive: 0x041219,
    waterOpacity: 0.85,
    grid: 0x54f2ff,
    particleColor: 0x9fd8ff,
    particleSize: 0.09,
    blocks: {
      turf: { base: 0x2b454c, fleck: 0x4f7478 },
      soil: { base: 0x262e35, fleck: 0x47525c },
      stone: { base: 0x39424a, fleck: 0x6c7982, metalness: 0.2 },
      timber: { base: 0x232f3d, fleck: 0x41586e, metalness: 0.45 },
      crystal: { base: 0x4f0e38, fleck: 0xff7ac8, emissive: 0xf02a98, metalness: 0.3 },
      neon: { base: 0x0e3440, fleck: 0xbdffff, emissive: 0x54f2ff, metalness: 0.1 },
      magma: { base: 0x40140b, fleck: 0xff7a30, emissive: 0xd8391b },
      gold: { base: 0x77591c, fleck: 0xffe066, emissive: 0x8a6a10, metalness: 0.72 },
    },
  },
  "underworld-forge": {
    sky: 0x0d0504,
    fog: 0x2a100a,
    fogNear: 14,
    fogFar: 72,
    hemiSky: 0xc47a48,
    hemiGround: 0x2a1410,
    hemiIntensity: 1.45,
    sun: 0xffb35c,
    sunIntensity: 1.25,
    sunPosition: [20, 30, 10],
    water: 0x8f2517,
    waterY: 1.9,
    waterEmissive: 0xd8391b,
    waterOpacity: 0.94,
    grid: 0xffc46b,
    particleColor: 0xff9c4e,
    particleSize: 0.11,
    blocks: {
      turf: { base: 0x5a3f2c, fleck: 0x8a6244 },
      soil: { base: 0x43302a, fleck: 0x6d5243 },
      stone: { base: 0x372c2f, fleck: 0x6d5a60, metalness: 0.16 },
      timber: { base: 0x77522c, fleck: 0xb98a4c, metalness: 0.22 },
      crystal: { base: 0x5d1c12, fleck: 0xffad5a, emissive: 0xc23c14, metalness: 0.14 },
      neon: { base: 0x23100a, fleck: 0xffd08a, emissive: 0xff9c2e, metalness: 0.08 },
      magma: { base: 0x551608, fleck: 0xffb054, emissive: 0xff4b1f, metalness: 0.05 },
      gold: { base: 0x8a6826, fleck: 0xffdf82, emissive: 0xb98614, metalness: 0.55 },
    },
  },
  "astral-covenant": {
    sky: 0x05071a,
    fog: 0x0c1128,
    fogNear: 26,
    fogFar: 96,
    hemiSky: 0x8fa8e8,
    hemiGround: 0x141024,
    hemiIntensity: 1.0,
    sun: 0xf1d99b,
    sunIntensity: 0.9,
    sunPosition: [26, 34, 18],
    water: 0x1b2455,
    waterY: -9,
    waterEmissive: 0x2b3a8f,
    waterOpacity: 0.55,
    grid: 0x8be3dc,
    particleColor: 0xcfd8ff,
    particleSize: 0.08,
    blocks: {
      turf: { base: 0x43604f, fleck: 0x77b58c },
      soil: { base: 0x4f4034, fleck: 0x816648 },
      stone: { base: 0x41405c, fleck: 0x76759c, metalness: 0.1 },
      timber: { base: 0x584427, fleck: 0x96793f, metalness: 0.2 },
      crystal: { base: 0x554791, fleck: 0xb7a4ff, emissive: 0x6d55c8, metalness: 0.2 },
      neon: { base: 0x1c2350, fleck: 0xa7f3ff, emissive: 0x6fc4e8, metalness: 0.08 },
      magma: { base: 0x2c1440, fleck: 0xc77fff, emissive: 0x7b3fd1, metalness: 0.06 },
      gold: { base: 0x6d5626, fleck: 0xe8c877, emissive: 0x4f3c0c, metalness: 0.5 },
    },
  },
};

const EYE_HEIGHT = 1.62;
const PLAYER_HALF = 0.32;
const PLAYER_HEIGHT = 1.74;
const GRAVITY = 26;
const JUMP_VELOCITY = 8.8;
const WALK_SPEED = 5.6;
const SPRINT_SPEED = 8.8;
const FLY_SPEED = 10.5;
const VOID_RESPAWN_Y = -16;

function createPixelTexture(base: number, fleck: number, salt: number) {
  const canvas = document.createElement("canvas");
  canvas.width = 16;
  canvas.height = 16;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas textures are unavailable");

  const baseColor = new THREE.Color(base);
  const fleckColor = new THREE.Color(fleck);
  context.fillStyle = baseColor.getStyle();
  context.fillRect(0, 0, 16, 16);
  for (let index = 0; index < 54; index += 1) {
    const x = (index * 7 + salt * 3) % 16;
    const y = (index * 11 + salt * 5) % 16;
    const strength = 0.18 + ((index + salt) % 5) * 0.08;
    const pixel = baseColor.clone().lerp(fleckColor, strength);
    context.fillStyle = pixel.getStyle();
    context.fillRect(x, y, 1 + (index % 3 === 0 ? 1 : 0), 1);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.NearestMipmapNearestFilter;
  texture.generateMipmaps = true;
  return texture;
}

function createTitleSprite(title: string, accent: number) {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 96;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas textures are unavailable");

  let fontSize = 46;
  context.font = `900 ${fontSize}px ui-monospace, SFMono-Regular, Consolas, monospace`;
  while (context.measureText(title).width > 470 && fontSize > 22) {
    fontSize -= 2;
    context.font = `900 ${fontSize}px ui-monospace, SFMono-Regular, Consolas, monospace`;
  }
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.lineWidth = 8;
  context.strokeStyle = "rgba(3, 6, 9, 0.92)";
  context.strokeText(title, 256, 50);
  context.fillStyle = `#${new THREE.Color(accent).getHexString()}`;
  context.fillText(title, 256, 50);
  context.fillStyle = "rgba(255, 255, 255, 0.5)";
  context.fillRect(96, 86, 320, 3);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const material = new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false });
  const sprite = new THREE.Sprite(material);
  sprite.scale.set(7.4, 1.39, 1);
  return sprite;
}

export class VoxelGameEngine {
  private readonly mount: HTMLElement;
  private readonly theme: CstdThemeId;
  private readonly layout: VoxelThemeLayout;
  private readonly palette: VoxelPalette;
  private readonly scene = new THREE.Scene();
  private readonly camera = new THREE.PerspectiveCamera(68, 1, 0.08, 220);
  private readonly renderer: THREE.WebGLRenderer;
  private readonly controls: PointerLockControls;
  private readonly worldGroup = new THREE.Group();
  private readonly landmarkGroup = new THREE.Group();
  private readonly fxGroup = new THREE.Group();
  private readonly blockGeometry = new THREE.BoxGeometry(1, 1, 1);
  private readonly materials = new Map<VoxelBlockKind, THREE.MeshStandardMaterial>();
  private readonly textures: THREE.Texture[] = [];
  private readonly worldMeshes: THREE.InstancedMesh[] = [];
  private readonly instanceCoordinates = new Map<THREE.InstancedMesh, VoxelCoordinate[]>();
  private readonly raycaster = new THREE.Raycaster();
  private readonly pointer = new THREE.Vector2(0, 0);
  private readonly selection: THREE.LineSegments;
  private readonly movement = new Set<VoxelMovement>();
  private readonly resizeObserver: ResizeObserver;
  private readonly ambientLight: THREE.HemisphereLight;
  private readonly sunLight: THREE.DirectionalLight;
  private readonly stars: THREE.Points;
  private readonly particles: THREE.Points | null;
  private readonly water: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshStandardMaterial> | null;
  private readonly onReady: VoxelEngineOptions["onReady"];
  private readonly onState: VoxelEngineOptions["onState"];
  private readonly onWorldChange: VoxelEngineOptions["onWorldChange"];
  private readonly onInteract: VoxelEngineOptions["onInteract"];
  private readonly onError: VoxelEngineOptions["onError"];
  private readonly landmarkGeometries: THREE.BufferGeometry[] = [];
  private readonly landmarkMaterials: THREE.Material[] = [];
  private readonly landmarkVisuals: LandmarkVisual[] = [];
  private readonly velocity = new THREE.Vector3();
  private readonly spawnPoint = new THREE.Vector3();
  private world: VoxelWorld;
  private frame = 0;
  private previousFrame = performance.now();
  private lastStateAt = 0;
  private selectedIndex = 0;
  private target: { coordinate: VoxelCoordinate; normal: VoxelCoordinate; kind: VoxelBlockKind } | null = null;
  private touchPointer: { id: number; x: number; y: number } | null = null;
  private focusedLandmarkId: VoxelExhibitId | null = null;
  private focusedLandmarkDistance: number | null = null;
  private active = false;
  private suspended = false;
  private flying = false;
  private sprinting = false;
  private grounded = false;
  private readonly exhibitTitleMap: Record<VoxelExhibitId, string>;

  constructor(options: VoxelEngineOptions) {
    this.mount = options.mount;
    this.theme = options.theme;
    this.layout = getVoxelThemeLayout(options.theme);
    this.palette = palettes[options.theme];
    this.exhibitTitleMap = options.exhibitTitles;
    this.onReady = options.onReady;
    this.onState = options.onState;
    this.onWorldChange = options.onWorldChange;
    this.onInteract = options.onInteract;
    this.onError = options.onError;
    this.world = options.snapshot ? restoreVoxelWorld(options.snapshot) : createVoxelWorld(options.theme, options.seed);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance", alpha: false });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = this.theme === "neon-district" ? 1.18 : this.theme === "underworld-forge" ? 1.3 : 1.08;
    this.renderer.domElement.dataset.cstdVoxelCanvas = "true";
    this.renderer.domElement.setAttribute("aria-label", options.canvasLabel);
    this.renderer.domElement.setAttribute("role", "application");
    this.renderer.domElement.tabIndex = 0;
    this.mount.appendChild(this.renderer.domElement);

    this.scene.add(this.worldGroup, this.landmarkGroup, this.fxGroup);
    this.scene.fog = new THREE.Fog(this.palette.fog, this.palette.fogNear, this.palette.fogFar);
    this.renderer.setClearColor(this.palette.sky, 1);

    this.ambientLight = new THREE.HemisphereLight(this.palette.hemiSky, this.palette.hemiGround, this.palette.hemiIntensity);
    this.sunLight = new THREE.DirectionalLight(this.palette.sun, this.palette.sunIntensity);
    this.sunLight.position.set(...this.palette.sunPosition);
    this.scene.add(this.ambientLight, this.sunLight);

    const selectionMaterial = new THREE.LineBasicMaterial({ color: this.palette.grid, transparent: true, opacity: 0.95 });
    this.selection = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(1.035, 1.035, 1.035)), selectionMaterial);
    this.selection.visible = false;
    this.scene.add(this.selection);

    this.stars = this.createStars();
    this.scene.add(this.stars);
    this.particles = this.createThemeParticles();
    if (this.particles) this.fxGroup.add(this.particles);
    this.water = this.createWaterPlane();
    if (this.water) this.scene.add(this.water);
    this.createMaterials();
    this.rebuildWorld();
    this.createLandmarkVisuals(options.exhibitTitles);

    this.camera.rotation.order = "YXZ";
    this.setStartPosition();
    this.controls = new PointerLockControls(this.camera, this.renderer.domElement);
    this.controls.addEventListener("lock", this.handleLock);
    this.controls.addEventListener("unlock", this.handleUnlock);

    this.renderer.domElement.addEventListener("pointerdown", this.handlePointerDown);
    this.renderer.domElement.addEventListener("pointermove", this.handlePointerMove);
    this.renderer.domElement.addEventListener("pointerup", this.handlePointerUp);
    this.renderer.domElement.addEventListener("pointercancel", this.handlePointerUp);
    this.renderer.domElement.addEventListener("wheel", this.handleWheel, { passive: false });
    this.renderer.domElement.addEventListener("contextmenu", this.handleContextMenu);
    this.renderer.domElement.addEventListener("webglcontextlost", this.handleContextLost);
    window.addEventListener("keydown", this.handleKeyDown);
    window.addEventListener("keyup", this.handleKeyUp);

    this.resizeObserver = new ResizeObserver(this.resize);
    this.resizeObserver.observe(this.mount);
    this.resize();
    this.onReady(this.getSnapshot());
    this.emitState(true);
    this.frame = window.requestAnimationFrame(this.animate);
  }

  private createMaterials() {
    voxelBlockKinds.forEach((kind, index) => {
      const colors = this.palette.blocks[kind];
      const texture = createPixelTexture(colors.base, colors.fleck, index + this.theme.length);
      this.textures.push(texture);
      this.materials.set(kind, new THREE.MeshStandardMaterial({
        map: texture,
        color: 0xffffff,
        roughness: kind === "crystal" || kind === "neon" ? 0.38 : kind === "gold" ? 0.34 : 0.88,
        metalness: colors.metalness ?? 0.03,
        emissive: colors.emissive ?? 0x000000,
        emissiveIntensity: colors.emissive ? (kind === "neon" ? 1.5 : 1.15) : 0,
      }));
    });
  }

  private createStars() {
    const count = this.theme === "underworld-forge" ? 320 : this.theme === "astral-covenant" ? 900 : 520;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const accent = new THREE.Color(this.palette.grid);
    const warm = new THREE.Color(this.palette.sun);
    for (let index = 0; index < count; index += 1) {
      const angle = index * 2.39996;
      const radius = this.theme === "underworld-forge" ? 9 + (index % 29) * 0.7 : 46 + (index % 37) * 1.1;
      positions[index * 3] = Math.cos(angle) * radius;
      positions[index * 3 + 1] = this.theme === "underworld-forge" ? 5 + ((index * 13) % 21) : 10 + ((index * 17) % 62);
      positions[index * 3 + 2] = Math.sin(angle) * radius;
      const mix = (index % 7) / 7;
      const tint = accent.clone().lerp(warm, this.theme === "neon-district" ? mix : mix * 0.4);
      colors[index * 3] = tint.r;
      colors[index * 3 + 1] = tint.g;
      colors[index * 3 + 2] = tint.b;
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    const material = new THREE.PointsMaterial({
      size: this.theme === "underworld-forge" ? 0.22 : this.theme === "astral-covenant" ? 0.26 : 0.14,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
    });
    return new THREE.Points(geometry, material);
  }

  private createThemeParticles() {
    const count = this.theme === "neon-district" ? 760 : this.theme === "underworld-forge" ? 300 : 320;
    const positions = new Float32Array(count * 3);
    for (let index = 0; index < count; index += 1) {
      if (this.theme === "neon-district") {
        positions[index * 3] = (hashWithout(index, 3) - 0.5) * 56;
        positions[index * 3 + 1] = hashWithout(index, 7) * 34;
        positions[index * 3 + 2] = (hashWithout(index, 11) - 0.5) * 56;
      } else if (this.theme === "underworld-forge") {
        const angle = index * 2.39996;
        const radius = 3 + hashWithout(index, 5) * 30;
        positions[index * 3] = Math.cos(angle) * radius;
        positions[index * 3 + 1] = 3 + hashWithout(index, 9) * 13;
        positions[index * 3 + 2] = Math.sin(angle) * radius;
      } else {
        const angle = index * 2.39996;
        const radius = 6 + hashWithout(index, 5) * 40;
        positions[index * 3] = Math.cos(angle) * radius;
        positions[index * 3 + 1] = -2 + hashWithout(index, 9) * 34;
        positions[index * 3 + 2] = Math.sin(angle) * radius;
      }
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const material = new THREE.PointsMaterial({
      color: this.palette.particleColor,
      size: this.palette.particleSize,
      transparent: true,
      opacity: this.theme === "neon-district" ? 0.5 : 0.75,
      depthWrite: false,
      blending: this.theme === "neon-district" ? THREE.NormalBlending : THREE.AdditiveBlending,
    });
    return new THREE.Points(geometry, material);
  }

  private createWaterPlane() {
    if (this.theme === "neon-district") return null;
    const size = this.theme === "astral-covenant" ? 220 : 130;
    const geometry = new THREE.PlaneGeometry(size, size, 1, 1);
    const material = new THREE.MeshStandardMaterial({
      color: this.palette.water,
      emissive: this.palette.waterEmissive,
      emissiveIntensity: this.theme === "underworld-forge" ? 0.85 : 0.5,
      transparent: true,
      opacity: this.palette.waterOpacity,
      roughness: 0.4,
      metalness: 0.1,
      depthWrite: false,
    });
    const water = new THREE.Mesh(geometry, material);
    water.rotation.x = -Math.PI / 2;
    water.position.y = this.palette.waterY;
    return water;
  }

  private findHighestVoxel(x: number, z: number) {
    let highest = -Infinity;
    for (const key of this.world.blocks.keys()) {
      const [blockX, blockY, blockZ] = key.split(",").map(Number);
      if (blockX === x && blockZ === z) highest = Math.max(highest, blockY ?? 0);
    }
    return highest === -Infinity ? 5 : highest;
  }

  private setStartPosition() {
    const [spawnX, spawnZ] = this.layout.spawn;
    this.spawnPoint.set(spawnX, this.findHighestVoxel(spawnX, spawnZ) + 1.02, spawnZ);
    const [lookX, lookZ] = this.layout.lookAt;
    this.camera.position.set(spawnX, this.spawnPoint.y + EYE_HEIGHT, spawnZ);
    const lookDown = this.theme === "underworld-forge" ? 2.4 : 1.2;
    this.camera.lookAt(lookX, this.camera.position.y - lookDown, lookZ);
  }

  private disposeLandmarkVisuals() {
    this.landmarkGroup.clear();
    for (const landmark of this.landmarkVisuals) {
      (landmark.sprite.material as THREE.SpriteMaterial).map?.dispose();
      (landmark.sprite.material as THREE.SpriteMaterial).dispose();
    }
    this.landmarkVisuals.length = 0;
    this.landmarkGeometries.splice(0).forEach((geometry) => geometry.dispose());
    this.landmarkMaterials.splice(0).forEach((material) => material.dispose());
  }

  private createLandmarkVisuals(exhibitTitles: Record<VoxelExhibitId, string>) {
    this.disposeLandmarkVisuals();
    const accent = new THREE.MeshBasicMaterial({
      color: this.palette.grid,
      transparent: true,
      opacity: 0.78,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const secondary = new THREE.MeshBasicMaterial({
      color: this.palette.sun,
      transparent: true,
      opacity: 0.92,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const beamGeometry = new THREE.CylinderGeometry(0.42, 0.16, 7, 6, 1, true);
    const ringGeometry = new THREE.TorusGeometry(2.3, 0.09, 6, 40);
    const flameGeometry = new THREE.ConeGeometry(0.5, 1.5, 5);
    const dieGeometry = new THREE.IcosahedronGeometry(0.82, 0);
    this.landmarkMaterials.push(accent, secondary);
    this.landmarkGeometries.push(beamGeometry, ringGeometry, flameGeometry, dieGeometry);

    this.layout.landmarks.forEach((landmark, index) => {
      const group = new THREE.Group();
      const baseY = this.findHighestVoxel(landmark.x, landmark.z) + 1.3;
      const phase = index * 0.83;
      group.position.set(landmark.x, baseY, landmark.z);
      group.userData.exhibitId = landmark.id;

      const core = new THREE.Mesh(
        this.theme === "underworld-forge" ? flameGeometry : this.theme === "astral-covenant" ? dieGeometry : new THREE.OctahedronGeometry(0.78, 0),
        secondary,
      );
      core.name = "core";
      const coreHeight = this.theme === "neon-district" ? 12 + (index % 3) : this.theme === "underworld-forge" ? 4.4 + (index % 2) : 3.4 + (index % 3);
      core.position.y = coreHeight;
      group.add(core);

      const halo = new THREE.Mesh(ringGeometry, accent);
      halo.name = "halo";
      halo.position.y = coreHeight;
      if (this.theme === "neon-district") {
        halo.rotation.x = Math.PI / 2.2;
        const beam = new THREE.Mesh(beamGeometry, accent);
        beam.name = "beam";
        beam.position.y = coreHeight - 2.2;
        group.add(beam);
      } else if (this.theme === "underworld-forge") {
        halo.rotation.x = Math.PI / 2;
        halo.position.y = 0.55;
      } else {
        halo.rotation.x = Math.PI / 2.6;
      }
      group.add(halo);

      const sprite = createTitleSprite(exhibitTitles[landmark.id] ?? landmark.id, this.palette.grid);
      sprite.position.y = coreHeight + (this.theme === "neon-district" ? 2.6 : 2.1);
      group.add(sprite);

      this.landmarkVisuals.push({ id: landmark.id, group, core, halo, sprite, baseY, phase });
      this.landmarkGroup.add(group);
    });
  }

  private updateLandmarks(now: number, delta: number) {
    for (const landmark of this.landmarkVisuals) {
      const pulse = (Math.sin(now * 0.002 + landmark.phase) + 1) / 2;
      const focused = landmark.id === this.focusedLandmarkId;
      const scale = (focused ? 1.22 : 1) + pulse * 0.04;
      landmark.group.scale.setScalar(scale);
      landmark.group.position.y = landmark.baseY + Math.sin(now * 0.0014 + landmark.phase) * (this.theme === "astral-covenant" ? 0.3 : 0.08);
      landmark.core.rotation.y += delta * (this.theme === "underworld-forge" ? 1.1 : this.theme === "astral-covenant" ? 1.5 : 2.1);
      landmark.halo.rotation.z += delta * (focused ? 1.6 : 0.5);
      if (this.theme === "underworld-forge") {
        const flicker = 0.86 + ((Math.sin(now * 0.013 + landmark.phase) + Math.sin(now * 0.029)) * 0.07);
        landmark.core.scale.set(flicker, 1 + (flicker - 1) * 1.6, flicker);
      }
      const material = landmark.sprite.material as THREE.SpriteMaterial;
      material.opacity = focused ? 1 : 0.82;
    }
  }

  private updateLandmarkFocus() {
    let id: VoxelExhibitId | null = null;
    let distance: number | null = null;
    for (const landmark of this.layout.landmarks) {
      const candidate = Math.hypot(this.camera.position.x - landmark.x, this.camera.position.z - landmark.z);
      if (candidate <= landmark.radius && (distance === null || candidate < distance)) {
        id = landmark.id;
        distance = candidate;
      }
    }
    this.focusedLandmarkId = id;
    this.focusedLandmarkDistance = distance;
  }

  private rebuildWorld() {
    for (const mesh of this.worldMeshes) this.worldGroup.remove(mesh);
    this.worldMeshes.length = 0;
    this.instanceCoordinates.clear();
    const exposed = getExposedVoxels(this.world);
    const matrix = new THREE.Matrix4();

    for (const kind of voxelBlockKinds) {
      const voxels = exposed.filter((voxel) => voxel.kind === kind);
      if (voxels.length === 0) continue;
      const material = this.materials.get(kind);
      if (!material) continue;
      const mesh = new THREE.InstancedMesh(this.blockGeometry, material, voxels.length);
      const coordinates = voxels.map((voxel) => voxel.coordinate);
      coordinates.forEach(([x, y, z], index) => {
        matrix.makeTranslation(x, y + 0.5, z);
        mesh.setMatrixAt(index, matrix);
      });
      mesh.instanceMatrix.needsUpdate = true;
      mesh.computeBoundingSphere();
      mesh.userData.voxelKind = kind;
      this.worldMeshes.push(mesh);
      this.instanceCoordinates.set(mesh, coordinates);
      this.worldGroup.add(mesh);
    }
  }

  private collidesAt(x: number, y: number, z: number) {
    const minX = Math.floor(x - PLAYER_HALF);
    const maxX = Math.floor(x + PLAYER_HALF);
    const minY = Math.floor(y);
    const maxY = Math.floor(y + PLAYER_HEIGHT);
    const minZ = Math.floor(z - PLAYER_HALF);
    const maxZ = Math.floor(z + PLAYER_HALF);
    for (let cx = minX; cx <= maxX; cx += 1) {
      for (let cy = minY; cy <= maxY; cy += 1) {
        for (let cz = minZ; cz <= maxZ; cz += 1) {
          if (this.world.blocks.has(voxelKey(cx, cy, cz))) return true;
        }
      }
    }
    return false;
  }

  private moveWithCollision(feet: THREE.Vector3, delta: THREE.Vector3) {
    const steps = Math.max(1, Math.ceil(Math.max(Math.abs(delta.x), Math.abs(delta.y), Math.abs(delta.z)) / 0.35));
    const step = delta.clone().divideScalar(steps);
    for (let index = 0; index < steps; index += 1) {
      feet.x += step.x;
      if (this.collidesAt(feet.x, feet.y, feet.z)) {
        feet.x -= step.x;
        this.velocity.x = 0;
      }
      feet.z += step.z;
      if (this.collidesAt(feet.x, feet.y, feet.z)) {
        feet.z -= step.z;
        this.velocity.z = 0;
      }
      feet.y += step.y;
      if (this.collidesAt(feet.x, feet.y, feet.z)) {
        feet.y -= step.y;
        if (step.y < 0) this.grounded = true;
        this.velocity.y = 0;
      }
    }
  }

  private updateMovement(delta: number) {
    if (!this.active) return;
    const feet = this.camera.position.clone();
    feet.y -= EYE_HEIGHT;

    const forward = new THREE.Vector3();
    this.camera.getWorldDirection(forward);
    forward.y = 0;
    forward.normalize();
    const right = new THREE.Vector3(-forward.z, 0, forward.x);
    const wish = new THREE.Vector3();
    if (this.movement.has("forward")) wish.add(forward);
    if (this.movement.has("backward")) wish.sub(forward);
    if (this.movement.has("right")) wish.add(right);
    if (this.movement.has("left")) wish.sub(right);
    const moving = wish.lengthSq() > 0;
    if (moving) wish.normalize();

    this.sprinting = !this.flying && this.movement.has("down") && moving;
    const speed = this.flying ? FLY_SPEED : this.sprinting ? SPRINT_SPEED : WALK_SPEED;

    if (this.flying) {
      const verticalInput = (this.movement.has("up") ? 1 : 0) - (this.movement.has("down") ? 1 : 0);
      this.velocity.x = wish.x * speed;
      this.velocity.z = wish.z * speed;
      this.velocity.y = verticalInput * speed * 0.85;
      this.grounded = false;
    } else {
      const targetX = wish.x * speed;
      const targetZ = wish.z * speed;
      this.velocity.x += (targetX - this.velocity.x) * Math.min(1, delta * 12);
      this.velocity.z += (targetZ - this.velocity.z) * Math.min(1, delta * 12);
      this.velocity.y -= GRAVITY * delta;
      if (this.velocity.y < -30) this.velocity.y = -30;
      if (this.movement.has("up") && this.grounded) {
        this.velocity.y = JUMP_VELOCITY;
        this.grounded = false;
      }
    }

    this.grounded = false;
    this.moveWithCollision(feet, this.velocity.clone().multiplyScalar(delta));
    if (!this.flying) {
      const probe = feet.clone();
      probe.y -= 0.08;
      this.grounded = this.collidesAt(probe.x, probe.y, probe.z) && this.velocity.y <= 0.01;
    }

    if (feet.y < VOID_RESPAWN_Y) {
      feet.copy(this.spawnPoint);
      this.velocity.set(0, 0, 0);
    }

    this.camera.position.set(feet.x, feet.y + EYE_HEIGHT, feet.z);
    this.camera.position.x = THREE.MathUtils.clamp(this.camera.position.x, -44, 44);
    this.camera.position.z = THREE.MathUtils.clamp(this.camera.position.z, -44, 44);

    const targetFov = this.sprinting ? 74 : 68;
    if (Math.abs(this.camera.fov - targetFov) > 0.1) {
      this.camera.fov += (targetFov - this.camera.fov) * Math.min(1, delta * 6);
      this.camera.updateProjectionMatrix();
    }
  }

  private updateAtmosphere(now: number, delta: number) {
    this.stars.rotation.y += delta * (this.theme === "neon-district" ? 0.006 : this.theme === "underworld-forge" ? 0.012 : 0.004);

    if (this.particles) {
      const positions = this.particles.geometry.getAttribute("position") as THREE.BufferAttribute;
      const array = positions.array as Float32Array;
      if (this.theme === "neon-district") {
        for (let index = 0; index < array.length; index += 3) {
          array[index + 1] -= delta * 21;
          array[index] += delta * 2.4;
          if (array[index + 1] < -2) {
            array[index + 1] = 32 + Math.random() * 6;
            array[index] = (Math.random() - 0.5) * 56;
            array[index + 2] = (Math.random() - 0.5) * 56;
          }
        }
        this.particles.position.set(this.camera.position.x, 0, this.camera.position.z);
      } else if (this.theme === "underworld-forge") {
        for (let index = 0; index < array.length; index += 3) {
          array[index + 1] += delta * (1.1 + (index % 5) * 0.24);
          array[index] += Math.sin(now * 0.001 + index) * delta * 0.5;
          if (array[index + 1] > 17) {
            array[index + 1] = 2.6;
            const angle = Math.random() * Math.PI * 2;
            const radius = 3 + Math.random() * 28;
            array[index] = Math.cos(angle) * radius;
            array[index + 2] = Math.sin(angle) * radius;
          }
        }
      } else {
        for (let index = 0; index < array.length; index += 3) {
          array[index + 1] += delta * 0.5;
          array[index] += Math.sin(now * 0.0006 + index * 0.7) * delta * 0.4;
          if (array[index + 1] > 32) array[index + 1] = -2;
        }
      }
      positions.needsUpdate = true;
    }

    if (this.water && this.theme === "underworld-forge") {
      this.water.material.emissiveIntensity = 0.72 + Math.sin(now * 0.0011) * 0.22;
      this.water.position.y = this.palette.waterY + Math.sin(now * 0.0009) * 0.06;
    }
  }

  private animate = (now: number) => {
    if (this.suspended) return;
    const delta = Math.min(0.05, Math.max(0, (now - this.previousFrame) / 1_000));
    this.previousFrame = now;
    this.updateMovement(delta);
    this.updateAtmosphere(now, delta);
    this.updateTarget();
    this.updateLandmarkFocus();
    this.updateLandmarks(now, delta);
    this.renderer.render(this.scene, this.camera);
    this.captureFrameSignal();
    this.emitState(false);
    this.frame = window.requestAnimationFrame(this.animate);
  };

  private captureFrameSignal() {
    const canvas = this.renderer.domElement;
    if (canvas.dataset.cstdVoxelColorSpan) return;

    const gl = this.renderer.getContext();
    const width = gl.drawingBufferWidth;
    const height = gl.drawingBufferHeight;
    if (width < 1 || height < 1) return;

    let minimum = 255;
    let maximum = 0;
    let lit = 0;
    let samples = 0;
    const stripHeight = Math.min(2, height);

    for (const ratio of [0.18, 0.52, 0.84]) {
      const y = Math.max(0, Math.min(height - stripHeight, Math.floor(height * ratio)));
      const pixels = new Uint8Array(width * stripHeight * 4);
      gl.readPixels(0, y, width, stripHeight, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
      for (let index = 0; index < pixels.length; index += 16) {
        const luminance = ((pixels[index] ?? 0) + (pixels[index + 1] ?? 0) + (pixels[index + 2] ?? 0)) / 3;
        minimum = Math.min(minimum, luminance);
        maximum = Math.max(maximum, luminance);
        if (luminance > 12) lit += 1;
        samples += 1;
      }
    }

    canvas.dataset.cstdVoxelColorSpan = String(Math.round(maximum - minimum));
    canvas.dataset.cstdVoxelLitSamples = String(lit);
    canvas.dataset.cstdVoxelPixelSamples = String(samples);
  }

  private emitState(force: boolean) {
    const now = performance.now();
    if (!force && now - this.lastStateAt < 120) return;
    this.lastStateAt = now;
    this.onState({
      active: this.active,
      blockCount: this.world.blocks.size,
      landmarkDistance: this.focusedLandmarkDistance,
      landmarkId: this.focusedLandmarkId,
      mode: this.flying ? "fly" : "walk",
      position: [this.camera.position.x, this.camera.position.y, this.camera.position.z],
      selectedIndex: this.selectedIndex,
      shards: this.world.shards,
      sprinting: this.sprinting,
      target: this.target?.kind ?? null,
    });
  }

  private updateTarget() {
    if (!this.active) {
      this.target = null;
      this.selection.visible = false;
      return;
    }
    this.raycaster.setFromCamera(this.pointer, this.camera);
    this.raycaster.far = 8;
    const hit = this.raycaster.intersectObjects(this.worldMeshes, false)[0];
    if (!hit || hit.instanceId === undefined || !(hit.object instanceof THREE.InstancedMesh)) {
      this.target = null;
      this.selection.visible = false;
      return;
    }
    const coordinate = this.instanceCoordinates.get(hit.object)?.[hit.instanceId];
    const kind = hit.object.userData.voxelKind as VoxelBlockKind | undefined;
    const normal = hit.face?.normal;
    if (!coordinate || !kind || !normal) return;
    this.target = {
      coordinate,
      normal: [Math.round(normal.x), Math.round(normal.y), Math.round(normal.z)],
      kind,
    };
    this.selection.position.set(coordinate[0], coordinate[1] + 0.5, coordinate[2]);
    this.selection.visible = true;
  }

  private editWorld(action: "break" | "place") {
    if (!this.target) return;
    if (action === "break") {
      const [x, y, z] = this.target.coordinate;
      if (y <= 2) return;
      if (this.world.blocks.get(voxelKey(x, y, z)) === "crystal") this.world.shards += 1;
      this.world.blocks.delete(voxelKey(x, y, z));
    } else {
      const coordinate: VoxelCoordinate = [
        this.target.coordinate[0] + this.target.normal[0],
        this.target.coordinate[1] + this.target.normal[1],
        this.target.coordinate[2] + this.target.normal[2],
      ];
      if (!isEditableVoxelCoordinate(coordinate) || this.world.blocks.has(voxelKey(...coordinate))) return;
      this.world.blocks.set(voxelKey(...coordinate), voxelBlockKinds[this.selectedIndex] ?? "turf");
    }
    this.rebuildWorld();
    const snapshot = this.getSnapshot();
    this.onWorldChange(snapshot);
    this.emitState(true);
  }

  private handleLock = () => {
    this.active = true;
    this.emitState(true);
  };

  private handleUnlock = () => {
    this.active = false;
    this.movement.clear();
    this.emitState(true);
  };

  private handlePointerDown = (event: PointerEvent) => {
    if (event.pointerType === "touch") {
      this.touchPointer = { id: event.pointerId, x: event.clientX, y: event.clientY };
      this.renderer.domElement.setPointerCapture(event.pointerId);
      this.active = true;
      this.emitState(true);
      return;
    }
    if (!this.controls.isLocked) return;
    if (event.button === 0) this.editWorld("break");
    if (event.button === 2) this.editWorld("place");
  };

  private handlePointerMove = (event: PointerEvent) => {
    if (!this.touchPointer || this.touchPointer.id !== event.pointerId) return;
    const dx = event.clientX - this.touchPointer.x;
    const dy = event.clientY - this.touchPointer.y;
    this.touchPointer = { id: event.pointerId, x: event.clientX, y: event.clientY };
    this.lookBy(dx, dy);
  };

  private handlePointerUp = (event: PointerEvent) => {
    if (this.touchPointer?.id === event.pointerId) this.touchPointer = null;
  };

  private handleWheel = (event: WheelEvent) => {
    event.preventDefault();
    const direction = event.deltaY > 0 ? 1 : -1;
    this.selectBlock((this.selectedIndex + direction + voxelBlockKinds.length) % voxelBlockKinds.length);
  };

  private handleContextMenu = (event: MouseEvent) => event.preventDefault();

  private handleContextLost = (event: Event) => {
    event.preventDefault();
    this.onError("WebGL context lost");
  };

  private handleKeyDown = (event: KeyboardEvent) => {
    if (event.code === "KeyE" && this.active && this.focusedLandmarkId && !event.repeat) {
      event.preventDefault();
      const id = this.focusedLandmarkId;
      this.pause();
      this.onInteract(id);
      return;
    }
    if (event.code === "KeyP") {
      event.preventDefault();
      this.pause();
      return;
    }
    if (event.code === "KeyF" && !event.repeat) {
      event.preventDefault();
      this.flying = !this.flying;
      this.velocity.set(0, 0, 0);
      this.emitState(true);
      return;
    }
    const movement = this.movementForCode(event.code);
    if (movement) {
      event.preventDefault();
      this.movement.add(movement);
    }
    if (/^Digit[1-8]$/.test(event.code)) this.selectBlock(Number(event.code.slice(-1)) - 1);
  };

  private handleKeyUp = (event: KeyboardEvent) => {
    const movement = this.movementForCode(event.code);
    if (movement) this.movement.delete(movement);
  };

  private movementForCode(code: string): VoxelMovement | null {
    if (code === "KeyW" || code === "ArrowUp") return "forward";
    if (code === "KeyS" || code === "ArrowDown") return "backward";
    if (code === "KeyA" || code === "ArrowLeft") return "left";
    if (code === "KeyD" || code === "ArrowRight") return "right";
    if (code === "Space") return "up";
    if (code === "ShiftLeft" || code === "ShiftRight") return "down";
    return null;
  }

  private resize = () => {
    const width = Math.max(1, this.mount.clientWidth);
    const height = Math.max(1, this.mount.clientHeight);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height, false);
  };

  enter() {
    if (this.suspended) {
      this.suspended = false;
      this.previousFrame = performance.now();
      this.frame = window.requestAnimationFrame(this.animate);
    }
    this.renderer.domElement.focus();
    if (window.matchMedia("(pointer: coarse)").matches) {
      this.active = true;
      this.emitState(true);
      return;
    }
    this.controls.lock();
  }

  pause() {
    if (this.controls.isLocked) this.controls.unlock();
    this.active = false;
    this.movement.clear();
    this.emitState(true);
  }

  suspend() {
    this.suspended = true;
    window.cancelAnimationFrame(this.frame);
    if (this.controls.isLocked) this.controls.unlock();
    this.active = false;
    this.movement.clear();
    this.emitState(true);
  }

  setMovement(direction: VoxelMovement, pressed: boolean) {
    if (pressed) this.movement.add(direction);
    else this.movement.delete(direction);
  }

  toggleFlight() {
    this.flying = !this.flying;
    this.velocity.set(0, 0, 0);
    this.emitState(true);
  }

  lookBy(deltaX: number, deltaY: number) {
    this.camera.rotation.y -= deltaX * 0.0034;
    this.camera.rotation.x = THREE.MathUtils.clamp(this.camera.rotation.x - deltaY * 0.0034, -Math.PI / 2 + 0.05, Math.PI / 2 - 0.05);
  }

  selectBlock(index: number) {
    this.selectedIndex = Math.max(0, Math.min(voxelBlockKinds.length - 1, index));
    this.emitState(true);
  }

  edit(action: "break" | "place") {
    this.editWorld(action);
  }

  travelToLandmark(id: VoxelExhibitId) {
    const landmark = this.layout.landmarks.find((entry) => entry.id === id);
    if (!landmark) return;
    const approachX = Math.round(landmark.x * 0.62);
    const approachZ = Math.round(landmark.z * 0.62);
    const feetY = this.findHighestVoxel(approachX, approachZ) + 1.05;
    this.camera.position.set(approachX, feetY + EYE_HEIGHT, approachZ);
    this.velocity.set(0, 0, 0);
    this.camera.lookAt(landmark.x, feetY + 2.4, landmark.z);
    this.updateLandmarkFocus();
    this.emitState(true);
  }

  reset(seed: number) {
    this.world = createVoxelWorld(this.theme, seed);
    this.target = null;
    this.rebuildWorld();
    this.createLandmarkVisuals(this.exhibitTitleMap);
    this.setStartPosition();
    this.velocity.set(0, 0, 0);
    this.updateLandmarkFocus();
    const snapshot = this.getSnapshot();
    this.onWorldChange(snapshot);
    this.emitState(true);
  }

  getSnapshot() {
    return createVoxelSnapshot(this.world, this.theme);
  }

  destroy() {
    this.suspended = true;
    window.cancelAnimationFrame(this.frame);
    this.pause();
    this.resizeObserver.disconnect();
    this.controls.removeEventListener("lock", this.handleLock);
    this.controls.removeEventListener("unlock", this.handleUnlock);
    this.controls.dispose();
    this.renderer.domElement.removeEventListener("pointerdown", this.handlePointerDown);
    this.renderer.domElement.removeEventListener("pointermove", this.handlePointerMove);
    this.renderer.domElement.removeEventListener("pointerup", this.handlePointerUp);
    this.renderer.domElement.removeEventListener("pointercancel", this.handlePointerUp);
    this.renderer.domElement.removeEventListener("wheel", this.handleWheel);
    this.renderer.domElement.removeEventListener("contextmenu", this.handleContextMenu);
    this.renderer.domElement.removeEventListener("webglcontextlost", this.handleContextLost);
    window.removeEventListener("keydown", this.handleKeyDown);
    window.removeEventListener("keyup", this.handleKeyUp);
    this.blockGeometry.dispose();
    this.materials.forEach((material) => material.dispose());
    this.textures.forEach((texture) => texture.dispose());
    this.selection.geometry.dispose();
    (this.selection.material as THREE.Material).dispose();
    this.stars.geometry.dispose();
    (this.stars.material as THREE.Material).dispose();
    if (this.particles) {
      this.particles.geometry.dispose();
      (this.particles.material as THREE.Material).dispose();
    }
    if (this.water) {
      this.water.geometry.dispose();
      this.water.material.dispose();
    }
    this.disposeLandmarkVisuals();
    this.renderer.dispose();
    this.renderer.domElement.remove();
  }
}

function hashWithout(index: number, salt: number) {
  const value = Math.imul(index + 1, 374_761_393) + Math.imul(salt + 7, 668_265_263);
  return ((value ^ (value >>> 15)) >>> 0) / 4_294_967_295;
}
