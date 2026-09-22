"use client";

import { useState } from "react";
import { Copy, Inbox, Link2 } from "lucide-react";
import { PageToolbar } from "@/components/drive/PageToolbar";
import { FilterBar } from "@/components/drive/FilterBar";
import type { DriveItem, ViewMode } from "@/lib/types";

const linkData = [
  { name: "Marketing image pack", sender: "Yuki Tanaka", received: "Today, 10:30 AM",    expires: "Apr 12, 2026", modified: "Apr 12, 2026", senderColor: "#9B3FD4" },
  { name: "Product roadmap",      sender: "Ken Sato",    received: "Yesterday, 4:15 PM", expires: "Apr 09, 2026", modified: "Apr 09, 2026", senderColor: "#0080B0" },
];

const allLinks = Array.from({ length: 25 }, (_, i) => {
  const l = linkData[i % linkData.length];
  const copy = Math.floor(i / linkData.length);
  return { ...l, name: copy ? `${l.name} ${copy + 1}` : l.name };
});

function toItems(links: typeof allLinks): DriveItem[] {
  return links.map((l, i) => ({
    id: String(i),
    name: l.name,
    type: "other" as const,
    modified: l.modified,
    size: "—",
    owner: l.sender,
    location: "Received Link",
  }));
}

const allLinkItems = toItems(allLinks);

const RECEIVED_COLUMNS = "grid-cols-[minmax(0,1fr)_44px] lg:grid-cols-[minmax(0,1fr)_200px_180px_44px]";

function SenderAvatar({ sender, color }: { sender: string; color: string }) {
  const initials = sender.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();
  return (
    <span className="flex size-6 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold text-white" style={{ backgroundColor: color }}>
      {initials}
    </span>
  );
}

export default function ReceivedLinkPage() {
  const [copied, setCopied] = useState<string | null>(null);
  const [viewMode] = useState<ViewMode>("list");
  const [filteredItems, setFilteredItems] = useState<DriveItem[]>(allLinkItems);

  const filteredIds = new Set(filteredItems.map((i) => i.id));
  const displayLinks = allLinks.filter((_, i) => filteredIds.has(String(i)));

  return (
    <div className="flex min-h-full flex-col">
      <div className="border-b border-border-subtle px-4 pb-4 pt-5 sm:px-6">
        <PageToolbar breadcrumbs={[{ label: "Received Link" }]} showActions={false} />
      </div>

      <div className="min-w-0 flex-1 px-4 sm:px-6">
        <div className="sticky top-0 z-30 bg-white pt-3">
          <FilterBar
            items={allLinkItems}
            viewMode={viewMode}
            onItemsChange={setFilteredItems}
            onViewModeChange={() => {}}
            hideType
            hideViewControls
            peopleLabel="From"
            modifiedLabel="Expires"
          />
          <div className={`mt-3 -mx-4 grid h-[42px] items-center border-b border-[#F2F2F7] bg-white text-left text-[14px] font-normal leading-[20px] text-muted-foreground shadow-[0_1px_0_#E5E5EA] sm:-mx-6 ${RECEIVED_COLUMNS}`}>
            <span className="px-4 sm:px-6">Name</span>
            <span className="hidden lg:block px-4">From</span>
            <span className="hidden lg:block px-4">Expires</span>
            <span className="px-1" />
          </div>
        </div>

        {displayLinks.length ? (
          <div className="w-full">
            {displayLinks.map((link, i) => (
              <div key={link.name + i} className={`group relative -mx-4 grid min-h-[56px] items-center border-b border-[#F2F2F7] hover:bg-[#F9F9FB] sm:-mx-6 ${RECEIVED_COLUMNS}`}>
                <div className="flex min-w-0 items-center gap-3 px-4 py-3 sm:px-6">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-[8px] bg-[#E9EEF6] text-[#002896]">
                    <Link2 size={16} strokeWidth={1.75} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[16px] leading-[24px] text-[#18181A]">{link.name}</p>
                    <p className="lg:hidden mt-0.5 truncate text-[12px] text-muted-foreground">
                      From {link.sender} · {link.received}
                    </p>
                  </div>
                </div>
                <div className="hidden lg:flex items-center gap-2 px-4">
                  <SenderAvatar sender={link.sender} color={link.senderColor} />
                  <div className="min-w-0">
                    <p className="truncate text-[14px] text-[#18181A]">{link.sender}</p>
                    <p className="truncate text-[12px] text-muted-foreground">{link.received}</p>
                  </div>
                </div>
                <span className="hidden lg:block px-4 text-[14px] text-muted-foreground">{link.expires}</span>
                <div className="flex items-center justify-center px-1">
                  <button type="button" onClick={() => setCopied(link.name)} className="flex size-8 items-center justify-center rounded-[6px] text-muted-foreground lg:opacity-0 lg:group-hover:opacity-100 hover:bg-[#E5E5EA] transition-opacity" aria-label={`Copy ${link.name} link`}>
                    <Copy size={16} strokeWidth={1.75} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center py-20 text-center">
            <Inbox size={40} className="text-[#AEAEB2]" />
            <p className="mt-3 text-[16px] text-foreground/50">No received links match the selected filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
