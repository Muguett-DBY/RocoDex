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

export type VoxelGameState = {
  active: boolean;
  blockCount: number;
  cycle: "day" | "night";
  landmarkDistance: number | null;
  landmarkId: VoxelExhibitId | null;
  position: readonly [number, number, number];
  selectedIndex: number;
  shards: number;
  target: VoxelBlockKind | null;
};

type VoxelEngineOptions = {
  mount: HTMLElement;
  theme: CstdThemeId;
  seed: number;
  snapshot: VoxelWorldSnapshot | null;
  canvasLabel: string;
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
  orbitA: THREE.Mesh;
  orbitB: THREE.Mesh;
  baseY: number;
  phase: number;
};

type VoxelPalette = {
  skyDay: number;
  skyNight: number;
  fogDay: number;
  fogNight: number;
  ambient: number;
  sun: number;
  water: number;
  grid: number;
  blocks: Record<VoxelBlockKind, { base: number; fleck: number; emissive?: number; metalness?: number }>;
};

const palettes: Record<CstdThemeId, VoxelPalette> = {
  "neon-district": {
    skyDay: 0x244153,
    skyNight: 0x03070c,
    fogDay: 0x193341,
    fogNight: 0x05090d,
    ambient: 0x7bc6d3,
    sun: 0xffe55c,
    water: 0x0a8297,
    grid: 0x24e0ff,
    blocks: {
      turf: { base: 0x2b7b66, fleck: 0x59d4a6 },
      soil: { base: 0x5a4638, fleck: 0x93705a },
      stone: { base: 0x323b42, fleck: 0x67737a, metalness: 0.18 },
      timber: { base: 0x1b2731, fleck: 0xf4d431, metalness: 0.58 },
      crystal: { base: 0x0a5362, fleck: 0x7ff6ff, emissive: 0x24e0ff, metalness: 0.32 },
    },
  },
  "underworld-forge": {
    skyDay: 0x4b2618,
    skyNight: 0x0b0504,
    fogDay: 0x351811,
    fogNight: 0x100605,
    ambient: 0xd68c68,
    sun: 0xf5c056,
    water: 0x8f2517,
    grid: 0xd7a84b,
    blocks: {
      turf: { base: 0x4e3427, fleck: 0x9b6544 },
      soil: { base: 0x35221c, fleck: 0x694033 },
      stone: { base: 0x221c1d, fleck: 0x60464a, metalness: 0.2 },
      timber: { base: 0x684522, fleck: 0xd7a84b, metalness: 0.35 },
      crystal: { base: 0x6d1f14, fleck: 0xffad5a, emissive: 0xff4b1f, metalness: 0.18 },
    },
  },
  "astral-covenant": {
    skyDay: 0x46578d,
    skyNight: 0x070919,
    fogDay: 0x28345f,
    fogNight: 0x090b1c,
    ambient: 0x9ec9e2,
    sun: 0xf1d99b,
    water: 0x4958a9,
    grid: 0x77d6d1,
    blocks: {
      turf: { base: 0x526d65, fleck: 0x8ac7a7 },
      soil: { base: 0x655347, fleck: 0xa98c69 },
      stone: { base: 0x4a4964, fleck: 0x8584aa, metalness: 0.12 },
      timber: { base: 0x6a5631, fleck: 0xd7bc78, metalness: 0.28 },
      crystal: { base: 0x554791, fleck: 0xb7a4ff, emissive: 0x8d79dc, metalness: 0.24 },
    },
  },
};

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

export class VoxelGameEngine {
  private readonly mount: HTMLElement;
  private readonly theme: CstdThemeId;
  private readonly layout: VoxelThemeLayout;
  private readonly palette: VoxelPalette;
  private readonly scene = new THREE.Scene();
  private readonly camera = new THREE.PerspectiveCamera(68, 1, 0.08, 180);
  private readonly renderer: THREE.WebGLRenderer;
  private readonly controls: PointerLockControls;
  private readonly worldGroup = new THREE.Group();
  private readonly landmarkGroup = new THREE.Group();
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
  private readonly water: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshStandardMaterial>;
  private readonly onReady: VoxelEngineOptions["onReady"];
  private readonly onState: VoxelEngineOptions["onState"];
  private readonly onWorldChange: VoxelEngineOptions["onWorldChange"];
  private readonly onInteract: VoxelEngineOptions["onInteract"];
  private readonly onError: VoxelEngineOptions["onError"];
  private readonly landmarkGeometries: THREE.BufferGeometry[] = [];
  private readonly landmarkMaterials: THREE.Material[] = [];
  private readonly landmarkVisuals: LandmarkVisual[] = [];
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
  private cycle = 0.24;

  constructor(options: VoxelEngineOptions) {
    this.mount = options.mount;
    this.theme = options.theme;
    this.layout = getVoxelThemeLayout(options.theme);
    this.palette = palettes[options.theme];
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
    this.renderer.toneMappingExposure = 1.05;
    this.renderer.domElement.dataset.cstdVoxelCanvas = "true";
    this.renderer.domElement.setAttribute("aria-label", options.canvasLabel);
    this.renderer.domElement.setAttribute("role", "application");
    this.renderer.domElement.tabIndex = 0;
    this.mount.appendChild(this.renderer.domElement);

    this.scene.add(this.worldGroup, this.landmarkGroup);
    this.scene.fog = new THREE.Fog(this.palette.fogNight, 12, this.theme === "underworld-forge" ? 52 : this.theme === "astral-covenant" ? 72 : 64);

    this.ambientLight = new THREE.HemisphereLight(this.palette.ambient, 0x171117, 1.1);
    this.sunLight = new THREE.DirectionalLight(this.palette.sun, 1.6);
    this.sunLight.position.set(18, 28, 12);
    this.scene.add(this.ambientLight, this.sunLight);

    const selectionMaterial = new THREE.LineBasicMaterial({ color: this.palette.grid, transparent: true, opacity: 0.95 });
    this.selection = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(1.035, 1.035, 1.035)), selectionMaterial);
    this.selection.visible = false;
    this.scene.add(this.selection);

    this.stars = this.createStars();
    this.scene.add(this.stars);
    this.water = this.createWater();
    this.scene.add(this.water);
    this.createMaterials();
    this.rebuildWorld();
    this.createLandmarkVisuals();

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
        roughness: kind === "crystal" ? 0.4 : 0.88,
        metalness: colors.metalness ?? 0.03,
        emissive: colors.emissive ?? 0x000000,
        emissiveIntensity: colors.emissive ? 1.35 : 0,
      }));
    });
  }

  private createStars() {
    const count = this.theme === "underworld-forge" ? 280 : 420;
    const positions = new Float32Array(count * 3);
    for (let index = 0; index < count; index += 1) {
      if (this.theme === "neon-district") {
        positions[index * 3] = ((index * 17) % 89) - 44;
        positions[index * 3 + 1] = 8 + ((index * 23) % 34);
        positions[index * 3 + 2] = ((index * 31) % 89) - 44;
      } else if (this.theme === "underworld-forge") {
        const angle = index * 2.39996;
        const radius = 7 + (index % 29) * 0.72;
        positions[index * 3] = Math.cos(angle) * radius;
        positions[index * 3 + 1] = 4 + ((index * 13) % 19);
        positions[index * 3 + 2] = Math.sin(angle) * radius;
      } else {
        const angle = index * 2.39996;
        const radius = 44 + (index % 35) * 0.9;
        positions[index * 3] = Math.cos(angle) * radius;
        positions[index * 3 + 1] = 16 + ((index * 17) % 48);
        positions[index * 3 + 2] = Math.sin(angle) * radius;
      }
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const material = new THREE.PointsMaterial({
      color: this.theme === "underworld-forge" ? this.palette.sun : this.palette.grid,
      size: this.theme === "underworld-forge" ? 0.2 : this.theme === "astral-covenant" ? 0.18 : 0.12,
      transparent: true,
      opacity: 0.78,
      depthWrite: false,
    });
    return new THREE.Points(geometry, material);
  }

  private createWater() {
    const geometry = new THREE.PlaneGeometry(52, 52, 1, 1);
    const material = new THREE.MeshStandardMaterial({
      color: this.palette.water,
      emissive: this.theme === "underworld-forge" ? this.palette.water : 0x000000,
      emissiveIntensity: this.theme === "underworld-forge" ? 0.45 : 0,
      transparent: true,
      opacity: this.theme === "astral-covenant" ? 0.2 : 0.48,
      roughness: 0.22,
      metalness: 0.22,
      depthWrite: false,
    });
    const water = new THREE.Mesh(geometry, material);
    water.rotation.x = -Math.PI / 2;
    water.position.y = 2.35;
    return water;
  }

  private findHighestVoxel(x: number, z: number) {
    let highest = 0;
    for (const key of this.world.blocks.keys()) {
      const [blockX, blockY, blockZ] = key.split(",").map(Number);
      if (blockX === x && blockZ === z) highest = Math.max(highest, blockY ?? 0);
    }
    return highest;
  }

  private setStartPosition() {
    const [spawnX, spawnZ] = this.layout.spawn;
    const [lookX, lookZ] = this.layout.lookAt;
    const startY = this.findHighestVoxel(Math.round(spawnX), Math.round(spawnZ)) + 4.5;
    const lookY = Math.min(startY - 1, this.findHighestVoxel(Math.round(lookX), Math.round(lookZ)) + 2.5);
    this.camera.position.set(spawnX, startY, spawnZ);
    this.camera.lookAt(lookX, Math.max(3, lookY), lookZ);
  }

  private disposeLandmarkVisuals() {
    this.landmarkGroup.clear();
    this.landmarkVisuals.length = 0;
    this.landmarkGeometries.splice(0).forEach((geometry) => geometry.dispose());
    this.landmarkMaterials.splice(0).forEach((material) => material.dispose());
  }

  private createLandmarkVisuals() {
    this.disposeLandmarkVisuals();
    const accent = new THREE.MeshBasicMaterial({
      color: this.palette.grid,
      transparent: true,
      opacity: 0.72,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const secondary = new THREE.MeshBasicMaterial({
      color: this.palette.sun,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const beamGeometry = new THREE.BoxGeometry(0.14, 6, 0.14);
    const ringGeometry = new THREE.TorusGeometry(2.15, 0.08, 6, 36);
    const smallRingGeometry = new THREE.TorusGeometry(1.25, 0.07, 5, 28);
    const coreGeometry = this.theme === "underworld-forge"
      ? new THREE.ConeGeometry(0.62, 1.8, 4)
      : new THREE.OctahedronGeometry(0.72, 0);
    this.landmarkMaterials.push(accent, secondary);
    this.landmarkGeometries.push(beamGeometry, ringGeometry, smallRingGeometry, coreGeometry);

    this.layout.landmarks.forEach((landmark, index) => {
      const group = new THREE.Group();
      const baseY = this.findHighestVoxel(landmark.x, landmark.z) + 1.35;
      const phase = index * 0.83;
      group.position.set(landmark.x, baseY, landmark.z);
      group.userData.exhibitId = landmark.id;

      const core = new THREE.Mesh(coreGeometry, secondary);
      core.name = "core";
      core.position.y = 1.1;
      group.add(core);

      const orbitA = new THREE.Mesh(ringGeometry, accent);
      orbitA.name = "orbit-a";
      const orbitB = new THREE.Mesh(smallRingGeometry, secondary);
      orbitB.name = "orbit-b";

      if (this.theme === "neon-district") {
        const beam = new THREE.Mesh(beamGeometry, accent);
        beam.name = "beam";
        beam.position.y = 3;
        orbitA.rotation.x = Math.PI / 2;
        orbitA.position.y = 0.45;
        orbitB.rotation.x = Math.PI / 2;
        orbitB.position.y = 2.2;
        group.add(beam, orbitA, orbitB);
      } else if (this.theme === "underworld-forge") {
        orbitA.rotation.y = Math.PI / 2;
        orbitA.position.y = 1.25;
        orbitB.rotation.x = Math.PI / 2;
        orbitB.position.y = 0.35;
        group.add(orbitA, orbitB);
      } else {
        orbitA.rotation.x = Math.PI / 2.8;
        orbitA.position.y = 1.05;
        orbitB.rotation.z = Math.PI / 2.4;
        orbitB.position.y = 1.05;
        group.add(orbitA, orbitB);
      }

      this.landmarkVisuals.push({ id: landmark.id, group, core, orbitA, orbitB, baseY, phase });
      this.landmarkGroup.add(group);
    });
  }

  private updateLandmarks(now: number, delta: number) {
    for (const landmark of this.landmarkVisuals) {
      const pulse = (Math.sin(now * 0.002 + landmark.phase) + 1) / 2;
      const focused = landmark.id === this.focusedLandmarkId;
      const scale = (focused ? 1.18 : 1) + pulse * 0.035;
      landmark.group.scale.setScalar(scale);
      landmark.group.position.y = landmark.baseY + Math.sin(now * 0.0014 + landmark.phase) * (this.theme === "astral-covenant" ? 0.32 : 0.1);
      landmark.core.rotation.y += delta * (this.theme === "underworld-forge" ? 0.9 : 1.8);
      landmark.orbitA.rotation.z += delta * (this.theme === "neon-district" ? 1.4 : 0.45);
      landmark.orbitB.rotation.y -= delta * (this.theme === "astral-covenant" ? 1.15 : 0.7);
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
      if (y === 0) return;
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
    const movement = this.movementForCode(event.code);
    if (movement) {
      event.preventDefault();
      this.movement.add(movement);
    }
    if (/^Digit[1-5]$/.test(event.code)) this.selectBlock(Number(event.code.slice(-1)) - 1);
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

  private updateMovement(delta: number) {
    if (!this.active) return;
    const speed = 8.5 * delta;
    const forward = new THREE.Vector3();
    this.camera.getWorldDirection(forward);
    forward.y = 0;
    forward.normalize();
    const right = new THREE.Vector3(-forward.z, 0, forward.x);
    if (this.movement.has("forward")) this.camera.position.addScaledVector(forward, speed);
    if (this.movement.has("backward")) this.camera.position.addScaledVector(forward, -speed);
    if (this.movement.has("right")) this.camera.position.addScaledVector(right, speed);
    if (this.movement.has("left")) this.camera.position.addScaledVector(right, -speed);
    if (this.movement.has("up")) this.camera.position.y += speed;
    if (this.movement.has("down")) this.camera.position.y -= speed;
    this.camera.position.x = THREE.MathUtils.clamp(this.camera.position.x, -34, 34);
    this.camera.position.y = THREE.MathUtils.clamp(this.camera.position.y, 1.25, 38);
    this.camera.position.z = THREE.MathUtils.clamp(this.camera.position.z, -34, 34);
  }

  private updateAtmosphere(delta: number) {
    this.cycle = (this.cycle + delta / 150) % 1;
    const daylight = THREE.MathUtils.clamp((Math.sin(this.cycle * Math.PI * 2 - Math.PI / 2) + 1) / 2, 0.08, 1);
    const sky = new THREE.Color(this.palette.skyNight).lerp(new THREE.Color(this.palette.skyDay), daylight);
    const fog = new THREE.Color(this.palette.fogNight).lerp(new THREE.Color(this.palette.fogDay), daylight);
    this.renderer.setClearColor(sky, 1);
    if (this.scene.fog instanceof THREE.Fog) this.scene.fog.color.copy(fog);
    this.ambientLight.intensity = 0.35 + daylight * 0.85;
    this.sunLight.intensity = 0.22 + daylight * 1.6;
    (this.stars.material as THREE.PointsMaterial).opacity = 0.18 + (1 - daylight) * 0.82;
    const atmosphereSpeed = this.theme === "neon-district" ? 0.028 : this.theme === "underworld-forge" ? 0.008 : 0.018;
    this.stars.rotation.y += delta * atmosphereSpeed;
    this.stars.position.y = this.theme === "underworld-forge" ? Math.sin(performance.now() * 0.00035) * 0.7 : 0;
    this.water.position.y = 2.35 + Math.sin(performance.now() * (this.theme === "underworld-forge" ? 0.0011 : 0.00055)) * 0.05;
  }

  private animate = (now: number) => {
    const delta = Math.min(0.05, Math.max(0, (now - this.previousFrame) / 1_000));
    this.previousFrame = now;
    this.updateMovement(delta);
    this.updateAtmosphere(delta);
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
      cycle: Math.sin(this.cycle * Math.PI * 2 - Math.PI / 2) > -0.15 ? "day" : "night",
      landmarkDistance: this.focusedLandmarkDistance,
      landmarkId: this.focusedLandmarkId,
      position: [this.camera.position.x, this.camera.position.y, this.camera.position.z],
      selectedIndex: this.selectedIndex,
      shards: this.world.shards,
      target: this.target?.kind ?? null,
    });
  }

  enter() {
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

  setMovement(direction: VoxelMovement, pressed: boolean) {
    if (pressed) this.movement.add(direction);
    else this.movement.delete(direction);
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
    const approachX = Math.round(landmark.x * 0.66);
    const approachZ = Math.round(landmark.z * 0.66);
    const approachY = this.findHighestVoxel(approachX, approachZ) + 3.8;
    const targetY = this.findHighestVoxel(landmark.x, landmark.z) + 1.8;
    this.camera.position.set(approachX, approachY, approachZ);
    this.camera.lookAt(landmark.x, Math.min(targetY, approachY + 2), landmark.z);
    this.updateLandmarkFocus();
    this.emitState(true);
  }

  reset(seed: number) {
    this.world = createVoxelWorld(this.theme, seed);
    this.target = null;
    this.rebuildWorld();
    this.createLandmarkVisuals();
    this.setStartPosition();
    this.updateLandmarkFocus();
    const snapshot = this.getSnapshot();
    this.onWorldChange(snapshot);
    this.emitState(true);
  }

  getSnapshot() {
    return createVoxelSnapshot(this.world, this.theme);
  }

  destroy() {
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
    this.water.geometry.dispose();
    this.water.material.dispose();
    this.disposeLandmarkVisuals();
    this.renderer.dispose();
    this.renderer.domElement.remove();
  }
}
