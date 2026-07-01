import { beforeEach, describe, expect, it, vi } from "vitest";

const authMocks = vi.hoisted(() => ({
  compare: vi.fn(),
  credentials: vi.fn((config) => config),
  findUserByUsername: vi.fn(),
  nextAuth: vi.fn(),
}));

vi.mock("@/lib/db", () => ({
  findUserByUsername: authMocks.findUserByUsername,
}));

vi.mock("bcryptjs", () => ({
  default: {
    compare: authMocks.compare,
  },
}));

vi.mock("next-auth", () => ({
  default: authMocks.nextAuth,
}));

vi.mock("next-auth/providers/credentials", () => ({
  default: authMocks.credentials,
}));

async function loadAuthorize() {
  vi.resetModules();
  type CapturedAuthConfig = {
    providers: Array<{
      authorize: (credentials: Record<string, unknown>) => Promise<unknown>;
    }>;
  };
  let capturedConfig: CapturedAuthConfig | null = null;

  authMocks.nextAuth.mockImplementation((config) => {
    capturedConfig = config;
    return {
      auth: vi.fn(),
      handlers: {},
      signIn: vi.fn(),
      signOut: vi.fn(),
    };
  });

  await import("./auth");

  const config = capturedConfig as CapturedAuthConfig | null;

  if (!config) {
    throw new Error("NextAuth configuration was not captured");
  }

  return config.providers[0].authorize;
}

describe("auth credentials provider", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("treats known storage outages as a controlled failed sign-in", async () => {
    const authorize = await loadAuthorize();
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    authMocks.findUserByUsername.mockRejectedValue(new TypeError("fetch failed"));

    await expect(authorize({ username: "tester", password: "secret123" })).resolves.toBeNull();
    expect(warnSpy).toHaveBeenCalledWith("Login storage unavailable:", expect.any(TypeError));
  });

  it("does not hide unknown lookup errors", async () => {
    const authorize = await loadAuthorize();
    authMocks.findUserByUsername.mockRejectedValue(new Error("unexpected storage shape"));

    await expect(authorize({ username: "tester", password: "secret123" })).rejects.toThrow("unexpected storage shape");
  });
});
