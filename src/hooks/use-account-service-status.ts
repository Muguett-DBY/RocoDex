"use client";

import type { AccountServiceStatus } from "@/lib/account-service-status";
import { fetchAccountServiceStatus } from "@/lib/account-service-client";
import { useEffect, useState } from "react";

export function useAccountServiceStatus() {
  const [accountStatus, setAccountStatus] = useState<AccountServiceStatus | null>(null);

  useEffect(() => {
    let active = true;

    void fetchAccountServiceStatus().then((status) => {
      if (active) setAccountStatus(status);
    });

    return () => {
      active = false;
    };
  }, []);

  return accountStatus;
}
