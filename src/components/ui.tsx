import React from "react";
import { cn } from "../lib/utils";

export function Container({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto w-full max-w-6xl px-4">{children}</div>;
}

export function Divider() {
  return <div className="h-px w-full bg-slate-200/70" />;
}

export function Button({
  children,
  variant = "primary",
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed";
  const styles =
    variant === "primary"
      ? "bg-slate-950 text-white hover:bg-slate-900"
      : variant === "secondary"
      ? "border border-slate-200 bg-white hover:bg-slate-50"
      : "hover:bg-slate-100";
  return (
    <button className={cn(base, styles, className)} {...props}>
      {children}
    </button>
  );
}

export function Input({
  label,
  hint,
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  hint?: string;
}) {
  return (
    <label className="grid gap-1">
      {label ? <span className="text-xs font-medium text-slate-700">{label}</span> : null}
      <input
        className={cn(
          "h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none",
          "focus:border-slate-400 focus:ring-2 focus:ring-slate-200",
          className
        )}
        {...props}
      />
      {hint ? <span className="text-xs text-slate-500">{hint}</span> : null}
    </label>
  );
}

export function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700">
      {children}
    </span>
  );
}

export function SectionHead({ title, desc }: { title: string; desc?: string }) {
  return (
    <div className="flex items-end justify-between gap-6">
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-slate-950">{title}</h2>
        {desc ? <p className="mt-1 text-sm text-slate-600">{desc}</p> : null}
      </div>
    </div>
  );
}
