import * as React from "react"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    let variantStyles = "";
    switch (variant) {
      case "default":
        variantStyles = "bg-teal-600 hover:bg-teal-700 text-white shadow-sm dark:bg-teal-600 dark:hover:bg-teal-500 border border-transparent";
        break;
      case "secondary":
        variantStyles = "bg-slate-100 hover:bg-slate-200 text-slate-900 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-50 border border-transparent";
        break;
      case "outline":
        variantStyles = "border border-slate-300 bg-transparent hover:bg-slate-50 text-slate-900 shadow-sm dark:border-zinc-700 dark:text-zinc-50 dark:hover:bg-zinc-800";
        break;
      case "ghost":
        variantStyles = "bg-transparent hover:bg-slate-100 text-slate-900 dark:text-zinc-50 dark:hover:bg-zinc-800 border border-transparent";
        break;
      case "danger":
        variantStyles = "bg-rose-500 hover:bg-rose-600 text-white shadow-sm dark:bg-rose-600 dark:hover:bg-rose-500 border border-transparent";
        break;
    }

    let sizeStyles = "";
    switch (size) {
      case "default": sizeStyles = "h-10 px-4 py-2"; break;
      case "sm": sizeStyles = "h-9 rounded-md px-3 text-xs"; break;
      case "lg": sizeStyles = "h-11 rounded-md px-8"; break;
      case "icon": sizeStyles = "h-10 w-10 shrink-0"; break;
    }

    return (
      <button
        ref={ref}
        className={`inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:focus-visible:ring-teal-400 dark:focus-visible:ring-offset-zinc-950 ${variantStyles} ${sizeStyles} ${className || ''}`}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
