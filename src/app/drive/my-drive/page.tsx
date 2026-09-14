"use client";

import { useState } from "react";
import { PageToolbar } from "@/components/drive/PageToolbar";
import { FilterBar } from "@/components/drive/FilterBar";
import { FileTable } from "@/components/drive/FileTable";
import { RightSidePanel } from "@/components/drive/RightSidePanel";
import { myDriveItems } from "@/lib/mock-data";
import type { DriveItem, ViewMode } from "@/lib/types";

export default function MyDrivePage() {
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [filteredItems, setFilteredItems] = useState(myDriveItems);
  const [selectedItems, setSelectedItems] = useState<DriveItem[]>([]);

  return (
    <div className="flex min-h-full flex-col">
      <div className="px-4 pb-4 pt-5 sm:px-6">
        <PageToolbar breadcrumbs={[{ label: "My Drive" }]} />
      </div>
      <div className="sticky top-0 z-20 border-b border-[#E5E5EA] bg-white px-4 pb-4 sm:px-6">
        {selectedItems.length > 0 ? (
          <div className="flex h-10 items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => setSelectedItems([])} className="inline-flex h-8 items-center rounded-[8px] border border-[#E5E5EA] px-4 text-[14px] text-[#18181A] hover:bg-[#F9F9FB]">
                ×&nbsp; Cancel
              </button>
              <span className="text-[14px] text-[#18181A]">{selectedItems.length} {selectedItems.length === 1 ? "Item" : "Items"} Selected</span>
            </div>
            <FilterBar items={myDriveItems} viewMode={viewMode} onItemsChange={setFilteredItems} onViewModeChange={setViewMode} hideFilters />
          </div>
        ) : (
          <FilterBar items={myDriveItems} viewMode={viewMode} onItemsChange={setFilteredItems} onViewModeChange={setViewMode} />
        )}
      </div>
      <section className="flex min-w-0 flex-1">
        <div className="min-w-0 flex-1">
          <FileTable items={filteredItems} selectedItemIds={selectedItems.map((item) => item.id)} onSelectedItemsChange={setSelectedItems} />
        </div>
        {selectedItems.length > 0 && <RightSidePanel items={selectedItems} />}
      </section>
    </div>
  );
}
