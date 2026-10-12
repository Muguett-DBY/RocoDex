import { createHash } from "node:crypto";
import { existsSync, mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { copyScopedRouteCacheEntries } from "./cf-cache-layout.mjs";

const directories = [];
afterEach(() => directories.splice(0).forEach((directory) => rmSync(directory, { recursive: true, force: true })));

function fixture() {
  const root = mkdtempSync(path.join(tmpdir(), "custard-cache-layout-"));
  directories.push(root);
  const source = path.join(root, "source");
  const destination = path.join(root, "assets");
  mkdirSync(source);
  return { source, destination };
}

function seed(source, pathname, sourceRoute, kind = "APP_PAGE") {
  const digest = createHash("sha256").update(sourceRoute).digest("hex");
  const key = `/route-cache/${kind}/${digest}/$/${pathname}`;
  const value = { type: kind === "APP_ROUTE" ? "route" : "app", meta: { routeCache: { key, owner: { kind, sourceRoute }, isFallback: false } }, html: sourceRoute };
  const filename = path.join(source, "build-123", `${pathname}.cache`);
  mkdirSync(path.dirname(filename), { recursive: true });
  writeFileSync(filename, JSON.stringify(value));
  return { filename, key, value };
}

describe("Cloudflare immutable route cache layout", () => {
  it("makes case pages and route handlers available at Next's scoped keys", () => {
    const { source, destination } = fixture();
    const page = seed(source, "cstd/work/alpha", "/(personal)/cstd/work/[slug]/page");
    const route = seed(source, "cstd/status.json", "/(personal)/cstd/status.json/route", "APP_ROUTE");
    expect(copyScopedRouteCacheEntries(source, destination)).toBe(2);
    for (const item of [page, route]) {
      expect(JSON.parse(readFileSync(path.join(destination, "build-123", `${item.key}.cache`), "utf8"))).toEqual(item.value);
      expect(existsSync(item.filename)).toBe(true);
    }
  });

  it("keeps the same pathname isolated by its source route and build", () => {
    const { source, destination } = fixture();
    const first = seed(source, "about", "/(rocodex)/about/page");
    copyScopedRouteCacheEntries(source, destination);
    const second = seed(source, "about", "/(personal)/about/page");
    copyScopedRouteCacheEntries(source, destination);
    expect(first.key).not.toBe(second.key);
    for (const item of [first, second]) {
      expect(JSON.parse(readFileSync(path.join(destination, "build-123", `${item.key}.cache`), "utf8"))).toEqual(item.value);
    }
  });

  it("leaves legacy and fetch entries in the existing layout", () => {
    const { source, destination } = fixture();
    mkdirSync(path.join(source, "build-123"));
    writeFileSync(path.join(source, "build-123", "legacy.cache"), JSON.stringify({ html: "legacy" }));
    writeFileSync(path.join(source, "build-123", "fetch-key"), JSON.stringify({ kind: "FETCH" }));
    expect(copyScopedRouteCacheEntries(source, destination)).toBe(0);
  });

  it("rejects traversal and mismatched source namespaces", () => {
    const { source, destination } = fixture();
    const item = seed(source, "cstd/work/alpha", "/(personal)/cstd/work/[slug]/page");
    item.value.meta.routeCache.key += "/../outside";
    writeFileSync(item.filename, JSON.stringify(item.value));
    expect(() => copyScopedRouteCacheEntries(source, destination)).toThrow("invalid scoped cache key");
    item.value.meta.routeCache.key = item.key;
    item.value.meta.routeCache.owner.sourceRoute = "/(rocodex)/about/page";
    writeFileSync(item.filename, JSON.stringify(item.value));
    expect(() => copyScopedRouteCacheEntries(source, destination)).toThrow("owner mismatch");
  });
});
