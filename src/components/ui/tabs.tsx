import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

const tabVariants = cva(
  "group/tab inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors outline-none select-none disabled:pointer-events-none disabled:text-disable-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        primary: "rounded-md text-primary hover:bg-primary/5 aria-selected:bg-primary-subtle",
        neutral: "rounded-md text-foreground [&_svg]:opacity-50 hover:bg-accent aria-selected:bg-background aria-selected:[&_svg]:opacity-100",
        underline: "rounded-none border-b border-transparent text-primary hover:bg-primary/5 aria-selected:border-primary",
        icon: "aspect-square rounded-md text-foreground [&_svg]:opacity-50 hover:bg-accent aria-selected:bg-primary-subtle aria-selected:text-primary aria-selected:[&_svg]:opacity-100",
      },
      size: {
        lg: "h-10 px-3 text-base",
        md: "h-9 px-3 text-sm",
        sm: "h-8 px-3 text-sm",
        xs: "h-6 gap-1 rounded-sm px-3 text-sm",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "lg",
    },
  }
)

function Tab({
  className,
  variant = "primary",
  size = "lg",
  render,
  ...props
}: useRender.ComponentProps<"button"> & VariantProps<typeof tabVariants>) {
  return useRender({
    defaultTagName: "button",
    props: mergeProps<"button">(
      {
        type: "button",
        role: "tab",
        className: cn(tabVariants({ variant, size, className })),
      },
      props
    ),
    render,
    state: {
      slot: "tab",
      variant,
      size,
    },
  })
}

function TabList({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      role="tablist"
      data-slot="tab-list"
      className={cn("inline-flex items-center gap-1", className)}
      {...props}
    />
  )
}

export { Tab, TabList, tabVariants }
