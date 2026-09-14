"use client";

import Image from "next/image";
import { Download, Star } from "lucide-react";
import type { DriveItem } from "@/lib/types";
import { FileIcon } from "./FileIcon";
import { MoreActionsMenu, ShareActionIcon } from "./MoreActionsMenu";
import { Checkbox } from "@/components/ui/checkbox";

interface FileRowProps {
  item: DriveItem;
  showOwner?: boolean;
  showLocation?: boolean;
  teamFolders?: boolean;
  ownerFirst?: boolean;
  selected?: boolean;
  onSelect?: () => void;
}

function OwnerAvatar({ item }: { item: DriveItem }) {
  const initials = item.ownerInitials ?? (item.owner.startsWith("You") ? "TR" : item.owner.slice(0, 2).toUpperCase());
  const bg = item.ownerColor ?? (item.owner.startsWith("You") ? "#002896" : "#636366");
  return (
    <div className="flex items-center gap-2 min-w-0">
      {item.ownerAvatar ? (
        <Image
          src={item.ownerAvatar}
          alt={item.owner}
          width={20}
          height={20}
          className="size-5 rounded-full object-cover shrink-0"
          unoptimized
        />
      ) : (
        <div
          className="size-5 rounded-full flex items-center justify-center text-white text-[9px] font-semibold shrink-0"
          style={{ backgroundColor: bg }}
        >
          {initials}
        </div>
      )}
      <span className="truncate text-[13px] text-[#636366]">{item.owner}</span>
    </div>
  );
}

export function FileRow({ item, showOwner = false, showLocation = false, teamFolders = false, ownerFirst = false, selected = false, onSelect }: FileRowProps) {
  return (
    <tr onClick={onSelect} aria-selected={selected} className={`group cursor-pointer border-b border-[#E5E5EA] transition-colors duration-150 ease-out hover:bg-[#F9F9FB] motion-reduce:transition-none ${selected ? "bg-[#E9EEF6] hover:bg-[#E9EEF6]" : ""}`} style={{ height: 64, fontFamily: "'Rakuten Sans UI', sans-serif" }}>
      {/* Checkbox — hidden, shown on hover */}
      <td className="pl-3 pr-0 w-9">
        <Checkbox
          checked={selected}
          onCheckedChange={onSelect}
          onClick={(event) => event.stopPropagation()}
          className={`cursor-pointer border-[#C7C7CC] transition-opacity duration-150 ease-out group-hover:opacity-100 group-focus-within:opacity-100 motion-reduce:transition-none ${selected ? "opacity-100" : "opacity-0"}`}
          aria-label={`Select ${item.name}`}
        />
      </td>

      {/* Name */}
      <td className="py-2 pl-2 pr-4">
        <div className="flex items-center gap-3">
          <FileIcon type={item.type} size={32} shared={teamFolders && item.type === "folder"} thumbnail={item.thumbnail} />
          <span className="text-[16px] leading-[24px] text-[#18181A] truncate max-w-[400px]">{item.name}</span>
        </div>
      </td>

      {/* Owner */}
      {showOwner && ownerFirst && (
        <td className="py-2 px-4 w-[150px]">
          <OwnerAvatar item={item} />
        </td>
      )}

      {/* Modified */}
      <td className="w-[160px] whitespace-nowrap px-4 py-2 text-[14px] leading-[20px] text-[#636366]">{item.modified}</td>

      {/* Size */}
      <td className="w-[130px] px-4 py-2 text-[14px] leading-[20px] text-[#636366]">{item.size}</td>

      {showOwner && !ownerFirst && (
        <td className="py-2 px-4 w-[150px]">
          <OwnerAvatar item={item} />
        </td>
      )}

      {/* Location stays in place while row actions appear at the far edge. */}
      {showLocation && (
        <td className="py-2 px-4 text-[13px] text-[#636366]">
          {item.location}
        </td>
      )}

      <td className="w-[152px] py-2 pr-3">
        <div onClick={(event) => event.stopPropagation()} className="pointer-events-none flex translate-x-1 items-center justify-end gap-1 opacity-0 transition-[opacity,transform] duration-150 [transition-timing-function:cubic-bezier(0.2,0,0,1)] group-hover:pointer-events-auto group-hover:translate-x-0 group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:translate-x-0 group-focus-within:opacity-100 motion-reduce:transition-none">
          <button className="flex size-8 items-center justify-center rounded-[6px] text-[#636366] transition-[background-color,transform] duration-150 ease-out hover:bg-[#E5E5EA] hover:text-[#18181A] active:scale-[0.96] motion-reduce:transition-none" aria-label={`Download ${item.name}`}>
            <Download size={17} strokeWidth={1.75} aria-hidden="true" />
          </button>
          <button className="flex size-8 items-center justify-center rounded-[6px] text-[#636366] transition-[background-color,transform] duration-150 ease-out hover:bg-[#E5E5EA] hover:text-[#18181A] active:scale-[0.96] motion-reduce:transition-none" aria-label={`Share ${item.name}`}>
            <ShareActionIcon />
          </button>
          <button className={`flex size-8 items-center justify-center rounded-[6px] transition-[background-color,transform] duration-150 ease-out hover:bg-[#E5E5EA] active:scale-[0.96] motion-reduce:transition-none ${item.starred ? "text-[#D67A00]" : "text-[#636366] hover:text-[#18181A]"}`} aria-label={`${item.starred ? "Remove" : "Add"} ${item.name} ${item.starred ? "from" : "to"} starred`}>
            <Star size={17} strokeWidth={1.75} fill={item.starred ? "currentColor" : "none"} aria-hidden="true" />
          </button>
          <MoreActionsMenu itemName={item.name} isFolder={item.type === "folder"} />
        </div>
      </td>
    </tr>
  );
}
