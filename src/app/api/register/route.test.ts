import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createUser, findUserByUsername } from "@/lib/db";
import { POST } from "./route";

vi.mock("@/lib/db", () => ({
  createUser: vi.fn(),
  findUserByUsername: vi.fn(),
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

function rawRegisterRequest(body: string) {
  return new Request("http://localhost/api/register", {
    method: "POST",
    body,
    headers: { "content-type": "application/json" },
  });
}

describe("register API route", () => {
  beforeEach(() => {
    delete process.env.AUTH_SECRET;
    delete process.env.NEXTAUTH_SECRET;
    vi.mocked(findUserByUsername).mockResolvedValue(undefined);
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
    expect(findUserByUsername).not.toHaveBeenCalled();
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
    expect(findUserByUsername).toHaveBeenCalledWith("tester");
    expect(createUser).toHaveBeenCalledWith("tester", expect.any(String));
  });

  it("rejects malformed JSON as a client input error before touching storage", async () => {
    process.env.AUTH_SECRET = "test-secret";

    const response = await POST(rawRegisterRequest("{not-json"));

    await expect(response.json()).resolves.toEqual({ error: "用户名和密码不能为空" });
    expect(response.status).toBe(400);
    expect(findUserByUsername).not.toHaveBeenCalled();
    expect(createUser).not.toHaveBeenCalled();
  });

  it("rejects non-string credentials as a client input error before touching storage", async () => {
    process.env.AUTH_SECRET = "test-secret";

    const response = await POST(registerRequest({ username: "tester", password: 123456 }));

    await expect(response.json()).resolves.toEqual({ error: "用户名和密码不能为空" });
    expect(response.status).toBe(400);
    expect(findUserByUsername).not.toHaveBeenCalled();
    expect(createUser).not.toHaveBeenCalled();
  });
});
