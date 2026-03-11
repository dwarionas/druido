import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:size-4] [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground rounded-full shadow-sm hover:bg-teal-hover hover:shadow-[0_0_20px_rgba(30,193,167,0.3)]",
        destructive:
          "bg-destructive text-destructive-foreground rounded-lg shadow-sm hover:bg-destructive/90",
        outline:
          "border border-border bg-transparent text-foreground rounded-full hover:bg-white/5 hover:border-white/20",
        secondary:
          "bg-secondary text-secondary-foreground rounded-full hover:bg-white/10",
        ghost: "text-muted-foreground hover:bg-white/5 hover:text-foreground rounded-lg",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-8 rounded-lg px-3.5 text-xs",
        lg: "h-12 rounded-full px-8 text-base",
        icon: "h-9 w-9 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
