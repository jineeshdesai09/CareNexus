import * as React from "react"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'success' | 'warning' | 'destructive' | 'outline';
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  let variantStyles = "";
  switch (variant) {
    case "default":
      variantStyles = "border-transparent bg-slate-100 text-slate-800 dark:bg-zinc-800 dark:text-zinc-300";
      break;
    case "success":
      variantStyles = "border-transparent bg-emerald-100 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-400";
      break;
    case "warning":
      variantStyles = "border-transparent bg-amber-100 text-amber-800 dark:bg-amber-500/10 dark:text-amber-400";
      break;
    case "destructive":
      variantStyles = "border-transparent bg-rose-100 text-rose-800 dark:bg-rose-500/10 dark:text-rose-400";
      break;
    case "outline":
      variantStyles = "text-slate-950 dark:text-slate-50 border-slate-200 dark:border-zinc-800";
      break;
  }

  return (
    <div
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 dark:focus:ring-zinc-300 ${variantStyles} ${className || ''}`}
      {...props}
    />
  )
}

export { Badge }
