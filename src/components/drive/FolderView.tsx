"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Copy, Download, FolderInput, Info, Link2, MessageSquare, MoreVertical, Pencil, Send, Share2, Star, Tag, Trash2, X } from "lucide-react";
import { FolderPlusIcon } from "@/components/icons";
import { Checkbox } from "@/components/ui/checkbox";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink,
  BreadcrumbPage, BreadcrumbSeparator, BreadcrumbEllipsis,
} from "@/components/ui/breadcrumb";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { FilterBar } from "@/components/drive/FilterBar";
import { UploadButton } from "@/components/drive/PageToolbar";
import { FileGrid } from "@/components/drive/FileGrid";
import { FileRow } from "@/components/drive/FileRow";
import { RightSidePanel } from "@/components/drive/RightSidePanel";
import { getFolderItems, getFolderBreadcrumb } from "@/lib/mock-data";
import type { DriveItem, ViewMode } from "@/lib/types";
import type { FolderNode } from "@/lib/mock-data";

const FOLDER_COLUMNS = "grid-cols-[36px_minmax(0,1fr)] lg:grid-cols-[36px_minmax(0,1fr)_176px_120px]";

export function FolderView({ folderId }: { folderId: string }) {
  const router = useRouter();
  const allItems = useMemo(() => getFolderItems(folderId), [folderId]);
  const breadcrumbs = useMemo(() => getFolderBreadcrumb(folderId), [folderId]);
  const currentFolder = breadcrumbs[breadcrumbs.length - 1];

  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("folderViewMode") as ViewMode) ?? "list";
    }
    return "list";
  });

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    localStorage.setItem("folderViewMode", mode);
  };
  const [filteredItems, setFilteredItems] = useState(allItems);
  const [selectedItems, setSelectedItems] = useState<DriveItem[]>([]);
  const [folderInfoOpen, setFolderInfoOpen] = useState(false);

  const openItem = useCallback((item: DriveItem) => {
    if (item.type === "folder") {
      const childFolderId = item.id.replace(/-item$/, "");
      router.push(`/drive/folder/${childFolderId}`);
      return;
    }
    router.push(`/preview/${item.id}`);
  }, [router]);

  function toggleItemSelection(item: DriveItem) {
    setSelectedItems(current =>
      current.some(s => s.id === item.id)
        ? current.filter(s => s.id !== item.id)
        : [...current, item]
    );
  }

  function toggleAllSelection(checked: boolean) {
    const filteredIds = new Set(filteredItems.map(i => i.id));
    setSelectedItems(current =>
      checked
        ? [...new Map([...current, ...filteredItems].map(i => [i.id, i])).values()]
        : current.filter(i => !filteredIds.has(i.id))
    );
  }

  const isTeamDrive = breadcrumbs[0]?.id === "td-root";

  return (
    <div className="flex min-h-full flex-col">
      <section className="flex min-w-0 flex-1">
        <div className="min-w-0 flex-1">
          <div className={`sticky top-0 z-30 bg-white border-b border-[#E5E5EA] px-4 pt-3 sm:px-6 ${viewMode === "grid" ? "pb-4" : ""}`}>
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <FolderBreadcrumb breadcrumbs={breadcrumbs} />
              </div>
              {isTeamDrive && (
                <div className="flex shrink-0 items-center gap-2 pb-4">
                  <button type="button" className="flex h-10 items-center gap-2 rounded-[8px] border border-[#E1E1E6] bg-white px-3 sm:px-4 text-body-md font-medium text-[#18181A] transition-colors hover:bg-[#F9F9FB] whitespace-nowrap">
                    <FolderPlusIcon size={20} className="text-foreground/50" />
                    <span className="hidden sm:inline">Create Team Folder</span>
                  </button>
                  <UploadButton />
                </div>
              )}
            </div>
            {selectedItems.length > 0 ? (
              <div className="flex h-10 items-center justify-between gap-3 pb-3">
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
                  <SelectionToolbar compact={folderInfoOpen} />
                </div>
                <FilterBar
                  items={allItems}
                  viewMode={viewMode}
                  onItemsChange={setFilteredItems}
                  onViewModeChange={handleViewModeChange}
                  hidePeople
                  hideFilters
                  endAdornment={<InfoButton onClick={() => setFolderInfoOpen(o => !o)} />}
                />
              </div>
            ) : (
              <FilterBar
                items={allItems}
                viewMode={viewMode}
                onItemsChange={setFilteredItems}
                onViewModeChange={handleViewModeChange}
                endAdornment={<InfoButton onClick={() => setFolderInfoOpen(o => !o)} />}
              />
            )}
            {viewMode === "list" && (
              <FolderListHeader
                items={filteredItems}
                selectedItems={selectedItems}
                onToggleAll={toggleAllSelection}
              />
            )}
          </div>

          {viewMode === "grid" ? (
            <FileGrid
              items={filteredItems}
              selectedItemIds={selectedItems.map(i => i.id)}
              teamFolders={isTeamDrive}
              onSelect={id => {
                const item = filteredItems.find(i => i.id === id);
                if (item) toggleItemSelection(item);
              }}
              onOpen={openItem}
            />
          ) : (
            <FolderFileList
              items={filteredItems}
              selectedItems={selectedItems}
              teamFolders={isTeamDrive}
              onSelect={toggleItemSelection}
              onOpen={openItem}
              onInfo={item => { setSelectedItems([item]); setFolderInfoOpen(true); }}
            />
          )}
        </div>
        {folderInfoOpen && (
          <RightSidePanel
            items={selectedItems}
            folderInfo={allItems.find(i => i.type === "folder") ?? allItems[0]}
            onCloseFolderInfo={() => setFolderInfoOpen(false)}
          />
        )}
      </section>
    </div>
  );
}

function FolderBreadcrumb({ breadcrumbs }: { breadcrumbs: FolderNode[] }) {
  const router = useRouter();
  const [ellipsisOpen, setEllipsisOpen] = useState(false);

  const isTeamDrive = breadcrumbs[0]?.id === "td-root";
  // Strip virtual td-root from the navigable crumb list
  const crumbs = breadcrumbs.filter(c => c.id !== "td-root");

  // Always visible: My Drive/Team Drive | … | parent | Current
  const lastCrumb = crumbs[crumbs.length - 1] ?? null;
  const parentCrumb = crumbs.length >= 2 ? crumbs[crumbs.length - 2] : null;
  // hidden = everything between root link and parent
  const hiddenCrumbs = crumbs.length > 2 ? crumbs.slice(0, crumbs.length - 2) : [];
  const showEllipsis = hiddenCrumbs.length > 0;

  return (
    <Breadcrumb className="mb-4">
      <BreadcrumbList className="text-[16px] text-muted-foreground">
        {/* Root — My Drive or Team Drive */}
        <BreadcrumbItem>
          {isTeamDrive ? (
            <BreadcrumbLink render={<Link href="/drive/team-drive" />}>Team Drive</BreadcrumbLink>
          ) : (
            <BreadcrumbLink render={<Link href="/drive/my-drive" />}>My Drive</BreadcrumbLink>
          )}
        </BreadcrumbItem>

        {/* Ellipsis in 2nd position — contains all hidden ancestors */}
        {showEllipsis && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <DropdownMenu open={ellipsisOpen} onOpenChange={setEllipsisOpen}>
                <DropdownMenuTrigger
                  className="flex items-center gap-1 rounded px-1.5 py-0.5 text-[14px] text-muted-foreground hover:bg-[#F2F2F7] hover:text-[#18181A] transition-colors"
                  aria-label="Show hidden breadcrumbs"
                >
                  <BreadcrumbEllipsis />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="min-w-[160px]">
                  {hiddenCrumbs.map((crumb) => (
                    <DropdownMenuItem key={crumb.id} onClick={() => router.push(`/drive/folder/${crumb.id}`)}>
                      {crumb.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </BreadcrumbItem>
          </>
        )}

        {/* Parent folder — always shown if exists */}
        {parentCrumb && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink render={<Link href={`/drive/folder/${parentCrumb.id}`} />}>
                {parentCrumb.name}
              </BreadcrumbLink>
            </BreadcrumbItem>
          </>
        )}

        {/* Current folder */}
        {lastCrumb && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-[24px] font-semibold text-[#18181A]" style={{ fontFamily: "'Rakuten Sans', sans-serif" }}>{lastCrumb.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

function InfoButton({ onClick }: { onClick: () => void }) {
  return (
    <Tooltip>
      <TooltipTrigger
        onClick={onClick}
        aria-label="Toggle information"
        className="flex size-10 items-center justify-center rounded-[8px] border border-[#E5E5EA] bg-white text-foreground/50 transition-[background-color,transform] duration-150 hover:bg-[#F9F9FB] active:scale-[0.96] motion-reduce:transition-none"
      >
        <Info size={20} strokeWidth={1.75} aria-hidden="true" />
      </TooltipTrigger>
      <TooltipContent>File information</TooltipContent>
    </Tooltip>
  );
}

function SelectionToolbar({ compact }: { compact?: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const btnRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const cachedWidths = useRef<number[]>([]);
  const [overflowFrom, setOverflowFrom] = useState(999);
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);
  const [screenSize, setScreenSize] = useState<"sm" | "md" | "lg">(() => {
    if (typeof window === "undefined") return "lg";
    return window.innerWidth < 768 ? "sm" : window.innerWidth < 1250 ? "md" : "lg";
  });

  useEffect(() => {
    const update = () => {
      setScreenSize(window.innerWidth < 768 ? "sm" : window.innerWidth < 1250 ? "md" : "lg");
    };
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const allPrimary = [
    { label: "Download", icon: Download },
    { label: "Share", icon: Share2 },
    { label: "Copy link", icon: Link2 },
    { label: "Send files", icon: Send },
    { label: "Add to starred", icon: Star },
    { label: "Move to", icon: FolderInput },
  ];
  const primaryActions = compact
    ? allPrimary.slice(0, 4)
    : allPrimary;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const PINNED = compact ? 2 : screenSize === "sm" ? 2 : screenSize === "md" ? 4 : 6; // compact: Download+Share; full: +Copy link+Send files

    const compute = () => {
      // Cache button widths once while all are visible
      btnRefs.current.forEach((btn, i) => {
        if (btn && btn.offsetWidth > 0) cachedWidths.current[i] = btn.offsetWidth + 2;
      });

      let pinnedW = 0;
      for (let i = 0; i < PINNED; i++) pinnedW += cachedWidths.current[i] ?? 110;
      const available = container.offsetWidth - 40 - pinnedW; // 40px for ⋮
      let used = 0;
      let count = PINNED;
      for (let i = PINNED; i < primaryActions.length; i++) {
        const w = cachedWidths.current[i] ?? 110;
        if (used + w > available) break;
        used += w;
        count++;
      }
      setOverflowFrom(count);
    };

    const ro = new ResizeObserver(compute);
    ro.observe(container);
    compute();
    return () => ro.disconnect();
  }, [compact, screenSize, primaryActions.length]);

  useEffect(() => {
    if (!moreOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (!moreRef.current?.contains(e.target as Node)) setMoreOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [moreOpen]);

  const overflowPrimary = primaryActions.slice(overflowFrom);

  const secondaryActions = [
    { label: "Rename", icon: Pencil },
    { label: "Make a copy", icon: Copy },
    { label: "Write a comment", icon: MessageSquare },
    { label: "Add or edit tags", icon: Tag },
  ];

  return (
    <div ref={containerRef} className="relative flex min-w-0 items-center gap-0.5">
      {primaryActions.map(({ label, icon: Icon }, i) => (
        <button
          key={label}
          ref={el => { btnRefs.current[i] = el; }}
          type="button"
          aria-label={label}
          style={i >= (compact ? 2 : screenSize === "sm" ? 2 : screenSize === "md" ? 4 : 6) && i >= overflowFrom ? { display: "none" } : undefined}
          className="flex items-center gap-1.5 whitespace-nowrap rounded-[8px] px-3 text-[14px] font-medium transition-[background-color,transform] duration-150 active:scale-[0.96] motion-reduce:transition-none text-[#002896] hover:bg-[rgba(0,40,150,0.06)] h-9"
        >
          <Icon size={16} strokeWidth={1.75} aria-hidden="true" />
          <span>{label}</span>
        </button>
      ))}
      <div ref={moreRef} className="relative shrink-0">
        <button
          type="button"
          onClick={() => setMoreOpen(o => !o)}
          aria-label="More actions"
          aria-haspopup="menu"
          aria-expanded={moreOpen}
          className={`flex size-9 items-center justify-center rounded-[8px] text-[#002896] transition-[background-color,transform] duration-150 hover:bg-[rgba(0,40,150,0.06)] active:scale-[0.96] motion-reduce:transition-none ${moreOpen ? "bg-[rgba(0,40,150,0.06)]" : ""}`}
        >
          <MoreVertical size={18} strokeWidth={1.75} aria-hidden="true" />
        </button>
        {moreOpen && (
          <div className="absolute right-0 top-[calc(100%+8px)] z-[60] w-[220px] overflow-hidden rounded-[8px] border border-[#E1E1E6] bg-white py-1 shadow-[0_8px_24px_rgba(24,24,26,0.14)]" role="menu">
            {overflowPrimary.map(({ label, icon: Icon }) => (
              <button key={label} type="button" role="menuitem" onClick={() => setMoreOpen(false)} className="flex h-10 w-full items-center gap-3 px-3 text-left text-body-md text-[#18181A] hover:bg-[#F9F9FB] focus:outline-none">
                <Icon size={18} strokeWidth={1.75} className="text-foreground/50" aria-hidden="true" />
                {label}
              </button>
            ))}
            {overflowPrimary.length > 0 && <div className="my-1 border-t border-[#E5E5EA]" />}
            {secondaryActions.map(({ label, icon: Icon }) => (
              <button key={label} type="button" role="menuitem" onClick={() => setMoreOpen(false)} className="flex h-10 w-full items-center gap-3 px-3 text-left text-body-md text-[#18181A] hover:bg-[#F9F9FB] focus:outline-none">
                <Icon size={18} strokeWidth={1.75} className="text-foreground/50" aria-hidden="true" />
                {label}
              </button>
            ))}
            <div className="my-1 border-t border-[#E5E5EA]" />
            <button type="button" role="menuitem" onClick={() => setMoreOpen(false)} className="flex h-10 w-full items-center gap-3 px-3 text-left text-body-md text-[#C10503] hover:bg-[#FFF5F5] focus:outline-none">
              <Trash2 size={18} strokeWidth={1.75} aria-hidden="true" />
              Move to trash
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function FolderListHeader({ items, selectedItems, onToggleAll }: {
  items: DriveItem[];
  selectedItems: DriveItem[];
  onToggleAll: (checked: boolean) => void;
}) {
  const selectedIds = new Set(selectedItems.map(i => i.id));
  const allSelected = items.length > 0 && items.every(i => selectedIds.has(i.id));
  return (
    <div className={`-mx-4 grid h-[42px] items-center border-b border-[#F2F2F7] bg-white text-left text-[14px] font-normal leading-[20px] text-muted-foreground shadow-[0_1px_0_#E5E5EA] sm:-mx-6 ${FOLDER_COLUMNS}`}>
      <span className="px-3">
        <Checkbox checked={allSelected} onCheckedChange={checked => onToggleAll(checked === true)} className="border-[#C7C7CC]" aria-label="Select all" />
      </span>
      <span className="px-2">Name</span>
      <span className="hidden lg:block px-4">Modified</span>
      <span className="hidden lg:block px-4">Size</span>
    </div>
  );
}

function FolderFileList({ items, selectedItems, teamFolders, onSelect, onOpen, onInfo }: {
  items: DriveItem[];
  selectedItems: DriveItem[];
  teamFolders?: boolean;
  onSelect: (item: DriveItem) => void;
  onOpen: (item: DriveItem) => void;
  onInfo: (item: DriveItem) => void;
}) {
  const selectedIds = new Set(selectedItems.map(i => i.id));
  return (
    <div className="w-full overflow-hidden">
      <table className="block w-full border-collapse">
        <thead className="sr-only"><tr><th>Select</th><th>Name</th><th>Modified</th><th>Size</th></tr></thead>
        <tbody className="block w-full">
          {items.map(item => (
            <FileRow
              key={item.id}
              item={item}
              teamFolders={teamFolders}
              compact
              overlayActions
              alwaysShowMore
              showCheckbox={selectedItems.length > 0}
              selected={selectedIds.has(item.id)}
              onSelect={() => onSelect(item)}
              onOpen={selectedItems.length === 0 ? () => onOpen(item) : undefined}
              onInfo={() => onInfo(item)}
              gridColumns={FOLDER_COLUMNS}
              showMobileMetadata
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
