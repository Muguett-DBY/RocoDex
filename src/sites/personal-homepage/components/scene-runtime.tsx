"use client";

import dynamic from "next/dynamic";
import { memo } from "react";
import type { CstdRuntimeProfile } from "../experience/runtime-hooks";
import type { PersonalImmersiveSceneProps } from "./immersive-scene";

const FullScene = dynamic(
  () => import("./immersive-scene").then((module) => module.PersonalImmersiveScene),
  { ssr: false },
);
const LiteScene = dynamic(
  () => import("./lite-immersive-scene").then((module) => module.LitePersonalImmersiveScene),
  { ssr: false },
);
const WebGpuField = dynamic(
  () => import("./webgpu-signal-field").then((module) => module.WebGpuSignalField),
  { ssr: false },
);

function SceneRuntime({ profile, enabled, ...sceneProps }: PersonalImmersiveSceneProps & {
  profile: CstdRuntimeProfile;
  enabled: boolean;
}) {
  if (!enabled) return null;

  return (
    <div
      data-cstd-scene-runtime
      data-cstd-scene-runtime-tier={profile.tier}
      data-cstd-scene-runtime-webgpu={profile.webgpu ? "true" : "false"}
      className="absolute inset-0"
    >
      {profile.tier === "full" ? <FullScene {...sceneProps} /> : null}
      {profile.tier === "lite" ? <LiteScene {...sceneProps} /> : null}
      {profile.tier === "full" && profile.webgpu ? <WebGpuField {...sceneProps} /> : null}
    </div>
  );
}

export const MemoizedSceneRuntime = memo(SceneRuntime);
