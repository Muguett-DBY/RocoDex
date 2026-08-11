import { Redis } from "@upstash/redis";
import { getAccountStorageConfig } from "@/lib/account-storage-config";
import { AccountStorageConfigurationError } from "@/lib/storage-errors";
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const storageConfig = getAccountStorageConfig();
const redis =
  storageConfig.kind === "redis" ? new Redis({ url: storageConfig.url, token: storageConfig.token }) : null;

// Local fallback storage
const DATA_DIR = path.join(process.cwd(), "data");
const USERS_FILE = path.join(DATA_DIR, "users.json");

export interface User {
  id: string;
  username: string;
  password: string;
  createdAt: string;
}

export class UserAlreadyExistsError extends Error {
  constructor(username: string) {
    super(`User already exists: ${username}`);
    this.name = "UserAlreadyExistsError";
  }
}

type RegistrationQuotaWindow = { startedAt: number; count: number };
const localRegistrationQuota = new Map<string, RegistrationQuotaWindow>();

function readLocalUsers(): User[] {
  try {
    if (!fs.existsSync(USERS_FILE)) return [];
    return JSON.parse(fs.readFileSync(USERS_FILE, "utf-8"));
  } catch {
    return [];
  }
}

function writeLocalUsers(users: User[]): void {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), "utf-8");
}

function userKey(username: string) {
  return `user:${username}`;
}

export async function findUserByUsername(username: string): Promise<User | undefined> {
  assertStorageConfigured();

  if (redis) {
    return (await redis.get(userKey(username))) as User | undefined;
  }
  return readLocalUsers().find((u) => u.username === username);
}

export async function createUser(username: string, password: string): Promise<User> {
  const user: User = { id: crypto.randomUUID(), username, password, createdAt: new Date().toISOString() };

  assertStorageConfigured();

  if (redis) {
    const created = await redis.set(userKey(username), user, { nx: true });
    if (!created) throw new UserAlreadyExistsError(username);
  } else {
    const users = readLocalUsers();
    if (users.some((candidate) => candidate.username === username)) {
      throw new UserAlreadyExistsError(username);
    }
    users.push(user);
    writeLocalUsers(users);
  }

  return user;
}

export async function consumeRegistrationQuota(
  identity: string,
  now = Date.now(),
  limit = 5,
  windowMilliseconds = 10 * 60_000,
) {
  assertStorageConfigured();
  const identityHash = hashIdentity(identity || "anonymous");

  if (redis) {
    const key = `quota:register:${identityHash}`;
    const count = await redis.incr(key);
    if (count === 1) await redis.expire(key, Math.ceil(windowMilliseconds / 1_000));
    const remainingSeconds = Math.max(1, await redis.ttl(key));
    return count <= limit
      ? { allowed: true, retryAfterSeconds: 0 } as const
      : { allowed: false, retryAfterSeconds: remainingSeconds } as const;
  }

  const current = localRegistrationQuota.get(identityHash);
  if (!current || now - current.startedAt >= windowMilliseconds) {
    localRegistrationQuota.set(identityHash, { startedAt: now, count: 1 });
    return { allowed: true, retryAfterSeconds: 0 } as const;
  }
  current.count += 1;
  if (localRegistrationQuota.size > 1_000) {
    for (const [candidate, window] of localRegistrationQuota) {
      if (now - window.startedAt >= windowMilliseconds) localRegistrationQuota.delete(candidate);
    }
  }
  return current.count <= limit
    ? { allowed: true, retryAfterSeconds: 0 } as const
    : {
        allowed: false,
        retryAfterSeconds: Math.max(1, Math.ceil((windowMilliseconds - (now - current.startedAt)) / 1_000)),
      } as const;
}

export async function deleteUserByUsername(username: string): Promise<boolean> {
  assertStorageConfigured();

  if (redis) {
    return (await redis.del(userKey(username))) > 0;
  }

  const users = readLocalUsers();
  const remainingUsers = users.filter((user) => user.username !== username);

  if (remainingUsers.length === users.length) {
    return false;
  }

  if (remainingUsers.length === 0) {
    if (fs.existsSync(USERS_FILE)) {
      fs.rmSync(USERS_FILE, { force: true });
    }
  } else {
    writeLocalUsers(remainingUsers);
  }

  return true;
}

function assertStorageConfigured(): void {
  if (storageConfig.kind === "invalid") {
    throw new AccountStorageConfigurationError(storageConfig.reason);
  }
}

function hashIdentity(value: string) {
  return createHash("sha256").update(value).digest("base64url");
}
