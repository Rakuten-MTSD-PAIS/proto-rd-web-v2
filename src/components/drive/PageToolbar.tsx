"use client";

import { useState } from "react";
import { FileUp, FolderUp } from "lucide-react";
import { FolderPlusIcon, ChevronDownIcon } from "@/components/icons";

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
  const [uploadMenuOpen, setUploadMenuOpen] = useState(false);

  return (
    <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
      <div className="flex items-center gap-2 flex-wrap">
        {breadcrumbs.map((crumb, i) => (
          <span key={i} className="flex items-center gap-2">
            {i > 0 && <span className="text-[#C7C7CC] text-[20px] font-normal">/</span>}
            <span
              className={i === breadcrumbs.length - 1 ? "text-title-lg font-semibold text-[#18181A]" : "text-title-lg font-normal text-muted-foreground"}
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
          <button className="flex h-10 items-center gap-2 rounded-[8px] border border-[#E1E1E6] bg-white px-3 sm:px-4 text-body-md font-medium text-[#18181A] transition-colors hover:bg-[#F9F9FB]">
            <FolderPlusIcon size={20} className="text-foreground/50" />
            <span className="hidden sm:inline">Create Folder</span>
          </button>
          <div className="relative">
            <button
              type="button"
              onClick={() => setUploadMenuOpen((open) => !open)}
              aria-expanded={uploadMenuOpen}
              aria-haspopup="menu"
              className="flex h-10 items-center gap-2 rounded-[8px] border border-[#E1E1E6] bg-white px-4 text-body-md font-medium text-[#18181A] transition-colors hover:bg-[#F9F9FB]"
            >
              <FileUp size={20} strokeWidth={1.75} className="text-foreground/50" />
              Upload
              <ChevronDownIcon size={16} className={`ml-1 text-foreground/50 transition-transform ${uploadMenuOpen ? "rotate-180" : ""}`} />
            </button>
            {uploadMenuOpen && (
              <div className="absolute right-0 top-[calc(100%+8px)] z-[60] w-[196px] rounded-[8px] border border-[#E1E1E6] bg-white py-1 shadow-[0_6px_16px_rgba(24,24,26,0.14)]" role="menu" aria-label="Upload options">
                <button type="button" role="menuitem" className="flex w-full items-center gap-3 px-4 py-3 text-left text-body-md text-[#18181A] hover:bg-[#F9F9FB]"><FileUp size={20} strokeWidth={1.75} className="text-foreground/50" />Upload file</button>
                <button type="button" role="menuitem" className="flex w-full items-center gap-3 px-4 py-3 text-left text-body-md text-[#18181A] hover:bg-[#F9F9FB]"><FolderUp size={20} strokeWidth={1.75} className="text-foreground/50" />Upload folder</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
