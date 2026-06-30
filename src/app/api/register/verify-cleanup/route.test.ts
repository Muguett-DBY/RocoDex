import bcrypt from "bcryptjs";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { deleteUserByUsername, findUserByUsername } from "@/lib/db";
import { POST } from "./route";

vi.mock("@/lib/db", () => ({
  deleteUserByUsername: vi.fn(),
  findUserByUsername: vi.fn(),
}));

const originalAuthSecret = process.env.AUTH_SECRET;
const originalNextAuthSecret = process.env.NEXTAUTH_SECRET;

function cleanupRequest(body: Record<string, unknown>) {
  return new Request("http://localhost/api/register/verify-cleanup", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "content-type": "application/json" },
  });
}

describe("live registration cleanup API route", () => {
  beforeEach(async () => {
    process.env.AUTH_SECRET = "test-secret";
    delete process.env.NEXTAUTH_SECRET;
    vi.mocked(findUserByUsername).mockResolvedValue({
      id: "user-1",
      username: "qa-mqzw89a8-a1b2",
      password: await bcrypt.hash("secret123", 10),
      createdAt: "2026-06-30T00:00:00.000Z",
    });
    vi.mocked(deleteUserByUsername).mockResolvedValue(true);
  });

  afterEach(() => {
    process.env.AUTH_SECRET = originalAuthSecret;
    process.env.NEXTAUTH_SECRET = originalNextAuthSecret;
    vi.clearAllMocks();
  });

  it("rejects cleanup before touching storage when auth is not configured", async () => {
    delete process.env.AUTH_SECRET;

    const response = await POST(
      cleanupRequest({
        username: "qa-mqzw89a8-a1b2",
        password: "secret123",
        confirm: "delete-live-registration-user",
      }),
    );

    await expect(response.json()).resolves.toEqual({ error: "账号功能暂未启用" });
    expect(response.status).toBe(503);
    expect(findUserByUsername).not.toHaveBeenCalled();
    expect(deleteUserByUsername).not.toHaveBeenCalled();
  });

  it("refuses to delete non-generated usernames", async () => {
    const response = await POST(
      cleanupRequest({
        username: "regular-user",
        password: "secret123",
        confirm: "delete-live-registration-user",
      }),
    );

    await expect(response.json()).resolves.toEqual({ error: "只能清理自动验收账号" });
    expect(response.status).toBe(400);
    expect(findUserByUsername).not.toHaveBeenCalled();
    expect(deleteUserByUsername).not.toHaveBeenCalled();
  });

  it("refuses to delete when the password does not match", async () => {
    const response = await POST(
      cleanupRequest({
        username: "qa-mqzw89a8-a1b2",
        password: "wrong-password",
        confirm: "delete-live-registration-user",
      }),
    );

    await expect(response.json()).resolves.toEqual({ error: "验收账号校验失败" });
    expect(response.status).toBe(403);
    expect(deleteUserByUsername).not.toHaveBeenCalled();
  });

  it("deletes only the matching generated user after password confirmation", async () => {
    const response = await POST(
      cleanupRequest({
        username: "qa-mqzw89a8-a1b2",
        password: "secret123",
        confirm: "delete-live-registration-user",
      }),
    );

    await expect(response.json()).resolves.toEqual({
      success: true,
      deleted: true,
      user: { id: "user-1", username: "qa-mqzw89a8-a1b2" },
    });
    expect(response.status).toBe(200);
    expect(deleteUserByUsername).toHaveBeenCalledWith("qa-mqzw89a8-a1b2");
  });
});
