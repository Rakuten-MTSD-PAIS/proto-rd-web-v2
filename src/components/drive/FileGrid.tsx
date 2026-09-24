"use client";

import Image from "next/image";
import { FileIcon } from "./FileIcon";
import { MoreActionsMenu } from "./MoreActionsMenu";
import { Checkbox } from "@/components/ui/checkbox";
import type { DriveItem } from "@/lib/types";

interface FileGridProps {
  items: DriveItem[];
  selectedItemIds: string[];
  onSelect: (id: string) => void;
  onOpen?: (item: DriveItem) => void;
  teamFolders?: boolean;
}

export function FileGrid({ items, selectedItemIds, onSelect, onOpen, teamFolders = false }: FileGridProps) {
  if (items.length === 0) {
    return <p className="px-6 py-12 text-center text-[14px] text-muted-foreground">No files match the selected filters.</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-3 px-5 py-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
      {items.map((item) => {
        const selected = selectedItemIds.includes(item.id);
        return (
          <article
            key={item.id}
            onClick={() => {
              if (selectedItemIds.length > 0) { onSelect(item.id); return; }
              if (onOpen) onOpen(item);
            }}
            className={`group relative min-w-0 rounded-[8px] border bg-white p-4 transition-[background-color,border-color,transform] duration-150 active:scale-[0.98] motion-reduce:transition-none ${onOpen || selectedItemIds.length > 0 ? "cursor-pointer" : ""} hover:bg-[#F9F9FB] ${selected ? "border-[#002896] bg-[#F4F5FD] hover:bg-[#F4F5FD]" : "border-[#E5E5EA]"}`}
          >
            <div className="absolute left-3 top-3" onClick={(e) => e.stopPropagation()}>
              <Checkbox checked={selected} onCheckedChange={() => onSelect(item.id)} aria-label={`Select ${item.name}`} className={`cursor-pointer border-[#C7C7CC] transition-[opacity] duration-150 motion-reduce:transition-none ${selected ? "opacity-100" : "opacity-0 group-hover:opacity-100 group-focus-within:opacity-100"}`} />
            </div>
            <div className="absolute right-2 top-2" onClick={(e) => e.stopPropagation()}>
              <MoreActionsMenu itemName={item.name} isFolder={item.type === "folder"} />
            </div>
            {item.thumbnail && (item.type === "image" || item.type === "video") ? (
              <div className="relative -mx-4 -mt-4 mb-3 h-36 overflow-hidden rounded-t-[8px] bg-[#F2F2F7]">
                <Image src={item.thumbnail} alt="" fill unoptimized className="object-cover" />
                {item.type === "video" && (
                  <span className="absolute inset-0 grid place-items-center bg-black/20">
                    <span className="ml-0.5 size-0 border-y-[8px] border-l-[13px] border-y-transparent border-l-white drop-shadow-sm" />
                  </span>
                )}
              </div>
            ) : (
              <div className="flex min-h-28 items-center justify-center px-8 py-3">
                <FileIcon type={item.type} size={64} thumbnail={undefined} teamFolder={item.type === "folder" && (teamFolders || item.location === "Team Drive")} />
              </div>
            )}
            <p className="truncate pr-6 text-[14px] font-medium leading-[20px] text-[#18181A]" title={item.name}>{item.name}</p>
            <p className="mt-1 truncate text-[13px] leading-[20px] text-muted-foreground">{item.modified}</p>
          </article>
        );
      })}
    </div>
  );
}
