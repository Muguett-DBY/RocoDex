import { mkdtemp, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

let tempDir: string;

describe("local user storage", () => {
  beforeEach(async () => {
    delete process.env.UPSTASH_REDIS_REST_TOKEN;
    delete process.env.UPSTASH_REDIS_REST_URL;
    delete process.env.UPSTASH_REDIS_TOKEN;
    delete process.env.UPSTASH_REDIS_URL;
    delete process.env.VERCEL;
    delete process.env.VERCEL_ENV;
    tempDir = await mkdtemp(path.join(os.tmpdir(), "rocodex-db-test-"));
    vi.resetModules();
    vi.spyOn(process, "cwd").mockReturnValue(tempDir);
  });

  afterEach(async () => {
    vi.restoreAllMocks();
    vi.resetModules();
    await rm(tempDir, { force: true, recursive: true });
  });

  test("deletes only the requested local user", async () => {
    const { createUser, deleteUserByUsername, findUserByUsername } = await import("./db");

    await createUser("qa-mqzw89a8-a1b2", "hashed-password");
    await createUser("existing", "existing-password");

    await expect(deleteUserByUsername("qa-mqzw89a8-a1b2")).resolves.toBe(true);
    await expect(findUserByUsername("qa-mqzw89a8-a1b2")).resolves.toBeUndefined();
    await expect(findUserByUsername("existing")).resolves.toMatchObject({ username: "existing" });
  });

  test("returns false when the local user does not exist", async () => {
    const { deleteUserByUsername } = await import("./db");

    await expect(deleteUserByUsername("missing")).resolves.toBe(false);
  });

  test("claims a local username atomically", async () => {
    const { createUser } = await import("./db");

    await createUser("same-name", "first-hash");
    await expect(createUser("same-name", "second-hash")).rejects.toMatchObject({
      name: "UserAlreadyExistsError",
    });
  });

  test("limits repeated local registration attempts without retaining the raw identity", async () => {
    const { consumeRegistrationQuota } = await import("./db");

    for (let attempt = 0; attempt < 5; attempt += 1) {
      await expect(consumeRegistrationQuota("203.0.113.8", 1_000)).resolves.toEqual({
        allowed: true,
        retryAfterSeconds: 0,
      });
    }
    await expect(consumeRegistrationQuota("203.0.113.8", 1_000)).resolves.toMatchObject({
      allowed: false,
      retryAfterSeconds: 600,
    });
  });

  test("rejects Redis socket URLs instead of falling back to local storage", async () => {
    process.env.UPSTASH_REDIS_URL = "rediss://default:secret@example.upstash.io:6379";
    process.env.UPSTASH_REDIS_TOKEN = "token";

    const { findUserByUsername } = await import("./db");

    await expect(findUserByUsername("existing")).rejects.toMatchObject({
      name: "AccountStorageConfigurationError",
      reason: "unsupported-redis-url",
    });
  });

  test("rejects missing Redis credentials in Vercel runtimes instead of using local storage", async () => {
    process.env.VERCEL = "1";
    process.env.VERCEL_ENV = "production";

    const { createUser } = await import("./db");

    await expect(createUser("existing", "hashed-password")).rejects.toMatchObject({
      name: "AccountStorageConfigurationError",
      reason: "missing-redis-credentials",
    });
  });
});
