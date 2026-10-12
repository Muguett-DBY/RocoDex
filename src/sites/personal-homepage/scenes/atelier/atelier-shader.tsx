"use client";

import { Satin, Shader } from "shaders/react";

export type AtelierShaderProps = {
  onReady: () => void;
  onUnavailable: () => void;
};

export function AtelierShader({ onReady, onUnavailable }: AtelierShaderProps) {
  return (
    <Shader className="atelier-material-canvas" disableTelemetry onReady={onReady} onUnavailable={onUnavailable}>
      <Satin
        color="#8e7144"
        highlightColor="#fff4d7"
        foldCount={3}
        foldDirection={38}
        foldDepth={0.38}
        foldWidth={0.3}
        seed={12}
        speed={0.18}
        breeze={0.16}
        gloss={0.48}
        sheen={0.45}
        weave={0.08}
        lightAngle={128}
      />
    </Shader>
  );
}
