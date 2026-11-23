import { buildRobotsTxt } from "@/sites/shared/robots";

export const dynamic = "force-static";
export function GET() {
  return new Response(buildRobotsTxt(), { headers: { "content-type": "text/plain; charset=utf-8" } });
}
