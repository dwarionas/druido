import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-neo-black placeholder:text-neo-black/40 selection:bg-neo-black selection:text-white border-neo-black flex h-12 w-full min-w-0 rounded-xl border-2 bg-white px-4 py-2 text-base font-bold shadow-[2px_2px_0px_#1a1510] transition-all outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-black disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none md:text-sm",
        "focus-visible:ring-4 focus-visible:ring-neo-orange focus-visible:border-neo-black",
        "aria-invalid:ring-red-500/20 aria-invalid:border-red-500",
        className
      )}
      {...props}
    />
  )
}

export { Input }
