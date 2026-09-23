"use client";

import Image from "next/image";
import { Fragment, useState } from "react";
import { Download, Info, Link2, RotateCcw, Star, StarOff, Trash2 } from "lucide-react";
import type { DriveItem } from "@/lib/types";
import { ShareIcon } from "@/components/icons";
import { FileIcon } from "./FileIcon";
import { MoreActionsMenu, ShareActionIcon } from "./MoreActionsMenu";
import { CopyLinkModal } from "./CopyLinkModal";
import { Checkbox } from "@/components/ui/checkbox";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface FileRowProps {
  item: DriveItem;
  showOwner?: boolean;
  showLocation?: boolean;
  teamFolders?: boolean;
  ownerFirst?: boolean;
  compact?: boolean;
  metadataBreakpoint?: "always" | "lg" | "xl" | "2xl";
  hideActions?: boolean;
  overlayActions?: boolean;
  alwaysShowMore?: boolean;
  trashMode?: boolean;
  alignMetadataEnd?: boolean;
  showCheckbox?: boolean;
  showMobileMetadata?: boolean;
  selected?: boolean;
  onSelect?: () => void;
  onOpen?: () => void;
  onInfo?: () => void;
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
      <span className="truncate text-[13px] text-muted-foreground">{item.owner}</span>
    </div>
  );
}

export function FileRow({ item, showOwner = false, showLocation = false, teamFolders = false, ownerFirst = false, compact = false, metadataBreakpoint = "lg", hideActions = false, overlayActions = false, alwaysShowMore = false, trashMode = false, alignMetadataEnd = false, showCheckbox = false, showMobileMetadata = false, selected = false, onSelect, onOpen, onInfo, selectOnMetadata = false, gridColumns }: FileRowProps) {
  const [copyLinkOpen, setCopyLinkOpen] = useState(false);

  function handleRowKeyDown(event: React.KeyboardEvent<HTMLTableRowElement>) {
    if (!selectOnMetadata || event.currentTarget !== event.target || (event.key !== "Enter" && event.key !== " ")) return;
    event.preventDefault();
    onSelect?.();
  }

  const nameContent = <>
    <FileIcon type={item.type} size={32} shared={item.shared && item.type === "folder"} teamFolder={item.type === "folder" && (teamFolders || item.location === "Team Drive")} thumbnail={item.thumbnail} />
    <span className="min-w-0 truncate text-[16px] leading-[24px] text-[#18181A]" title={item.name}>{item.name}</span>
    {item.shared && item.type !== "folder" && <ShareIcon size={12} className={`size-3 shrink-0 text-foreground/50 ${showMobileMetadata ? "lg:block hidden" : ""}`} aria-label="Shared" />}
    {item.starred && <Star size={16} strokeWidth={1.75} fill="currentColor" className={`size-4 shrink-0 text-foreground/50 ${showMobileMetadata ? "lg:block hidden" : ""}`} aria-label="Starred" />}
  </>;
  const displayUnit = gridColumns ? "flex" : "table-cell";
  const compactMetadataVisibility = metadataBreakpoint === "always" ? "" : metadataBreakpoint === "2xl" ? `hidden 2xl:${displayUnit}` : metadataBreakpoint === "xl" ? `hidden xl:${displayUnit}` : `hidden lg:${displayUnit}`;

  return (
    <Fragment>
    <tr aria-selected={selected} tabIndex={selectOnMetadata ? 0 : undefined} onClick={selectOnMetadata ? onSelect : undefined} onKeyDown={handleRowKeyDown} className={`group border-b border-[#E5E5EA] transition-colors duration-150 ease-out hover:z-10 hover:bg-[#F9F9FB] focus-within:z-20 motion-reduce:transition-none ${gridColumns ? `relative grid w-full ${gridColumns}` : ""} ${selectOnMetadata ? "cursor-pointer" : ""} ${selected ? "bg-[#E9EEF6] hover:bg-[#E9EEF6]" : ""}`} style={{ minHeight: 64, fontFamily: "'Rakuten Sans UI', sans-serif" }}>
      {/* Checkbox — hidden, shown on hover */}
      <td className={`w-9 pl-3 pr-0 ${gridColumns ? "flex items-center" : ""}`}>
        <Checkbox
          checked={selected}
          onCheckedChange={onSelect}
          onClick={(event) => event.stopPropagation()}
          className="cursor-pointer border-[#C7C7CC]"
          aria-label={`Select ${item.name}`}
        />
      </td>

      {/* Name */}
      <td className={`py-2 pl-2 pr-4 ${gridColumns ? `flex ${showMobileMetadata ? "flex-col items-start justify-center" : "items-center"}` : ""}`}>
        {onOpen
          ? <button type="button" onClick={(event) => { event.stopPropagation(); onOpen(); }} className="flex w-full min-w-0 cursor-pointer items-center gap-3 text-left" aria-label={`Open ${item.name}`}>{nameContent}</button>
          : <div className="flex w-full min-w-0 items-center gap-3">{nameContent}</div>
        }
        {showMobileMetadata && (
          <div className="mt-0.5 flex items-center gap-2 pl-[44px] lg:hidden">
            <span className="text-[12px] leading-[16px] text-muted-foreground">{item.modified}</span>
            {item.starred && <Star size={12} strokeWidth={1.75} fill="currentColor" className="text-foreground/50" aria-hidden="true" />}
            {item.shared && item.type !== "folder" && <ShareIcon size={12} className="text-foreground/50" aria-label="Shared" />}
            {item.size && item.size !== "–" && item.size !== "-" && <span className="text-[12px] leading-[16px] text-muted-foreground">· {item.size}</span>}
          </div>
        )}
      </td>

      {/* Owner */}
      {showOwner && ownerFirst && (
          <td onClick={onSelect} className={`w-[150px] px-4 py-2 ${gridColumns ? "flex items-center" : ""} ${compact ? compactMetadataVisibility : ""} ${onSelect ? "cursor-default" : ""}`}>
          <OwnerAvatar item={item} />
        </td>
      )}

      {/* Modified */}
      <td onClick={onSelect} className={`w-[176px] whitespace-nowrap px-4 py-2 text-[14px] leading-[20px] text-muted-foreground ${gridColumns ? "flex items-center" : ""} ${showMobileMetadata ? "hidden lg:flex" : ""} ${alignMetadataEnd ? "text-right" : ""} ${onSelect ? "cursor-default" : ""}`}>{item.modified}</td>

      {showOwner && !ownerFirst && (
          <td onClick={onSelect} className={`w-[160px] px-4 py-2 ${gridColumns ? "flex items-center" : ""} ${compact ? compactMetadataVisibility : ""} ${onSelect ? "cursor-default" : ""}`}>
          <OwnerAvatar item={item} />
        </td>
      )}

      {/* Location */}
      {showLocation && (
        <td onClick={onSelect} className={`w-[180px] truncate px-4 py-2 text-[13px] text-muted-foreground ${gridColumns ? "flex items-center" : ""} ${compact ? compactMetadataVisibility : ""} ${alignMetadataEnd ? "text-right" : ""} ${onSelect ? "cursor-default" : ""}`} title={item.location}>
          {item.location}
        </td>
      )}

      {/* Size — rightmost metadata column */}
      <td onClick={onSelect} className={`w-[120px] whitespace-nowrap px-4 py-2 text-[14px] leading-[20px] text-muted-foreground ${gridColumns ? "flex items-center" : ""} ${showMobileMetadata ? "hidden lg:flex" : compact ? compactMetadataVisibility : ""} ${alignMetadataEnd ? "text-right" : ""} ${onSelect ? "cursor-default" : ""}`}>{item.size}</td>

      {!hideActions && <td className={overlayActions ? "absolute inset-y-0 right-3 flex items-center" : `w-[152px] py-2 pr-3 ${compact ? "hidden sm:table-cell" : ""}`}>
        <div onClick={(event) => event.stopPropagation()} className="flex items-center justify-end gap-1">
          {/* Hover pill — desktop (lg+) only */}
          {trashMode ? (
            <div className={`pointer-events-none items-center gap-1 rounded-[10px] bg-[#F2F2F2] p-1 opacity-0 transition-opacity duration-150 group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100 motion-reduce:transition-none ${alwaysShowMore ? "hidden lg:flex" : "hidden sm:flex"}`}>
              <Tooltip><TooltipTrigger className="flex size-8 items-center justify-center rounded-[6px] text-[#002896] transition-colors duration-150 hover:bg-[#E5E5EA] motion-reduce:transition-none" aria-label={`Restore ${item.name}`}>
                <RotateCcw size={17} strokeWidth={1.75} aria-hidden="true" />
              </TooltipTrigger><TooltipContent>Restore</TooltipContent></Tooltip>
              <Tooltip><TooltipTrigger className="flex size-8 items-center justify-center rounded-[6px] text-[#C10503] transition-colors duration-150 hover:bg-[#FFF5F5] motion-reduce:transition-none" aria-label={`Delete ${item.name} permanently`}>
                <Trash2 size={17} strokeWidth={1.75} aria-hidden="true" />
              </TooltipTrigger><TooltipContent>Delete permanently</TooltipContent></Tooltip>
              {onInfo && <Tooltip><TooltipTrigger onClick={onInfo} className="flex size-8 items-center justify-center rounded-[6px] text-foreground transition-colors duration-150 hover:bg-[#E5E5EA] motion-reduce:transition-none" aria-label={`View information for ${item.name}`}><Info size={17} strokeWidth={1.75} aria-hidden="true" /></TooltipTrigger><TooltipContent>View information</TooltipContent></Tooltip>}
            </div>
          ) : (
            <div className={`pointer-events-none items-center gap-1 rounded-[10px] bg-[#F2F2F2] p-1 opacity-0 transition-opacity duration-150 group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100 motion-reduce:transition-none ${alwaysShowMore ? "hidden lg:flex" : "hidden sm:flex"}`}>
              <Tooltip><TooltipTrigger className="flex size-8 items-center justify-center rounded-[6px] text-foreground transition-colors duration-150 hover:bg-[#E5E5EA] motion-reduce:transition-none" aria-label={`Download ${item.name}`}>
                <Download size={17} strokeWidth={1.75} aria-hidden="true" />
              </TooltipTrigger><TooltipContent>Download</TooltipContent></Tooltip>
              <Tooltip><TooltipTrigger className="flex size-8 items-center justify-center rounded-[6px] text-foreground transition-colors duration-150 hover:bg-[#E5E5EA] motion-reduce:transition-none" aria-label={`Share ${item.name}`}>
                <ShareActionIcon />
              </TooltipTrigger><TooltipContent>Share</TooltipContent></Tooltip>
              <Tooltip><TooltipTrigger onClick={() => setCopyLinkOpen(true)} className="flex size-8 items-center justify-center rounded-[6px] text-foreground transition-colors duration-150 hover:bg-[#E5E5EA] motion-reduce:transition-none" aria-label={`Copy link for ${item.name}`}>
                <Link2 size={17} strokeWidth={1.75} aria-hidden="true" />
              </TooltipTrigger><TooltipContent>Copy link</TooltipContent></Tooltip>
              {onInfo && <Tooltip><TooltipTrigger onClick={onInfo} className="flex size-8 items-center justify-center rounded-[6px] text-foreground transition-colors duration-150 hover:bg-[#E5E5EA] motion-reduce:transition-none" aria-label={`View information for ${item.name}`}><Info size={17} strokeWidth={1.75} aria-hidden="true" /></TooltipTrigger><TooltipContent>View information</TooltipContent></Tooltip>}
              <Tooltip><TooltipTrigger className="flex size-8 items-center justify-center rounded-[6px] text-foreground transition-colors duration-150 hover:bg-[#E5E5EA] motion-reduce:transition-none" aria-label={`${item.starred ? "Remove" : "Add"} ${item.name} ${item.starred ? "from" : "to"} starred`}>
                {item.starred ? <StarOff size={17} strokeWidth={1.75} aria-hidden="true" /> : <Star size={17} strokeWidth={1.75} aria-hidden="true" />}
              </TooltipTrigger><TooltipContent>{item.starred ? "Remove from starred" : "Add to starred"}</TooltipContent></Tooltip>
              <MoreActionsMenu itemName={item.name} isFolder={item.type === "folder"} />
            </div>
          )}
          {/* Always-visible ⋮ — small/tablet only when alwaysShowMore, hidden on desktop where hover pill takes over */}
          {alwaysShowMore && !trashMode
            ? <span className="lg:hidden"><MoreActionsMenu itemName={item.name} isFolder={item.type === "folder"} onInfo={onInfo} starred={item.starred} /></span>
            : null}
        </div>
      </td>}
    </tr>
    {copyLinkOpen && <CopyLinkModal itemName={item.name} onClose={() => setCopyLinkOpen(false)} />}
    </Fragment>
  );
}
