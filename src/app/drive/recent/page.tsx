"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FilterBar } from "@/components/drive/FilterBar";
import { FileRow } from "@/components/drive/FileRow";
import { FolderCards } from "@/components/drive/FolderCards";
import { ChevronDownIcon } from "@/components/icons";
import { Checkbox } from "@/components/ui/checkbox";
import { recentFileGroups, recentFolders, recentItems } from "@/lib/mock-data";
import type { DriveItem, ViewMode } from "@/lib/types";
import { FileGrid } from "@/components/drive/FileGrid";
import { RightSidePanel } from "@/components/drive/RightSidePanel";
import { Copy, Download, FolderInput, Info, Link2, MessageSquare, MoreVertical, Pencil, Send, Share2, Star, Tag, Trash2, X } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export default function RecentPage() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [foldersOpen, setFoldersOpen] = useState(true);
  const [filteredItems, setFilteredItems] = useState(recentItems);
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
  const [folderInfoOpen, setFolderInfoOpen] = useState(false);

  const filteredIds = new Set(filteredItems.map((item) => item.id));
  const filteredGroups = recentFileGroups
    .map(({ group, items }) => ({ group, items: items.filter((item) => filteredIds.has(item.id)) }))
    .filter(({ items }) => items.length > 0);
  const selectedItems = recentItems.filter((item) => selectedItemIds.includes(item.id));
  const allFilteredItemsSelected = filteredItems.length > 0 && filteredItems.every((item) => selectedItemIds.includes(item.id));
  const listHeaderColumns = "grid-cols-[36px_minmax(0,1fr)] lg:grid-cols-[36px_minmax(0,1fr)_176px] xl:grid-cols-[36px_minmax(0,1fr)_176px_120px_160px_180px]";
  const metadataBreakpoint = "xl";

  function toggleItemSelection(id: string) {
    setSelectedItemIds((current) => current.includes(id) ? current.filter((itemId) => itemId !== id) : [...current, id]);
  }

  function toggleAllSelection(checked: boolean) {
    const filteredItemIds = new Set(filteredItems.map((item) => item.id));
    setSelectedItemIds((current) => checked
      ? [...new Set([...current, ...filteredItemIds])]
      : current.filter((id) => !filteredItemIds.has(id)));
  }

  function openItem(item: DriveItem) {
    if (item.type === "folder") {
      router.push(item.location === "Team Drive" ? "/drive/team-drive" : "/drive/my-drive");
      return;
    }
    router.push(`/drive/recent/${item.id}`);
  }

  return <div className="flex min-h-full flex-col">
    <section aria-labelledby="recent-folders-heading">
      <div className="flex items-center px-6 py-3">
        <h2 id="recent-folders-heading" className="text-[20px] font-normal leading-[28px] text-muted-foreground">
          <button type="button" onClick={() => setFoldersOpen((open) => !open)} className="flex min-h-10 items-center gap-3 rounded-[6px] transition-colors hover:text-[#18181A]" aria-expanded={foldersOpen} aria-controls="recent-folders-content">
            <ChevronDownIcon size={12} className={`shrink-0 text-foreground/50 transition-transform motion-reduce:transition-none ${foldersOpen ? "" : "-rotate-90"}`} aria-hidden="true" />
            Recent folders
          </button>
        </h2>
      </div>
      {foldersOpen && <div id="recent-folders-content"><FolderCards folders={recentFolders} /></div>}
    </section>

    <section className="flex min-w-0 flex-1" aria-labelledby="recent-files-heading">
      <div className="min-w-0 flex-1">
        <div className={`sticky top-0 z-30 bg-white px-6 pt-3 ${viewMode === "list" ? "pb-0" : "pb-3"}`}>
          <div className="mb-3 flex items-baseline gap-2">
            <h1 id="recent-files-heading" className="text-[20px] font-normal leading-[28px] text-[#18181A]">Recent files</h1>
            <span aria-hidden="true" className="text-[14px] leading-[20px] text-muted-foreground">|</span>
            <span className="text-[14px] leading-[20px] text-muted-foreground" role="status" aria-live="polite">
              {selectedItems.length > 0 ? `${selectedItems.length} ${selectedItems.length === 1 ? "item" : "items"} selected` : `${filteredItems.length} items`}
            </span>
          </div>
          {selectedItems.length > 0 ? (
            <div className="flex h-10 items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <button type="button" onClick={() => setSelectedItemIds([])} aria-label="Cancel selection" className="flex h-10 items-center gap-2 rounded-[8px] border border-[#E1E1E6] bg-white px-3 text-[14px] font-medium text-[#18181A] transition-colors hover:bg-[#F9F9FB]">
                  <X size={18} strokeWidth={1.75} />
                  <span className="hidden sm:inline">Cancel</span>
                </button>
                <SelectionActionToolbar />
              </div>
              <FilterBar items={recentItems} viewMode={viewMode} onItemsChange={setFilteredItems} onViewModeChange={setViewMode} hideFilters endAdornment={<InfoButton onClick={() => setFolderInfoOpen((open) => !open)} />} />
            </div>
          ) : (
            <FilterBar items={recentItems} viewMode={viewMode} onItemsChange={setFilteredItems} onViewModeChange={setViewMode} endAdornment={<InfoButton onClick={() => setFolderInfoOpen((open) => !open)} />} />
          )}
          {viewMode === "list" && (
            <div className={`mt-3 -mx-6 grid h-[42px] items-center border-b border-[#F2F2F7] bg-white text-left text-[14px] font-normal leading-[20px] text-muted-foreground shadow-[0_1px_0_#E5E5EA] ${listHeaderColumns}`}>
              <span className="px-3"><Checkbox checked={allFilteredItemsSelected} onCheckedChange={(checked) => toggleAllSelection(checked === true)} className="border-[#C7C7CC]" aria-label="Select all recent files" /></span>
              <span className="px-2">Name</span>
              <span className="hidden lg:block px-4">Modified</span>
              <span className="hidden xl:block px-4">Size</span>
              <span className="hidden xl:block px-4">Owner</span>
              <span className="hidden xl:block px-4">Location</span>
            </div>
          )}
        </div>
        {viewMode === "list" ? (
          <div className="w-full overflow-hidden">
            <table className="block w-full border-collapse">
              <thead className="sr-only"><tr><th>Select</th><th>Name</th><th>Modified</th><th>Size</th><th>Owner</th><th>Location</th></tr></thead>
              <tbody className="block w-full">
                {filteredGroups.length === 0
                  ? <tr><td colSpan={6} className="block py-12 text-center text-[14px] text-muted-foreground">No files match the selected filters.</td></tr>
                  : filteredGroups.map(({ group, items }) => (
                    <Fragment key={group}>
                      <tr className={`grid w-full ${listHeaderColumns}`}><td colSpan={6} className="col-span-full h-12 bg-white pl-3 pt-3 text-[14px] text-muted-foreground">{group}</td></tr>
                      {items.map((item) => (
                        <FileRow key={item.id} item={item} showOwner showLocation compact metadataBreakpoint={metadataBreakpoint} overlayActions showCheckbox={selectedItemIds.length > 0} showMobileMetadata selected={selectedItemIds.includes(item.id)} onSelect={() => toggleItemSelection(item.id)} onOpen={selectedItems.length === 0 ? () => openItem(item) : undefined} selectOnMetadata gridColumns={listHeaderColumns} />
                      ))}
                    </Fragment>
                  ))
                }
              </tbody>
            </table>
          </div>
        ) : <FileGrid items={filteredItems} selectedItemIds={selectedItemIds} onSelect={toggleItemSelection} />}
      </div>
      {folderInfoOpen && <RightSidePanel items={selectedItems} folderInfo={recentFolders.find((folder) => folder.location.includes("Team")) ?? recentFolders[0]} onCloseFolderInfo={() => setFolderInfoOpen(false)} />}
    </section>
  </div>;
}

function InfoButton({ onClick }: { onClick: () => void }) {
  return <Tooltip><TooltipTrigger onClick={onClick} aria-label="Toggle folder information" className="flex size-10 items-center justify-center rounded-[8px] border border-[#E5E5EA] bg-white text-foreground/50 transition-[background-color,transform] duration-150 hover:bg-[#F9F9FB] active:scale-[0.96] motion-reduce:transition-none"><Info size={20} strokeWidth={1.75} aria-hidden="true" /></TooltipTrigger><TooltipContent>Folder information</TooltipContent></Tooltip>;
}

function SelectionActionToolbar() {
  const [moreOpen, setMoreOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!moreOpen) return;
    function handleClick(e: MouseEvent) {
      if (!menuRef.current?.contains(e.target as Node)) setMoreOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [moreOpen]);
  const primaryActions = [
    { label: "Download", icon: Download },
    { label: "Share", icon: Share2 },
    { label: "Copy link", icon: Link2, hideBelow: "md" },
    { label: "Send files", icon: Send, hideBelow: "md" },
    { label: "Add to starred", icon: Star, hideBelow: "xl" },
    { label: "Move to", icon: FolderInput, hideBelow: "xl" },
  ];

  return (
    <div ref={menuRef} className="relative flex items-center gap-0.5">
      {primaryActions.map(({ label, icon: Icon, hideBelow }) => (
        <button key={label} type="button" aria-label={label} className={`items-center gap-1.5 whitespace-nowrap rounded-[8px] px-2 md:px-3 text-[14px] font-medium transition-[background-color,transform] duration-150 active:scale-[0.96] motion-reduce:transition-none text-[#002896] hover:bg-[rgba(0,40,150,0.06)] h-9 ${hideBelow === "md" ? "hidden md:flex" : hideBelow === "xl" ? "hidden xl:flex" : "flex"}`}>
          <Icon size={16} strokeWidth={1.75} aria-hidden="true" />
          <span>{label}</span>
        </button>
      ))}
      <div className="relative">
      <button type="button" onClick={() => setMoreOpen((open) => !open)} aria-label="More selection actions" aria-haspopup="menu" aria-expanded={moreOpen} className={`flex size-9 items-center justify-center rounded-[8px] text-[#002896] transition-[background-color,transform] duration-150 hover:bg-[rgba(0,40,150,0.06)] active:scale-[0.96] motion-reduce:transition-none ${moreOpen ? "bg-[rgba(0,40,150,0.06)]" : ""}`}>
        <MoreVertical size={18} strokeWidth={1.75} aria-hidden="true" />
      </button>
      {moreOpen && (
        <div className="absolute right-0 top-[calc(100%+8px)] z-[60] w-[220px] overflow-hidden rounded-[8px] border border-[#E1E1E6] bg-white py-1 shadow-[0_8px_24px_rgba(24,24,26,0.14)]" role="menu" aria-label="More selection actions">
          {[{ label: "Copy link", icon: Link2, hideAbove: "md" }, { label: "Send files", icon: Send, hideAbove: "md" }, { label: "Add to starred", icon: Star, hideAbove: "xl" }, { label: "Move to", icon: FolderInput, hideAbove: "xl" }, { label: "Rename", icon: Pencil }, { label: "Make a copy", icon: Copy }, { label: "Write a comment", icon: MessageSquare }, { label: "Add or edit tags", icon: Tag }].map(({ label, icon: Icon, hideAbove }) => (
            <button key={label} type="button" role="menuitem" onClick={() => setMoreOpen(false)} className={`h-10 w-full items-center gap-3 px-3 text-left text-body-md text-[#18181A] hover:bg-[#F9F9FB] focus:bg-[#F9F9FB] focus:outline-none ${hideAbove === "md" ? "flex md:hidden" : hideAbove === "xl" ? "flex xl:hidden" : "flex"}`}>
              <Icon size={18} strokeWidth={1.75} className="text-foreground/50" aria-hidden="true" />{label}
            </button>
          ))}
          <div className="my-1 border-t border-[#E5E5EA]" />
          <button type="button" role="menuitem" onClick={() => setMoreOpen(false)} className="flex h-10 w-full items-center gap-3 px-3 text-left text-body-md text-[#C10503] hover:bg-[#FFF5F5] focus:bg-[#FFF5F5] focus:outline-none">
            <Trash2 size={18} strokeWidth={1.75} aria-hidden="true" />Move to trash
          </button>
        </div>
      )}
      </div>
    </div>
  );
}

