type AccountStorageEnvironment = Record<string, string | undefined>;
type RedisCredentialPair = { url: string | undefined; token: string | undefined };

export type AccountStorageConfig =
  | { kind: "local" }
  | { kind: "redis"; url: string; token: string }
  | {
      kind: "invalid";
      reason: "missing-redis-credentials" | "partial-redis-credentials" | "unsupported-redis-url";
    };

export function getAccountStorageConfig(environment: AccountStorageEnvironment = process.env): AccountStorageConfig {
  const credentialPairs = [
    { url: credentialValue(environment.KV_REST_API_URL), token: credentialValue(environment.KV_REST_API_TOKEN) },
    {
      url: credentialValue(environment.UPSTASH_REDIS_REST_URL),
      token: credentialValue(environment.UPSTASH_REDIS_REST_TOKEN),
    },
    { url: credentialValue(environment.UPSTASH_REDIS_URL), token: credentialValue(environment.UPSTASH_REDIS_TOKEN) },
  ];
  const credentials = credentialPairs.find(hasCompleteCredentials);
  const hasAnyRedisCredential = credentialPairs.some((pair) => pair.url || pair.token);
  const isVercelRuntime = environment.VERCEL === "1" || Boolean(credentialValue(environment.VERCEL_ENV));

  if (!credentials) {
    if (hasAnyRedisCredential) {
      return { kind: "invalid", reason: "partial-redis-credentials" };
    }
    return isVercelRuntime ? { kind: "invalid", reason: "missing-redis-credentials" } : { kind: "local" };
  }

  if (!isHttpsUrl(credentials.url)) {
    return { kind: "invalid", reason: "unsupported-redis-url" };
  }

  return { kind: "redis", url: credentials.url, token: credentials.token };
}

function credentialValue(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  if (!trimmed || trimmed === "\"\"" || trimmed === "''") return undefined;
  return trimmed;
}

function hasCompleteCredentials(
  pair: RedisCredentialPair,
): pair is { url: string; token: string } {
  return Boolean(pair.url && pair.token);
}

function isHttpsUrl(value: string): boolean {
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}
