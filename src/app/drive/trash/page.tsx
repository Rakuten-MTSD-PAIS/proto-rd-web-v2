"use client";

import { useState } from "react";
import { Grid2X2, List, Trash2 } from "lucide-react";
import { ChevronDownIcon } from "@/components/icons";
import { FileTable } from "@/components/drive/FileTable";
import { trashItems } from "@/lib/mock-data";

export default function TrashPage() {
  const [scopeOpen, setScopeOpen] = useState(false);
  const [listView, setListView] = useState(true);

  return <div className="p-3 sm:p-5">
    <section className="overflow-visible rounded-[16px] bg-white" aria-labelledby="trash-heading">
      <div className="flex flex-col items-start justify-between gap-3 px-4 pb-4 pt-5 sm:flex-row sm:items-center sm:px-6">
        <h1 id="trash-heading" className="text-[24px] font-normal leading-8 text-[#636366]">Trash</h1>
        <button type="button" className="flex h-10 items-center gap-2 rounded-[8px] border border-[#E1E1E6] bg-white px-4 text-[16px] font-medium text-[#18181A] transition-colors hover:bg-[#F9F9FB]"><Trash2 size={19} strokeWidth={1.75} className="text-[#8E8E93]" />Empty Trash</button>
      </div>
      <div className="flex items-center justify-between border-b border-[#E5E5EA] px-4 pb-4 sm:px-6">
        <div className="relative"><button type="button" onClick={() => setScopeOpen((open) => !open)} aria-expanded={scopeOpen} className="flex h-10 items-center gap-3 rounded-[8px] border border-[#E1E1E6] bg-white px-4 text-[16px] text-[#18181A]">Deleted Files From My Drive<ChevronDownIcon size={14} className={`text-[#8E8E93] transition-transform ${scopeOpen ? "rotate-180" : ""}`} /></button>{scopeOpen && <div className="absolute left-0 top-[calc(100%+6px)] z-20 w-[270px] rounded-[8px] border border-[#E1E1E6] bg-white py-1 shadow-[0_6px_16px_rgba(24,24,26,0.14)]"><button type="button" className="w-full px-4 py-2.5 text-left text-[14px] text-[#18181A] hover:bg-[#F9F9FB]">Deleted Files From My Drive</button><button type="button" className="w-full px-4 py-2.5 text-left text-[14px] text-[#18181A] hover:bg-[#F9F9FB]">Deleted Files From Team Drive</button></div>}</div>
        <div className="flex items-center rounded-[12px] bg-[#F2F2F7] p-1"><button type="button" onClick={() => setListView(true)} aria-label="List view" aria-pressed={listView} className={`flex size-8 items-center justify-center rounded-[8px] ${listView ? "bg-white text-[#002896] shadow-sm" : "text-[#636366]"}`}><List size={18} /></button><button type="button" onClick={() => setListView(false)} aria-label="Grid view" aria-pressed={!listView} className={`flex size-8 items-center justify-center rounded-[8px] ${!listView ? "bg-white text-[#002896] shadow-sm" : "text-[#636366]"}`}><Grid2X2 size={17} /></button></div>
      </div>
      <FileTable items={trashItems} />
    </section>
  </div>;
}
