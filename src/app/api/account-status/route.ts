import { NextResponse } from "next/server";
import { findUserByUsername } from "@/lib/db";
import { isAuthConfigured } from "@/lib/auth-availability";
import { ACCOUNT_STATUS_HEALTHCHECK_USERNAME, getAccountServiceStatus } from "@/lib/account-service-status";
import { isStorageUnavailableError } from "@/lib/storage-errors";

export const dynamic = "force-dynamic";

const noStoreHeaders = {
  "Cache-Control": "no-store",
};

export async function GET() {
  if (!isAuthConfigured()) {
    return NextResponse.json(
      getAccountServiceStatus({ authConfigured: false, storageReachable: false }),
      { headers: noStoreHeaders },
    );
  }

  try {
    await findUserByUsername(ACCOUNT_STATUS_HEALTHCHECK_USERNAME);

    return NextResponse.json(
      getAccountServiceStatus({ authConfigured: true, storageReachable: true }),
      { headers: noStoreHeaders },
    );
  } catch (error) {
    if (isStorageUnavailableError(error)) {
      console.warn("Account status storage unavailable:", error);
      return NextResponse.json(
        getAccountServiceStatus({ authConfigured: true, storageReachable: false }),
        { headers: noStoreHeaders },
      );
    }

    console.error("Account status check failed:", error);
    return NextResponse.json(
      getAccountServiceStatus({ authConfigured: true, storageReachable: false }),
      { headers: noStoreHeaders },
    );
  }
}
