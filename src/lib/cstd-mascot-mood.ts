export type CstdMascotMood = "curious" | "happy" | "working";

export function shouldApplyCstdMascotMoodChange({
  nextMood,
  now,
  happyUntil,
}: {
  nextMood: CstdMascotMood;
  now: number;
  happyUntil: number;
}) {
  return nextMood !== "working" || now >= happyUntil;
}
