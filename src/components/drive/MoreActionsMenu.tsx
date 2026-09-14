"use client";

import { useEffect, useRef, useState } from "react";
import { Copy, Download, FolderInput, MoreVertical, Pencil, Share2, Star, Trash2 } from "lucide-react";

interface MoreActionsMenuProps {
  itemName: string;
  isFolder?: boolean;
}

const actions = [
  { label: "Download", icon: Download },
  { label: "Rename", icon: Pencil },
  { label: "Make a copy", icon: Copy },
  { label: "Move to", icon: FolderInput },
  { label: "Add to starred", icon: Star },
];

export function ShareActionIcon() {
  return <Share2 size={18} strokeWidth={1.75} aria-hidden="true" />;
}

export function MoreActionsMenu({ itemName, isFolder = false }: MoreActionsMenuProps) {
  const [open, setOpen] = useState(false);
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

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        className={`flex size-8 items-center justify-center rounded-[6px] text-[#636366] transition-[background-color,transform] duration-150 ease-out hover:bg-[#E5E5EA] hover:text-[#18181A] active:scale-[0.96] motion-reduce:transition-none ${open ? "bg-[#E5E5EA] text-[#18181A]" : ""}`}
        aria-label={`More actions for ${itemName}`}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={(event) => {
          event.stopPropagation();
          setOpen((value) => !value);
        }}
      >
        <MoreVertical size={18} strokeWidth={1.75} aria-hidden="true" />
      </button>
      {open && (
        <div className="absolute right-0 top-[calc(100%+6px)] z-40 w-[220px] overflow-hidden rounded-[8px] border border-[#E1E1E6] bg-white py-1 shadow-[0_8px_24px_rgba(24,24,26,0.14)]" role="menu" aria-label={`Actions for ${itemName}`}>
          {actions.filter((action) => !isFolder || action.label !== "Download").map(({ label, icon: Icon }) => (
            <button key={label} type="button" role="menuitem" onClick={() => setOpen(false)} className="flex h-10 w-full items-center gap-3 px-3 text-left text-[14px] text-[#18181A] hover:bg-[#F9F9FB] focus:bg-[#F9F9FB] focus:outline-none">
              <Icon size={18} strokeWidth={1.75} className="text-[#636366]" aria-hidden="true" />
              {label}
            </button>
          ))}
          <div className="my-1 border-t border-[#E5E5EA]" />
          <button type="button" role="menuitem" onClick={() => setOpen(false)} className="flex h-10 w-full items-center gap-3 px-3 text-left text-[14px] text-[#C10503] hover:bg-[#FFF5F5] focus:bg-[#FFF5F5] focus:outline-none">
            <Trash2 size={18} strokeWidth={1.75} aria-hidden="true" />
            Move to trash
          </button>
        </div>
      )}
    </div>
  );
}
