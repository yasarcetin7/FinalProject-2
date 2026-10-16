import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"
import { cn } from "@/lib/utils"


const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-md border border-transparent bg-clip-padding text-xs/relaxed font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/80",
        outline:
          "interval-btn cursor-pointer rounded-lg border border-line bg-transparent px-3 py-2 font-bold text-brand",
        secondary:
          "mt-2.5 w-full cursor-pointer rounded-lg border-0 bg-brand px-3.5 py-3.5 text-lg font-bold text-black transition-colors duration-300 hover:bg-[#a4db4b] motion-reduce:transition-none max-[480px]:py-3 max-[480px]:text-base",
          ghost:
          "absolute top-3 end-3.5 cursor-pointer border-0 bg-transparent p-0 text-[32px] leading-none font-bold text-muted hover:text-down",
        destructive:
        "cursor-pointer rounded-lg border-0 bg-brand px-5 py-2.5 text-base font-bold text-black transition-colors duration-300 hover:bg-[#a4db4b] motion-reduce:transition-none",
        link: "text-primary",
        success:
          "p-3 mx-1 hover:scale-105 bg-green-500/10 text-green-600 hover:bg-green-500/20 focus-visible:border-green-500/40 focus-visible:ring-green-500/20 dark:bg-green-500/20 dark:text-green-400 dark:hover:bg-green-500/30 dark:focus-visible:ring-green-500/40",
          cart: "font-semibold text-white bg-slate-900 hover:bg-slate-700 dark:bg-slate-400 dark:text-slate-100 dark:hover:bg-slate-300 hover:scale-105 active:scale-95 transition-all duration-200",
      },
      size: {
        default:
          "h-7 gap-1 px-2 text-xs/relaxed has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        xs: "h-5 gap-1 rounded-sm px-2 text-[0.625rem] has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-2.5",
        sm: "h-6 gap-1 px-2 text-xs/relaxed has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        lg: "h-8 gap-1 px-2.5 text-xs/relaxed has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&_svg:not([class*='size-'])]:size-4",
        none: "h-auto",
        icon: "size-7 [&_svg:not([class*='size-'])]:size-3.5",
        "icon-xs": "size-5 rounded-sm [&_svg:not([class*='size-'])]:size-2.5",
        "icon-sm": "size-6 [&_svg:not([class*='size-'])]:size-3",
        "icon-lg": "size-8 [&_svg:not([class*='size-'])]:size-4",
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
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
