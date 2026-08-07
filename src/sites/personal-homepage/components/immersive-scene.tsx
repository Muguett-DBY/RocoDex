"use client";

import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { Bloom, ChromaticAberration, EffectComposer, Noise } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

type NumberRef = { current: number };
type PointerRef = { current: { x: number; y: number } };

export type PersonalImmersiveSceneProps = {
  progressRef: NumberRef;
  pointerRef: PointerRef;
  impulseRef: NumberRef;
  reducedMotion: boolean;
  active: boolean;
  showArchive: boolean;
};

type SceneQuality = "full" | "lite";

const softwareRendererPattern = /swiftshader|llvmpipe|software rasterizer|softpipe/i;

function getSceneQuality(renderer: THREE.WebGLRenderer): SceneQuality {
  const context = renderer.getContext();
  const debugInfo = context.getExtension("WEBGL_debug_renderer_info") as {
    UNMASKED_RENDERER_WEBGL: number;
  } | null;
  const rendererName = String(
    context.getParameter(debugInfo?.UNMASKED_RENDERER_WEBGL ?? context.RENDERER),
  );

  const device = navigator as Navigator & { deviceMemory?: number };
  const constrainedDevice =
    (device.hardwareConcurrency ?? 8) <= 4 ||
    (device.deviceMemory ?? 8) <= 4;

  return softwareRendererPattern.test(rendererName) || constrainedDevice ? "lite" : "full";
}

const archiveTextures = [
  "/cstd-archive/cstd-archive-resin-circuit-v1.webp",
  "/cstd-archive/cstd-archive-data-film-v1.webp",
  "/cstd-archive/cstd-archive-notebook-v1.webp",
  "/cstd-archive/cstd-archive-cobalt-modules-v1.webp",
  "/cstd-archive/cstd-archive-studio-v1.webp",
] as const;

const projectTextures = [
  "/cstd-projects/rocodex.png",
  "/cstd-projects/alpha.png",
  "/cstd-projects/crm.png",
] as const;

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  uniform float uTime;
  uniform float uProgress;
  uniform vec2 uPointer;
  uniform float uImpulse;

  void main() {
    vUv = uv;
    vec3 transformed = position;
    float pointerDistance = distance(uv, uPointer * 0.5 + 0.5);
    float pointerWave = exp(-pointerDistance * 7.0) * (0.08 + uImpulse * 0.16);
    transformed.z += sin(uv.x * 10.0 + uv.y * 8.0 + uTime * 0.42) * 0.055;
    transformed.z += sin(pointerDistance * 32.0 - uTime * 2.8) * pointerWave;
    transformed.x += sin(uv.y * 5.0 + uTime * 0.18) * 0.025 * (1.0 - uProgress * 0.45);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  varying vec2 vUv;
  uniform sampler2D uTextureA;
  uniform sampler2D uTextureB;
  uniform float uTime;
  uniform float uProgress;
  uniform vec2 uPointer;
  uniform float uImpulse;

  float ease(float value) {
    return value * value * (3.0 - 2.0 * value);
  }

  void main() {
    vec2 pointerUv = uPointer * 0.5 + 0.5;
    vec2 delta = vUv - pointerUv;
    float distanceToPointer = length(delta);
    float field = exp(-distanceToPointer * 8.0);
    float ripple = sin(distanceToPointer * 48.0 - uTime * 3.2) * field;
    vec2 direction = normalize(delta + vec2(0.0001));

    vec2 warpedUv = vUv;
    warpedUv += direction * ripple * (0.006 + uImpulse * 0.022);
    warpedUv.x += sin(vUv.y * 11.0 + uTime * 0.28) * 0.0025;
    warpedUv.y += cos(vUv.x * 9.0 - uTime * 0.22) * 0.002;

    float chapterBlend = ease(smoothstep(0.16, 0.43, uProgress));
    chapterBlend *= 1.0 - smoothstep(0.82, 1.0, uProgress) * 0.42;
    float split = 0.002 + field * (0.004 + uImpulse * 0.007);

    vec3 textureA;
    textureA.r = texture2D(uTextureA, warpedUv + direction * split).r;
    textureA.g = texture2D(uTextureA, warpedUv).g;
    textureA.b = texture2D(uTextureA, warpedUv - direction * split).b;

    vec3 textureB;
    textureB.r = texture2D(uTextureB, warpedUv - direction * split).r;
    textureB.g = texture2D(uTextureB, warpedUv).g;
    textureB.b = texture2D(uTextureB, warpedUv + direction * split).b;

    vec3 color = mix(textureA, textureB, chapterBlend);
    float edge = smoothstep(0.88, 0.2, distance(vUv, vec2(0.5)));
    color *= 0.55 + edge * 0.45;
    color += field * vec3(0.18, 0.12, 0.03) * (0.28 + uImpulse * 0.7);
    gl_FragColor = vec4(color, 1.0);
  }
`;

function seeded(index: number) {
  const value = Math.sin(index * 127.1 + 311.7) * 43758.5453123;
  return value - Math.floor(value);
}

function BackgroundField({
  progressRef,
  pointerRef,
  impulseRef,
  reducedMotion,
  quality,
}: PersonalImmersiveSceneProps & { quality: SceneQuality }) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const pointerTarget = useMemo(() => new THREE.Vector2(), []);
  const [studioTexture, loomTexture] = useLoader(THREE.TextureLoader, [
    "/cstd-world/cstd-kinetic-studio-v2.webp",
    "/cstd-world/cstd-data-loom-v2.webp",
  ]);

  useEffect(() => {
    for (const texture of [studioTexture, loomTexture]) {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = 8;
    }
  }, [loomTexture, studioTexture]);

  const uniforms = useMemo(
    () => ({
      uTextureA: { value: studioTexture },
      uTextureB: { value: loomTexture },
      uTime: { value: 0 },
      uProgress: { value: 0 },
      uPointer: { value: new THREE.Vector2() },
      uImpulse: { value: 0 },
    }),
    [loomTexture, studioTexture],
  );

  useFrame(({ clock }, delta) => {
    const material = materialRef.current;
    if (!material) return;
    if (reducedMotion) {
      material.uniforms.uTime.value = 0;
      material.uniforms.uProgress.value = progressRef.current;
      material.uniforms.uPointer.value.set(0, 0);
      material.uniforms.uImpulse.value = 0;
      return;
    }
    material.uniforms.uTime.value = clock.elapsedTime;
    material.uniforms.uProgress.value = THREE.MathUtils.lerp(
      material.uniforms.uProgress.value,
      progressRef.current,
      1 - Math.exp(-delta * 4.5),
    );
    pointerTarget.set(pointerRef.current.x, pointerRef.current.y);
    material.uniforms.uPointer.value.lerp(pointerTarget, 1 - Math.exp(-delta * 7));
    material.uniforms.uImpulse.value = impulseRef.current;
  });

  return (
    <mesh position={[0, 0, -7.5]} scale={[22, 12.4, 1]}>
      <planeGeometry args={[1, 1, quality === "lite" ? 12 : 48, quality === "lite" ? 8 : 28]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        toneMapped={false}
      />
    </mesh>
  );
}

function ParticleCurrent({
  progressRef,
  pointerRef,
  reducedMotion,
  quality,
}: Omit<PersonalImmersiveSceneProps, "impulseRef" | "active" | "showArchive"> & { quality: SceneQuality }) {
  const pointsRef = useRef<THREE.Points>(null);
  const count = quality === "lite" ? 280 : 950;
  const { positions, colors } = useMemo(() => {
    const pointPositions = new Float32Array(count * 3);
    const pointColors = new Float32Array(count * 3);
    const palette = [new THREE.Color("#f5efe1"), new THREE.Color("#ff2a6d"), new THREE.Color("#2d6fae")];

    for (let index = 0; index < count; index += 1) {
      const radius = 2.2 + seeded(index * 3) * 6.8;
      const angle = seeded(index * 5) * Math.PI * 2;
      const strand = (seeded(index * 7) - 0.5) * 2.4;
      pointPositions[index * 3] = Math.cos(angle) * radius;
      pointPositions[index * 3 + 1] = Math.sin(angle * 1.7) * (1.2 + radius * 0.22) + strand;
      pointPositions[index * 3 + 2] = (seeded(index * 11) - 0.5) * 8;

      const color = palette[index % palette.length];
      pointColors[index * 3] = color.r;
      pointColors[index * 3 + 1] = color.g;
      pointColors[index * 3 + 2] = color.b;
    }

    return { positions: pointPositions, colors: pointColors };
  }, [count]);

  useFrame(({ clock }, delta) => {
    const points = pointsRef.current;
    if (!points) return;
    if (reducedMotion) {
      points.rotation.set(0, 0, 0);
      points.position.y = 0;
      return;
    }
    const targetRotation = progressRef.current * Math.PI * 1.35 + pointerRef.current.x * 0.12;
    points.rotation.z = THREE.MathUtils.lerp(points.rotation.z, targetRotation, 1 - Math.exp(-delta * 1.8));
    points.rotation.y = THREE.MathUtils.lerp(points.rotation.y, pointerRef.current.x * 0.18, 1 - Math.exp(-delta * 3));
    points.position.y = THREE.MathUtils.lerp(points.position.y, pointerRef.current.y * 0.2, 1 - Math.exp(-delta * 3));
    points.rotation.x = Math.sin(clock.elapsedTime * 0.12) * 0.12;
  });

  return (
    <points ref={pointsRef} position={[0, 0, -1.6]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.032}
        sizeAttenuation
        transparent
        opacity={0.72}
        vertexColors
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function ArchiveSpine({
  progressRef,
  pointerRef,
  impulseRef,
  reducedMotion,
  quality,
}: PersonalImmersiveSceneProps & { quality: SceneQuality }) {
  const groupRef = useRef<THREE.Group>(null);
  const geometry = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-6.8, -2.8, 0.2),
      new THREE.Vector3(-3.5, -1.1, 0.8),
      new THREE.Vector3(-0.9, 1.0, -0.5),
      new THREE.Vector3(1.4, 0.4, 0.7),
      new THREE.Vector3(3.4, -1.0, -0.2),
      new THREE.Vector3(6.8, 2.4, 0.5),
    ]);
    return new THREE.TubeGeometry(
      curve,
      quality === "lite" ? 96 : 260,
      0.105,
      quality === "lite" ? 8 : 12,
      false,
    );
  }, [quality]);

  useFrame(({ clock }, delta) => {
    const group = groupRef.current;
    if (!group) return;
    const progress = progressRef.current;
    const impulse = impulseRef.current;
    const scale = 1 + impulse * 0.12 + Math.sin(progress * Math.PI) * 0.08;
    if (reducedMotion) {
      group.rotation.set(0, 0, -0.16 + progress * 0.72);
      group.scale.setScalar(scale);
      group.position.y = 0;
      impulseRef.current = 0;
      return;
    }
    group.rotation.z = THREE.MathUtils.lerp(
      group.rotation.z,
      -0.16 + progress * 0.72 + pointerRef.current.x * 0.08,
      1 - Math.exp(-delta * 2.8),
    );
    group.rotation.y = THREE.MathUtils.lerp(group.rotation.y, pointerRef.current.x * 0.11, 1 - Math.exp(-delta * 4));
    const nextScale = THREE.MathUtils.lerp(group.scale.x, scale, 1 - Math.exp(-delta * 5));
    group.scale.setScalar(nextScale);
    group.position.y = Math.sin(clock.elapsedTime * 0.32) * 0.08;
  });

  return (
    <group ref={groupRef} position={[0, -0.15, -0.45]}>
      <mesh geometry={geometry}>
        <meshPhysicalMaterial
          color="#ff2a6d"
          emissive="#7a4300"
          emissiveIntensity={0.78}
          roughness={0.18}
          metalness={0.24}
          transmission={0.28}
          thickness={0.7}
          transparent
          opacity={0.9}
        />
      </mesh>
      <mesh geometry={geometry} scale={0.48} position={[0, 0.18, -0.2]}>
        <meshStandardMaterial
          color="#05d9e8"
          emissive="#2a1a5e"
          emissiveIntensity={0.8}
          roughness={0.24}
          metalness={0.42}
        />
      </mesh>
    </group>
  );
}

type FloatingPanelProps = {
  texture: THREE.Texture;
  index: number;
  progressRef: NumberRef;
  pointerRef: PointerRef;
  project?: boolean;
  reducedMotion: boolean;
};

function FloatingPanel({
  texture,
  index,
  progressRef,
  pointerRef,
  project = false,
  reducedMotion,
}: FloatingPanelProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);

  useFrame(({ clock }, delta) => {
    const mesh = meshRef.current;
    const material = materialRef.current;
    if (!mesh || !material) return;
    const progress = progressRef.current;
    const chapter = project
      ? THREE.MathUtils.smoothstep(progress, 0.48, 0.74) * (1 - THREE.MathUtils.smoothstep(progress, 0.84, 1))
      : 1 - THREE.MathUtils.smoothstep(progress, 0.25, 0.5);
    const baseX = project ? (index - 1) * 2.7 : (index - 2) * 1.42;
    const wave = reducedMotion ? 0 : Math.sin(clock.elapsedTime * 0.38 + index * 1.4) * 0.1;
    const targetZ = project ? 0.35 + Math.abs(index - 1) * -0.55 : 0.5 - Math.abs(index - 2) * 0.42;
    const targetX = baseX + (reducedMotion ? 0 : pointerRef.current.x * (0.12 + index * 0.018));
    const targetY =
      (project ? (index - 1) * -0.2 : Math.sin(index * 1.8) * 0.58) +
      wave +
      (reducedMotion ? 0 : pointerRef.current.y * 0.12);
    const targetRotationY = (index - (project ? 1 : 2)) * -0.1 + (reducedMotion ? 0 : pointerRef.current.x * 0.06);
    const targetRotationZ = (index - 2) * 0.025;
    const targetOpacity = Math.max(0, chapter) * (project ? 0.88 : 0.76);
    const targetScale = (project ? 1.32 : 1) * (0.84 + chapter * 0.16);

    if (reducedMotion) {
      mesh.position.set(targetX, targetY, targetZ);
      mesh.rotation.set(0, targetRotationY, targetRotationZ);
      mesh.scale.setScalar(targetScale);
      material.opacity = targetOpacity;
      return;
    }

    mesh.position.x = THREE.MathUtils.lerp(mesh.position.x, targetX, 1 - Math.exp(-delta * 3));
    mesh.position.y = THREE.MathUtils.lerp(
      mesh.position.y,
      targetY,
      1 - Math.exp(-delta * 3),
    );
    mesh.position.z = THREE.MathUtils.lerp(mesh.position.z, targetZ, 1 - Math.exp(-delta * 3));
    mesh.rotation.y = THREE.MathUtils.lerp(mesh.rotation.y, targetRotationY, 1 - Math.exp(-delta * 3));
    mesh.rotation.z = THREE.MathUtils.lerp(mesh.rotation.z, targetRotationZ, 1 - Math.exp(-delta * 3));
    material.opacity = THREE.MathUtils.lerp(material.opacity, targetOpacity, 1 - Math.exp(-delta * 4));
    const scale = THREE.MathUtils.lerp(mesh.scale.x, targetScale, 1 - Math.exp(-delta * 3));
    mesh.scale.setScalar(scale);
  });

  return (
    <mesh ref={meshRef} position={[0, 0, project ? -1 : 0.2]}>
      <planeGeometry args={project ? [2.25, 1.35, 1, 1] : [1.2, 1.8, 1, 1]} />
      <meshBasicMaterial ref={materialRef} map={texture} transparent opacity={0} toneMapped={false} />
    </mesh>
  );
}

function FloatingArchives({
  progressRef,
  pointerRef,
  quality,
  reducedMotion,
}: Pick<PersonalImmersiveSceneProps, "progressRef" | "pointerRef" | "reducedMotion"> & {
  quality: SceneQuality;
}) {
  const archives = useLoader(THREE.TextureLoader, [...archiveTextures]);
  const projects = useLoader(THREE.TextureLoader, [...projectTextures]);

  useEffect(() => {
    for (const texture of [...archives, ...projects]) {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = 8;
    }
  }, [archives, projects]);

  return (
    <group position={[0, 0, 0.8]}>
      {archives.map((texture, index) =>
        quality === "lite" && index % 2 === 1 ? null : (
          <FloatingPanel
            key={archiveTextures[index]}
            texture={texture}
            index={index}
            progressRef={progressRef}
            pointerRef={pointerRef}
            reducedMotion={reducedMotion}
          />
        ),
      )}
      {projects.map((texture, index) => (
        <FloatingPanel
          key={projectTextures[index]}
          texture={texture}
          index={index}
          progressRef={progressRef}
          pointerRef={pointerRef}
          project
          reducedMotion={reducedMotion}
        />
      ))}
    </group>
  );
}

function ProgressiveArchiveLayer(
  props: Pick<PersonalImmersiveSceneProps, "progressRef" | "pointerRef" | "reducedMotion"> & {
    quality: SceneQuality;
  },
) {
  return (
    <Suspense fallback={null}>
      <FloatingArchives {...props} />
    </Suspense>
  );
}

function CameraRig({ progressRef, pointerRef, impulseRef, reducedMotion }: PersonalImmersiveSceneProps) {
  useFrame(({ camera, clock }, delta) => {
    const progress = progressRef.current;
    const pointer = pointerRef.current;
    const easedPointer = reducedMotion ? { x: 0, y: 0 } : pointer;
    const targetX = Math.sin(progress * Math.PI * 1.7) * 0.42 + easedPointer.x * 0.32;
    const targetY = Math.cos(progress * Math.PI * 1.2) * 0.2 + easedPointer.y * 0.2;
    const targetZ = 7.2 - Math.sin(progress * Math.PI) * 0.7 - impulseRef.current * 0.16;
    if (reducedMotion) {
      camera.position.set(targetX, targetY, targetZ);
      camera.rotation.z = 0;
      camera.lookAt(0, 0, -0.2);
      impulseRef.current = 0;
      return;
    }
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, 1 - Math.exp(-delta * 3.5));
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 1 - Math.exp(-delta * 3.5));
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 1 - Math.exp(-delta * 3.5));
    camera.rotation.z = Math.sin(clock.elapsedTime * 0.18) * 0.004;
    camera.lookAt(0, 0, -0.2);
    impulseRef.current = THREE.MathUtils.lerp(impulseRef.current, 0, 1 - Math.exp(-delta * 4.8));
  });
  return null;
}

function SceneReady({
  onReady,
  quality,
}: {
  onReady: (quality: SceneQuality) => void;
  quality: SceneQuality;
}) {
  useEffect(() => {
    let secondFrame = 0;
    const firstFrame = window.requestAnimationFrame(() => {
      secondFrame = window.requestAnimationFrame(() => onReady(quality));
    });

    return () => {
      window.cancelAnimationFrame(firstFrame);
      window.cancelAnimationFrame(secondFrame);
    };
  }, [onReady, quality]);

  return null;
}

function World(
  props: PersonalImmersiveSceneProps & {
    onReady: (quality: SceneQuality) => void;
    quality: SceneQuality;
  },
) {
  const chromaticOffset = useMemo(() => new THREE.Vector2(0.00055, 0.0004), []);
  const advance = useThree((state) => state.advance);

  // quality / reducedMotion 切换（如进入 calm）时同步渲染一帧，
  // 避免切换后的 invalidate 渲染依赖 rAF 时序（截图窗口内迟到渲染导致帧对比不稳定）
  useEffect(() => {
    advance(Date.now());
  }, [props.quality, props.reducedMotion, advance]);

  return (
    <>
      <color attach="background" args={["#090a08"]} />
      <ambientLight intensity={0.75} />
      <directionalLight position={[4, 6, 5]} intensity={2.4} color="#fff4db" />
      <pointLight position={[-4, -2, 3]} intensity={10} distance={10} color="#05d9e8" />
      <BackgroundField {...props} />
      <ParticleCurrent
        progressRef={props.progressRef}
        pointerRef={props.pointerRef}
        reducedMotion={props.reducedMotion}
        quality={props.quality}
      />
      <ArchiveSpine {...props} />
      {props.showArchive ? (
        <ProgressiveArchiveLayer
          progressRef={props.progressRef}
          pointerRef={props.pointerRef}
          reducedMotion={props.reducedMotion}
          quality={props.quality}
        />
      ) : null}
      <SceneReady onReady={props.onReady} quality={props.quality} />
      <CameraRig {...props} />
      {props.quality === "full" ? (
        <EffectComposer multisampling={0}>
          <Bloom intensity={0.5} luminanceThreshold={0.72} luminanceSmoothing={0.32} mipmapBlur />
          <ChromaticAberration offset={chromaticOffset} radialModulation modulationOffset={0.35} />
          <Noise opacity={0.015} blendFunction={BlendFunction.SOFT_LIGHT} />
        </EffectComposer>
      ) : null}
    </>
  );
}

export function PersonalImmersiveScene(props: PersonalImmersiveSceneProps) {
  const [detectedQuality, setDetectedQuality] = useState<SceneQuality>("lite");
  const [readyQuality, setReadyQuality] = useState<SceneQuality | null>(null);
  const [contextLost, setContextLost] = useState(false);
  const [autoLite, setAutoLite] = useState(false);
  const quality: SceneQuality =
    props.reducedMotion || autoLite ? "lite" : detectedQuality;
  const markSceneReady = useCallback((renderedQuality: SceneQuality) => setReadyQuality(renderedQuality), []);
  const renderReady = contextLost ? "fallback" : readyQuality === quality ? "true" : "false";

  // 帧率自适应降级：全效模式下持续 2 秒低于 35fps → 自动切 lite
  // （低端 GPU / 高分屏用户保流畅；降级后保持，不抖动）
  useEffect(() => {
    if (props.reducedMotion || detectedQuality === "lite" || autoLite) return;

    let frames = 0;
    let last = performance.now();
    let lowSeconds = 0;
    let rafId = 0;

    const loop = (now: number) => {
      frames += 1;
      const elapsed = now - last;
      if (elapsed >= 1000) {
        const fps = (frames * 1000) / elapsed;
        frames = 0;
        last = now;
        if (fps < 35) {
          lowSeconds += 1;
          if (lowSeconds >= 2) {
            setAutoLite(true);
            return;
          }
        } else {
          lowSeconds = 0;
        }
      }
      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, [props.reducedMotion, detectedQuality, autoLite]);

  return (
    <div
      data-cstd-webgl
      data-cstd-render-quality={quality}
      data-cstd-render-ready={renderReady}
      data-cstd-render-fallback={contextLost ? "true" : "false"}
      data-cstd-render-active={props.active ? "true" : "false"}
      className="absolute inset-0"
    >
      {contextLost ? null : (
        <Canvas
          data-cstd-webgl-canvas
          camera={{ position: [0, 0, 7.2], fov: 42, near: 0.1, far: 40 }}
          dpr={quality === "full" ? [1, 1.25] : 1}
          gl={{ antialias: true, alpha: false, powerPreference: "high-performance", preserveDrawingBuffer: true }}
          frameloop={props.active && quality === "full" ? "always" : "demand"}
          onCreated={({ gl }) => {
            gl.outputColorSpace = THREE.SRGBColorSpace;
            gl.toneMapping = THREE.ACESFilmicToneMapping;
            gl.toneMappingExposure = 1.06;
            gl.domElement.addEventListener("webglcontextlost", (event) => {
              event.preventDefault();
              setReadyQuality(null);
              setContextLost(true);
            }, { once: true });
            setDetectedQuality(getSceneQuality(gl));
          }}
        >
          <Suspense fallback={null}>
            <World {...props} quality={quality} onReady={markSceneReady} />
          </Suspense>
        </Canvas>
      )}
    </div>
  );
}
