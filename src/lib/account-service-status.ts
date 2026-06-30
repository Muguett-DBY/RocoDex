export const ACCOUNT_STATUS_HEALTHCHECK_USERNAME = "__rocodex_account_status__";

export type AccountServiceState = "ready" | "disabled" | "unavailable";

export type AccountServiceStatus = {
  state: AccountServiceState;
  title: string;
  message: string;
  actionHref: string;
  actionLabel: string;
};

type AccountServiceStatusInput = {
  authConfigured: boolean;
  storageReachable: boolean;
};

export function getAccountServiceStatus({
  authConfigured,
  storageReachable,
}: AccountServiceStatusInput): AccountServiceStatus {
  if (!authConfigured) {
    return {
      state: "disabled",
      title: "账号功能暂未启用",
      message: "当前环境没有配置安全的认证密钥。你仍可使用无需登录的本地收藏与全部图鉴工具。",
      actionHref: "/collection",
      actionLabel: "打开本地收藏",
    };
  }

  if (!storageReachable) {
    return {
      state: "unavailable",
      title: "账号功能暂不可用",
      message: "账号存储暂时无法连接。已填写的信息不会被保存，建议先使用本地收藏继续浏览。",
      actionHref: "/collection",
      actionLabel: "先用本地收藏",
    };
  }

  return {
    state: "ready",
    title: "账号功能可用",
    message: "当前环境可以注册和登录账号。",
    actionHref: "/register",
    actionLabel: "继续注册",
  };
}
