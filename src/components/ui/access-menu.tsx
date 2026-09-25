"use client";

import type { ComponentType } from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "cn";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export interface AccessMenuOption<Value extends string> {
  value: Value;
  label: string;
  description?: string;
  icon?: ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
}

interface AccessMenuProps<Value extends string> {
  value: Value;
  options: readonly AccessMenuOption<Value>[];
  onChange: (value: Value) => void;
  triggerClassName?: string;
  contentClassName?: string;
}

// Shared selection-list palette — keep in sync with FilterBar's Type/Modified/People
// menus so every single-select dropdown in the app looks and behaves the same.
// (bg-[#F0F2FF]/hover:bg-[#F6F7FC] are applied as literal Tailwind classes below,
// since Tailwind can't pick up interpolated arbitrary values.)
const SELECTED_TEXT = "#002896";
const TEXT = "#18181A";
const MUTED_TEXT = "#636366";

/**
 * Labeled dropdown for single-select pickers (e.g. link-sharing audience,
 * permission level, or any "choose one of N" menu). Selected option gets a
 * checkmark and a persistent tint; hovering the selected row does NOT change
 * its background (using `!` so this can't lose to the shared
 * DropdownMenuItem's own focus/hover defaults, regardless of specificity).
 */
export function AccessMenu<Value extends string>({
  value,
  options,
  onChange,
  triggerClassName,
  contentClassName,
}: AccessMenuProps<Value>) {
  const selected = options.find((o) => o.value === value);
  const hasDescriptions = options.some((o) => o.description);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "group/dropdown-menu-trigger flex items-center gap-1 font-['Rakuten_Sans_UI'] text-[14px] font-semibold text-[#002896] hover:underline data-[popup-open]:underline",
          triggerClassName
        )}
      >
        {selected?.label}
        <ChevronDown size={14} strokeWidth={2} className="transition-transform duration-150 group-data-[popup-open]/dropdown-menu-trigger:rotate-180" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className={cn(hasDescriptions ? "min-w-max" : "min-w-[220px]", contentClassName)}>
        {options.map((opt) => {
          const isSelected = opt.value === value;
          return (
            <DropdownMenuItem
              key={opt.value}
              onClick={() => onChange(opt.value)}
              className={cn(
                "justify-between gap-2.5 px-3.5",
                hasDescriptions ? "items-start py-2.5" : "h-10",
                "!text-inherit focus:**:!text-inherit",
                isSelected ? "!bg-[#F0F2FF]" : "!bg-transparent"
              )}
            >
              {opt.description ? (
                <span className="flex items-start gap-2.5">
                  {opt.icon && <opt.icon size={16} strokeWidth={1.75} className={cn("mt-0.5 shrink-0", isSelected ? "text-[#002896]" : "text-[#636366]")} />}
                  <span className="flex flex-col">
                    <span className="font-['Rakuten_Sans_UI'] text-[15px] font-medium" style={{ color: isSelected ? SELECTED_TEXT : TEXT }}>
                      {opt.label}
                    </span>
                    <span className="whitespace-nowrap font-['Rakuten_Sans_UI'] text-[13px]" style={{ color: isSelected ? SELECTED_TEXT : MUTED_TEXT }}>
                      {opt.description}
                    </span>
                  </span>
                </span>
              ) : (
                <span className="flex items-center gap-2.5">
                  {opt.icon && <opt.icon size={16} strokeWidth={1.75} className={cn("shrink-0", isSelected ? "text-[#002896]" : "text-[#636366]")} />}
                  <span className="font-['Rakuten_Sans_UI'] text-[14px]" style={{ color: isSelected ? SELECTED_TEXT : TEXT, fontWeight: isSelected ? 600 : 400 }}>
                    {opt.label}
                  </span>
                </span>
              )}
              {isSelected && (
                <Check size={16} strokeWidth={2.5} className={cn("shrink-0", hasDescriptions && "mt-0.5")} style={{ color: SELECTED_TEXT }} />
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
