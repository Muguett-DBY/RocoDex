import { randomUUID } from "node:crypto";
import { pathToFileURL } from "node:url";

export type RedisVerificationClient = {
  get(key: string): Promise<unknown | null>;
  del(key: string): Promise<number>;
};

type FetchLike = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;

export type VerifyLiveRegistrationOptions = {
  targetUrl: string;
  redis?: RedisVerificationClient;
  fetchImpl?: FetchLike;
  now?: number;
  nonce?: string;
  password?: string;
};

export type VerifyLiveRegistrationResult = {
  username: string;
  userId: string;
  cleaned: true;
};

type StoredUser = {
  id?: unknown;
  username?: unknown;
};

const CLEANUP_CONFIRMATION = "delete-live-registration-user";

export function buildLiveRegistrationUsername(now = Date.now(), nonce = randomNonce()): string {
  const timestamp = Math.floor(now).toString(36);
  const normalizedNonce = normalizeNonce(nonce);
  const username = `qa-${timestamp}-${normalizedNonce}`;

  if (username.length > 20) {
    throw new Error("Generated live registration username exceeds application limit");
  }

  return username;
}

export function getRedisUserKey(username: string): string {
  return `user:${username}`;
}

export function validateLiveRegistrationTarget(targetUrl: string): URL {
  const url = new URL(targetUrl);
  const isLocalHttp =
    url.protocol === "http:" &&
    (url.hostname === "localhost" || url.hostname === "127.0.0.1" || url.hostname === "[::1]");

  if (url.protocol !== "https:" && !isLocalHttp) {
    throw new Error("Live registration verification requires HTTPS except for localhost targets");
  }

  return url;
}

export async function verifyLiveRegistration({
  targetUrl,
  redis,
  fetchImpl = fetch,
  now,
  nonce,
  password = buildPassword(),
}: VerifyLiveRegistrationOptions): Promise<VerifyLiveRegistrationResult> {
  const target = validateLiveRegistrationTarget(targetUrl);
  const username = buildLiveRegistrationUsername(now, nonce);
  const redisKey = getRedisUserKey(username);

  if (redis) {
    const existing = await redis.get(redisKey);

    if (existing !== null) {
      throw new Error(`Refusing to verify live registration because ${redisKey} already exists`);
    }
  }

  let registrationAttempted = false;
  let userId = "";
  let originalError: unknown;

  try {
    registrationAttempted = true;
    const response = await fetchImpl(new URL("/api/register", target), {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const body = (await readJson(response)) as {
      success?: unknown;
      error?: unknown;
      user?: { id?: unknown; username?: unknown };
    };

    if (!response.ok) {
      const detail = typeof body.error === "string" ? `: ${body.error}` : "";
      throw new Error(`Live registration failed with HTTP ${response.status}${detail}`);
    }

    if (body.success !== true || body.user?.username !== username || typeof body.user.id !== "string") {
      throw new Error("Live registration response did not contain the expected generated user");
    }

    userId = body.user.id;

    if (redis) {
      const stored = parseStoredUser(await redis.get(redisKey));

      if (!stored || stored.username !== username || stored.id !== userId) {
        throw new Error("Live registration Redis verification did not match the API response");
      }
    }
  } catch (error) {
    originalError = error;
  }

  let cleaned = false;
  if (registrationAttempted) {
    try {
      cleaned = redis
        ? await cleanupGeneratedUser(redis, redisKey, username)
        : await cleanupGeneratedUserViaApi(target, fetchImpl, username, password, userId);
    } catch (cleanupError) {
      if (originalError) {
        throw new AggregateError(
          [originalError, cleanupError],
          "Live registration verification failed and cleanup also failed",
          { cause: cleanupError },
        );
      }
      throw cleanupError;
    }
  }

  if (originalError) {
    throw originalError;
  }

  if (!cleaned) {
    throw new Error("Live registration cleanup did not find the generated user");
  }

  return { username, userId, cleaned: true };
}

async function cleanupGeneratedUserViaApi(
  target: URL,
  fetchImpl: FetchLike,
  username: string,
  password: string,
  expectedUserId: string,
): Promise<boolean> {
  const response = await fetchImpl(new URL("/api/register/verify-cleanup", target), {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ username, password, confirm: CLEANUP_CONFIRMATION }),
  });
  const body = (await readJson(response)) as {
    success?: unknown;
    deleted?: unknown;
    error?: unknown;
    user?: { id?: unknown; username?: unknown };
  };

  if (!response.ok) {
    if (!expectedUserId && (response.status === 403 || response.status === 404)) {
      return false;
    }

    const detail = typeof body.error === "string" ? `: ${body.error}` : "";
    throw new Error(`Live registration cleanup failed with HTTP ${response.status}${detail}`);
  }

  if (
    body.success !== true ||
    body.deleted !== true ||
    body.user?.username !== username ||
    (expectedUserId && body.user.id !== expectedUserId)
  ) {
    throw new Error("Live registration cleanup response did not match the generated user");
  }

  return true;
}

async function cleanupGeneratedUser(
  redis: RedisVerificationClient,
  redisKey: string,
  username: string,
): Promise<boolean> {
  const stored = parseStoredUser(await redis.get(redisKey));

  if (!stored) {
    return false;
  }

  if (stored.username !== username) {
    throw new Error(`Refusing to delete ${redisKey} because it is not the generated user`);
  }

  await redis.del(redisKey);

  if ((await redis.get(redisKey)) !== null) {
    throw new Error(`Live registration cleanup verification failed for ${redisKey}`);
  }

  return true;
}

function parseStoredUser(value: unknown): StoredUser | null {
  const parsed = typeof value === "string" ? safeJsonParse(value) : value;

  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    return null;
  }

  return parsed as StoredUser;
}

function safeJsonParse(value: string): unknown {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

async function readJson(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    return {};
  }
}

function normalizeNonce(nonce: string): string {
  const normalized = nonce.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 4);

  if (normalized.length !== 4) {
    throw new Error("Live registration nonce must contain at least four alphanumeric characters");
  }

  return normalized;
}

function randomNonce(): string {
  return randomUUID().replace(/-/g, "").slice(0, 4);
}

function buildPassword(): string {
  return `RocoDex-QA-${randomUUID()}`;
}

async function createRedisClientFromEnv(): Promise<RedisVerificationClient | undefined> {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.UPSTASH_REDIS_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.UPSTASH_REDIS_TOKEN;

  if (!hasCredentialValue(url) || !hasCredentialValue(token)) {
    return undefined;
  }

  const { Redis } = await import("@upstash/redis");
  return new Redis({ url, token });
}

function hasCredentialValue(value: string | undefined): value is string {
  const trimmed = value?.trim();
  return Boolean(trimmed && trimmed !== "\"\"" && trimmed !== "''");
}

async function main(): Promise<void> {
  const targetUrl = process.env.LIVE_REGISTRATION_URL || process.argv[2];

  if (!targetUrl) {
    throw new Error("Set LIVE_REGISTRATION_URL or pass a target URL argument");
  }

  const redis = await createRedisClientFromEnv();
  const result = await verifyLiveRegistration({
    targetUrl,
    redis,
  });

  console.log(
    JSON.stringify(
      {
        target: validateLiveRegistrationTarget(targetUrl).origin,
        username: result.username,
        userId: result.userId,
        cleaned: result.cleaned,
        cleanupMode: redis ? "redis" : "api",
      },
      null,
      2,
    ),
  );
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error: unknown) => {
    const message = error instanceof Error ? error.message : String(error);
    console.error(message);
    process.exitCode = 1;
  });
}
