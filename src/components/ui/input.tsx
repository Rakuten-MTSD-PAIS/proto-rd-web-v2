import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

const inputVariants = cva(
  "flex w-full min-w-0 items-center gap-2 border bg-input text-foreground transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-30 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg]:text-muted-foreground",
  {
    variants: {
      inputSize: {
        lg: "h-10 rounded-md px-3 text-sm",
        md: "h-9 rounded-md px-3 text-sm",
        sm: "h-8 rounded-md px-3 text-sm",
        xs: "h-6 rounded-sm px-2 text-sm",
      },
    },
    defaultVariants: {
      inputSize: "lg",
    },
  }
)

function Input({
  className,
  type,
  inputSize = "lg",
  ...props
}: React.ComponentProps<"input"> & VariantProps<typeof inputVariants>) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(inputVariants({ inputSize, className }))}
      {...props}
    />
  )
}

export { Input, inputVariants }
