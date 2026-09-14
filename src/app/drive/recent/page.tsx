"use client";

import { Fragment, useState } from "react";
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

export default function RecentPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [foldersOpen, setFoldersOpen] = useState(true);
  const [filteredItems, setFilteredItems] = useState(recentItems);
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);

  const filteredIds = new Set(filteredItems.map((item) => item.id));
  const filteredGroups = recentFileGroups
    .map(({ group, items }) => ({ group, items: items.filter((item) => filteredIds.has(item.id)) }))
    .filter(({ items }) => items.length > 0);
  const selectedItems = recentItems.filter((item) => selectedItemIds.includes(item.id));
  const allFilteredItemsSelected = filteredItems.length > 0 && filteredItems.every((item) => selectedItemIds.includes(item.id));

  function toggleItemSelection(id: string) {
    setSelectedItemIds((current) => current.includes(id) ? current.filter((itemId) => itemId !== id) : [...current, id]);
  }

  function toggleAllSelection(checked: boolean) {
    const filteredItemIds = new Set(filteredItems.map((item) => item.id));
    setSelectedItemIds((current) => checked
      ? [...new Set([...current, ...filteredItemIds])]
      : current.filter((id) => !filteredItemIds.has(id)));
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
      {foldersOpen && <div id="recent-folders-content" className="border-b border-[#E5E5EA]"><FolderCards folders={recentFolders} /></div>}
    </section>

    <section className="flex min-w-0 flex-1" aria-labelledby="recent-files-heading">
      <div className="min-w-0 flex-1">
        <div className="sticky top-0 z-20 bg-white px-6 py-3">
          {selectedItems.length > 0 ? <>
            <h1 id="recent-files-heading" className="mb-3 text-[20px] font-normal leading-[28px] text-[#18181A]">Recent files</h1>
            <div className="flex min-h-10 items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <button type="button" onClick={() => setSelectedItemIds([])} className="inline-flex h-8 items-center rounded-[8px] border border-[#E5E5EA] px-4 text-[14px] leading-[20px] text-[#18181A] transition-colors hover:bg-[#F9F9FB]">×&nbsp;Cancel</button>
                <span className="text-[14px] leading-[20px] text-[#18181A]" role="status" aria-live="polite">{selectedItems.length} {selectedItems.length === 1 ? "Item" : "Items"} Selected</span>
              </div>
              <FilterBar items={recentItems} viewMode={viewMode} onItemsChange={setFilteredItems} onViewModeChange={setViewMode} hideFilters />
            </div>
          </> : <>
            <div className="mb-3 flex items-baseline gap-2">
              <h1 id="recent-files-heading" className="text-[20px] font-normal leading-[28px] text-[#18181A]">Recent files</h1>
              <span className="text-[14px] leading-[20px] text-[#636366]" role="status" aria-live="polite">{filteredItems.length} items</span>
            </div>
            <FilterBar items={recentItems} viewMode={viewMode} onItemsChange={setFilteredItems} onViewModeChange={setViewMode} />
          </>}
          {viewMode === "list" && <div className="mt-3 -mx-6 grid h-[42px] grid-cols-[36px_minmax(0,1fr)_176px] items-center border-b border-[#F2F2F7] bg-white text-left text-[14px] font-normal leading-[20px] text-[#636366] shadow-[0_1px_0_#E5E5EA] sm:grid-cols-[36px_minmax(0,1fr)_176px_152px] lg:grid-cols-[36px_minmax(0,1fr)_176px_120px_160px_180px_152px]">
            <span className="px-3"><Checkbox checked={allFilteredItemsSelected} onCheckedChange={(checked) => toggleAllSelection(checked === true)} className="border-[#C7C7CC]" aria-label="Select all recent files" /></span>
            <span className="px-2">Name</span>
            <span className="px-4">Modified</span>
            <span className="hidden px-4 lg:block">Size</span>
            <span className="hidden px-4 lg:block">Owner</span>
            <span className="hidden px-4 lg:block">Location</span>
          </div>}
        </div>
        {viewMode === "list" ? <div className="w-full overflow-hidden">
        <table className="w-full table-fixed border-collapse">
          <colgroup>
            <col className="w-9" />
            <col />
            <col className="w-[176px]" />
            <col className="hidden w-[120px] lg:table-column" />
            <col className="hidden w-[160px] lg:table-column" />
            <col className="hidden w-[180px] lg:table-column" />
            <col className="hidden w-[152px] sm:table-column" />
          </colgroup>
          <thead className="sr-only">
            <tr className="h-[42px] border-b border-[#F2F2F7] text-left text-[14px] font-normal leading-[20px] text-[#636366]">
              <th className="w-9">Select</th>
              <th>Name</th>
              <th className="w-[176px]">Modified</th>
              <th className="hidden w-[120px] lg:table-cell">Size</th>
              <th className="hidden w-[160px] lg:table-cell">Owner</th>
              <th className="hidden w-[180px] lg:table-cell">Location</th>
              <th className="hidden w-[152px] sm:table-cell">Actions</th>
            </tr>
          </thead>
          <tbody>{filteredGroups.length === 0 ? <tr><td colSpan={7} className="py-12 text-center text-[14px] text-[#636366]">No files match the selected filters.</td></tr> : filteredGroups.map(({ group, items }) => <Fragment key={group}><tr><td colSpan={7} className="h-12 bg-white pl-3 text-[14px] text-[#636366]">{group}</td></tr>{items.map((item) => <FileRow key={item.id} item={item} showOwner showLocation compact showCheckbox={selectedItemIds.length > 0} selected={selectedItemIds.includes(item.id)} onSelect={() => toggleItemSelection(item.id)} />)}</Fragment>)}</tbody>
        </table>
        </div> : <RecentFileGrid items={filteredItems} selectedItemIds={selectedItemIds} onSelect={toggleItemSelection} />}
      </div>
      {selectedItems.length > 0 && <RightSidePanel items={selectedItems} />}
    </section>
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
