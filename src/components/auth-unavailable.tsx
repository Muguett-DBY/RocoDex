import Link from "next/link";
import { Heart } from "lucide-react";

export function AuthUnavailable() {
  return (
    <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center px-4">
      <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <Heart className="mx-auto h-9 w-9 text-emerald-600" />
        <h1 className="mt-5 text-2xl font-bold text-slate-950">账号功能暂未启用</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          当前环境没有配置安全的认证密钥。你仍可使用无需登录的本地收藏与全部图鉴工具。
        </p>
        <Link
          href="/collection"
          className="mt-6 inline-flex h-10 items-center justify-center rounded-md bg-emerald-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
        >
          打开我的收藏
        </Link>
      </div>
    </div>
  );
}
