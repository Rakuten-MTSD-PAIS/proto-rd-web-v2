"use client";

import { useState } from "react";
import { ArrowRight, Copy, Download, MessageSquareText, Pencil, Send, Share2, Tag, Trash2, Upload } from "lucide-react";
import { PageToolbar } from "@/components/drive/PageToolbar";
import { FilterBar } from "@/components/drive/FilterBar";
import { FileTable } from "@/components/drive/FileTable";
import { FileIcon } from "@/components/drive/FileIcon";
import { myDriveItems } from "@/lib/mock-data";
import type { DriveItem, ViewMode } from "@/lib/types";

export default function MyDrivePage() {
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [filteredItems, setFilteredItems] = useState(myDriveItems);
  const [selectedItem, setSelectedItem] = useState<DriveItem | null>(null);

  return (
    <div className="flex min-h-full gap-6 p-4 sm:p-6">
      <div className="flex min-w-0 flex-1 flex-col gap-5">
        <PageToolbar breadcrumbs={[{ label: "My Drive" }]} />
        {selectedItem ? <div className="flex h-10 items-center gap-3"><button type="button" onClick={() => setSelectedItem(null)} className="rounded-[8px] border border-[#E5E5EA] px-4 text-[14px] text-[#18181A] hover:bg-[#F9F9FB]">×&nbsp; Cancel</button><span className="text-[14px] text-[#18181A]">1 Item Selected</span></div> : <FilterBar items={myDriveItems} viewMode={viewMode} onItemsChange={setFilteredItems} onViewModeChange={setViewMode} />}
        <section>
          <FileTable items={filteredItems} selectedItemId={selectedItem?.id ?? null} onSelectedItemChange={setSelectedItem} />
        </section>
      </div>
      {selectedItem && <SelectionInspector item={selectedItem} />}
    </div>
  );
}

function SelectionInspector({ item }: { item: DriveItem }) {
  return <aside className="hidden w-[312px] shrink-0 self-stretch rounded-[16px] bg-white px-6 py-14 xl:block" aria-label="Selected file details">
    <div className="flex flex-col items-center text-center"><FileIcon type={item.type} size={48} thumbnail={item.thumbnail} /><p className="mt-4 max-w-full truncate text-[14px] font-semibold text-[#18181A]">{item.name}</p><p className="mt-1 text-[14px] text-[#636366]">{item.size}</p></div>
    <button type="button" className="mt-8 flex h-[52px] w-full items-center justify-center gap-3 rounded-[8px] bg-[#002896] text-[16px] font-medium text-white hover:bg-[#0037B8]"><Download size={20} strokeWidth={1.75} />Download</button>
    <div className="mt-5 flex flex-col gap-1"><InspectorAction icon={Send} label="Send via Rakuten Drive" /><InspectorAction icon={Share2} label="Share" /><InspectorAction icon={Upload} label="Upload New Version" /></div>
    <div className="my-5 border-t border-[#E5E5EA]" />
    <div className="flex flex-col gap-1"><InspectorAction icon={ArrowRight} label="Move" /><InspectorAction icon={Copy} label="Copy" /><InspectorAction icon={Pencil} label="Rename" /><InspectorAction icon={MessageSquareText} label="Write a Comment" /><InspectorAction icon={Tag} label="Add or Edit Tags" /></div>
    <div className="my-5 border-t border-[#E5E5EA]" />
    <InspectorAction icon={Trash2} label="Delete" destructive />
  </aside>;
}

function InspectorAction({ icon: Icon, label, destructive = false }: { icon: typeof Download; label: string; destructive?: boolean }) {
  return <button type="button" className={`flex h-10 items-center gap-3 rounded-[6px] px-2 text-left text-[16px] transition-colors hover:bg-[#F9F9FB] ${destructive ? "text-[#C10503]" : "text-[#18181A]"}`}><Icon size={20} strokeWidth={1.75} className={destructive ? "text-[#C10503]" : "text-[#8E8E93]"} /><span>{label}</span></button>;
}
