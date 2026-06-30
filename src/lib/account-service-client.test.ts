import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchAccountServiceStatus } from "@/lib/account-service-client";

describe("account service client", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns a ready account status response", async () => {
    const fetcher = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({
        state: "ready",
        title: "账号功能可用",
        message: "当前环境可以注册和登录账号。",
        actionHref: "/register",
        actionLabel: "继续注册",
      }), { status: 200 }),
    );

    await expect(fetchAccountServiceStatus(fetcher)).resolves.toMatchObject({ state: "ready" });
    expect(fetcher).toHaveBeenCalledWith("/api/account-status", expect.objectContaining({ cache: "no-store" }));
  });

  it("falls back to unavailable when the request times out", async () => {
    vi.useFakeTimers();
    const fetcher = vi.fn((_input: string, init?: RequestInit) => new Promise<Response>((_resolve, reject) => {
      init?.signal?.addEventListener("abort", () => reject(new DOMException("Aborted", "AbortError")));
    }));

    const pending = fetchAccountServiceStatus(fetcher, 50);
    await vi.advanceTimersByTimeAsync(50);

    await expect(pending).resolves.toMatchObject({ state: "unavailable" });
  });

  it("falls back to unavailable for a non-OK response", async () => {
    const fetcher = vi.fn().mockResolvedValue(new Response(null, { status: 503 }));

    await expect(fetchAccountServiceStatus(fetcher)).resolves.toMatchObject({ state: "unavailable" });
  });
});
