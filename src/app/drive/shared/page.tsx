"use client";

import { useState } from "react";
import { PageToolbar } from "@/components/drive/PageToolbar";
import { FilterBar } from "@/components/drive/FilterBar";
import { FolderCards } from "@/components/drive/FolderCards";
import { FileTable } from "@/components/drive/FileTable";
import { sharedItems } from "@/lib/mock-data";
import type { ViewMode } from "@/lib/types";

export default function SharedPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [filteredItems, setFilteredItems] = useState(sharedItems);

  const folders = filteredItems.filter((i) => i.type === "folder");
  const files = filteredItems.filter((i) => i.type !== "folder");

  return (
    <div className="flex flex-col gap-5 p-6">
      <PageToolbar breadcrumbs={[{ label: "Shared with Me" }]} showActions={false} />
      <div className="sticky top-0 z-20 -mx-6 bg-white px-6 py-2">
        <FilterBar items={sharedItems} viewMode={viewMode} onItemsChange={setFilteredItems} onViewModeChange={setViewMode} />
      </div>
      {folders.length > 0 && (
        <section>
          <p className="text-[12px] text-[#636366] font-semibold uppercase tracking-wide mb-3">Folders</p>
          <FolderCards folders={folders} />
        </section>
      )}
      {files.length > 0 && (
        <section>
          <p className="text-[12px] text-[#636366] font-semibold uppercase tracking-wide mb-3">Files</p>
          <div className="-mx-6">
            <FileTable items={files} showOwner showLocation />
          </div>
        </section>
      )}
    </div>
  );
}
