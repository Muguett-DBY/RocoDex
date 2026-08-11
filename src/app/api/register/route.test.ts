import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { consumeRegistrationQuota, createUser, UserAlreadyExistsError } from "@/lib/db";
import { POST } from "./route";

vi.mock("@/lib/db", () => ({
  consumeRegistrationQuota: vi.fn(),
  createUser: vi.fn(),
  UserAlreadyExistsError: class UserAlreadyExistsError extends Error {
    constructor(username: string) {
      super(`User already exists: ${username}`);
      this.name = "UserAlreadyExistsError";
    }
  },
}));

const originalAuthSecret = process.env.AUTH_SECRET;
const originalNextAuthSecret = process.env.NEXTAUTH_SECRET;

function registerRequest(body: Record<string, unknown>) {
  return new Request("http://localhost/api/register", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "content-type": "application/json" },
  });
}

function rawRegisterRequest(body: string, headers: Record<string, string> = {}) {
  return new Request("http://localhost/api/register", {
    method: "POST",
    body,
    headers: { "content-type": "application/json", ...headers },
  });
}

describe("register API route", () => {
  beforeEach(() => {
    delete process.env.AUTH_SECRET;
    delete process.env.NEXTAUTH_SECRET;
    vi.mocked(consumeRegistrationQuota).mockResolvedValue({ allowed: true, retryAfterSeconds: 0 });
    vi.mocked(createUser).mockResolvedValue({
      id: "user-1",
      username: "tester",
      password: "hashed-password",
      createdAt: "2026-06-30T00:00:00.000Z",
    });
  });

  afterEach(() => {
    process.env.AUTH_SECRET = originalAuthSecret;
    process.env.NEXTAUTH_SECRET = originalNextAuthSecret;
    vi.clearAllMocks();
  });

  it("rejects registration before touching storage when auth is not configured", async () => {
    const response = await POST(registerRequest({ username: "tester", password: "secret123" }));

    await expect(response.json()).resolves.toEqual({ error: "账号功能暂未启用" });
    expect(response.status).toBe(503);
    expect(consumeRegistrationQuota).not.toHaveBeenCalled();
    expect(createUser).not.toHaveBeenCalled();
  });

  it("keeps successful registration available when auth is configured", async () => {
    process.env.AUTH_SECRET = "test-secret";

    const response = await POST(registerRequest({ username: "tester", password: "secret123" }));

    await expect(response.json()).resolves.toEqual({
      success: true,
      user: { id: "user-1", username: "tester" },
    });
    expect(response.status).toBe(200);
    expect(consumeRegistrationQuota).toHaveBeenCalledWith("local");
    expect(createUser).toHaveBeenCalledWith("tester", expect.any(String));
  });

  it("rejects malformed JSON as a client input error before touching storage", async () => {
    process.env.AUTH_SECRET = "test-secret";

    const response = await POST(rawRegisterRequest("{not-json"));

    await expect(response.json()).resolves.toEqual({ error: "用户名和密码不能为空" });
    expect(response.status).toBe(400);
    expect(createUser).not.toHaveBeenCalled();
  });

  it("stops oversized streamed bodies even when the declared length is forged", async () => {
    process.env.AUTH_SECRET = "test-secret";
    const request = rawRegisterRequest(
      JSON.stringify({ username: "tester", password: "x".repeat(3_000) }),
      { "content-length": "32" },
    );

    const response = await POST(request);

    await expect(response.json()).resolves.toEqual({ error: "请求内容过大" });
    expect(response.status).toBe(413);
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(createUser).not.toHaveBeenCalled();
  });

  it("rejects non-string credentials as a client input error before touching storage", async () => {
    process.env.AUTH_SECRET = "test-secret";

    const response = await POST(registerRequest({ username: "tester", password: 123456 }));

    await expect(response.json()).resolves.toEqual({ error: "用户名和密码不能为空" });
    expect(response.status).toBe(400);
    expect(createUser).not.toHaveBeenCalled();
  });

  it("rejects non-object JSON as a client input error", async () => {
    process.env.AUTH_SECRET = "test-secret";

    const response = await POST(rawRegisterRequest("null"));

    await expect(response.json()).resolves.toEqual({ error: "用户名和密码不能为空" });
    expect(response.status).toBe(400);
    expect(createUser).not.toHaveBeenCalled();
  });

  it("rate limits repeated registration attempts before password hashing or storage writes", async () => {
    process.env.AUTH_SECRET = "test-secret";
    vi.mocked(consumeRegistrationQuota).mockResolvedValue({ allowed: false, retryAfterSeconds: 420 });

    const response = await POST(registerRequest({ username: "tester", password: "secret123" }));

    await expect(response.json()).resolves.toEqual({ error: "注册请求过于频繁，请稍后再试" });
    expect(response.status).toBe(429);
    expect(response.headers.get("retry-after")).toBe("420");
    expect(createUser).not.toHaveBeenCalled();
  });

  it("returns a conflict when another request atomically claims the username", async () => {
    process.env.AUTH_SECRET = "test-secret";
    vi.mocked(createUser).mockRejectedValue(new UserAlreadyExistsError("tester"));

    const response = await POST(registerRequest({ username: "tester", password: "secret123" }));

    await expect(response.json()).resolves.toEqual({ error: "该用户名已被注册" });
    expect(response.status).toBe(409);
  });

  it("reports account storage as unavailable when user creation cannot reach Redis", async () => {
    process.env.AUTH_SECRET = "test-secret";
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.mocked(createUser).mockRejectedValue(new TypeError("fetch failed"));

    const response = await POST(registerRequest({ username: "tester", password: "secret123" }));

    await expect(response.json()).resolves.toEqual({ error: "账号功能暂不可用" });
    expect(response.status).toBe(503);
    expect(errorSpy).not.toHaveBeenCalled();
    expect(warnSpy).toHaveBeenCalledWith("Register storage unavailable:", expect.any(TypeError));
  });
});
