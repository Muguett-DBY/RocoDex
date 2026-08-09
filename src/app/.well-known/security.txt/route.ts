import { createCstdSecurityTxtResponse } from "@/sites/personal-homepage/infrastructure/security";

export const dynamic = "force-static";

export function GET() {
  return createCstdSecurityTxtResponse();
}
