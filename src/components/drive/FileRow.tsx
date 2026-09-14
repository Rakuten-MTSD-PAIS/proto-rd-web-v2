"use client";

import Image from "next/image";
import { Download, Star } from "lucide-react";
import type { DriveItem } from "@/lib/types";
import { FileIcon } from "./FileIcon";
import { MoreActionsMenu, ShareActionIcon } from "./MoreActionsMenu";
import { Checkbox } from "@/components/ui/checkbox";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface FileRowProps {
  item: DriveItem;
  showOwner?: boolean;
  showLocation?: boolean;
  teamFolders?: boolean;
  ownerFirst?: boolean;
  compact?: boolean;
  metadataBreakpoint?: "lg" | "xl" | "2xl";
  hideActions?: boolean;
  overlayActions?: boolean;
  alignMetadataEnd?: boolean;
  showCheckbox?: boolean;
  selected?: boolean;
  onSelect?: () => void;
  onOpen?: () => void;
  selectOnMetadata?: boolean;
  gridColumns?: string;
}

function OwnerAvatar({ item }: { item: DriveItem }) {
  const initials = item.ownerInitials ?? (item.owner.startsWith("You") ? "TR" : item.owner.slice(0, 2).toUpperCase());
  const bg = item.ownerColor ?? (item.owner.startsWith("You") ? "#002896" : "#636366");
  return (
    <div className="flex min-w-0 items-center gap-2">
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

function SharedPeopleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="size-4 shrink-0 text-[#636366]" role="img" aria-label="Shared">
      <path d="M4.99934 6.8579C6.84029 6.8579 8.33268 5.32271 8.33268 3.42895C8.33268 1.53519 6.84029 0 4.99934 0C3.15839 0 1.66601 1.53519 1.66601 3.42895C1.66601 5.32271 3.15839 6.8579 4.99934 6.8579Z" fill="currentColor" />
      <path d="M14.9993 6.85836C16.8403 6.85836 18.3327 5.32317 18.3327 3.42941C18.3327 1.53565 16.8403 0.000460619 14.9993 0.000460619C13.1584 0.000460619 11.666 1.53565 11.666 3.42941C11.666 5.32317 13.1584 6.85836 14.9993 6.85836Z" fill="currentColor" />
      <path d="M15 6.85658C17.7614 6.85658 20 9.15937 20 12H10C10 9.15937 12.2386 6.85658 15 6.85658Z" fill="currentColor" />
      <path d="M5 6.85658C7.76142 6.85658 10 9.15937 10 12H0C0 9.15937 2.23858 6.85658 5 6.85658Z" fill="currentColor" />
    </svg>
  );
}

export function FileRow({ item, showOwner = false, showLocation = false, teamFolders = false, ownerFirst = false, compact = false, metadataBreakpoint = "lg", hideActions = false, overlayActions = false, alignMetadataEnd = false, showCheckbox = false, selected = false, onSelect, onOpen, selectOnMetadata = false, gridColumns }: FileRowProps) {
  function handleRowKeyDown(event: React.KeyboardEvent<HTMLTableRowElement>) {
    if (!selectOnMetadata || event.currentTarget !== event.target || (event.key !== "Enter" && event.key !== " ")) return;
    event.preventDefault();
    onSelect?.();
  }

  const nameContent = <>
    <FileIcon type={item.type} size={32} shared={item.shared && item.type === "folder"} teamFolder={teamFolders && item.type === "folder"} thumbnail={item.thumbnail} />
    <span className="min-w-0 flex-1 truncate text-[16px] leading-[24px] text-[#18181A]" title={item.name}>{item.name}</span>
    {item.shared && <SharedPeopleIcon />}
    {item.starred && <Star size={16} strokeWidth={1.75} fill="currentColor" className="size-4 shrink-0 text-[#636366]" aria-label="Starred" />}
  </>;
  const compactMetadataVisibility = metadataBreakpoint === "2xl" ? "hidden 2xl:table-cell" : metadataBreakpoint === "xl" ? "hidden xl:table-cell" : "hidden lg:table-cell";

  return (
    <tr aria-selected={selected} tabIndex={selectOnMetadata ? 0 : undefined} onClick={selectOnMetadata ? onSelect : undefined} onKeyDown={handleRowKeyDown} className={`group border-b border-[#E5E5EA] transition-colors duration-150 ease-out hover:z-10 hover:bg-[#F9F9FB] focus-within:z-20 motion-reduce:transition-none ${gridColumns ? `relative grid w-full ${gridColumns}` : ""} ${selectOnMetadata ? "cursor-pointer" : ""} ${selected ? "bg-[#E9EEF6] hover:bg-[#E9EEF6]" : ""}`} style={{ minHeight: 64, fontFamily: "'Rakuten Sans UI', sans-serif" }}>
      {/* Checkbox — hidden, shown on hover */}
      <td className={`w-9 pl-3 pr-0 ${gridColumns ? "flex items-center" : ""}`}>
        <Checkbox
          checked={selected}
          onCheckedChange={onSelect}
          onClick={(event) => event.stopPropagation()}
          className={`cursor-pointer border-[#C7C7CC] transition-opacity duration-150 ease-out group-hover:opacity-100 group-focus-within:opacity-100 motion-reduce:transition-none ${selected || showCheckbox ? "opacity-100" : "opacity-0"}`}
          aria-label={`Select ${item.name}`}
        />
      </td>

      {/* Name */}
      <td className="py-2 pl-2 pr-4">
        {onOpen ? <button type="button" onClick={(event) => { event.stopPropagation(); onOpen(); }} className="flex w-full cursor-pointer items-center gap-3 text-left" aria-label={`Open ${item.name}`}>{nameContent}</button> : <div className="flex items-center gap-3">{nameContent}</div>}
      </td>

      {/* Owner */}
      {showOwner && ownerFirst && (
          <td className={`w-[150px] px-4 py-2 ${compact ? compactMetadataVisibility : ""}`}>
          <OwnerAvatar item={item} />
        </td>
      )}

      {/* Modified */}
      <td className={`w-[176px] whitespace-nowrap px-4 py-2 text-[14px] leading-[20px] text-[#636366] ${alignMetadataEnd ? "text-right" : ""}`}>{item.modified}</td>

      {/* Size */}
      <td className={`w-[120px] whitespace-nowrap px-4 py-2 text-[14px] leading-[20px] text-[#636366] ${compact ? compactMetadataVisibility : ""} ${alignMetadataEnd ? "text-right" : ""}`}>{item.size}</td>

      {showOwner && !ownerFirst && (
          <td className={`w-[160px] px-4 py-2 ${compact ? compactMetadataVisibility : ""}`}>
          <OwnerAvatar item={item} />
        </td>
      )}

      {/* Location stays in place while row actions appear at the far edge. */}
      {showLocation && (
        <td className={`w-[180px] truncate px-4 py-2 text-[13px] text-[#636366] ${compact ? compactMetadataVisibility : ""} ${alignMetadataEnd ? "text-right" : ""}`} title={item.location}>
          {item.location}
        </td>
      )}

      {!hideActions && <td className={overlayActions ? "absolute inset-y-0 right-3 hidden items-center sm:flex" : `w-[152px] py-2 pr-3 ${compact ? "hidden sm:table-cell" : ""}`}>
        <div onClick={(event) => event.stopPropagation()} className="pointer-events-none flex translate-x-1 items-center justify-end gap-1 rounded-[10px] bg-[#F2F2F2] p-1 opacity-0 transition-[opacity,transform] duration-150 [transition-timing-function:cubic-bezier(0.2,0,0,1)] group-hover:pointer-events-auto group-hover:translate-x-0 group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:translate-x-0 group-focus-within:opacity-100 motion-reduce:transition-none">
          <Tooltip><TooltipTrigger className="flex size-8 items-center justify-center rounded-[6px] text-[#636366] transition-[background-color,transform] duration-150 ease-out hover:bg-[#E5E5EA] hover:text-[#18181A] active:scale-[0.96] motion-reduce:transition-none" aria-label={`Download ${item.name}`}>
            <Download size={17} strokeWidth={1.75} aria-hidden="true" />
          </TooltipTrigger><TooltipContent>Download</TooltipContent></Tooltip>
          <Tooltip><TooltipTrigger className="flex size-8 items-center justify-center rounded-[6px] text-[#636366] transition-[background-color,transform] duration-150 ease-out hover:bg-[#E5E5EA] hover:text-[#18181A] active:scale-[0.96] motion-reduce:transition-none" aria-label={`Share ${item.name}`}>
            <ShareActionIcon />
          </TooltipTrigger><TooltipContent>Share</TooltipContent></Tooltip>
          <Tooltip><TooltipTrigger className={`flex size-8 items-center justify-center rounded-[6px] transition-[background-color,transform] duration-150 ease-out hover:bg-[#E5E5EA] active:scale-[0.96] motion-reduce:transition-none ${item.starred ? "text-[#D67A00]" : "text-[#636366] hover:text-[#18181A]"}`} aria-label={`${item.starred ? "Remove" : "Add"} ${item.name} ${item.starred ? "from" : "to"} starred`}>
            <Star size={17} strokeWidth={1.75} fill={item.starred ? "currentColor" : "none"} aria-hidden="true" />
          </TooltipTrigger><TooltipContent>{item.starred ? "Remove from starred" : "Add to starred"}</TooltipContent></Tooltip>
          <MoreActionsMenu itemName={item.name} isFolder={item.type === "folder"} />
        </div>
      </td>}
    </tr>
  );
}
