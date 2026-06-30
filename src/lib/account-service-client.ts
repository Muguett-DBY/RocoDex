import type { AccountServiceStatus } from "@/lib/account-service-status";
import { getAccountServiceStatus } from "@/lib/account-service-status";

export const ACCOUNT_STATUS_TIMEOUT_MS = 6_000;

type AccountStatusFetcher = (
  input: string,
  init?: RequestInit,
) => Promise<Response>;

function unavailableStatus(): AccountServiceStatus {
  return getAccountServiceStatus({ authConfigured: true, storageReachable: false });
}

function isAccountServiceStatus(value: unknown): value is AccountServiceStatus {
  if (!value || typeof value !== "object") return false;

  const status = value as Partial<AccountServiceStatus>;
  return (
    (status.state === "ready" || status.state === "disabled" || status.state === "unavailable") &&
    typeof status.title === "string" &&
    typeof status.message === "string" &&
    typeof status.actionHref === "string" &&
    typeof status.actionLabel === "string"
  );
}

export async function fetchAccountServiceStatus(
  fetcher: AccountStatusFetcher = fetch,
  timeoutMs = ACCOUNT_STATUS_TIMEOUT_MS,
): Promise<AccountServiceStatus> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetcher("/api/account-status", {
      cache: "no-store",
      signal: controller.signal,
    });

    if (!response.ok) return unavailableStatus();

    const data: unknown = await response.json();
    return isAccountServiceStatus(data) ? data : unavailableStatus();
  } catch {
    return unavailableStatus();
  } finally {
    clearTimeout(timeout);
  }
}
