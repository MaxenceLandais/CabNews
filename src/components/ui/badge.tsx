import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium uppercase tracking-wider",
  {
    variants: {
      variant: {
        default: "bg-elevated text-muted",
        haute: "bg-accent/15 text-accent",
        moyenne: "bg-elevated text-fg",
        veille: "bg-transparent text-subtle shadow-[var(--shadow-border)]",
        ok: "bg-ok/15 text-ok",
        warn: "bg-warn/15 text-warn",
        paper: "bg-paper/10 text-paper",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export function Badge({
  className,
  variant,
  ...props
}: HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
