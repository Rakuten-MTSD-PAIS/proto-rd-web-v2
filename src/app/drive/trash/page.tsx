"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FilterBar } from "@/components/drive/FilterBar";
import { FileGrid } from "@/components/drive/FileGrid";
import { FileRow } from "@/components/drive/FileRow";
import { RightSidePanel } from "@/components/drive/RightSidePanel";
import { Checkbox } from "@/components/ui/checkbox";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { trashItems } from "@/lib/mock-data";
import type { DriveItem, ViewMode } from "@/lib/types";
import Image from "next/image";
import { ChevronDownIcon } from "@/components/icons";
import { Info, RotateCcw, Trash2, X } from "lucide-react";

const TRASH_COLUMNS = "grid-cols-[36px_minmax(0,1fr)] lg:grid-cols-[36px_minmax(0,1fr)_176px_120px]";

export default function TrashPage() {
  const router = useRouter();
  function openItem(item: DriveItem) {
    if (item.type === "folder") return;
    router.push(`/preview/${item.id}`);
  }
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [filteredItems, setFilteredItems] = useState(trashItems);
  const [selectedItems, setSelectedItems] = useState<DriveItem[]>([]);
  const [folderInfoOpen, setFolderInfoOpen] = useState(false);
  const [scopeOpen, setScopeOpen] = useState(false);
  const [scopeIsTeam, setScopeIsTeam] = useState(false);
  const scopeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!scopeOpen) return;
    function handleClick(e: MouseEvent) {
      if (!scopeRef.current?.contains(e.target as Node)) setScopeOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [scopeOpen]);

  function toggleItemSelection(item: DriveItem) {
    setSelectedItems((current) =>
      current.some((s) => s.id === item.id)
        ? current.filter((s) => s.id !== item.id)
        : [...current, item]
    );
  }

  function toggleAllSelection(checked: boolean) {
    const filteredIds = new Set(filteredItems.map((item) => item.id));
    setSelectedItems((current) =>
      checked
        ? [...new Map([...current, ...filteredItems].map((item) => [item.id, item])).values()]
        : current.filter((item) => !filteredIds.has(item.id))
    );
  }

  return (
    <div className="flex min-h-full flex-col">
      {/* Title row */}
      <div className="border-b border-border-subtle px-4 pb-4 pt-5 sm:px-6">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap min-w-0">
            <span className="text-title-lg font-semibold text-[#18181A]" style={{ fontFamily: "'Rakuten Sans', sans-serif" }}>
              Trash
            </span>
            {/* Scope dropdown — next to title */}
            <div ref={scopeRef} className="relative">
              <button
                type="button"
                onClick={() => setScopeOpen((o) => !o)}
                aria-expanded={scopeOpen}
                className="flex h-8 items-center gap-1.5 rounded-[8px] border border-[#E1E1E6] bg-white px-2.5 text-[13px] text-[#18181A] hover:bg-[#F9F9FB]"
              >
                <Image src={scopeIsTeam ? "/navigation-icons/team-drive.svg" : "/navigation-icons/my-drive.svg"} alt="" width={16} height={16} className="size-4 shrink-0" />
                <span className="hidden sm:inline">{scopeIsTeam ? "Team Drive" : "My Drive"}</span>
                <ChevronDownIcon size={12} className={`text-foreground/50 transition-transform ${scopeOpen ? "rotate-180" : ""}`} />
              </button>
              {scopeOpen && (
                <div className="absolute left-0 top-[calc(100%+6px)] z-[60] w-[200px] rounded-[8px] border border-[#E1E1E6] bg-white py-1 shadow-[0_6px_16px_rgba(24,24,26,0.14)]">
                  <button type="button" onClick={() => { setScopeIsTeam(false); setScopeOpen(false); }} className="flex w-full items-center gap-2.5 px-3 py-2.5 text-left text-body-md text-[#18181A] hover:bg-[#F9F9FB]">
                    <Image src="/navigation-icons/my-drive.svg" alt="" width={18} height={18} className="size-[18px] shrink-0" />
                    My Drive
                  </button>
                  <button type="button" onClick={() => { setScopeIsTeam(true); setScopeOpen(false); }} className="flex w-full items-center gap-2.5 px-3 py-2.5 text-left text-body-md text-[#18181A] hover:bg-[#F9F9FB]">
                    <Image src="/navigation-icons/team-drive.svg" alt="" width={18} height={18} className="size-[18px] shrink-0" />
                    Team Drive
                  </button>
                </div>
              )}
            </div>
            {selectedItems.length > 0 && (
              <>
                <span aria-hidden="true" className="text-[14px] leading-[20px] text-muted-foreground">|</span>
                <span className="text-[14px] leading-[20px] text-muted-foreground" role="status" aria-live="polite">
                  {selectedItems.length} {selectedItems.length === 1 ? "item" : "items"} selected
                </span>
              </>
            )}
          </div>
          <button
            type="button"
            className="flex h-10 shrink-0 items-center gap-2 rounded-[8px] border border-[#E1E1E6] bg-white px-3 sm:px-4 text-body-md font-medium text-[#18181A] transition-colors hover:bg-[#F9F9FB]"
          >
            <Trash2 size={18} strokeWidth={1.75} className="text-foreground/50" />
            Empty Trash
          </button>
        </div>
      </div>

      <section className="flex min-w-0 flex-1">
        <div className="min-w-0 flex-1">
          <div className="sticky top-0 z-30 bg-white px-4 pt-3 sm:px-6">
            {selectedItems.length > 0 ? (
              <div className="flex h-10 items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedItems([])}
                    aria-label="Cancel selection"
                    className="flex h-10 items-center gap-2 rounded-[8px] border border-[#E1E1E6] bg-white px-3 text-[14px] font-medium text-[#18181A] transition-colors hover:bg-[#F9F9FB]"
                  >
                    <X size={18} strokeWidth={1.75} />
                    <span className="hidden sm:inline">Cancel</span>
                  </button>
                  <TrashSelectionToolbar />
                </div>
                <FilterBar
                  items={trashItems}
                  viewMode={viewMode}
                  onItemsChange={setFilteredItems}
                  onViewModeChange={setViewMode}
                  hidePeople
                  hideFilters
                  endAdornment={<InfoButton onClick={() => setFolderInfoOpen((o) => !o)} />}
                />
              </div>
            ) : (
              <FilterBar
                items={trashItems}
                viewMode={viewMode}
                onItemsChange={setFilteredItems}
                onViewModeChange={setViewMode}
                hidePeople
                endAdornment={<InfoButton onClick={() => setFolderInfoOpen((o) => !o)} />}
              />
            )}
            {viewMode === "list" && (
              <TrashListHeader
                items={filteredItems}
                selectedItems={selectedItems}
                onToggleAll={toggleAllSelection}
              />
            )}
          </div>

          {viewMode === "grid" ? (
            <FileGrid
              items={filteredItems}
              selectedItemIds={selectedItems.map((i) => i.id)}
              onSelect={(id) => {
                const item = filteredItems.find((i) => i.id === id);
                if (item) toggleItemSelection(item);
              }}
              onOpen={openItem}
            />
          ) : (
            <TrashFileList
              items={filteredItems}
              selectedItems={selectedItems}
              onSelect={toggleItemSelection}
              onOpen={openItem}
              onInfo={(item) => { setSelectedItems([item]); setFolderInfoOpen(true); }}
            />
          )}
        </div>
        {folderInfoOpen && (
          <RightSidePanel
            items={selectedItems}
            folderInfo={trashItems.find((item) => item.type === "folder") ?? trashItems[0]}
            onCloseFolderInfo={() => setFolderInfoOpen(false)}
          />
        )}
      </section>
    </div>
  );
}

function InfoButton({ onClick }: { onClick: () => void }) {
  return (
    <Tooltip>
      <TooltipTrigger
        onClick={onClick}
        aria-label="Toggle file information"
        className="flex size-10 items-center justify-center rounded-[8px] border border-[#E5E5EA] bg-white text-foreground/50 transition-[background-color,transform] duration-150 hover:bg-[#F9F9FB] active:scale-[0.96] motion-reduce:transition-none"
      >
        <Info size={20} strokeWidth={1.75} aria-hidden="true" />
      </TooltipTrigger>
      <TooltipContent>File information</TooltipContent>
    </Tooltip>
  );
}

function TrashSelectionToolbar() {
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

  return (
    <div ref={menuRef} className="relative flex items-center gap-0.5">
      <button
        type="button"
        aria-label="Restore"
        className="flex items-center gap-1.5 whitespace-nowrap rounded-[8px] px-2 md:px-3 text-[14px] font-medium transition-[background-color,transform] duration-150 active:scale-[0.96] motion-reduce:transition-none text-[#002896] hover:bg-[rgba(0,40,150,0.06)] h-9"
      >
        <RotateCcw size={16} strokeWidth={1.75} aria-hidden="true" />
        <span>Restore</span>
      </button>
      <button
        type="button"
        aria-label="Delete permanently"
        className="flex items-center gap-1.5 whitespace-nowrap rounded-[8px] px-2 md:px-3 text-[14px] font-medium transition-[background-color,transform] duration-150 active:scale-[0.96] motion-reduce:transition-none text-[#C10503] hover:bg-[rgba(193,5,3,0.06)] h-9"
      >
        <Trash2 size={16} strokeWidth={1.75} aria-hidden="true" />
        <span className="hidden sm:inline">Delete permanently</span>
        <span className="sm:hidden">Delete</span>
      </button>
    </div>
  );
}

function TrashListHeader({
  items,
  selectedItems,
  onToggleAll,
}: {
  items: DriveItem[];
  selectedItems: DriveItem[];
  onToggleAll: (checked: boolean) => void;
}) {
  const selectedIds = new Set(selectedItems.map((item) => item.id));
  const allSelected = items.length > 0 && items.every((item) => selectedIds.has(item.id));

  return (
    <div className={`mt-3 -mx-4 grid h-[42px] items-center border-b border-[#F2F2F7] bg-white text-left text-[14px] font-normal leading-[20px] text-muted-foreground shadow-[0_1px_0_#E5E5EA] sm:-mx-6 ${TRASH_COLUMNS}`}>
      <span className="px-3">
        <Checkbox
          checked={allSelected}
          onCheckedChange={(checked) => onToggleAll(checked === true)}
          className="border-[#C7C7CC]"
          aria-label="Select all items"
        />
      </span>
      <span className="px-2">Name</span>
      <span className="hidden lg:block px-4">Modified</span>
      <span className="hidden lg:block px-4">Size</span>
    </div>
  );
}

function TrashFileList({
  items,
  selectedItems,
  onSelect,
  onOpen,
  onInfo,
}: {
  items: DriveItem[];
  selectedItems: DriveItem[];
  onSelect: (item: DriveItem) => void;
  onOpen: (item: DriveItem) => void;
  onInfo: (item: DriveItem) => void;
}) {
  const selectedIds = new Set(selectedItems.map((item) => item.id));

  return (
    <div className="w-full overflow-hidden">
      <table className="block w-full border-collapse">
        <thead className="sr-only">
          <tr><th>Select</th><th>Name</th><th>Modified</th><th>Size</th></tr>
        </thead>
        <tbody className="block w-full">
          {items.map((item) => (
            <FileRow
              key={item.id}
              item={item}
              compact
              overlayActions
              alwaysShowMore
              trashMode
              showCheckbox={selectedItems.length > 0}
              selected={selectedIds.has(item.id)}
              onSelect={() => onSelect(item)}
              onOpen={selectedItems.length === 0 ? () => onOpen(item) : undefined}
              onInfo={() => onInfo(item)}
              gridColumns={TRASH_COLUMNS}
              showMobileMetadata
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
