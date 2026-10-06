import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-12 w-full bg-white px-3 py-2 text-base text-black placeholder:text-[#525252] placeholder:italic border-b-2 border-black border-t-0 border-x-0 rounded-none focus:border-b-4 focus:outline-none disabled:cursor-not-allowed disabled:opacity-40 transition-none",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
