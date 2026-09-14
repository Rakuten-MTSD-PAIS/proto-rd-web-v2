"use client";

import { useEffect, useRef, useState } from "react";
import type { DriveItem } from "@/lib/types";
import { FileRow } from "./FileRow";
import { Checkbox } from "@/components/ui/checkbox";

interface FileTableProps {
  items: DriveItem[];
  showOwner?: boolean;
  showLocation?: boolean;
  teamFolders?: boolean;
  ownerFirst?: boolean;
  selectedItemId?: string | null;
  onSelectedItemChange?: (item: DriveItem | null) => void;
}

export function FileTable({ items, showOwner = false, showLocation = false, teamFolders = false, ownerFirst = false, selectedItemId, onSelectedItemChange }: FileTableProps) {
  const pageSize = 10;
  const [visibleCount, setVisibleCount] = useState(pageSize);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [internalSelectedId, setInternalSelectedId] = useState<string | null>(null);
  const loadMoreRef = useRef<HTMLTableRowElement>(null);
  const columnCount = 5 + Number(showOwner) + Number(showLocation);
  const visibleItems = items.slice(0, visibleCount);
  const hasMore = visibleCount < items.length;
  const activeSelectedId = selectedItemId === undefined ? internalSelectedId : selectedItemId;

  function selectItem(item: DriveItem) {
    const nextId = activeSelectedId === item.id ? null : item.id;
    if (selectedItemId === undefined) setInternalSelectedId(nextId);
    onSelectedItemChange?.(nextId ? item : null);
  }

  useEffect(() => {
    const target = loadMoreRef.current;
    if (!target || !hasMore || isLoadingMore) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      setIsLoadingMore(true);
      window.setTimeout(() => {
        setVisibleCount((count) => Math.min(count + pageSize, items.length));
        setIsLoadingMore(false);
      }, 350);
    }, { rootMargin: "160px" });

    observer.observe(target);
    return () => observer.disconnect();
  }, [hasMore, isLoadingMore, items.length]);

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse">
        <thead className="sticky top-0 z-10 bg-white shadow-[0_1px_0_#E5E5EA]">
          <tr className="h-[42px] border-b border-[#E5E5EA] bg-white" style={{ fontFamily: "'Rakuten Sans UI', sans-serif" }}>
            <th className="w-9 pl-3 pr-0">
              <Checkbox
                className="cursor-pointer border-[#C7C7CC]"
                aria-label="Select all files"
              />
            </th>
            <th className="py-0 pl-2 pr-4 text-left text-[14px] font-normal leading-[20px] text-[#636366]">Name</th>
            {showOwner && ownerFirst && (
              <th className="w-[150px] px-4 py-0 text-left text-[14px] font-normal leading-[20px] text-[#636366]">Owner</th>
            )}
            <th className="w-[160px] px-4 py-0 text-left text-[14px] font-normal leading-[20px] text-[#636366]">Modified</th>
            <th className="w-[130px] px-4 py-0 text-left text-[14px] font-normal leading-[20px] text-[#636366]">Size</th>
            {showOwner && !ownerFirst && (
              <th className="w-[150px] px-4 py-0 text-left text-[14px] font-normal leading-[20px] text-[#636366]">Owner</th>
            )}
            {showLocation && (
              <th className="w-[130px] px-4 py-0 text-left text-[14px] font-normal leading-[20px] text-[#636366]">Location</th>
            )}
            <th className="w-[152px]" />
          </tr>
        </thead>
        <tbody>
          {visibleItems.map((item) => (
            <FileRow key={item.id} item={item} showOwner={showOwner} showLocation={showLocation} teamFolders={teamFolders} ownerFirst={ownerFirst} selected={activeSelectedId === item.id} onSelect={() => selectItem(item)} />
          ))}
          {isLoadingMore && (
            <SkeletonRows columns={columnCount} />
          )}
          {hasMore && !isLoadingMore && (
            <tr ref={loadMoreRef} aria-hidden="true">
              <td colSpan={columnCount} className="h-px p-0" />
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function SkeletonRows({ columns }: { columns: number }) {
  return (
    <>
      {[0, 1, 2].map((row) => (
        <tr key={row} className="h-16 border-b border-[#E5E5EA]" aria-hidden="true">
          <td colSpan={columns} className="px-4">
            <div className="flex items-center gap-3">
              <span className="size-8 rounded-[6px] bg-[#F2F2F7]" />
              <span className="h-4 w-48 rounded bg-[#F2F2F7]" />
              <span className="ml-auto h-4 w-28 rounded bg-[#F2F2F7]" />
              <span className="h-4 w-16 rounded bg-[#F2F2F7]" />
            </div>
          </td>
        </tr>
      ))}
    </>
  );
}
