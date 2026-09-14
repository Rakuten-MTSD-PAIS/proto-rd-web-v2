"use client";

import { useState } from "react";
import { FilterBar } from "@/components/drive/FilterBar";
import { FileTable } from "@/components/drive/FileTable";
import { FolderPlusIcon } from "@/components/icons";
import { teamDriveItems } from "@/lib/mock-data";
import type { ViewMode } from "@/lib/types";

export default function TeamDrivePage() {
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [filteredItems, setFilteredItems] = useState(teamDriveItems);

  return (
    <div className="p-0.5">
      <section className="rounded-[16px] bg-white" aria-labelledby="team-drive-heading">
        <div className="flex flex-col items-start justify-between gap-3 px-4 pb-4 pt-5 sm:flex-row sm:items-center sm:px-6">
          <h1 id="team-drive-heading" className="text-[24px] font-normal leading-8 text-[#636366]">Team Drive</h1>
          <button type="button" className="flex h-10 items-center gap-2 rounded-[8px] border border-[#E5E5EA] bg-white px-4 text-[16px] font-medium text-[#18181A] transition-colors hover:bg-[#F9F9FB]">
            <FolderPlusIcon size={18} className="text-[#636366]" />
            Create Team Folder
          </button>
        </div>
        <div className="border-b border-[#E5E5EA] px-4 pb-5 sm:px-6">
          <FilterBar items={teamDriveItems} viewMode={viewMode} onItemsChange={setFilteredItems} onViewModeChange={setViewMode} />
        </div>
        <FileTable items={filteredItems} showOwner ownerFirst teamFolders />
      </section>
    </div>
  );
}
