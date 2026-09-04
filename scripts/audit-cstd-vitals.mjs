#!/usr/bin/env node
// Audits collected CSTD field Web Vitals (stored by /api/cstd-vitals in Upstash Redis)
// against the published performance contract thresholds.
//
// Credentials come from CSTD_TELEMETRY_REDIS_URL/TOKEN or UPSTASH_REDIS_REST_URL/TOKEN.
// Without credentials the audit exits 0 with a skip notice so scheduled runs stay green
// until telemetry storage is configured.

import { appendFileSync, readFileSync } from "node:fs";
import path from "node:path";

const contractPath = path.resolve("src/sites/personal-homepage/content/performance-contract.json");
const contract = JSON.parse(readFileSync(contractPath, "utf8"));
const { rumAudit, budgets } = contract;

const repositoryUrl = "https://github.com/Muguett-DBY/RocoDex";
// Workflow env blocks resolve missing secrets to empty strings, so pick the first
// complete pair instead of a ??-chain that would short-circuit on "".
const credentialPairs = [
  { url: process.env.CSTD_TELEMETRY_REDIS_URL, token: process.env.CSTD_TELEMETRY_REDIS_TOKEN },
  { url: process.env.UPSTASH_REDIS_REST_URL, token: process.env.UPSTASH_REDIS_REST_TOKEN },
];
const credentials = credentialPairs.find((pair) => pair.url?.trim() && pair.token?.trim());
const restUrl = (credentials?.url ?? "").trim().replace(/\/$/, "");
const restToken = (credentials?.token ?? "").trim();

if (!restUrl || !restToken) {
  console.log("SKIP: telemetry Redis credentials are not configured; nothing to audit.");
  process.exit(0);
}

function utcDateKey(offsetDays) {
  return new Date(Date.now() - offsetDays * 86_400_000).toISOString().slice(0, 10).replaceAll("-", "");
}

async function fetchHash(key) {
  // The vitals sink stores aggregates as Redis hashes, so read them with HGETALL.
  const response = await fetch(`${restUrl}/hgetall/${key}`, {
    headers: { authorization: `Bearer ${restToken}` },
  });
  if (!response.ok) throw new Error(`Upstash REST ${response.status} for ${key}`);
  const payload = await response.json();
  const fields = payload.result ?? null;
  if (!fields || typeof fields !== "object") return null;
  return Object.keys(fields).length > 0 ? fields : null;
}

function thresholdIndexFor(metricName, threshold) {
  const edges = rumAudit.bucketEdges[metricName];
  const index = edges.indexOf(threshold);
  if (index === -1) {
    throw new Error(`Contract threshold ${threshold} for ${metricName} is not a declared bucket edge: [${edges.join(", ")}]`);
  }
  return index;
}

function evaluateBucketCounts(metricName, threshold, fields) {
  const edges = rumAudit.bucketEdges[metricName];
  const goodIndex = thresholdIndexFor(metricName, threshold);
  let total = 0;
  let good = 0;
  for (let index = 0; index <= edges.length; index += 1) {
    const count = Number(fields[`bucket_${index}`] ?? 0);
    total += count;
    if (index <= goodIndex) good += count;
  }
  return { total, good };
}

const days = [];
for (let offset = 0; offset < rumAudit.windowDays; offset += 1) days.push(utcDateKey(offset));

const perMetric = {};
for (const [metricName, config] of Object.entries(rumAudit.metrics)) {
  perMetric[metricName] = {
    kind: config.kind,
    desktop: { threshold: budgets[config.desktopBudgetKey], total: 0, good: 0 },
    mobile: { threshold: budgets[config.mobileBudgetKey], total: 0, good: 0 },
  };
}

const failures = [];
let sawAnyData = false;

try {
  for (const dateKey of days) {
    await Promise.all(Object.entries(rumAudit.metrics).flatMap(([metricName]) =>
      (["desktop", "mobile"]).map(async (device) => {
        const fields = await fetchHash(`cstd:vitals:${dateKey}:${metricName}:${device}`);
        if (!fields) return;
        sawAnyData = true;
        const target = perMetric[metricName][device];
        const evaluated = evaluateBucketCounts(metricName, target.threshold, fields);
        target.total += evaluated.total;
        target.good += evaluated.good;
      }),
    ));
  }
} catch (error) {
  console.error(`Audit could not read telemetry aggregates from Redis: ${error instanceof Error ? error.message : error}`);
  process.exit(1);
}

const summaryLines = [
  `## CSTD field Web Vitals audit`,
  "",
  `Trailing ${rumAudit.windowDays} days · pass requires ≥ ${Math.round(rumAudit.goodFraction * 100)}% of samples within budget with ≥ ${rumAudit.minimumSamples} samples.`,
  "",
  "| Metric | Device | Budget | Samples | Within budget | Verdict |",
  "| --- | --- | --- | --- | --- | --- |",
];

for (const [metricName, evaluation] of Object.entries(perMetric)) {
  for (const device of ["desktop", "mobile"]) {
    const { threshold, total, good } = evaluation[device];
    const unit = evaluation.kind === "milliseconds" ? "ms" : "";
    const fraction = total > 0 ? good / total : null;
    const judged = total >= rumAudit.minimumSamples;
    const passed = !judged || fraction >= rumAudit.goodFraction;
    if (judged && !passed) {
      failures.push(`${metricName} (${device}): only ${Math.round(fraction * 100)}% of ${total} samples met the ${threshold}${unit} budget`);
    }
    summaryLines.push(
      `| ${metricName} | ${device} | ≤ ${threshold}${unit} | ${total} | ${fraction === null ? "—" : `${Math.round(fraction * 100)}%`} | ${!judged ? "insufficient data" : passed ? "✅ pass" : "❌ breach"} |`,
    );
  }
}

const summary = summaryLines.join("\n");
console.log(summary);
if (process.env.GITHUB_STEP_SUMMARY) {
  appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${summary}\n`);
}

if (!sawAnyData) {
  console.log(`No telemetry aggregates found in Redis yet. Deployed vitals must run with Redis credentials to collect data. Repository: ${repositoryUrl}`);
  process.exit(0);
}

if (failures.length > 0) {
  console.error(`FIELD VITALS BREACH against the published CSTD performance contract:`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("All collected field vitals meet the published CSTD performance contract.");
