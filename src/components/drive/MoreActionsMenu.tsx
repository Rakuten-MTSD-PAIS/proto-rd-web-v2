"use client";

import { useEffect, useRef, useState } from "react";
import { Copy, Download, FolderInput, Link2, MessageSquare, MoreVertical, Pencil, Send, Share2, Star, Tag, Trash2, StarOff } from "lucide-react";
import { ShareLineIcon } from "@/components/icons";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useSendFilesDialog } from "@/components/drive/SendFilesModal";
import type { DriveItem } from "@/lib/types";

interface MoreActionsMenuProps {
  itemName: string;
  isFolder?: boolean;
  /** Passed so Info appears in the dropdown on mobile (where hover pill is hidden). */
  onInfo?: () => void;
  starred?: boolean;
  /** Full item so Send files pre-loads it in the modal. */
  driveItem?: DriveItem;
}

export function ShareActionIcon() {
  return <ShareLineIcon size={18} aria-hidden="true" />;
}

export function MoreActionsMenu({ itemName, isFolder = false, onInfo, starred = false, driveItem }: MoreActionsMenuProps) {
  const [open, setOpen] = useState(false);
  const openSendFiles = useSendFilesDialog();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onOutsidePress = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onOutsidePress);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("mousedown", onOutsidePress);
      document.removeEventListener("keydown", onEscape);
    };
  }, []);

  const btn = "flex h-10 w-full items-center gap-3 px-3 text-left text-body-md text-[#18181A] hover:bg-[#F9F9FB] focus:bg-[#F9F9FB] focus:outline-none";

  return (
    <div ref={menuRef} className="relative">
      <Tooltip><TooltipTrigger
        type="button"
        className={`flex size-8 items-center justify-center rounded-[6px] text-foreground transition-[background-color,transform] duration-150 hover:bg-[#E5E5EA] active:scale-[0.96] motion-reduce:transition-none ${open ? "bg-[#E5E5EA]" : ""}`}
        aria-label={`More actions for ${itemName}`}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={(event) => {
          event.stopPropagation();
          setOpen((value) => !value);
        }}
      >
        <MoreVertical size={18} strokeWidth={1.75} aria-hidden="true" />
      </TooltipTrigger><TooltipContent>More actions</TooltipContent></Tooltip>

      {open && (
        <div className="animate-in fade-in zoom-in-95 duration-100 absolute right-0 top-[calc(100%+6px)] z-[60] w-[220px] overflow-hidden rounded-[8px] border border-[#E1E1E6] bg-white py-1 shadow-[0_8px_24px_rgba(24,24,26,0.14)]" role="menu" aria-label={`Actions for ${itemName}`}>

          {/* Mobile-only group: hover pill is hidden on small screens so show these here */}
          <div className="sm:hidden">
            {!isFolder && (
              <button type="button" role="menuitem" onClick={() => setOpen(false)} className={btn}>
                <Download size={18} strokeWidth={1.75} className="text-foreground/50" aria-hidden="true" />Download
              </button>
            )}
            <button type="button" role="menuitem" onClick={() => setOpen(false)} className={btn}>
              <Share2 size={18} strokeWidth={1.75} className="text-foreground/50" aria-hidden="true" />Share
            </button>
            <button type="button" role="menuitem" onClick={() => setOpen(false)} className={btn}>
              <Link2 size={18} strokeWidth={1.75} className="text-foreground/50" aria-hidden="true" />Copy link
            </button>
            {onInfo && (
              <button type="button" role="menuitem" onClick={() => { setOpen(false); onInfo(); }} className={btn}>
                <Star size={18} strokeWidth={1.75} className="text-foreground/50" aria-hidden="true" />{starred ? "Remove from starred" : "Add to starred"}
              </button>
            )}
            <div className="my-1 border-t border-[#E5E5EA]" />
          </div>

          {/* Always visible actions */}
          <button type="button" role="menuitem" onClick={() => { setOpen(false); openSendFiles(driveItem ? [driveItem] : undefined); }} className={btn}>
            <Send size={18} strokeWidth={1.75} className="text-foreground/50" aria-hidden="true" />Send files
          </button>
          <div className="my-1 border-t border-[#E5E5EA]" />
          <button type="button" role="menuitem" onClick={() => setOpen(false)} className={btn}>
            <Pencil size={18} strokeWidth={1.75} className="text-foreground/50" aria-hidden="true" />Rename
          </button>
          <button type="button" role="menuitem" onClick={() => setOpen(false)} className={btn}>
            <Copy size={18} strokeWidth={1.75} className="text-foreground/50" aria-hidden="true" />Make a copy
          </button>
          <button type="button" role="menuitem" onClick={() => setOpen(false)} className={btn}>
            <FolderInput size={18} strokeWidth={1.75} className="text-foreground/50" aria-hidden="true" />Move to
          </button>
          <button type="button" role="menuitem" onClick={() => setOpen(false)} className={btn}>
            {starred ? <StarOff size={18} strokeWidth={1.75} className="text-foreground/50" aria-hidden="true" /> : <Star size={18} strokeWidth={1.75} className="text-foreground/50" aria-hidden="true" />}{starred ? "Remove from starred" : "Add to starred"}
          </button>
          <button type="button" role="menuitem" onClick={() => setOpen(false)} className={btn}>
            <MessageSquare size={18} strokeWidth={1.75} className="text-foreground/50" aria-hidden="true" />Write a comment
          </button>
          <button type="button" role="menuitem" onClick={() => setOpen(false)} className={btn}>
            <Tag size={18} strokeWidth={1.75} className="text-foreground/50" aria-hidden="true" />Add or edit tags
          </button>
          <div className="my-1 border-t border-[#E5E5EA]" />
          <button type="button" role="menuitem" onClick={() => setOpen(false)} className="flex h-10 w-full items-center gap-3 px-3 text-left text-body-md text-[#C10503] hover:bg-[#FFF5F5] focus:bg-[#FFF5F5] focus:outline-none">
            <Trash2 size={18} strokeWidth={1.75} aria-hidden="true" />Move to trash
          </button>
        </div>
      )}
    </div>
  );
}
