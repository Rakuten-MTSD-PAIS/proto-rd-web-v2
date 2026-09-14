"use client";

import { useState } from "react";
import { FilterBar } from "@/components/drive/FilterBar";
import { FileTable } from "@/components/drive/FileTable";
import { RightSidePanel } from "@/components/drive/RightSidePanel";
import { FolderPlusIcon } from "@/components/icons";
import { teamDriveItems } from "@/lib/mock-data";
import type { DriveItem, ViewMode } from "@/lib/types";

export default function TeamDrivePage() {
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [filteredItems, setFilteredItems] = useState(teamDriveItems);
  const [selectedItems, setSelectedItems] = useState<DriveItem[]>([]);

  return (
    <div className="flex min-h-full flex-col">
      <div className="flex items-center justify-between gap-3 px-4 pb-4 pt-5 sm:px-6">
        <h1 id="team-drive-heading" className="min-w-0 truncate text-[24px] font-normal leading-8 text-[#636366]">Team Drive</h1>
        <button type="button" className="flex h-10 shrink-0 items-center gap-2 whitespace-nowrap rounded-[8px] border border-[#E5E5EA] bg-white px-4 text-[16px] font-medium text-[#18181A] transition-colors hover:bg-[#F9F9FB]">
          <FolderPlusIcon size={18} className="text-[#636366]" />
          Create Team Folder
        </button>
      </div>
      <div className="sticky top-0 z-20 border-b border-[#E5E5EA] bg-white px-4 pb-5 sm:px-6">
        <FilterBar items={teamDriveItems} viewMode={viewMode} onItemsChange={setFilteredItems} onViewModeChange={setViewMode} />
      </div>
      <section className="flex min-w-0 flex-1">
        <div className="min-w-0 flex-1">
          <FileTable
            items={filteredItems}
            showOwner
            ownerFirst
            teamFolders
            stickyHeaderTop={60}
            selectedItemIds={selectedItems.map((item) => item.id)}
            onSelectedItemsChange={setSelectedItems}
          />
        </div>
        {selectedItems.length > 0 && <RightSidePanel items={selectedItems} teamFolders />}
      </section>
    </div>
  );
}
