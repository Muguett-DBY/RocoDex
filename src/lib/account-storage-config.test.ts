import { describe, expect, it } from "vitest";
import { getAccountStorageConfig } from "@/lib/account-storage-config";

describe("account storage configuration", () => {
  it("uses local storage only outside Vercel when Redis credentials are absent", () => {
    expect(getAccountStorageConfig({})).toEqual({ kind: "local" });
  });

  it("treats missing Redis credentials on Vercel as unavailable storage", () => {
    expect(getAccountStorageConfig({ VERCEL: "1", VERCEL_ENV: "production" })).toMatchObject({
      kind: "invalid",
      reason: "missing-redis-credentials",
    });
  });

  it("treats partial Redis credentials as unavailable storage", () => {
    expect(getAccountStorageConfig({ UPSTASH_REDIS_REST_URL: "https://example.upstash.io" })).toMatchObject({
      kind: "invalid",
      reason: "partial-redis-credentials",
    });
  });

  it("rejects Redis socket URLs because the Upstash client expects REST HTTPS URLs", () => {
    expect(
      getAccountStorageConfig({
        UPSTASH_REDIS_URL: "rediss://default:secret@example.upstash.io:6379",
        UPSTASH_REDIS_TOKEN: "token",
      }),
    ).toMatchObject({
      kind: "invalid",
      reason: "unsupported-redis-url",
    });
  });

  it("accepts legacy variable names when they contain REST credentials", () => {
    expect(
      getAccountStorageConfig({
        UPSTASH_REDIS_URL: "https://example.upstash.io",
        UPSTASH_REDIS_TOKEN: "token",
      }),
    ).toEqual({
      kind: "redis",
      url: "https://example.upstash.io",
      token: "token",
    });
  });

  it("prefers Vercel Marketplace KV REST credentials over stale legacy variables", () => {
    expect(
      getAccountStorageConfig({
        KV_REST_API_URL: "https://marketplace.upstash.io",
        KV_REST_API_TOKEN: "marketplace-token",
        UPSTASH_REDIS_URL: "rediss://default:stale@example.upstash.io:6379",
        UPSTASH_REDIS_TOKEN: "stale-token",
      }),
    ).toEqual({
      kind: "redis",
      url: "https://marketplace.upstash.io",
      token: "marketplace-token",
    });
  });
});
