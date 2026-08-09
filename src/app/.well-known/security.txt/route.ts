import { createCstdSecurityTxtResponse } from "@/sites/personal-homepage/server";

export const dynamic = "force-static";

export function GET() {
  return createCstdSecurityTxtResponse();
}
