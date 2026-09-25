"use client";

import { FileUp, FolderUp } from "lucide-react";
import { FolderPlusIcon, ChevronDownIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export function UploadButton({ size = 20 }: { size?: number }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<Button variant="outline" size="lg" className="group/dropdown-menu-trigger text-body-md" />}
      >
        <FileUp size={size} strokeWidth={1.75} className="text-foreground/50" />
        Upload
        <ChevronDownIcon size={16} className="ml-1 text-foreground/50 transition-transform group-data-[popup-open]/dropdown-menu-trigger:rotate-180" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[196px]">
        <DropdownMenuItem className="gap-3 px-3 py-2.5 text-body-md">
          <FileUp size={20} strokeWidth={1.75} className="text-foreground/50" />
          Upload file
        </DropdownMenuItem>
        <DropdownMenuItem className="gap-3 px-3 py-2.5 text-body-md">
          <FolderUp size={20} strokeWidth={1.75} className="text-foreground/50" />
          Upload folder
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageToolbarProps {
  breadcrumbs: BreadcrumbItem[];
  showActions?: boolean;
  selectionCount?: number;
}

export function PageToolbar({ breadcrumbs, showActions = true, selectionCount }: PageToolbarProps) {

  return (
    <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
      <div className="flex items-center gap-2 flex-wrap">
        {breadcrumbs.map((crumb, i) => (
          <span key={i} className="flex items-center gap-2">
            {i > 0 && <span className="text-[#C7C7CC] text-[1.25rem] font-normal">/</span>}
            <span
              className={i === breadcrumbs.length - 1 ? "text-[1.25rem] font-semibold text-[#18181A]" : "text-[1.25rem] font-normal text-muted-foreground"}
              style={{ fontFamily: "'Rakuten Sans', sans-serif" }}
            >
              {crumb.label}
            </span>
          </span>
        ))}
        {selectionCount != null && selectionCount > 0 && (
          <>
            <span aria-hidden="true" className="text-[14px] leading-[20px] text-muted-foreground">|</span>
            <span className="text-[14px] leading-[20px] text-muted-foreground" role="status" aria-live="polite">
              {selectionCount} {selectionCount === 1 ? "item" : "items"} selected
            </span>
          </>
        )}
      </div>

      {showActions && (
        <div className="flex items-center gap-2">
          <Button variant="outline" size="lg" className="px-3 text-body-md sm:px-4">
            <FolderPlusIcon size={20} className="text-foreground/50" />
            <span className="hidden sm:inline">Create Folder</span>
          </Button>
          <UploadButton />
        </div>
      )}
    </div>
  );
}
