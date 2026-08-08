"use client";

import { useEffect, useRef, useState } from "react";
import type { PersonalImmersiveSceneProps } from "./immersive-scene";

const vertexShader = `
  attribute vec2 aPosition;
  void main() {
    gl_Position = vec4(aPosition, 0.0, 1.0);
  }
`;

const fragmentShader = `
  precision mediump float;
  uniform vec2 uResolution;
  uniform vec2 uPointer;
  uniform float uTime;
  uniform float uProgress;
  uniform float uImpulse;
  uniform float uOverdrive;

  float line(float value, float width) {
    return 1.0 - smoothstep(width, width * 2.4, abs(value));
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / uResolution.xy;
    vec2 p = uv * 2.0 - 1.0;
    p.x *= uResolution.x / max(1.0, uResolution.y);

    float t = uTime * (0.32 + uOverdrive * 0.42);
    float perspective = 1.0 / max(0.18, p.y + 1.16);
    float verticalGrid = line(sin((p.x * perspective + uProgress * 2.0) * 10.0), 0.12);
    float horizontalGrid = line(sin((perspective + t * 0.22) * 9.0), 0.09) * step(-0.82, p.y);
    float cyanWave = line(p.y - sin(p.x * 2.25 + t) * 0.13 - 0.02, 0.025 + uImpulse * 0.018);
    float redWave = line(p.y - cos(p.x * 1.72 - t * 1.3) * 0.19 + 0.19, 0.022 + uImpulse * 0.014);
    float pointerField = exp(-length(p - vec2(uPointer.x, uPointer.y)) * 3.8);
    float scan = 0.5 + 0.5 * sin((uv.y + t * 0.1) * uResolution.y * 0.16);

    vec3 color = vec3(0.006, 0.018, 0.024);
    color += vec3(0.02, 0.38, 0.48) * (verticalGrid * 0.28 + horizontalGrid * 0.22);
    color += vec3(0.05, 0.86, 1.0) * cyanWave * (0.42 + pointerField * 0.34);
    color += mix(vec3(0.95, 0.12, 0.12), vec3(1.0, 0.75, 0.08), uOverdrive) * redWave * 0.58;
    color += vec3(0.1, 0.58, 0.7) * pointerField * 0.13;
    color += vec3(scan * 0.012);
    gl_FragColor = vec4(color, 0.82);
  }
`;

function createShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export function LitePersonalImmersiveScene(props: PersonalImmersiveSceneProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const runtimeRef = useRef({ active: props.active, reducedMotion: props.reducedMotion });
  const [renderState, setRenderState] = useState<"loading" | "true" | "fallback">("loading");

  useEffect(() => {
    runtimeRef.current = { active: props.active, reducedMotion: props.reducedMotion };
  }, [props.active, props.reducedMotion]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", {
      alpha: true,
      antialias: false,
      powerPreference: "low-power",
      preserveDrawingBuffer: true,
    });
    if (!gl) {
      setRenderState("fallback");
      return;
    }

    const vertex = createShader(gl, gl.VERTEX_SHADER, vertexShader);
    const fragment = createShader(gl, gl.FRAGMENT_SHADER, fragmentShader);
    const program = gl.createProgram();
    if (!vertex || !fragment || !program) {
      setRenderState("fallback");
      return;
    }
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      setRenderState("fallback");
      return;
    }

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, "aPosition");
    const resolution = gl.getUniformLocation(program, "uResolution");
    const pointer = gl.getUniformLocation(program, "uPointer");
    const time = gl.getUniformLocation(program, "uTime");
    const progress = gl.getUniformLocation(program, "uProgress");
    const impulse = gl.getUniformLocation(program, "uImpulse");
    const overdrive = gl.getUniformLocation(program, "uOverdrive");
    gl.useProgram(program);
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    let frame = 0;
    let lastFrame = 0;
    let firstFrame = true;
    const resize = () => {
      const width = Math.max(1, Math.round(canvas.clientWidth));
      const height = Math.max(1, Math.round(canvas.clientHeight));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
      gl.viewport(0, 0, width, height);
    };
    const render = (timestamp: number) => {
      frame = window.requestAnimationFrame(render);
      const runtime = runtimeRef.current;
      if (!runtime.active || (!runtime.reducedMotion && timestamp - lastFrame < 42)) return;
      if (runtime.reducedMotion && !firstFrame) return;
      lastFrame = timestamp;
      resize();
      gl.uniform2f(resolution, canvas.width, canvas.height);
      gl.uniform2f(pointer, props.pointerRef.current.x, props.pointerRef.current.y);
      gl.uniform1f(time, runtime.reducedMotion ? 0 : timestamp / 1000);
      gl.uniform1f(progress, props.progressRef.current);
      gl.uniform1f(impulse, props.impulseRef.current);
      gl.uniform1f(overdrive, props.overdriveRef.current ? 1 : 0);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      props.impulseRef.current *= 0.86;
      if (firstFrame) {
        firstFrame = false;
        setRenderState("true");
      }
    };

    const onContextLost = (event: Event) => {
      event.preventDefault();
      setRenderState("fallback");
    };
    canvas.addEventListener("webglcontextlost", onContextLost, { once: true });
    frame = window.requestAnimationFrame(render);
    return () => {
      window.cancelAnimationFrame(frame);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vertex);
      gl.deleteShader(fragment);
    };
  }, [props.impulseRef, props.overdriveRef, props.pointerRef, props.progressRef]);

  return (
    <div
      data-cstd-webgl
      data-cstd-render-quality="lite"
      data-cstd-render-ready={renderState}
      data-cstd-render-fallback={renderState === "fallback" ? "true" : "false"}
      data-cstd-render-active={props.active ? "true" : "false"}
      data-cstd-neural-city
      data-cstd-lite-immersive
      className="absolute inset-0 opacity-[0.72] mix-blend-screen"
    >
      {renderState === "fallback" ? null : (
        <div data-cstd-webgl-canvas className="absolute inset-0">
          <canvas ref={canvasRef} className="h-full w-full" />
        </div>
      )}
    </div>
  );
}
