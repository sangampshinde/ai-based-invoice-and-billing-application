import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-accent text-white shadow hover:bg-accent-strong",
        secondary:
          "border-transparent bg-[var(--surface-2)] text-[var(--ink)] hover:bg-[var(--surface-2)]/80",
        outline: "text-[var(--ink)] border-[var(--border)]",
        paid: "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
        sent: "border-teal-500/20 bg-teal-500/10 text-teal-600 dark:text-teal-400",
        unpaid: "border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400",
        overdue: "border-rose-500/20 bg-rose-500/10 text-rose-600 dark:text-rose-400",
        draft: "border-slate-500/20 bg-slate-500/10 text-slate-600 dark:text-slate-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function Badge({ className, variant, tone, ...props }) {
  let v = variant;
  if (!v && tone) {
    if (tone === "neutral") v = "secondary";
    else if (tone === "success") v = "paid";
    else if (tone === "danger") v = "overdue";
    else if (tone === "warning") v = "unpaid";
    else v = "default";
  }
  return (
    <div className={cn(badgeVariants({ variant: v }), className)} {...props} />
  );
}

export function StatusBadge({ status, className }) {
  const norm = (status || "draft").toLowerCase();
  const variant = ["paid", "sent", "unpaid", "overdue", "draft"].includes(norm)
    ? norm
    : "default";
  return (
    <Badge variant={variant} className={cn("capitalize", className)}>
      {norm}
    </Badge>
  );
}

export { Badge, badgeVariants };
export default Badge;
