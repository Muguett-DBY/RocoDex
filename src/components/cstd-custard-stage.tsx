"use client";

import { useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import * as THREE from "three";
import { canUseCstdWebgl } from "@/lib/cstd-webgl";
import { getCstdPointerTilt } from "@/lib/cstd-motion";
import { playCstdPokeSound } from "@/lib/cstd-intro-sound";
import { cstdMascotShellClassName } from "@/lib/cstd-mobile-layout";

type MascotMood = "curious" | "happy" | "working";

type PointerState = {
  x: number;
  y: number;
  glowX: number;
  glowY: number;
};

const neutralPointer: PointerState = {
  x: 0,
  y: 0,
  glowX: 50,
  glowY: 50,
};

export function CstdCustardStage({
  audioEnabled = true,
  mascotCopy,
  mascotMood,
  motionDisabled,
  onMoodChange,
  onPoke,
}: {
  audioEnabled?: boolean;
  mascotCopy: string;
  mascotMood: MascotMood;
  motionDisabled: boolean;
  onMoodChange: (mood: MascotMood) => void;
  onPoke: () => void;
}) {
  const [webglSupported] = useState(canUseCstdWebgl);
  const [pointer, setPointer] = useState<PointerState>(neutralPointer);
  const [clickPulse, setClickPulse] = useState(0);

  function handlePointerMove(event: ReactPointerEvent<HTMLButtonElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const tilt = getCstdPointerTilt({
      clientX: event.clientX,
      clientY: event.clientY,
      rectLeft: rect.left,
      rectTop: rect.top,
      rectWidth: rect.width,
      rectHeight: rect.height,
    });
    setPointer({ x: tilt.x, y: tilt.y, glowX: tilt.glowX, glowY: tilt.glowY });
  }

  function handlePointerLeave() {
    setPointer(neutralPointer);
    onMoodChange("curious");
  }

  function handlePoke() {
    setClickPulse((value) => value + 1);
    if (audioEnabled) void playCstdPokeSound();
    onPoke();
  }

  return (
    <button
      type="button"
      onClick={handlePoke}
      onPointerEnter={() => onMoodChange("working")}
      onPointerLeave={handlePointerLeave}
      onPointerMove={handlePointerMove}
      className={`${cstdMascotShellClassName} isolate`}
      aria-label="点击奶黄包互动"
    >
      <span
        aria-hidden="true"
        className="absolute inset-0 opacity-90 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at ${pointer.glowX}% ${pointer.glowY}%, rgba(255,255,255,.98), rgba(255,239,197,.58) 25%, transparent 64%)`,
        }}
      />
      <span
        aria-hidden="true"
        className="absolute inset-x-7 bottom-8 h-16 rounded-full bg-[#d98528]/20 blur-2xl"
        style={{ transform: `translate(${pointer.x * 10}px, ${pointer.y * 6}px)` }}
      />
      <span
        aria-hidden="true"
        className="absolute inset-7 rounded-[2rem] border border-[#f6bf3f]/35 opacity-70"
        style={{ transform: `rotate(${pointer.x * 4}deg) scale(${1 + Math.abs(pointer.y) * 0.025})` }}
      />
      <span
        aria-hidden="true"
        className="absolute inset-14 rounded-full border border-dashed border-[#d98528]/35 opacity-70"
        style={{ transform: `rotate(${18 + pointer.x * -8}deg)` }}
      />
      <span
        aria-hidden="true"
        className="absolute left-[16%] top-[16%] h-20 w-2 rotate-[-28deg] rounded-full bg-white/45 blur-sm"
        style={{ transform: `translate(${pointer.x * 8}px, ${pointer.y * 8}px) rotate(-28deg)` }}
      />
      <motion.span
        aria-hidden="true"
        className="absolute inset-y-8 left-[-28%] w-1/3 skew-x-[-18deg] bg-white/35 blur-sm"
        animate={motionDisabled ? undefined : { x: ["0%", "450%"] }}
        transition={{ repeat: Infinity, repeatDelay: 2.4, duration: 1.15, ease: "easeInOut" }}
      />
      <AnimatePresence>{clickPulse > 0 ? <PokeBurst key={clickPulse} /> : null}</AnimatePresence>

      <span className="relative z-10 block h-[238px] w-[230px] sm:h-[306px] sm:w-[300px] lg:h-[416px] lg:w-[400px]">
        {webglSupported ? (
          <Canvas
            camera={{ position: [0, 0.35, 5.8], fov: 34 }}
            dpr={[1, 2]}
            gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
          >
            <CustardScene clickPulse={clickPulse} motionDisabled={motionDisabled} mood={mascotMood} pointer={pointer} />
          </Canvas>
        ) : (
          <CustardFallback mood={mascotMood} pointer={pointer} />
        )}
      </span>

      <span className="relative z-10 mt-1 rounded-full border border-[#ead6ad] bg-[#fffaf0]/92 px-3 py-1.5 text-[0.66rem] font-black text-[#7b6656] shadow-sm sm:px-4 sm:py-2 sm:text-xs">
        {mascotCopy}
      </span>
    </button>
  );
}

function CustardScene({
  clickPulse,
  motionDisabled,
  mood,
  pointer,
}: {
  clickPulse: number;
  motionDisabled: boolean;
  mood: MascotMood;
  pointer: PointerState;
}) {
  return (
    <>
      <ambientLight intensity={1.48} />
      <directionalLight color="#fff4cf" intensity={3.6} position={[-2.4, 3.8, 4.6]} />
      <spotLight angle={0.48} color="#fff2b4" intensity={38} penumbra={0.75} position={[0, 3.8, 3.2]} />
      <pointLight color="#dff8ed" intensity={28} position={[2.8, 1.8, 2.2]} />
      <pointLight color="#ffe7ec" intensity={14} position={[-2.2, -0.8, 2.8]} />
      <pointLight color="#fffaf0" intensity={16} position={[0, -0.2, 3.4]} />
      <StageRings motionDisabled={motionDisabled} pointer={pointer} />
      <SoftContactShadow pointer={pointer} />
      <StageGlow motionDisabled={motionDisabled} />
      <SteamTrails motionDisabled={motionDisabled} />
      <CustardModel clickPulse={clickPulse} motionDisabled={motionDisabled} mood={mood} pointer={pointer} />
      <SugarOrbit motionDisabled={motionDisabled} />
    </>
  );
}

function SoftContactShadow({ pointer }: { pointer: PointerState }) {
  const shadow = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (!shadow.current) return;
    const ease = Math.min(delta * 6, 1);
    shadow.current.position.x = THREE.MathUtils.lerp(shadow.current.position.x, pointer.x * 0.08, ease);
    shadow.current.scale.x = THREE.MathUtils.lerp(shadow.current.scale.x, 1.62 + Math.abs(pointer.x) * 0.1, ease);
  });

  return (
    <mesh ref={shadow} position={[0, -1.04, -0.18]} rotation={[-Math.PI / 2, 0, 0]} scale={[1.62, 0.62, 1]}>
      <circleGeometry args={[1, 64]} />
      <meshBasicMaterial color="#7a4a20" depthWrite={false} transparent opacity={0.18} />
    </mesh>
  );
}

function StageGlow({ motionDisabled }: { motionDisabled: boolean }) {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!group.current || motionDisabled) return;
    group.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.45) * 0.05;
    group.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 0.9) * 0.025);
  });

  return (
    <group ref={group} position={[0, 0.24, -0.62]}>
      <mesh scale={[1.72, 1.72, 0.04]}>
        <sphereGeometry args={[1, 48, 24]} />
        <meshBasicMaterial color="#fff2b4" depthWrite={false} transparent opacity={0.16} />
      </mesh>
      <mesh position={[0.38, 0.48, 0.08]} scale={[0.54, 0.3, 0.04]} rotation={[0, 0, -0.24]}>
        <sphereGeometry args={[1, 36, 12]} />
        <meshBasicMaterial color="#ffffff" depthWrite={false} transparent opacity={0.28} />
      </mesh>
    </group>
  );
}

function PokeBurst() {
  return (
    <span aria-hidden="true" className="pointer-events-none absolute inset-0 z-20">
      {Array.from({ length: 10 }, (_, index) => (
        <motion.span
          key={index}
          className="absolute left-1/2 top-[45%] h-2.5 w-2.5 rounded-sm border border-[#2f241d]/25 shadow-[3px_3px_0_rgba(47,36,29,.06)]"
          style={{ background: ["#f6bf3f", "#dff8ed", "#ffe7ec", "#fffaf0"][index % 4] }}
          initial={{ opacity: 0, x: 0, y: 0, rotate: 0, scale: 0.3 }}
          animate={{
            opacity: [0, 1, 0],
            x: Math.cos((index / 10) * Math.PI * 2) * (54 + (index % 3) * 16),
            y: Math.sin((index / 10) * Math.PI * 2) * (44 + (index % 4) * 11),
            rotate: 160 + index * 28,
            scale: [0.3, 1.2, 0.55],
          }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.72, ease: "easeOut" }}
        />
      ))}
    </span>
  );
}

function StageRings({ motionDisabled, pointer }: { motionDisabled: boolean; pointer: PointerState }) {
  const group = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!group.current) return;
    const ease = Math.min(delta * 6, 1);
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, 1.38 + pointer.y * 0.04, ease);
    group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, pointer.x * 0.12, ease);
    if (!motionDisabled) {
      group.current.rotation.y = state.clock.elapsedTime * 0.16;
    }
  });

  return (
    <group ref={group} position={[0, -0.03, -0.2]}>
      <mesh scale={[1.62, 1.62, 0.08]}>
        <torusGeometry args={[1, 0.006, 8, 96]} />
        <meshBasicMaterial color="#f6bf3f" transparent opacity={0.34} />
      </mesh>
      <mesh scale={[1.95, 1.95, 0.08]} rotation={[0, 0, 0.3]}>
        <torusGeometry args={[1, 0.005, 8, 96]} />
        <meshBasicMaterial color="#ffe7ec" transparent opacity={0.28} />
      </mesh>
    </group>
  );
}

function CustardModel({
  clickPulse,
  motionDisabled,
  mood,
  pointer,
}: {
  clickPulse: number;
  motionDisabled: boolean;
  mood: MascotMood;
  pointer: PointerState;
}) {
  const group = useRef<THREE.Group>(null);
  const body = useRef<THREE.Mesh>(null);
  const base = useRef<THREE.Mesh>(null);
  const leftEye = useRef<THREE.Mesh>(null);
  const rightEye = useRef<THREE.Mesh>(null);
  const leftArm = useRef<THREE.Mesh>(null);
  const rightArm = useRef<THREE.Mesh>(null);
  const pulse = useRef(0);
  const lastPulse = useRef(clickPulse);

  useEffect(() => {
    if (clickPulse !== lastPulse.current) {
      pulse.current = 1;
      lastPulse.current = clickPulse;
    }
  }, [clickPulse]);

  useFrame((state, delta) => {
    const time = state.clock.elapsedTime;
    const ease = Math.min(delta * 8, 1);
    const bounce = motionDisabled ? 0 : Math.sin(time * 2.2) * 0.045;
    const happyHop = !motionDisabled && mood === "happy" ? Math.abs(Math.sin(time * 10)) * 0.16 : 0;

    pulse.current = Math.max(0, pulse.current - delta * 2.7);
    const squash = pulse.current;

    if (group.current) {
      group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, pointer.x * 0.32, ease);
      group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, -pointer.y * 0.14, ease);
      group.current.position.y = -0.14 + bounce + happyHop;
    }

    if (body.current) {
      body.current.scale.set(1.02 + squash * 0.12, 0.9 - squash * 0.16 + bounce * 0.25, 0.86 + squash * 0.08);
    }

    if (base.current) {
      base.current.rotation.z = THREE.MathUtils.lerp(base.current.rotation.z, -0.06 + pointer.x * 0.045, ease);
    }

    const eyeX = pointer.x * 0.055;
    const eyeY = -pointer.y * 0.035;
    const blink = motionDisabled ? 1 : Math.max(0.18, 1 - Math.pow(Math.max(0, Math.sin(time * 2.15)), 36) * 0.86);
    if (leftEye.current) {
      leftEye.current.position.set(-0.26 + eyeX, 0.78 + eyeY, 0.82);
      leftEye.current.scale.set(0.075, 0.09 * blink, 0.035);
    }
    if (rightEye.current) {
      rightEye.current.position.set(0.26 + eyeX, 0.78 + eyeY, 0.82);
      rightEye.current.scale.set(0.075, 0.09 * blink, 0.035);
    }

    if (leftArm.current) leftArm.current.rotation.z = THREE.MathUtils.lerp(leftArm.current.rotation.z, mood === "happy" ? 0.85 : 0.42, ease);
    if (rightArm.current) rightArm.current.rotation.z = THREE.MathUtils.lerp(rightArm.current.rotation.z, mood === "happy" ? -0.85 : -0.42, ease);
  });

  return (
    <group ref={group} position={[0, -0.14, 0]} rotation={[0.02, 0, 0]}>
      <mesh ref={base} position={[0, -0.72, 0]} rotation={[0, 0, -0.06]} scale={[1.62, 0.38, 0.88]}>
        <sphereGeometry args={[1, 48, 24]} />
        <meshStandardMaterial color="#dff8ed" roughness={0.56} metalness={0.02} />
      </mesh>

      <mesh position={[0, -0.84, 0.64]} scale={[0.92, 0.08, 0.06]}>
        <sphereGeometry args={[1, 36, 12]} />
        <meshStandardMaterial color="#9fc9bd" roughness={0.7} transparent opacity={0.58} />
      </mesh>

      <mesh ref={leftArm} position={[-0.82, 0.3, 0.08]} rotation={[0.06, 0.12, 0.42]} scale={[0.11, 0.48, 0.1]}>
        <sphereGeometry args={[1, 24, 16]} />
        <meshStandardMaterial color="#f3b42f" roughness={0.5} />
      </mesh>
      <mesh ref={rightArm} position={[0.82, 0.3, 0.08]} rotation={[0.06, -0.12, -0.42]} scale={[0.11, 0.48, 0.1]}>
        <sphereGeometry args={[1, 24, 16]} />
        <meshStandardMaterial color="#f3b42f" roughness={0.5} />
      </mesh>

      <mesh ref={body} position={[0, 0.44, 0]} scale={[1.02, 0.9, 0.86]}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial color="#f7bf37" emissive="#f6bf3f" emissiveIntensity={0.08} roughness={0.36} metalness={0.02} />
      </mesh>

      <mesh position={[-0.34, 0.92, -0.02]} scale={[0.48, 0.34, 0.42]} rotation={[0.02, 0.12, -0.2]}>
        <sphereGeometry args={[1, 40, 24]} />
        <meshStandardMaterial color="#f9ca4e" roughness={0.42} metalness={0.02} />
      </mesh>
      <mesh position={[0.36, 0.91, -0.03]} scale={[0.46, 0.32, 0.4]} rotation={[0.04, -0.08, 0.18]}>
        <sphereGeometry args={[1, 40, 24]} />
        <meshStandardMaterial color="#f8c545" roughness={0.42} metalness={0.02} />
      </mesh>
      <mesh position={[0.02, 1.02, 0.02]} scale={[0.34, 0.28, 0.34]}>
        <sphereGeometry args={[1, 40, 20]} />
        <meshStandardMaterial color="#ffd76a" roughness={0.38} metalness={0.02} />
      </mesh>

      <mesh position={[0.24, 0.86, 0.7]} scale={[0.28, 0.16, 0.05]} rotation={[0, 0, -0.42]}>
        <sphereGeometry args={[1, 24, 12]} />
        <meshStandardMaterial color="#fff3b6" roughness={0.3} transparent opacity={0.5} />
      </mesh>
      <mesh position={[-0.22, 0.98, 0.52]} rotation={[0.25, -0.24, -0.22]} scale={[0.36, 0.08, 0.035]}>
        <sphereGeometry args={[1, 24, 10]} />
        <meshStandardMaterial color="#fff6bf" roughness={0.26} transparent opacity={0.34} />
      </mesh>

      <mesh ref={leftEye} position={[-0.26, 0.78, 0.82]} scale={[0.075, 0.09, 0.035]}>
        <sphereGeometry args={[1, 20, 12]} />
        <meshStandardMaterial color="#2f241d" roughness={0.36} />
      </mesh>
      <mesh ref={rightEye} position={[0.26, 0.78, 0.82]} scale={[0.075, 0.09, 0.035]}>
        <sphereGeometry args={[1, 20, 12]} />
        <meshStandardMaterial color="#2f241d" roughness={0.36} />
      </mesh>

      <mesh position={[-0.42, 0.57, 0.82]} scale={[0.16, 0.075, 0.035]}>
        <sphereGeometry args={[1, 24, 12]} />
        <meshStandardMaterial color="#ff9db2" roughness={0.62} transparent opacity={0.52} />
      </mesh>
      <mesh position={[0.42, 0.57, 0.82]} scale={[0.16, 0.075, 0.035]}>
        <sphereGeometry args={[1, 24, 12]} />
        <meshStandardMaterial color="#ff9db2" roughness={0.62} transparent opacity={0.52} />
      </mesh>

      <Smile />

      <mesh position={[-0.56, 0.5, 0.86]} rotation={[0.3, -0.28, 0.45]} scale={[0.16, 0.16, 0.16]}>
        <octahedronGeometry args={[1, 0]} />
        <meshStandardMaterial color="#fffaf0" roughness={0.34} emissive="#fff0a8" emissiveIntensity={0.2} />
      </mesh>
    </group>
  );
}

function Smile() {
  const smileCurve = useMemo(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(-0.26, 0.55, 0.9),
        new THREE.Vector3(-0.1, 0.43, 0.98),
        new THREE.Vector3(0.1, 0.43, 0.98),
        new THREE.Vector3(0.26, 0.55, 0.9),
      ]),
    [],
  );

  return (
    <mesh>
      <tubeGeometry args={[smileCurve, 28, 0.024, 8, false]} />
      <meshStandardMaterial color="#2f241d" roughness={0.45} />
    </mesh>
  );
}

function SteamTrails({ motionDisabled }: { motionDisabled: boolean }) {
  const group = useRef<THREE.Group>(null);
  const curves = useMemo(
    () => [
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(-0.7, 0.65, -0.5),
        new THREE.Vector3(-0.92, 1.04, -0.56),
        new THREE.Vector3(-0.56, 1.36, -0.5),
        new THREE.Vector3(-0.82, 1.72, -0.54),
      ]),
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(0.05, 0.82, -0.66),
        new THREE.Vector3(0.28, 1.12, -0.68),
        new THREE.Vector3(-0.12, 1.42, -0.62),
        new THREE.Vector3(0.16, 1.76, -0.66),
      ]),
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(0.7, 0.7, -0.5),
        new THREE.Vector3(0.96, 1.02, -0.56),
        new THREE.Vector3(0.58, 1.34, -0.52),
        new THREE.Vector3(0.86, 1.66, -0.56),
      ]),
    ],
    [],
  );

  useFrame((state) => {
    if (!group.current || motionDisabled) return;
    group.current.position.y = Math.sin(state.clock.elapsedTime * 1.15) * 0.035;
    group.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.8) * 0.035;
  });

  return (
    <group ref={group}>
      {curves.map((curve, index) => (
        <mesh key={index}>
          <tubeGeometry args={[curve, 28, 0.014, 6, false]} />
          <meshBasicMaterial color={index === 1 ? "#fff7d6" : "#dff8ed"} transparent opacity={0.42} />
        </mesh>
      ))}
    </group>
  );
}

function SugarOrbit({ motionDisabled }: { motionDisabled: boolean }) {
  const group = useRef<THREE.Group>(null);
  const particles = useMemo(
    () =>
      Array.from({ length: 16 }, (_, index) => ({
        angle: (index / 16) * Math.PI * 2,
        radius: 1.48 + (index % 3) * 0.2,
        y: -0.25 + (index % 5) * 0.24,
        size: 0.025 + (index % 4) * 0.012,
        color: ["#fffaf0", "#ffe7ec", "#dff8ed", "#f6bf3f"][index % 4],
      })),
    [],
  );

  useFrame((state) => {
    if (!group.current || motionDisabled) return;
    group.current.rotation.y = state.clock.elapsedTime * 0.22;
    group.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.8) * 0.04;
  });

  return (
    <group ref={group}>
      {particles.map((particle, index) => (
        <mesh
          key={index}
          position={[
            Math.cos(particle.angle) * particle.radius,
            particle.y,
            Math.sin(particle.angle) * particle.radius * 0.42,
          ]}
          scale={[particle.size, particle.size, particle.size]}
        >
          <octahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color={particle.color} roughness={0.45} emissive={particle.color} emissiveIntensity={0.18} />
        </mesh>
      ))}
    </group>
  );
}

function CustardFallback({ mood, pointer }: { mood: MascotMood; pointer: PointerState }) {
  return (
    <span
      aria-hidden="true"
      className="absolute inset-0 grid place-items-center transition-transform duration-300"
      style={{ transform: `rotateX(${-pointer.y * 8}deg) rotateY(${pointer.x * 10}deg)` }}
    >
      <span className="relative block h-[210px] w-[220px] sm:h-[270px] sm:w-[285px] lg:h-[380px] lg:w-[390px]">
        <span className="absolute inset-x-5 bottom-8 h-[34%] rotate-[-2deg] rounded-[52%_48%_42%_46%/48%_48%_58%_54%] border-[5px] border-[#2f241d] bg-gradient-to-br from-[#e9fff7] via-[#dff8ed] to-[#b9eee0] shadow-[0_18px_0_rgba(47,36,29,.1)] sm:border-[6px] lg:border-[7px]" />
        <span className="absolute left-[18%] top-[43%] h-4 w-16 origin-right rotate-[-14deg] rounded-full border-[4px] border-[#2f241d] border-r-0 bg-[#f6bf3f] sm:h-5 sm:w-20" />
        <span className="absolute right-[18%] top-[43%] h-4 w-16 origin-left rotate-[14deg] rounded-full border-[4px] border-[#2f241d] border-l-0 bg-[#f6bf3f] sm:h-5 sm:w-20" />
        <span className="absolute left-1/2 top-[18%] h-[54%] w-[54%] -translate-x-1/2 rounded-[48%_54%_48%_52%/44%_42%_58%_56%] border-[6px] border-[#2f241d] bg-gradient-to-br from-[#ffe38a] via-[#f6bf3f] to-[#e59b20] shadow-[inset_18px_18px_24px_rgba(255,255,255,.24),0_20px_0_rgba(47,36,29,.1)] sm:border-[7px]">
          <span className="absolute left-[28%] top-[35%] h-3.5 w-3.5 rounded-full bg-[#2f241d] sm:h-4 sm:w-4" />
          <span className="absolute right-[28%] top-[35%] h-3.5 w-3.5 rounded-full bg-[#2f241d] sm:h-4 sm:w-4" />
          <span className="absolute left-[20%] top-[48%] h-5 w-8 rounded-full bg-[#ff9db2]/45 blur-[1px]" />
          <span className="absolute right-[20%] top-[48%] h-5 w-8 rounded-full bg-[#ff9db2]/45 blur-[1px]" />
          <span className="absolute left-1/2 top-[48%] h-9 w-16 -translate-x-1/2 rounded-b-full border-b-[6px] border-[#2f241d] sm:h-10 sm:w-20" />
        </span>
        <span className={`absolute left-[16%] top-[33%] grid h-11 w-11 place-items-center rounded-xl border-[4px] border-[#2f241d] bg-white text-[#f6bf3f] shadow-[5px_5px_0_rgba(47,36,29,.08)] sm:h-14 sm:w-14 ${mood === "happy" ? "-rotate-12 scale-110" : "rotate-3"}`}>
          <Sparkles className="h-6 w-6 sm:h-7 sm:w-7" />
        </span>
      </span>
    </span>
  );
}
