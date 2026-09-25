"use client";

import * as React from "react";
import { CheckCircle } from "lucide-react";
import { cn } from "cn";
import { Input, inputVariants } from "@/components/ui/input";

type FieldSize = "lg" | "md" | "sm" | "xs";

interface FormFieldBaseProps {
  label?: React.ReactNode;
  helperText?: React.ReactNode;
  errorText?: React.ReactNode;
  successText?: React.ReactNode;
  size?: FieldSize;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerClassName?: string;
  labelClassName?: string;
}

/**
 * The RD "input" component: label + field (with optional leading/trailing
 * icon slots) + helper/error/success text underneath, all in one place so
 * every text input in the app shares the same label typography, spacing,
 * border, focus ring and state colors instead of each screen hand-rolling
 * its own version.
 */
function FormField({
  label,
  helperText,
  errorText,
  successText,
  size = "lg",
  leftIcon,
  rightIcon,
  containerClassName,
  labelClassName,
  className,
  disabled,
  id,
  ...props
}: FormFieldBaseProps & Omit<React.ComponentProps<"input">, "size">) {
  const hasError = Boolean(errorText);
  const hasSuccess = Boolean(successText) && !hasError;

  return (
    <div className={cn("flex flex-col items-start gap-1.5", containerClassName)}>
      {label && (
        <label
          htmlFor={id}
          className={cn(
            "font-['Rakuten_Sans_UI'] text-sm leading-5",
            disabled ? "text-muted-foreground" : "text-foreground",
            labelClassName
          )}
        >
          {label}
        </label>
      )}

      <div className="relative w-full">
        {leftIcon && (
          <span className="pointer-events-none absolute left-3 top-1/2 flex -translate-y-1/2 items-center text-muted-foreground">
            {leftIcon}
          </span>
        )}
        <Input
          id={id}
          inputSize={size}
          disabled={disabled}
          aria-invalid={hasError}
          className={cn(leftIcon && "pl-9", rightIcon && "pr-9", hasSuccess && "border-success", className)}
          {...props}
        />
        {rightIcon && (
          <span className="pointer-events-none absolute right-3 top-1/2 flex -translate-y-1/2 items-center text-muted-foreground">
            {rightIcon}
          </span>
        )}
      </div>

      {hasError ? (
        <p className="font-['Rakuten_Sans_UI'] text-sm leading-5 text-destructive">{errorText}</p>
      ) : hasSuccess ? (
        <div className="flex items-center gap-2">
          <CheckCircle size={18} strokeWidth={1.75} className="text-success" />
          <p className="font-['Rakuten_Sans_UI'] text-sm leading-5 text-success">{successText}</p>
        </div>
      ) : helperText ? (
        <p className="font-['Rakuten_Sans_UI'] text-sm leading-5 text-muted-foreground">{helperText}</p>
      ) : null}
    </div>
  );
}

const textareaVariants = (size: FieldSize) =>
  cn(
    inputVariants({ inputSize: size }),
    "h-auto min-h-[100px] items-start resize-none py-2"
  );

interface FormTextareaProps extends FormFieldBaseProps, Omit<React.ComponentProps<"textarea">, "size"> {}

function FormTextarea({
  label,
  helperText,
  errorText,
  successText,
  size = "lg",
  containerClassName,
  labelClassName,
  className,
  disabled,
  id,
  ...props
}: FormTextareaProps) {
  const hasError = Boolean(errorText);
  const hasSuccess = Boolean(successText) && !hasError;

  return (
    <div className={cn("flex flex-col items-start gap-1.5", containerClassName)}>
      {label && (
        <label
          htmlFor={id}
          className={cn(
            "font-['Rakuten_Sans_UI'] text-sm leading-5",
            disabled ? "text-muted-foreground" : "text-foreground",
            labelClassName
          )}
        >
          {label}
        </label>
      )}

      <textarea
        id={id}
        disabled={disabled}
        aria-invalid={hasError}
        className={cn(textareaVariants(size), hasSuccess && "border-success", className)}
        {...props}
      />

      {hasError ? (
        <p className="font-['Rakuten_Sans_UI'] text-sm leading-5 text-destructive">{errorText}</p>
      ) : hasSuccess ? (
        <div className="flex items-center gap-2">
          <CheckCircle size={18} strokeWidth={1.75} className="text-success" />
          <p className="font-['Rakuten_Sans_UI'] text-sm leading-5 text-success">{successText}</p>
        </div>
      ) : helperText ? (
        <p className="font-['Rakuten_Sans_UI'] text-sm leading-5 text-muted-foreground">{helperText}</p>
      ) : null}
    </div>
  );
}

export { FormField, FormTextarea };
