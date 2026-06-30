import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { AccountStatusPanel } from "@/components/account-status-panel";
import { getAccountServiceStatus } from "@/lib/account-service-status";

describe("AccountStatusPanel", () => {
  it("renders an accessible checking state", () => {
    const markup = renderToStaticMarkup(<AccountStatusPanel status={null} />);

    expect(markup).toContain('role="status"');
    expect(markup).toContain('aria-live="polite"');
    expect(markup).toContain('aria-busy="true"');
    expect(markup).toContain("正在检查账号服务");
    expect(markup).toContain("animate-spin");
  });

  it("renders a touch-safe recovery action for blocked account states", () => {
    const status = getAccountServiceStatus({ authConfigured: true, storageReachable: false });
    const markup = renderToStaticMarkup(<AccountStatusPanel status={status} />);

    expect(markup).toContain('role="status"');
    expect(markup).toContain('href="/collection"');
    expect(markup).toContain("账号功能暂不可用");
    expect(markup).toContain("先用本地收藏");
    expect(markup).toContain("min-h-11");
  });
});
