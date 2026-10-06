import * as React from "react"
import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[120px] w-full bg-white p-4 text-base text-black placeholder:text-[#525252] placeholder:italic border-2 border-black rounded-none focus:border-4 focus:outline-none disabled:cursor-not-allowed disabled:opacity-40 transition-none font-serif leading-relaxed",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
