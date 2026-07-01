"use client";

import { AccountStatusPanel } from "@/components/account-status-panel";
import { useAccountServiceStatus } from "@/hooks/use-account-service-status";

export function HomeAccountContinuity() {
  const status = useAccountServiceStatus();

  if (!status || status.state === "ready") {
    return null;
  }

  return (
    <div aria-label="账号服务状态" className="mt-5 max-w-2xl">
      <AccountStatusPanel status={status} />
    </div>
  );
}
