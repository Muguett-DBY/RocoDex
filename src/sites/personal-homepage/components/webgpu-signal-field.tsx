"use client";

import { useEffect, useRef, useState } from "react";
import type { PersonalImmersiveSceneProps } from "./immersive-scene";

const shader = /* wgsl */ `
  struct State { value: vec4f }
  @group(0) @binding(0) var<uniform> state: State;

  struct VertexOutput {
    @builtin(position) position: vec4f,
    @location(0) uv: vec2f,
  }

  @vertex fn vertexMain(@builtin(vertex_index) index: u32) -> VertexOutput {
    var points = array<vec2f, 3>(vec2f(-1.0, -1.0), vec2f(3.0, -1.0), vec2f(-1.0, 3.0));
    var output: VertexOutput;
    output.position = vec4f(points[index], 0.0, 1.0);
    output.uv = points[index] * 0.5 + 0.5;
    return output;
  }

  fn traceLine(value: f32, width: f32) -> f32 {
    return 1.0 - smoothstep(width, width * 2.2, abs(value));
  }

  @fragment fn fragmentMain(input: VertexOutput) -> @location(0) vec4f {
    let time = state.value.x;
    let progress = state.value.y;
    let velocity = state.value.z;
    let overdrive = state.value.w;
    let uv = input.uv;
    let centered = uv * 2.0 - 1.0;
    let lane = traceLine(sin((centered.x * 6.0 + centered.y * 3.0 + progress * 8.0) + time * 0.24), 0.045);
    let cross = traceLine(sin((centered.y * 9.0 - centered.x * 1.8) - time * 0.18), 0.035);
    let pulse = pow(max(0.0, sin(length(centered) * 18.0 - time * (1.2 + velocity * 3.0))), 14.0);
    let cyan = vec3f(0.055, 0.72, 0.9) * (lane * 0.16 + pulse * 0.2);
    let amber = vec3f(0.96, 0.68, 0.12) * cross * (0.07 + overdrive * 0.12);
    let red = vec3f(0.9, 0.06, 0.04) * pulse * overdrive * 0.12;
    let alpha = clamp((lane + cross + pulse) * 0.12, 0.0, 0.24);
    return vec4f(cyan + amber + red, alpha);
  }
`;

export function WebGpuSignalField(props: PersonalImmersiveSceneProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const runtimeRef = useRef({ active: props.active, reducedMotion: props.reducedMotion });
  const frameRef = useRef(0);
  const renderRef = useRef<((timestamp: number) => void) | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "fallback">("loading");

  useEffect(() => {
    runtimeRef.current = { active: props.active, reducedMotion: props.reducedMotion };
    if (props.active && renderRef.current && !frameRef.current) {
      frameRef.current = window.requestAnimationFrame(renderRef.current);
    }
  }, [props.active, props.reducedMotion]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const gpu = navigator.gpu;
    const context = canvas?.getContext("webgpu") as GPUCanvasContext | null;
    if (!canvas || !gpu || !context) {
      setState("fallback");
      return;
    }

    let cancelled = false;
    let lastFrame = 0;
    let contextReady = false;
    let device: GPUDevice | null = null;

    const start = async () => {
      const adapter = await gpu.requestAdapter();
      if (!adapter || cancelled) {
        setState("fallback");
        return;
      }
      const createdDevice = await adapter.requestDevice();
      device = createdDevice;
      if (cancelled) return;

      const format = gpu.getPreferredCanvasFormat();
      const shaderModule = createdDevice.createShaderModule({ code: shader });
      const pipeline = createdDevice.createRenderPipeline({
        layout: "auto",
        vertex: { module: shaderModule, entryPoint: "vertexMain" },
        fragment: {
          module: shaderModule,
          entryPoint: "fragmentMain",
          targets: [{
            format,
            blend: {
              color: { srcFactor: "src-alpha", dstFactor: "one-minus-src-alpha", operation: "add" },
              alpha: { srcFactor: "one", dstFactor: "one-minus-src-alpha", operation: "add" },
            },
          }],
        },
        primitive: { topology: "triangle-list" },
      });
      const uniform = createdDevice.createBuffer({
        size: 16,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
      });
      const bindGroup = createdDevice.createBindGroup({
        layout: pipeline.getBindGroupLayout(0),
        entries: [{ binding: 0, resource: { buffer: uniform } }],
      });

      const resize = () => {
        const scale = Math.min(window.devicePixelRatio || 1, 1) * 0.72;
        canvas.width = Math.max(1, Math.floor(window.innerWidth * scale));
        canvas.height = Math.max(1, Math.floor(window.innerHeight * scale));
        context.configure({ device: createdDevice, format, alphaMode: "premultiplied" });
        contextReady = true;
      };
      resize();
      window.addEventListener("resize", resize);
      setState("ready");

      const schedule = () => {
        if (!frameRef.current && runtimeRef.current.active && (!runtimeRef.current.reducedMotion || lastFrame === 0)) {
          frameRef.current = window.requestAnimationFrame(render);
        }
      };
      const render = (timestamp: number) => {
        frameRef.current = 0;
        if (!runtimeRef.current.active || !contextReady) return;
        if (!runtimeRef.current.reducedMotion && timestamp - lastFrame < 32) {
          schedule();
          return;
        }
        if (runtimeRef.current.reducedMotion && lastFrame > 0) return;
        lastFrame = timestamp;
        const values = new Float32Array([
          timestamp / 1000,
          props.progressRef.current,
          props.velocityRef.current,
          props.overdriveRef.current ? 1 : 0,
        ]);
        createdDevice.queue.writeBuffer(uniform, 0, values);
        const encoder = createdDevice.createCommandEncoder();
        const pass = encoder.beginRenderPass({
          colorAttachments: [{
            view: context.getCurrentTexture().createView(),
            clearValue: { r: 0, g: 0, b: 0, a: 0 },
            loadOp: "clear",
            storeOp: "store",
          }],
        });
        pass.setPipeline(pipeline);
        pass.setBindGroup(0, bindGroup);
        pass.draw(3);
        pass.end();
        createdDevice.queue.submit([encoder.finish()]);
        schedule();
      };
      renderRef.current = render;
      schedule();

      return () => window.removeEventListener("resize", resize);
    };

    let removeResize: void | (() => void);
    void start().then((cleanup) => { removeResize = cleanup; }).catch(() => setState("fallback"));
    return () => {
      cancelled = true;
      if (frameRef.current) window.cancelAnimationFrame(frameRef.current);
      frameRef.current = 0;
      renderRef.current = null;
      removeResize?.();
      if (contextReady) context.unconfigure();
      device?.destroy();
    };
  }, [props.overdriveRef, props.progressRef, props.velocityRef]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      data-cstd-webgpu-field
      data-cstd-webgpu-state={state}
      className="absolute inset-0 h-full w-full mix-blend-screen opacity-55"
    />
  );
}
