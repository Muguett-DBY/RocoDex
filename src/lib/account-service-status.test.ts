import { describe, expect, it } from "vitest";
import { getAccountServiceStatus } from "@/lib/account-service-status";

describe("account service status model", () => {
  it("reports a ready state when auth and storage are available", () => {
    expect(getAccountServiceStatus({ authConfigured: true, storageReachable: true })).toEqual({
      state: "ready",
      title: "账号功能可用",
      message: "当前环境可以注册和登录账号。",
      actionHref: "/register",
      actionLabel: "继续注册",
    });
  });

  it("reports disabled auth before checking storage", () => {
    expect(getAccountServiceStatus({ authConfigured: false, storageReachable: false })).toMatchObject({
      state: "disabled",
      title: "账号功能暂未启用",
      actionHref: "/collection",
    });
  });

  it("reports configured auth with unreachable storage as unavailable", () => {
    expect(getAccountServiceStatus({ authConfigured: true, storageReachable: false })).toMatchObject({
      state: "unavailable",
      title: "账号功能暂不可用",
      actionHref: "/collection",
    });
  });
});
