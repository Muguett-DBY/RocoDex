import { describe, expect, test, vi } from "vitest";
import {
  buildLiveRegistrationUsername,
  getRedisUserKey,
  validateLiveRegistrationTarget,
  verifyLiveRegistration,
  type RedisVerificationClient,
} from "./verify-live-registration.mts";

function createRedisClient(store: Map<string, unknown>): RedisVerificationClient {
  return {
    get: vi.fn(async (key: string) => store.get(key) ?? null),
    del: vi.fn(async (key: string) => (store.delete(key) ? 1 : 0)),
  };
}

describe("live registration verifier", () => {
  test("builds a valid unique username and the exact application Redis key", () => {
    const username = buildLiveRegistrationUsername(1_782_778_400_000, "a1b2");

    expect(username).toBe("qa-mqzw89a8-a1b2");
    expect(username.length).toBeLessThanOrEqual(20);
    expect(getRedisUserKey(username)).toBe(`user:${username}`);
  });

  test("allows HTTPS and local HTTP targets but rejects external insecure targets", () => {
    expect(validateLiveRegistrationTarget("https://rocodex.custard.top").origin).toBe(
      "https://rocodex.custard.top",
    );
    expect(validateLiveRegistrationTarget("http://127.0.0.1:3100").origin).toBe(
      "http://127.0.0.1:3100",
    );
    expect(() => validateLiveRegistrationTarget("http://example.com")).toThrow(
      "Live registration verification requires HTTPS",
    );
  });

  test("verifies a successful registration and removes exactly its generated user", async () => {
    const store = new Map<string, unknown>();
    const redis = createRedisClient(store);
    const username = buildLiveRegistrationUsername(1_782_778_400_000, "c3d4");
    const key = getRedisUserKey(username);
    store.set("user:existing", { id: "existing", username: "existing" });

    const result = await verifyLiveRegistration({
      targetUrl: "https://rocodex.custard.top",
      redis,
      now: 1_782_778_400_000,
      nonce: "c3d4",
      password: "strong-test-password",
      fetchImpl: vi.fn(async (_input, init) => {
        const request = JSON.parse(String(init?.body)) as { username: string };
        const user = {
          id: "created-user",
          username: request.username,
          password: "hashed",
          createdAt: "2026-06-30T10:00:00.000Z",
        };
        store.set(getRedisUserKey(request.username), user);
        return Response.json({ success: true, user: { id: user.id, username: user.username } });
      }),
    });

    expect(result).toEqual({ username, userId: "created-user", cleaned: true });
    expect(store.has(key)).toBe(false);
    expect(store.has("user:existing")).toBe(true);
    expect(redis.del).toHaveBeenCalledTimes(1);
    expect(redis.del).toHaveBeenCalledWith(key);
  });

  test("cleans a user written before a failed registration response", async () => {
    const store = new Map<string, unknown>();
    const redis = createRedisClient(store);
    const username = buildLiveRegistrationUsername(1_782_778_400_000, "e5f6");

    await expect(
      verifyLiveRegistration({
        targetUrl: "https://rocodex.custard.top",
        redis,
        now: 1_782_778_400_000,
        nonce: "e5f6",
        password: "strong-test-password",
        fetchImpl: vi.fn(async (_input, init) => {
          const request = JSON.parse(String(init?.body)) as { username: string };
          store.set(getRedisUserKey(request.username), {
            id: "created-before-network-failure",
            username: request.username,
          });
          throw new Error("simulated response loss");
        }),
      }),
    ).rejects.toThrow("simulated response loss");

    expect(store.has(getRedisUserKey(username))).toBe(false);
    expect(redis.del).toHaveBeenCalledWith(getRedisUserKey(username));
  });

  test("uses the cleanup API when Redis credentials are not available locally", async () => {
    const username = buildLiveRegistrationUsername(1_782_778_400_000, "f7g8");
    const fetchImpl = vi.fn(async (input, init) => {
      const url = input instanceof URL ? input : new URL(String(input));
      const request = JSON.parse(String(init?.body)) as { username: string; password: string; confirm?: string };

      if (url.pathname === "/api/register") {
        return Response.json({ success: true, user: { id: "api-user", username: request.username } });
      }

      if (url.pathname === "/api/register/verify-cleanup") {
        return Response.json({
          success: true,
          deleted: true,
          user: { id: "api-user", username: request.username },
        });
      }

      return Response.json({ error: "unexpected endpoint" }, { status: 404 });
    });

    await expect(
      verifyLiveRegistration({
        targetUrl: "https://rocodex.custard.top",
        now: 1_782_778_400_000,
        nonce: "f7g8",
        password: "strong-test-password",
        fetchImpl,
      }),
    ).resolves.toEqual({ username, userId: "api-user", cleaned: true });

    expect(fetchImpl).toHaveBeenCalledWith(
      new URL("https://rocodex.custard.top/api/register/verify-cleanup"),
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          username,
          password: "strong-test-password",
          confirm: "delete-live-registration-user",
        }),
      }),
    );
  });
});
