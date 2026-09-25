"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import { useViewMode } from "@/hooks/useViewMode";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FilterBar } from "@/components/drive/FilterBar";
import { FileRow } from "@/components/drive/FileRow";
import { FolderCards } from "@/components/drive/FolderCards";
import { ChevronDownIcon } from "@/components/icons";
import { Checkbox } from "@/components/ui/checkbox";
import { recentFileGroups, recentFolders, recentItems, getFolderBreadcrumb } from "@/lib/mock-data";
import type { DriveItem, ViewMode } from "@/lib/types";
import { FileGrid } from "@/components/drive/FileGrid";
import { RightSidePanel } from "@/components/drive/RightSidePanel";
import { Copy, Download, FolderInput, Info, Link2, MessageSquare, MoreVertical, Pencil, SearchX, Send, Share2, Star, Tag, Trash2, X } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useSendFilesDialog } from "@/components/drive/SendFilesModal";

export default function RecentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search") ?? "";
  const isSearching = searchQuery.trim().length > 0;
  const searchFolderId = searchParams.get("folder");
  const searchFolder = searchFolderId ? getFolderBreadcrumb(searchFolderId).at(-1) : undefined;
  const searchOrigin = searchParams.get("origin");
  const [viewMode, handleViewModeChange] = useViewMode();
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
  const listHeaderColumns = "grid-cols-[36px_minmax(0,1fr)] lg:grid-cols-[36px_minmax(0,1fr)_176px] xl:grid-cols-[36px_minmax(0,1fr)_176px_160px_180px_120px]";
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
      router.push(`/drive/folder/${item.id}`);
      return;
    }
    router.push(`/preview/${item.id}`);
  }

  return <div className="flex min-h-full flex-col">
    {!isSearching && (
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
    )}

    <section className="flex min-w-0 flex-1" aria-labelledby="recent-files-heading">
      <div className="min-w-0 flex-1">
        <div className={`sticky top-0 z-30 bg-white px-6 pt-3 ${viewMode === "list" ? "pb-0" : "pb-3"}`}>
          <div className="mb-3 flex flex-wrap items-baseline gap-2">
            {isSearching ? (
              <h1 id="recent-files-heading" className="flex items-center gap-2 text-[20px] font-semibold leading-[28px] text-[#18181A]">
                <button type="button" onClick={() => router.push(searchOrigin ?? "/drive/recent")} aria-label="Clear search" className="flex size-6 items-center justify-center rounded-full text-foreground/40 transition-colors hover:bg-[#F2F2F7] hover:text-[#18181A]">
                  <X size={16} strokeWidth={2} aria-hidden="true" />
                </button>
                {searchFolder ? (
                  <>
                    Search Results in{" "}
                    <Link href={`/drive/folder/${searchFolder.id}`} className="font-semibold text-[#0039B9] hover:underline">
                      {searchFolder.name}
                    </Link>{" "}
                    for <span className="font-bold text-muted-foreground">&ldquo;{searchQuery}&rdquo;</span>
                  </>
                ) : (
                  <>
                    Search Results for <span className="font-bold text-muted-foreground">&ldquo;{searchQuery}&rdquo;</span>
                  </>
                )}
              </h1>
            ) : (
              <h1 id="recent-files-heading" className="text-[20px] font-normal leading-[28px] text-[#18181A]">Recent files</h1>
            )}
            <span aria-hidden="true" className="text-[14px] leading-[20px] text-muted-foreground">|</span>
            <span className="text-[14px] leading-[20px] text-muted-foreground" role="status" aria-live="polite">
              {selectedItems.length > 0 ? `${selectedItems.length} ${selectedItems.length === 1 ? "item" : "items"} selected` : `${filteredItems.length} ${filteredItems.length === 1 ? "result" : "results"}`}
            </span>
          </div>
          {selectedItems.length > 0 ? (
            <div className="flex h-10 items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <button type="button" onClick={() => setSelectedItemIds([])} aria-label="Cancel selection" className="flex h-10 items-center gap-2 rounded-[8px] border border-[#E1E1E6] bg-white px-3 text-[14px] font-medium text-[#18181A] transition-colors hover:bg-[#F9F9FB]">
                  <X size={18} strokeWidth={1.75} />
                  <span className="hidden sm:inline">Cancel</span>
                </button>
                <SelectionActionToolbar selectedItems={selectedItems} />
              </div>
              <FilterBar items={recentItems} viewMode={viewMode} onItemsChange={setFilteredItems} onViewModeChange={handleViewModeChange} hideFilters searchQuery={searchQuery} endAdornment={<InfoButton onClick={() => setFolderInfoOpen((open) => !open)} />} />
            </div>
          ) : (
            <FilterBar items={recentItems} viewMode={viewMode} onItemsChange={setFilteredItems} onViewModeChange={handleViewModeChange} searchQuery={searchQuery} endAdornment={<InfoButton onClick={() => setFolderInfoOpen((open) => !open)} />} />
          )}
          {viewMode === "list" && (
            <div className={`mt-3 -mx-6 grid h-[42px] items-center border-b border-[#F2F2F7] bg-white text-left text-[14px] font-normal leading-[20px] text-muted-foreground shadow-[0_1px_0_#E5E5EA] ${listHeaderColumns}`}>
              <span className="px-3"><Checkbox checked={allFilteredItemsSelected} onCheckedChange={(checked) => toggleAllSelection(checked === true)} className="border-[#C7C7CC]" aria-label="Select all recent files" /></span>
              <span className="px-2">Name</span>
              <span className="hidden lg:block px-4">Modified</span>
              <span className="hidden xl:block px-4">Owner</span>
              <span className="hidden xl:block px-4">Location</span>
              <span className="hidden xl:block px-4">Size</span>
            </div>
          )}
        </div>
        {viewMode === "list" ? (
          <div className="w-full overflow-hidden">
            <table className="block w-full border-collapse">
              <thead className="sr-only"><tr><th>Select</th><th>Name</th><th>Modified</th><th>Size</th><th>Owner</th><th>Location</th></tr></thead>
              <tbody className="block w-full">
                {filteredGroups.length === 0
                  ? <tr className="block w-full"><td colSpan={6} className="block w-full">
                      {isSearching ? (
                        <div className="flex w-full flex-col items-center justify-center gap-4 py-24 text-center">
                          <div className="flex size-16 items-center justify-center rounded-full bg-[#F2F2F7]">
                            <SearchX size={32} className="text-foreground/40" aria-hidden="true" />
                          </div>
                          <div className="flex flex-col gap-1">
                            <p className="text-[16px] font-medium text-[#18181A]">No results for &ldquo;<span className="text-muted-foreground">{searchQuery}</span>&rdquo;</p>
                            <p className="text-[14px] text-muted-foreground">Try different keywords or remove filters</p>
                          </div>
                        </div>
                      ) : (
                        <div className="w-full py-16 text-center text-[14px] text-muted-foreground">No files match the selected filters.</div>
                      )}
                    </td></tr>
                  : filteredGroups.map(({ group, items }) => (
                    <Fragment key={group}>
                      <tr className={`grid w-full ${listHeaderColumns}`}><td colSpan={6} className="col-span-full h-12 bg-white pl-3 pt-3 text-[14px] text-muted-foreground">{group}</td></tr>
                      {items.map((item) => (
                        <FileRow key={item.id} item={item} showOwner showLocation compact metadataBreakpoint={metadataBreakpoint} overlayActions showCheckbox={selectedItemIds.length > 0} showMobileMetadata selected={selectedItemIds.includes(item.id)} onSelect={() => toggleItemSelection(item.id)} onOpen={selectedItems.length === 0 ? () => openItem(item) : undefined} onInfo={() => setFolderInfoOpen(true)} gridColumns={listHeaderColumns} />
                      ))}
                    </Fragment>
                  ))
                }
              </tbody>
            </table>
          </div>
        ) : <FileGrid items={filteredItems} selectedItemIds={selectedItemIds} onSelect={toggleItemSelection} onOpen={openItem} />}
      </div>
      {folderInfoOpen && <RightSidePanel items={selectedItems} folderInfo={recentFolders.find((folder) => folder.location.includes("Team")) ?? recentFolders[0]} onCloseFolderInfo={() => setFolderInfoOpen(false)} />}
    </section>
  </div>;
}

function InfoButton({ onClick }: { onClick: () => void }) {
  return <Tooltip><TooltipTrigger onClick={onClick} aria-label="Toggle folder information" className="flex size-10 items-center justify-center rounded-[8px] border border-[#E5E5EA] bg-white text-foreground/50 transition-[background-color,transform] duration-150 hover:bg-[#F9F9FB] active:scale-[0.96] motion-reduce:transition-none"><Info size={20} strokeWidth={1.75} aria-hidden="true" /></TooltipTrigger><TooltipContent>Folder information</TooltipContent></Tooltip>;
}

function SelectionActionToolbar({ selectedItems }: { selectedItems: DriveItem[] }) {
  const openSendFiles = useSendFilesDialog();
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
    { label: "Download", icon: Download, onClick: undefined as (() => void) | undefined },
    { label: "Share", icon: Share2, onClick: undefined as (() => void) | undefined },
    { label: "Copy link", icon: Link2, hideBelow: "md", onClick: undefined as (() => void) | undefined },
    { label: "Send files", icon: Send, hideBelow: "md", onClick: () => openSendFiles(selectedItems) },
    { label: "Add to starred", icon: Star, hideBelow: "xl", onClick: undefined as (() => void) | undefined },
    { label: "Move to", icon: FolderInput, hideBelow: "xl", onClick: undefined as (() => void) | undefined },
  ];

  return (
    <div ref={menuRef} className="relative flex items-center gap-0.5">
      {primaryActions.map(({ label, icon: Icon, hideBelow, onClick }) => (
        <button key={label} type="button" aria-label={label} onClick={onClick} className={`items-center gap-1.5 whitespace-nowrap rounded-[8px] px-2 md:px-3 text-[14px] font-medium transition-[background-color,transform] duration-150 active:scale-[0.96] motion-reduce:transition-none text-[#002896] hover:bg-[rgba(0,40,150,0.06)] h-9 ${hideBelow === "md" ? "hidden md:flex" : hideBelow === "xl" ? "hidden xl:flex" : "flex"}`}>
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
          {[{ label: "Copy link", icon: Link2, hideAbove: "md", onClick: undefined as (() => void) | undefined }, { label: "Send files", icon: Send, hideAbove: "md", onClick: () => { setMoreOpen(false); openSendFiles(selectedItems); } }, { label: "Add to starred", icon: Star, hideAbove: "xl", onClick: undefined as (() => void) | undefined }, { label: "Move to", icon: FolderInput, hideAbove: "xl", onClick: undefined as (() => void) | undefined }, { label: "Rename", icon: Pencil, onClick: undefined as (() => void) | undefined }, { label: "Make a copy", icon: Copy, onClick: undefined as (() => void) | undefined }, { label: "Write a comment", icon: MessageSquare, onClick: undefined as (() => void) | undefined }, { label: "Add or edit tags", icon: Tag, onClick: undefined as (() => void) | undefined }].map(({ label, icon: Icon, hideAbove, onClick }) => (
            <button key={label} type="button" role="menuitem" onClick={onClick ?? (() => setMoreOpen(false))} className={`h-10 w-full items-center gap-3 px-3 text-left text-body-md text-[#18181A] hover:bg-[#F9F9FB] focus:bg-[#F9F9FB] focus:outline-none ${hideAbove === "md" ? "flex md:hidden" : hideAbove === "xl" ? "flex xl:hidden" : "flex"}`}>
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

