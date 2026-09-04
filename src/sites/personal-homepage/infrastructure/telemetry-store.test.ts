import { beforeEach, describe, expect, test, vi } from "vitest";

type FakePipelineOperation = [op: string, key: string, field?: string, value?: string];

const redisHarness = vi.hoisted(() => ({
  instances: [] as Array<{
    opts: { url: string; token: string };
    incrError: Error | null;
    incrResults: number[];
    incrCalls: string[];
    expireCalls: Array<[string, number]>;
    pipelines: FakePipelineOperation[][];
    failPipeline: boolean;
  }>,
}));

vi.mock("@upstash/redis", () => ({
  Redis: class {
    opts: { url: string; token: string };
    incrError: Error | null = null;
    incrResults: number[] = [];
    incrCalls: string[] = [];
    expireCalls: Array<[string, number]> = [];
    pipelines: FakePipelineOperation[][] = [];
    failPipeline = false;
    constructor(opts: { url: string; token: string }) {
      this.opts = opts;
      redisHarness.instances.push(this);
    }
    async incr(key: string) {
      this.incrCalls.push(key);
      if (this.incrError) throw this.incrError;
      return this.incrResults.shift() ?? 1;
    }
    async expire(key: string, seconds: number) {
      this.expireCalls.push([key, seconds]);
      return 1;
    }
    pipeline() {
      if (this.failPipeline) throw new Error("pipeline unavailable");
      const operations: FakePipelineOperation[] = [];
      this.pipelines.push(operations);
      const api = {
        hincrby: (key: string, field: string, value: number) => {
          operations.push(["hincrby", key, field, String(value)]);
          return api;
        },
        hincrbyfloat: (key: string, field: string, value: number) => {
          operations.push(["hincrbyfloat", key, field, String(value)]);
          return api;
        },
        expire: (key: string, seconds: number) => {
          operations.push(["expire", key, String(seconds)]);
          return api;
        },
        exec: async () => operations,
      };
      return api;
    }
  },
}));

import {
  createCstdTelemetrySink,
  getCstdMetricBucketIndex,
  getCstdRumThreshold,
  resolveCstdTelemetryRedisConfig,
  CSTD_RUM_METRICS,
} from "./telemetry-store";
import { consumeCstdTelemetryQuota } from "./telemetry";

const baseMetric = {
  name: "LCP",
  value: 1200,
  page: "home",
  path: "/",
  device: "desktop" as const,
  renderTier: "image" as const,
};

describe("CSTD telemetry store configuration", () => {
  test("requires both URL and token before using Redis", () => {
    expect(resolveCstdTelemetryRedisConfig({})).toBeNull();
    expect(resolveCstdTelemetryRedisConfig({ UPSTASH_REDIS_REST_URL: "https://example.upstash.io" })).toBeNull();
    expect(resolveCstdTelemetryRedisConfig({ UPSTASH_REDIS_REST_URL: "https://example.upstash.io", UPSTASH_REDIS_REST_TOKEN: "token" })).toEqual({
      url: "https://example.upstash.io",
      token: "token",
    });
  });

  test("lets CSTD-specific credentials override the shared Upstash variables", () => {
    expect(resolveCstdTelemetryRedisConfig({
      CSTD_TELEMETRY_REDIS_URL: "https://cstd.upstash.io",
      CSTD_TELEMETRY_REDIS_TOKEN: "cstd-token",
      UPSTASH_REDIS_REST_URL: "https://shared.upstash.io",
      UPSTASH_REDIS_REST_TOKEN: "shared-token",
    })).toEqual({ url: "https://cstd.upstash.io", token: "cstd-token" });
  });

  test("audits exactly the published RUM metrics", () => {
    expect(CSTD_RUM_METRICS).toEqual(["LCP", "INP", "CLS"]);
  });

  test("resolves RUM thresholds from the shared budgets block", () => {
    expect(getCstdRumThreshold("LCP", "desktop")).toBe(1800);
    expect(getCstdRumThreshold("LCP", "mobile")).toBe(2500);
    expect(getCstdRumThreshold("INP", "desktop")).toBe(150);
    expect(getCstdRumThreshold("CLS", "mobile")).toBe(0.03);
  });

  test("buckets values so every contract threshold is an exact edge", () => {
    expect(getCstdMetricBucketIndex("LCP", 800)).toBe(0);
    expect(getCstdMetricBucketIndex("LCP", 1200)).toBe(1);
    expect(getCstdMetricBucketIndex("LCP", 1800)).toBe(1);
    expect(getCstdMetricBucketIndex("LCP", 2500)).toBe(2);
    expect(getCstdMetricBucketIndex("LCP", 4000)).toBe(3);
    expect(getCstdMetricBucketIndex("LCP", 4500)).toBe(4);
    expect(getCstdMetricBucketIndex("CLS", 0.02)).toBe(1);
    expect(getCstdMetricBucketIndex("CLS", 0.03)).toBe(1);
  });
});

describe("CSTD telemetry sinks", () => {
  beforeEach(() => {
    redisHarness.instances.length = 0;
  });

  test("memory sink keeps the original bounded quota behavior", async () => {
    const sink = createCstdTelemetrySink(null);
    expect(sink.mode).toBe("memory");
    expect((await sink.consumeQuota("identity-a", 1_000, 1)).allowed).toBe(true);
    expect((await sink.consumeQuota("identity-a", 1_100, 1)).allowed).toBe(false);
    await expect(sink.recordMetric(baseMetric)).resolves.toBeUndefined();
  });

  test("memory sink quota stays consistent with the legacy helper", () => {
    expect(consumeCstdTelemetryQuota("identity-b", 5_000, 2).allowed).toBe(true);
    expect(consumeCstdTelemetryQuota("identity-b", 5_100, 2).allowed).toBe(true);
    expect(consumeCstdTelemetryQuota("identity-b", 5_200, 2).allowed).toBe(false);
  });

  test("redis sink enforces the quota with a 60s window key", async () => {
    const sink = createCstdTelemetrySink({ url: "https://example.upstash.io", token: "token" });
    const redis = redisHarness.instances[0];
    redis.incrResults = [1, 31];

    const first = await sink.consumeQuota("identity-c", 60_000, 30);
    expect(first).toEqual({ allowed: true, retryAfterSeconds: 0 });
    expect(redis.incrCalls[0]).toMatch(/^cstd:vitals:quota:.+:\d+$/);
    expect(redis.expireCalls[0]?.[1]).toBe(120);

    const limited = await sink.consumeQuota("identity-c", 60_000, 30);
    expect(limited.allowed).toBe(false);
    expect(limited.retryAfterSeconds).toBeGreaterThanOrEqual(1);
    expect(limited.retryAfterSeconds).toBeLessThanOrEqual(60);
  });

  test("redis sink falls back to memory quota when Redis fails", async () => {
    const sink = createCstdTelemetrySink({ url: "https://example.upstash.io", token: "token" });
    const redis = redisHarness.instances[0];
    redis.incrError = new Error("connection refused");
    await expect(sink.consumeQuota("identity-d", 10_000, 30)).resolves.toEqual({ allowed: true, retryAfterSeconds: 0 });
  });

  test("redis sink aggregates count, sum, rating, threshold buckets, and TTL in one pipeline", async () => {
    const sink = createCstdTelemetrySink({ url: "https://example.upstash.io", token: "token" });
    await sink.recordMetric({
      ...baseMetric,
      name: "LCP",
      value: 1200,
      rating: "good",
      device: "desktop",
    }, new Date("2026-09-05T10:30:00Z"));

    const operations = redisHarness.instances[0].pipelines.at(-1) ?? [];
    const key = "cstd:vitals:20260905:LCP:desktop";
    expect(operations).toEqual([
      ["hincrby", key, "count", "1"],
      ["hincrbyfloat", key, "sum", "1200"],
      ["hincrby", key, "rating_good", "1"],
      ["hincrby", key, "bucket_1", "1"],
      ["expire", key, String(40 * 86_400)],
    ]);
  });

  test("redis sink swallows aggregation failures", async () => {
    const sink = createCstdTelemetrySink({ url: "https://example.upstash.io", token: "token" });
    redisHarness.instances[0].failPipeline = true;
    await expect(sink.recordMetric(baseMetric)).resolves.toBeUndefined();
  });
});
