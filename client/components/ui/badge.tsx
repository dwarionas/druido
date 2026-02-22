import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-xl border-2 border-neo-black px-2.5 py-0.5 text-xs font-bold w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:ring-4 focus-visible:ring-neo-orange transition-all overflow-hidden shadow-[2px_2px_0px_#1a1510]",
  {
    variants: {
      variant: {
        default: "bg-neo-black text-white [a&]:hover:bg-neo-black/80 [a&]:hover:-translate-y-0.5 [a&]:hover:shadow-[2px_4px_0px_#1a1510]",
        secondary:
          "bg-neo-peach text-neo-black [a&]:hover:bg-neo-peach/80 [a&]:hover:-translate-y-0.5 [a&]:hover:shadow-[2px_4px_0px_#1a1510]",
        destructive:
          "bg-red-500 text-white [a&]:hover:bg-red-600 [a&]:hover:-translate-y-0.5 [a&]:hover:shadow-[2px_4px_0px_#1a1510]",
        outline:
          "bg-white text-neo-black [a&]:hover:bg-neo-yellow/30 [a&]:hover:-translate-y-0.5 [a&]:hover:shadow-[2px_4px_0px_#1a1510]",
        ghost: "border-transparent shadow-none [a&]:hover:bg-neo-yellow/30",
        link: "border-transparent shadow-none underline-offset-4 [a&]:hover:underline",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span"

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
