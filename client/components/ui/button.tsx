import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-black transition-all disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none disabled:translate-y-0 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-4 focus-visible:ring-neo-orange border-2 border-transparent hover:-translate-y-1 active:translate-y-0.5 active:shadow-none",
  {
    variants: {
      variant: {
        default:
          "bg-neo-black text-white border-neo-black shadow-[2px_2px_0px_#1a1510] hover:bg-neo-black/90",
        destructive:
          "bg-red-500 text-white border-neo-black shadow-[2px_2px_0px_#1a1510] hover:bg-red-600 focus-visible:ring-red-500",
        outline:
          "border-neo-black bg-white text-neo-black shadow-[2px_2px_0px_#1a1510] hover:bg-neo-yellow/30",
        secondary:
          "bg-neo-peach text-neo-black border-neo-black shadow-[2px_2px_0px_#1a1510] hover:bg-neo-peach/80",
        ghost:
          "hover:bg-neo-yellow/30 hover:text-neo-black border-transparent hover:-translate-y-0",
        link: "text-neo-black underline-offset-4 hover:underline hover:-translate-y-0",
        gradient: "bg-neo-orange text-neo-black border-neo-black shadow-[2px_2px_0px_#1a1510] hover:bg-neo-orange/80",
        "outline-glow": "bg-white text-neo-black border-neo-black shadow-[2px_2px_0px_#1a1510] hover:bg-neo-yellow/30 hover:shadow-[2px_4px_0px_#1a1510]",
      },
      size: {
        default: "h-11 px-6 py-2 has-[>svg]:px-4",
        sm: "h-9 rounded-xl gap-1.5 px-4 has-[>svg]:px-3",
        lg: "h-14 rounded-2xl px-8 text-lg has-[>svg]:px-6",
        icon: "size-11",
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
