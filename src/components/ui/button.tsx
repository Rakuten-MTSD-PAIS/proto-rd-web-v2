import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap font-medium transition-[background-color,opacity,box-shadow] outline-none select-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground hover:opacity-80 disabled:bg-disable disabled:text-disable-foreground",
        "primary-ghost": "bg-transparent text-primary hover:bg-primary/10 disabled:bg-transparent disabled:text-disable-foreground",
        outline: "border border-border bg-background text-secondary-foreground hover:bg-accent disabled:border-border-disable disabled:bg-background disabled:text-disable-foreground",
        "outline-ghost": "bg-transparent text-secondary-foreground hover:bg-accent disabled:bg-transparent disabled:text-disable-foreground",
        success: "bg-success text-success-foreground hover:opacity-80 disabled:bg-disable disabled:text-disable-foreground",
        "success-ghost": "bg-transparent text-success hover:bg-success/10 disabled:bg-transparent disabled:text-disable-foreground",
        danger: "border border-destructive bg-destructive text-destructive-foreground hover:opacity-80 disabled:border-transparent disabled:bg-disable disabled:text-disable-foreground",
        "danger-ghost": "bg-transparent text-destructive hover:bg-destructive/10 disabled:bg-transparent disabled:text-disable-foreground",
        warning: "border border-warning bg-warning text-warning-foreground hover:opacity-80 disabled:border-transparent disabled:bg-disable disabled:text-disable-foreground",
        "warning-ghost": "bg-transparent text-warning hover:bg-warning/10 disabled:bg-transparent disabled:text-disable-foreground",
      },
      size: {
        lg: "h-10 rounded-md px-4 text-base [&_svg:not([class*='size-'])]:size-4",
        md: "h-9 rounded-md px-4 text-sm [&_svg:not([class*='size-'])]:size-4",
        sm: "h-8 rounded-md px-4 text-sm [&_svg:not([class*='size-'])]:size-4",
        xs: "h-6 gap-1 rounded-sm px-3 text-sm [&_svg:not([class*='size-'])]:size-3.5",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "lg",
    },
  }
)

function Button({
  className,
  variant = "primary",
  size = "lg",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
