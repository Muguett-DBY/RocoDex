import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AuthProvider } from "@/components/auth-provider";
import { PageShell } from "@/components/page-shell";
import { Button } from "@/components/ui/button";
import { isAuthConfigured } from "@/lib/auth-availability";

export default function NotFound() {
  return (
    <AuthProvider enabled={isAuthConfigured()}>
      <RocoDexNotFound />
    </AuthProvider>
  );
}

function RocoDexNotFound() {
  return (
    <PageShell>
      <main className="mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center lg:px-8">
        <p className="text-8xl font-bold text-slate-200">404</p>
        <h1 className="mt-6 text-2xl font-bold tracking-tight text-slate-950">页面未找到</h1>
        <p className="mt-4 max-w-lg text-sm leading-7 text-slate-600">
          你查找的精灵编号、攻略或阵容可能尚未收录，或者链接已失效。
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/">
            <Button type="button" variant="primary">
              <ArrowLeft className="h-4 w-4" />
              返回首页
            </Button>
          </Link>
          <Link href="/creatures">
            <Button type="button" variant="secondary">
              浏览精灵列表
            </Button>
          </Link>
        </div>
      </main>
    </PageShell>
  );
}
