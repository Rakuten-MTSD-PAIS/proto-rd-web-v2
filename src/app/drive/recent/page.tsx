"use client";

import { Fragment, useState } from "react";
import { useRouter } from "next/navigation";
import { FilterBar } from "@/components/drive/FilterBar";
import { FileRow } from "@/components/drive/FileRow";
import { FolderCards } from "@/components/drive/FolderCards";
import { ChevronDownIcon } from "@/components/icons";
import { Checkbox } from "@/components/ui/checkbox";
import { recentFileGroups, recentFolders, recentItems } from "@/lib/mock-data";
import type { DriveItem, ViewMode } from "@/lib/types";
import { FileIcon } from "@/components/drive/FileIcon";
import { MoreActionsMenu } from "@/components/drive/MoreActionsMenu";
import { RightSidePanel } from "@/components/drive/RightSidePanel";
import { Download, FolderInput, Info, Link2, MoreVertical, Send, Share2, Trash2 } from "lucide-react";
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
  const listHeaderColumns = selectedItems.length > 0
    ? "grid-cols-[36px_minmax(0,1fr)_176px] xl:grid-cols-[36px_minmax(0,1fr)_176px_120px_160px_180px]"
    : "grid-cols-[36px_minmax(0,1fr)_176px] xl:grid-cols-[36px_minmax(0,1fr)_176px_120px_160px_180px]";
  const metadataHeaderVisibility = "hidden xl:block";
  const metadataTableHeaderVisibility = "hidden xl:table-cell";
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
        <h2 id="recent-folders-heading" className="text-[20px] font-normal leading-[28px] text-[#636366]">
          <button type="button" onClick={() => setFoldersOpen((open) => !open)} className="flex min-h-10 items-center gap-3 rounded-[6px] transition-colors hover:text-[#18181A]" aria-expanded={foldersOpen} aria-controls="recent-folders-content">
            <ChevronDownIcon size={12} className={`shrink-0 transition-transform motion-reduce:transition-none ${foldersOpen ? "" : "-rotate-90"}`} aria-hidden="true" />
            Recent folders
          </button>
        </h2>
      </div>
      {foldersOpen && <div id="recent-folders-content"><FolderCards folders={recentFolders} /></div>}
    </section>

    <section className="flex min-w-0 flex-1" aria-labelledby="recent-files-heading">
      <div className="min-w-0 flex-1">
        <div className={`sticky top-0 z-20 bg-white px-6 pt-3 ${viewMode === "list" ? "pb-0" : "pb-3"}`}>
          {selectedItems.length > 0 ? <>
            <div className="mb-3 flex items-baseline gap-2"><h1 id="recent-files-heading" className="text-[20px] font-normal leading-[28px] text-[#18181A]">Recent files</h1><span className="text-[14px] leading-[20px] text-[#636366]" role="status" aria-live="polite">{selectedItems.length} {selectedItems.length === 1 ? "item" : "items"} selected</span></div>
            <div className="flex min-h-10 items-center gap-3">
              <button type="button" onClick={() => setSelectedItemIds([])} className="inline-flex h-8 items-center rounded-[8px] border border-[#E5E5EA] px-4 text-[14px] leading-[20px] text-[#18181A] transition-colors hover:bg-[#F9F9FB]">×&nbsp;Cancel</button>
              <SelectionActionToolbar />
              <div className="ml-auto"><FilterBar items={recentItems} viewMode={viewMode} onItemsChange={setFilteredItems} onViewModeChange={setViewMode} hideFilters endAdornment={<InfoButton onClick={() => setFolderInfoOpen((open) => !open)} />} /></div>
            </div>
          </> : <>
            <div className="mb-3 flex items-baseline gap-2">
              <h1 id="recent-files-heading" className="text-[20px] font-normal leading-[28px] text-[#18181A]">Recent files</h1>
              <span className="text-[14px] leading-[20px] text-[#636366]" role="status" aria-live="polite">{filteredItems.length} items</span>
            </div>
            <FilterBar items={recentItems} viewMode={viewMode} onItemsChange={setFilteredItems} onViewModeChange={setViewMode} endAdornment={<InfoButton onClick={() => setFolderInfoOpen((open) => !open)} />} />
          </>}
          {viewMode === "list" && <div className={`mt-3 -mx-6 h-[42px] items-center border-b border-[#F2F2F7] bg-white text-left text-[14px] font-normal leading-[20px] text-[#636366] shadow-[0_1px_0_#E5E5EA] ${selectedItems.length > 0 ? "hidden sm:grid" : "grid"} ${listHeaderColumns}`}>
            <span className="px-3"><Checkbox checked={allFilteredItemsSelected} onCheckedChange={(checked) => toggleAllSelection(checked === true)} className="border-[#C7C7CC]" aria-label="Select all recent files" /></span>
            <span className="px-2">Name</span>
            <span className={`px-4 ${selectedItems.length > 0 ? "text-right" : ""}`}>Modified</span>
            <span className={`${metadataHeaderVisibility} px-4 ${selectedItems.length > 0 ? "text-right" : ""}`}>Size</span>
            <span className={`${metadataHeaderVisibility} px-4`}>Owner</span>
            <span className={`${metadataHeaderVisibility} px-4 ${selectedItems.length > 0 ? "text-right" : ""}`}>Location</span>
          </div>}
        </div>
        {viewMode === "list" ? <>
        {selectedItems.length > 0 && <MobileSelectionList groups={filteredGroups} selectedItemIds={selectedItemIds} onSelect={toggleItemSelection} />}
        <div className={`w-full overflow-hidden ${selectedItems.length > 0 ? "hidden sm:block" : ""}`}>
        <table className="block w-full border-collapse">
          <thead className="sr-only">
            <tr className="h-[42px] border-b border-[#F2F2F7] text-left text-[14px] font-normal leading-[20px] text-[#636366]">
              <th className="w-9">Select</th>
              <th>Name</th>
              <th className="w-[176px]">Modified</th>
              <th className={`w-[120px] ${metadataTableHeaderVisibility}`}>Size</th>
              <th className={`w-[160px] ${metadataTableHeaderVisibility}`}>Owner</th>
              <th className={`w-[180px] ${metadataTableHeaderVisibility}`}>Location</th>
            </tr>
          </thead>
          <tbody className="block w-full">{filteredGroups.length === 0 ? <tr><td colSpan={6} className="block py-12 text-center text-[14px] text-[#636366]">No files match the selected filters.</td></tr> : filteredGroups.map(({ group, items }) => <Fragment key={group}><tr className={`grid w-full ${listHeaderColumns}`}><td colSpan={6} className="col-span-full h-12 bg-white pl-3 text-[14px] text-[#636366]">{group}</td></tr>{items.map((item) => <FileRow key={item.id} item={item} showOwner showLocation compact metadataBreakpoint={metadataBreakpoint} overlayActions hideActions={selectedItems.length > 0} alignMetadataEnd={selectedItems.length > 0} showCheckbox={selectedItemIds.length > 0} selected={selectedItemIds.includes(item.id)} onSelect={() => toggleItemSelection(item.id)} onOpen={selectedItems.length === 0 ? () => openItem(item) : undefined} selectOnMetadata gridColumns={listHeaderColumns} />)}</Fragment>)}</tbody>
        </table>
        </div>
        </> : <RecentFileGrid items={filteredItems} selectedItemIds={selectedItemIds} onSelect={toggleItemSelection} />}
      </div>
      {folderInfoOpen && <RightSidePanel items={selectedItems} folderInfo={recentFolders.find((folder) => folder.location.includes("Team")) ?? recentFolders[0]} onCloseFolderInfo={() => setFolderInfoOpen(false)} />}
    </section>
  </div>;
}

function InfoButton({ onClick }: { onClick: () => void }) {
  return <Tooltip><TooltipTrigger onClick={onClick} aria-label="Toggle folder information" className="flex size-10 items-center justify-center rounded-[8px] border border-[#E5E5EA] bg-white text-[#48484A] transition-[background-color,transform] duration-150 hover:bg-[#F9F9FB] active:scale-[0.96] motion-reduce:transition-none"><Info size={20} strokeWidth={1.75} aria-hidden="true" /></TooltipTrigger><TooltipContent>Folder information</TooltipContent></Tooltip>;
}

function SelectionActionToolbar() {
  const [moreOpen, setMoreOpen] = useState(false);
  const primaryActions = [
    { label: "Send files", icon: Send },
    { label: "Share", icon: Share2 },
    { label: "Download", icon: Download },
    { label: "Move", icon: FolderInput },
    { label: "Delete", icon: Trash2, destructive: true },
    { label: "Copy link", icon: Link2 },
  ];

  return <div className="relative hidden items-center gap-1 sm:flex">
    {primaryActions.map(({ label, icon: Icon, destructive }) => <Tooltip key={label}><TooltipTrigger aria-label={label} className={`flex size-10 items-center justify-center rounded-[8px] transition-[background-color,transform] duration-150 hover:bg-[#F2F2F7] active:scale-[0.96] motion-reduce:transition-none ${destructive ? "text-[#C10503] hover:bg-[#FFF5F5]" : "text-[#48484A]"}`}>
      <Icon size={19} strokeWidth={1.75} aria-hidden="true" />
    </TooltipTrigger><TooltipContent>{label}</TooltipContent></Tooltip>)}
    <Tooltip><TooltipTrigger onClick={() => setMoreOpen((open) => !open)} aria-label="More selection actions" aria-haspopup="menu" aria-expanded={moreOpen} className={`flex size-10 items-center justify-center rounded-[8px] text-[#48484A] transition-[background-color,transform] duration-150 hover:bg-[#F2F2F7] active:scale-[0.96] motion-reduce:transition-none ${moreOpen ? "bg-[#F2F2F7]" : ""}`}>
      <MoreVertical size={20} strokeWidth={1.75} aria-hidden="true" />
    </TooltipTrigger><TooltipContent>More actions</TooltipContent></Tooltip>
    {moreOpen && <div className="absolute right-0 top-[calc(100%+8px)] z-30 w-52 overflow-hidden rounded-[8px] border border-[#E1E1E6] bg-white py-1 shadow-[0_8px_24px_rgba(24,24,26,0.14)]" role="menu" aria-label="More selection actions">
      {["Copy", "Write a comment", "Add or edit tags"].map((label) => <button key={label} type="button" role="menuitem" onClick={() => setMoreOpen(false)} className="flex h-10 w-full items-center px-3 text-left text-[14px] text-[#18181A] hover:bg-[#F9F9FB] focus:bg-[#F9F9FB] focus:outline-none">{label}</button>)}
    </div>}
  </div>;
}

function MobileSelectionList({ groups, selectedItemIds, onSelect }: { groups: { group: string; items: DriveItem[] }[]; selectedItemIds: string[]; onSelect: (id: string) => void }) {
  const [moreOpen, setMoreOpen] = useState(false);

  return <div className="sm:hidden">
    {groups.map(({ group, items }) => <section key={group} aria-labelledby={`recent-group-${group.replaceAll(" ", "-").toLowerCase()}`}>
      <h2 id={`recent-group-${group.replaceAll(" ", "-").toLowerCase()}`} className="border-b border-[#F2F2F7] px-6 py-3 text-[14px] font-medium leading-5 text-[#636366]">{group}</h2>
      <div>{items.map((item) => {
        const selected = selectedItemIds.includes(item.id);
        return <article key={item.id} className={`flex min-h-[72px] items-center gap-3 border-b border-[#E5E5EA] px-6 py-3 ${selected ? "bg-[#E9EEF6]" : "bg-white"}`}>
          <Checkbox checked={selected} onCheckedChange={() => onSelect(item.id)} aria-label={`Select ${item.name}`} className="cursor-pointer border-[#C7C7CC]" />
          <button type="button" onClick={() => onSelect(item.id)} className="flex min-w-0 flex-1 items-center gap-3 text-left" aria-label={`Toggle selection for ${item.name}`}>
            <FileIcon type={item.type} size={32} thumbnail={item.thumbnail} />
            <span className="min-w-0 flex-1"><span className="block truncate text-[15px] font-medium leading-5 text-[#18181A]">{item.name}</span><span className="mt-0.5 block truncate text-[13px] leading-5 text-[#636366]">{item.modified}</span></span>
          </button>
        </article>;
      })}</div>
    </section>)}
    <div className="sticky bottom-0 flex gap-2 border-t border-[#E5E5EA] bg-white p-3 shadow-[0_-4px_12px_rgba(24,24,26,0.06)]">
      <button type="button" className="flex h-10 flex-1 items-center justify-center rounded-[8px] bg-[#002896] px-4 text-[14px] font-semibold text-white">Download</button>
      <button type="button" className="flex h-10 flex-1 items-center justify-center rounded-[8px] border border-[#E5E5EA] px-4 text-[14px] font-medium text-[#18181A]">Share</button>
      <div className="relative">
        <button type="button" onClick={() => setMoreOpen((open) => !open)} className="flex h-10 items-center justify-center rounded-[8px] border border-[#E5E5EA] px-4 text-[14px] font-medium text-[#18181A]" aria-haspopup="menu" aria-expanded={moreOpen}>More</button>
        {moreOpen && <div className="absolute bottom-[calc(100%+8px)] right-0 z-30 w-52 overflow-hidden rounded-[8px] border border-[#E1E1E6] bg-white py-1 shadow-[0_8px_24px_rgba(24,24,26,0.14)]" role="menu" aria-label="More selection actions">
          {["Move", "Copy", "Write a comment", "Add or edit tags", "Delete"].map((label) => <button key={label} type="button" role="menuitem" onClick={() => setMoreOpen(false)} className={`flex h-10 w-full items-center px-3 text-left text-[14px] hover:bg-[#F9F9FB] ${label === "Delete" ? "text-[#C10503] hover:bg-[#FFF5F5]" : "text-[#18181A]"}`}>{label}</button>)}
        </div>}
      </div>
    </div>
  </div>;
}

function RecentFileGrid({ items, selectedItemIds, onSelect }: { items: DriveItem[]; selectedItemIds: string[]; onSelect: (id: string) => void }) {
  if (items.length === 0) {
    return <p className="px-6 py-12 text-center text-[14px] text-[#636366]">No files match the selected filters.</p>;
  }

  return <div className="grid grid-cols-1 gap-3 px-5 py-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
    {items.map((item) => {
      const selected = selectedItemIds.includes(item.id);
      return <article key={item.id} className={`group relative min-w-0 rounded-[8px] border bg-white p-4 transition-colors hover:bg-[#F9F9FB] ${selected ? "border-[#002896] bg-[#F4F5FD] hover:bg-[#F4F5FD]" : "border-[#E5E5EA]"}`}>
        <div className="absolute left-3 top-3"><Checkbox checked={selected} onCheckedChange={() => onSelect(item.id)} aria-label={`Select ${item.name}`} className={`cursor-pointer border-[#C7C7CC] transition-opacity duration-150 motion-reduce:transition-none ${selected ? "opacity-100" : "opacity-0 group-hover:opacity-100 group-focus-within:opacity-100"}`} /></div>
        <div className="absolute right-2 top-2"><MoreActionsMenu itemName={item.name} isFolder={item.type === "folder"} /></div>
        <div className="flex min-h-28 items-center justify-center px-8 py-3"><FileIcon type={item.type} size={64} thumbnail={item.thumbnail} /></div>
        <p className="truncate pr-6 text-[14px] font-medium leading-[20px] text-[#18181A]" title={item.name}>{item.name}</p>
        <p className="mt-1 truncate text-[13px] leading-[20px] text-[#636366]">{item.modified}</p>
      </article>;
    })}
  </div>;
}
