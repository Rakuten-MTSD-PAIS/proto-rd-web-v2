"use client";

import { useState } from "react";
import { Copy, Link2, Plus } from "lucide-react";
import { PageToolbar } from "@/components/drive/PageToolbar";
import { FilterBar } from "@/components/drive/FilterBar";
import type { DriveItem, ViewMode } from "@/lib/types";

const linkData = [
  { name: "Q2 campaign assets",  expires: "Apr 28, 2026", downloads: "3",  status: "Active"  as const, modified: "Apr 28, 2026" },
  { name: "Design handoff",      expires: "Apr 15, 2026", downloads: "12", status: "Active"  as const, modified: "Apr 15, 2026" },
  { name: "Webinar recording",   expires: "—",            downloads: "8",  status: "Expired" as const, modified: "Today, 9:00 AM" },
];

const allLinks = Array.from({ length: 25 }, (_, i) => {
  const l = linkData[i % linkData.length];
  const copy = Math.floor(i / linkData.length);
  return { ...l, name: copy ? `${l.name} ${copy + 1}` : l.name };
});

// Shape link data as DriveItem[] so FilterBar can filter by Modified (= Expires)
function toItems(links: typeof allLinks): DriveItem[] {
  return links.map((l, i) => ({
    id: String(i),
    name: l.name,
    type: "other" as const,
    modified: l.modified,
    size: l.downloads,
    owner: "You (Taro Rakuten)",
    location: "My Link",
  }));
}

const allLinkItems = toItems(allLinks);

const MY_LINK_COLUMNS = "grid-cols-[minmax(0,1fr)_44px] lg:grid-cols-[minmax(0,1fr)_160px_120px_120px_44px]";

export default function MyLinkPage() {
  const [copied, setCopied] = useState<string | null>(null);
  const [viewMode] = useState<ViewMode>("list");
  const [filteredItems, setFilteredItems] = useState<DriveItem[]>(allLinkItems);
  const [statusFilter, setStatusFilter] = useState<"Active" | "Expired" | null>(null);

  const filteredIds = new Set(filteredItems.map((i) => i.id));
  const visibleLinks = allLinks.filter((_, i) => filteredIds.has(String(i)));
  const displayLinks = statusFilter ? visibleLinks.filter((l) => l.status === statusFilter) : visibleLinks;

  return (
    <div className="flex min-h-full flex-col">
      <div className="border-b border-border-subtle px-4 pb-4 pt-5 sm:px-6">
        <div className="flex items-center justify-between gap-3">
          <PageToolbar breadcrumbs={[{ label: "My Link" }]} showActions={false} />
          <button
            type="button"
            className="flex h-9 shrink-0 items-center gap-2 rounded-[8px] bg-[#002896] px-3 text-[14px] font-semibold text-white transition-colors duration-150 hover:bg-[#001F7A]"
          >
            <Plus size={16} strokeWidth={2} aria-hidden="true" />
            <span className="hidden sm:inline">Create link</span>
          </button>
        </div>
      </div>

      <div className="min-w-0 flex-1 px-4 sm:px-6">
        <div className="sticky top-0 z-30 bg-white pt-3 pb-0">
          <FilterBar
            items={allLinkItems}
            viewMode={viewMode}
            onItemsChange={setFilteredItems}
            onViewModeChange={() => {}}
            hideType
            hidePeople
            hideViewControls
            modifiedLabel="Expires"
            appendFilters={
              (["Active", "Expired"] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStatusFilter(statusFilter === s ? null : s)}
                  className={`flex h-8 items-center rounded-[8px] border px-3 text-body-md transition-colors ${statusFilter === s ? "border-[#002896] bg-[#F4F5FD] font-semibold text-[#002896]" : "border-[#E5E5EA] bg-white text-[#18181A] hover:bg-[#F9F9FB]"}`}
                >
                  {s}
                </button>
              ))
            }
          />
          <div className={`mt-3 -mx-4 grid h-[42px] items-center border-b border-[#F2F2F7] bg-white text-left text-[14px] font-normal leading-[20px] text-muted-foreground shadow-[0_1px_0_#E5E5EA] sm:-mx-6 ${MY_LINK_COLUMNS}`}>
            <span className="px-4 sm:px-6">Name</span>
            <span className="hidden lg:block px-4">Expires</span>
            <span className="hidden lg:block px-4">Downloads</span>
            <span className="hidden lg:block px-4">Status</span>
            <span className="px-1" />
          </div>
        </div>

        <div className="w-full">
          {displayLinks.map((link, i) => (
            <div key={link.name + i} className={`group relative -mx-4 grid min-h-[56px] items-center border-b border-[#F2F2F7] hover:bg-[#F9F9FB] sm:-mx-6 ${MY_LINK_COLUMNS}`}>
              <div className="flex min-w-0 items-center gap-3 px-4 py-3 sm:px-6">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-[8px] bg-[#E9EEF6] text-[#002896]">
                  <Link2 size={16} strokeWidth={1.75} />
                </span>
                <span className="min-w-0 truncate text-[16px] leading-[24px] text-[#18181A]">{link.name}</span>
                <span className="lg:hidden ml-auto shrink-0 pr-2">
                  <span className={`text-[13px] ${link.status === "Active" ? "text-[#009400]" : "text-muted-foreground"}`}>{link.status}</span>
                </span>
              </div>
              <span className="hidden lg:block px-4 text-[14px] text-muted-foreground">{link.expires}</span>
              <span className="hidden lg:block px-4 text-[14px] text-muted-foreground">{link.downloads}</span>
              <span className="hidden lg:block px-4">
                <span className={`text-[13px] font-medium ${link.status === "Active" ? "text-[#009400]" : "text-muted-foreground"}`}>{link.status}</span>
              </span>
              <div className="flex items-center justify-center px-1">
                <button type="button" onClick={() => setCopied(link.name)} className="flex size-8 items-center justify-center rounded-[6px] text-muted-foreground lg:opacity-0 lg:group-hover:opacity-100 hover:bg-[#E5E5EA] transition-opacity" aria-label={`Copy ${link.name} link`}>
                  <Copy size={16} strokeWidth={1.75} />
                </button>
              </div>
            </div>
          ))}
          {displayLinks.length === 0 && (
            <p className="py-16 text-center text-[14px] text-muted-foreground">No links match the selected filters.</p>
          )}
        </div>
      </div>

      {copied && <p className="px-4 py-2 text-[13px] text-[#009400] sm:px-6">Copied the {copied} link.</p>}
    </div>
  );
}
