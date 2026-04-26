import * as React from "react";
import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
};

export function Button({ className, variant = "primary", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex h-10 items-center justify-center gap-2 rounded-md px-4 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50",
        variant === "primary" && "bg-emerald-600 text-white shadow-sm hover:bg-emerald-700 focus-visible:outline-emerald-600",
        variant === "secondary" && "border border-slate-200 bg-white text-slate-800 hover:bg-slate-50 focus-visible:outline-slate-400",
        variant === "ghost" && "text-slate-700 hover:bg-slate-100 focus-visible:outline-slate-400",
        className,
      )}
      {...props}
    />
  );
}
