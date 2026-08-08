"use client";

import { Bloom, ChromaticAberration, EffectComposer, Noise } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { useMemo } from "react";
import { Vector2 } from "three";

export function ImmersivePostprocessing() {
  const chromaticOffset = useMemo(() => new Vector2(0.00055, 0.0004), []);

  return (
    <EffectComposer multisampling={0}>
      <Bloom intensity={0.5} luminanceThreshold={0.72} luminanceSmoothing={0.32} mipmapBlur />
      <ChromaticAberration offset={chromaticOffset} radialModulation modulationOffset={0.35} />
      <Noise opacity={0.015} blendFunction={BlendFunction.SOFT_LIGHT} />
    </EffectComposer>
  );
}
