"use client";

import { Fragment, useEffect, useState } from "react";
import { FilterBar } from "@/components/drive/FilterBar";
import { FileRow } from "@/components/drive/FileRow";
import { FolderCards } from "@/components/drive/FolderCards";
import { ChevronDownIcon } from "@/components/icons";
import { Checkbox } from "@/components/ui/checkbox";
import { recentFileGroups, recentFolders, recentItems } from "@/lib/mock-data";
import type { ViewMode } from "@/lib/types";

export default function RecentPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [foldersOpen, setFoldersOpen] = useState(true);
  const [filteredItems, setFilteredItems] = useState(recentItems);

  useEffect(() => {
    const scrollContainer = document.querySelector("main");
    if (!scrollContainer) return;

    const collapseFolders = () => {
      if (scrollContainer.scrollTop > 0) setFoldersOpen(false);
    };

    scrollContainer.addEventListener("scroll", collapseFolders, { passive: true });
    return () => scrollContainer.removeEventListener("scroll", collapseFolders);
  }, []);

  const filteredIds = new Set(filteredItems.map((item) => item.id));
  const filteredGroups = recentFileGroups
    .map(({ group, items }) => ({ group, items: items.filter((item) => filteredIds.has(item.id)) }))
    .filter(({ items }) => items.length > 0);

  return <div className="flex flex-col">
    <section>
      <div className="flex items-center px-6 py-3">
        <button type="button" onClick={() => setFoldersOpen((open) => !open)} className="flex items-center gap-3 text-[20px] font-normal leading-[28px] text-[#636366]" aria-expanded={foldersOpen}>
          <ChevronDownIcon size={12} className={`shrink-0 text-[#636366] transition-transform ${foldersOpen ? "" : "-rotate-90"}`} />
          Recent Folders
        </button>
      </div>
      {foldersOpen && <div className="border-t border-[#E5E5EA]"><FolderCards folders={recentFolders} /></div>}
    </section>

    <section className="flex flex-col" aria-labelledby="recent-files-heading">
      <div className="sticky top-0 z-20 border-b border-[#E5E5EA] bg-white px-6 py-3">
        <h1 id="recent-files-heading" className="mb-3 text-[20px] font-normal leading-[28px] text-[#636366]">Recent Files</h1>
        <FilterBar items={recentItems} viewMode={viewMode} onItemsChange={setFilteredItems} onViewModeChange={setViewMode} />
      </div>
      <div className="w-full overflow-x-auto md:overflow-visible">
        <table className="w-full border-collapse">
          <thead className="sticky top-[104px] z-10 bg-white shadow-[0_1px_0_#E5E5EA]"><tr className="h-[42px] border-b border-[#F2F2F7] text-left text-[14px] font-normal leading-[20px] text-[#636366]"><th className="w-9 pl-3 pr-0"><Checkbox className="border-[#C7C7CC]" aria-label="Select all recent files" /></th><th className="py-0 pl-2 pr-4 font-normal">Name</th><th className="w-[130px] px-4 py-0 font-normal">Modified</th><th className="w-[130px] px-4 py-0 font-normal">Size</th><th className="w-[150px] px-4 py-0 font-normal">Owner</th><th className="px-4 py-0 font-normal">Location</th><th className="w-[152px]" /></tr></thead>
          <tbody>{filteredGroups.length === 0 ? <tr><td colSpan={7} className="py-12 text-center text-[14px] text-[#636366]">No files match the selected filters.</td></tr> : filteredGroups.map(({ group, items }) => <Fragment key={group}><tr><td colSpan={7} className="h-12 bg-white pl-3 text-[14px] text-[#636366]">{group}</td></tr>{items.map((item) => <FileRow key={item.id} item={item} showOwner showLocation />)}</Fragment>)}</tbody>
        </table>
      </div>
    </section>
  </div>;
}
