import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { findUserByUsername } from "@/lib/db";
import { ACCOUNT_STATUS_HEALTHCHECK_USERNAME } from "@/lib/account-service-status";
import { GET } from "./route";

vi.mock("@/lib/db", () => ({
  findUserByUsername: vi.fn(),
}));

const originalAuthSecret = process.env.AUTH_SECRET;
const originalNextAuthSecret = process.env.NEXTAUTH_SECRET;

describe("account status API route", () => {
  beforeEach(() => {
    delete process.env.AUTH_SECRET;
    delete process.env.NEXTAUTH_SECRET;
    vi.mocked(findUserByUsername).mockResolvedValue(undefined);
  });

  afterEach(() => {
    process.env.AUTH_SECRET = originalAuthSecret;
    process.env.NEXTAUTH_SECRET = originalNextAuthSecret;
    vi.clearAllMocks();
  });

  it("returns disabled before touching storage when auth is not configured", async () => {
    const response = await GET();

    await expect(response.json()).resolves.toMatchObject({
      state: "disabled",
      title: "账号功能暂未启用",
    });
    expect(response.status).toBe(200);
    expect(findUserByUsername).not.toHaveBeenCalled();
  });

  it("probes storage without creating data when auth is configured", async () => {
    process.env.AUTH_SECRET = "test-secret";

    const response = await GET();

    await expect(response.json()).resolves.toMatchObject({
      state: "ready",
      title: "账号功能可用",
    });
    expect(response.status).toBe(200);
    expect(findUserByUsername).toHaveBeenCalledWith(ACCOUNT_STATUS_HEALTHCHECK_USERNAME);
  });

  it("reports unavailable storage as a warning-level service state", async () => {
    process.env.AUTH_SECRET = "test-secret";
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.mocked(findUserByUsername).mockRejectedValue(new TypeError("fetch failed"));

    const response = await GET();

    await expect(response.json()).resolves.toMatchObject({
      state: "unavailable",
      title: "账号功能暂不可用",
    });
    expect(response.status).toBe(200);
    expect(errorSpy).not.toHaveBeenCalled();
    expect(warnSpy).toHaveBeenCalledWith("Account status storage unavailable:", expect.any(TypeError));
  });
});
