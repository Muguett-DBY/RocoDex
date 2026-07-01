type AccountStorageEnvironment = Record<string, string | undefined>;

export type AccountStorageConfig =
  | { kind: "local" }
  | { kind: "redis"; url: string; token: string }
  | {
      kind: "invalid";
      reason: "missing-redis-credentials" | "partial-redis-credentials" | "unsupported-redis-url";
    };

export function getAccountStorageConfig(environment: AccountStorageEnvironment = process.env): AccountStorageConfig {
  const url = credentialValue(environment.UPSTASH_REDIS_REST_URL) ?? credentialValue(environment.UPSTASH_REDIS_URL);
  const token =
    credentialValue(environment.UPSTASH_REDIS_REST_TOKEN) ?? credentialValue(environment.UPSTASH_REDIS_TOKEN);
  const isVercelRuntime = environment.VERCEL === "1" || Boolean(credentialValue(environment.VERCEL_ENV));

  if (!url && !token) {
    return isVercelRuntime ? { kind: "invalid", reason: "missing-redis-credentials" } : { kind: "local" };
  }

  if (!url || !token) {
    return { kind: "invalid", reason: "partial-redis-credentials" };
  }

  if (!isHttpsUrl(url)) {
    return { kind: "invalid", reason: "unsupported-redis-url" };
  }

  return { kind: "redis", url, token };
}

function credentialValue(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  if (!trimmed || trimmed === "\"\"" || trimmed === "''") return undefined;
  return trimmed;
}

function isHttpsUrl(value: string): boolean {
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}
