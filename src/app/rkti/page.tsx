import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { RktiQuiz } from "@/components/rkti-quiz";

export const metadata: Metadata = {
  title: "洛克测试 / RKTI - 测测你的本命精灵",
  description: "24 道情景题，从战斗风格、冒险态度、社交倾向、培育理念等多个维度测出你的本命精灵。洛克王国世界精灵图鉴。",
};

export default function RktiPage() {
  return (
    <PageShell>
      <RktiQuiz />
    </PageShell>
  );
}
