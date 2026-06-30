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
});
