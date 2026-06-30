import type { AccountServiceStatus } from "@/lib/account-service-status";
import { cn } from "@/lib/utils";
import { ArrowRight, LoaderCircle, TriangleAlert } from "lucide-react";
import Link from "next/link";

type AccountStatusPanelProps = {
  status: AccountServiceStatus | null;
  className?: string;
};

export function AccountStatusPanel({ status, className }: AccountStatusPanelProps) {
  if (!status) {
    return (
      <div
        role="status"
        aria-live="polite"
        aria-busy="true"
        className={cn(
          "rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 shadow-sm",
          className,
        )}
      >
        <div className="flex gap-3">
          <LoaderCircle aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 animate-spin text-emerald-600" />
          <div>
            <p className="font-semibold text-slate-900">正在检查账号服务</p>
            <p className="mt-1 leading-5">确认注册与登录是否可用，请稍候。</p>
          </div>
        </div>
      </div>
    );
  }

  if (status.state === "ready") return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950 shadow-sm",
        className,
      )}
    >
      <div className="flex gap-3">
        <TriangleAlert aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />
        <div className="min-w-0 flex-1">
          <p className="font-semibold">{status.title}</p>
          <p className="mt-1 leading-5 text-amber-900">{status.message}</p>
          <Link
            href={status.actionHref}
            className="mt-3 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md border border-amber-300 bg-white px-3 text-sm font-semibold text-amber-950 shadow-sm transition hover:bg-amber-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600 sm:w-auto"
          >
            {status.actionLabel}
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
