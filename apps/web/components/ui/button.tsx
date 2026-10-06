import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger"
  size?: "default" | "sm" | "lg" | "icon"
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "default", ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center rounded-none font-mono uppercase tracking-widest font-medium transition-none duration-0 cursor-pointer disabled:pointer-events-none disabled:opacity-40 focus-visible:outline focus-visible:outline-3 focus-visible:outline-black focus-visible:outline-offset-3"

    const variants = {
      primary:
        "bg-black text-white border border-black hover:bg-white hover:text-black active:bg-neutral-800 active:text-white",
      secondary:
        "bg-transparent text-black border-2 border-black hover:bg-black hover:text-white active:bg-neutral-900",
      ghost:
        "bg-transparent text-black hover:underline underline-offset-4 border-none",
      danger:
        "bg-transparent text-black border-2 border-black hover:bg-black hover:text-white",
    }

    const sizes = {
      default: "px-8 py-4 text-sm min-h-[44px]",
      sm: "px-4 py-2 text-xs min-h-[36px]",
      lg: "px-10 py-5 text-base min-h-[52px]",
      icon: "h-11 w-11 p-2",
    }

    return (
      <button
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
