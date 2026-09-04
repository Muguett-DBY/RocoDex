import { Redis } from "@upstash/redis";

import { cstdPerformanceContract } from "../content/performance-contract";
import { consumeCstdTelemetryQuota, hashCstdTelemetryIdentity, type CstdMetric } from "./telemetry";

const rumAudit = cstdPerformanceContract.rumAudit;
export const CSTD_RUM_METRICS = Object.keys(rumAudit.metrics) as readonly CstdRumMetricName[];
export type CstdRumMetricName = keyof typeof rumAudit.metrics;

export type CstdTelemetryRedisConfig = { url: string; token: string };

type TelemetryEnvironment = Readonly<Record<string, string | undefined>>;

export function resolveCstdTelemetryRedisConfig(environment: TelemetryEnvironment = process.env): CstdTelemetryRedisConfig | null {
  const credentialPairs = [
    { url: environment.CSTD_TELEMETRY_REDIS_URL, token: environment.CSTD_TELEMETRY_REDIS_TOKEN },
    { url: environment.KV_REST_API_URL, token: environment.KV_REST_API_TOKEN },
    { url: environment.UPSTASH_REDIS_REST_URL, token: environment.UPSTASH_REDIS_REST_TOKEN },
    { url: environment.UPSTASH_REDIS_URL, token: environment.UPSTASH_REDIS_TOKEN },
  ];
  const credentials = credentialPairs.find((pair) => pair.url?.trim() && pair.token?.trim());
  if (!credentials) return null;
  return { url: credentials.url!.trim(), token: credentials.token!.trim() };
}

export function getCstdMetricBucketIndex(metric: CstdRumMetricName, value: number) {
  const edges = rumAudit.bucketEdges[metric];
  for (let index = 0; index < edges.length; index += 1) {
    if (value <= edges[index]) return index;
  }
  return edges.length;
}

export function getCstdRumThreshold(metric: CstdRumMetricName, device: "desktop" | "mobile") {
  const contract = rumAudit.metrics[metric];
  const budgetKey = (device === "desktop" ? contract.desktopBudgetKey : contract.mobileBudgetKey) as keyof typeof cstdPerformanceContract.budgets;
  return cstdPerformanceContract.budgets[budgetKey];
}

export type CstdQuotaDecision = { allowed: boolean; retryAfterSeconds: number };

export interface CstdTelemetrySink {
  readonly mode: "redis" | "memory";
  consumeQuota(identity: string, now?: number, limit?: number): Promise<CstdQuotaDecision>;
  recordMetric(metric: CstdMetric, now?: Date): Promise<void>;
}

const QUOTA_WINDOW_MS = 60_000;
const AGGREGATE_TTL_SECONDS = 40 * 86_400;

function cstdUtcDateKey(now: Date) {
  return now.toISOString().slice(0, 10).replaceAll("-", "");
}

function quotaKey(identity: string, windowIndex: number) {
  return `cstd:vitals:quota:${hashCstdTelemetryIdentity(identity || "anonymous")}:${windowIndex}`;
}

function aggregateKey(metricName: string, device: string, dateKey: string) {
  return `cstd:vitals:${dateKey}:${metricName}:${device}`;
}

export function createCstdTelemetrySink(config: CstdTelemetryRedisConfig | null): CstdTelemetrySink {
  if (!config) {
    return {
      mode: "memory",
      async consumeQuota(identity, now = Date.now(), limit = 30) {
        return consumeCstdTelemetryQuota(identity, now, limit);
      },
      async recordMetric() {
        // Without durable storage the structured route log remains the only record.
      },
    };
  }

  const redis = new Redis({ url: config.url, token: config.token });

  async function consumeQuotaWithRedis(identity: string, now: number, limit: number): Promise<CstdQuotaDecision> {
    const windowIndex = Math.floor(now / QUOTA_WINDOW_MS);
    const key = quotaKey(identity, windowIndex);
    const count = await redis.incr(key);
    if (count === 1) await redis.expire(key, 120);
    if (count <= limit) return { allowed: true, retryAfterSeconds: 0 };
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((QUOTA_WINDOW_MS - (now % QUOTA_WINDOW_MS)) / 1_000)),
    };
  }

  return {
    mode: "redis",
    async consumeQuota(identity, now = Date.now(), limit = 30) {
      try {
        return await consumeQuotaWithRedis(identity, now, limit);
      } catch {
        // Availability beats strict quota precision: degrade to the per-instance window.
        return consumeCstdTelemetryQuota(identity, now, limit);
      }
    },
    async recordMetric(metric, now = new Date()) {
      const dateKey = cstdUtcDateKey(now);
      const key = aggregateKey(metric.name, metric.device, dateKey);
      try {
        const operations = redis.pipeline()
          .hincrby(key, "count", 1)
          .hincrbyfloat(key, "sum", metric.value);
        if (metric.rating) operations.hincrby(key, `rating_${metric.rating}`, 1);
        if (metric.name in rumAudit.bucketEdges) {
          operations.hincrby(key, `bucket_${getCstdMetricBucketIndex(metric.name as CstdRumMetricName, metric.value)}`, 1);
        }
        operations.expire(key, AGGREGATE_TTL_SECONDS);
        await operations.exec();
      } catch {
        // A lost aggregate sample is acceptable; telemetry must never break the page.
      }
    },
  };
}

let sharedSink: CstdTelemetrySink | null = null;

export function getCstdTelemetrySink(environment: TelemetryEnvironment = process.env) {
  if (!sharedSink) sharedSink = createCstdTelemetrySink(resolveCstdTelemetryRedisConfig(environment));
  return sharedSink;
}

export function resetCstdTelemetrySinkForTests() {
  sharedSink = null;
}
