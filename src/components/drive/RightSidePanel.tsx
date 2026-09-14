"use client";

import Image from "next/image";
import type { DriveItem } from "@/lib/types";
import { FileIcon } from "./FileIcon";

interface RightSidePanelProps {
  items: DriveItem[];
  teamFolders?: boolean;
}

interface ActionItem {
  label: string;
  icon: string;
  iconSize?: { width: number; height: number };
}

/* Superseded by the exported Figma assets below. */
/*
function SendIcon() {
  return (
    <svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M15.707.293a1 1 0 0 0-1.061-.225l-14 5a1 1 0 0 0-.03 1.87l5.293 2.12 2.121 5.294A1 1 0 0 0 9 15a1 1 0 0 0 .97-.753l5-14a1 1 0 0 0-.263-1.008zM9.08 11.677 7.477 7.617 11 4.914 8.297 8.437l4.059 1.602-3.276.638zM4.323 6.52 2.32 5.704 12.086 2.5 8.883 12.265 7.245 8.206l.048.048L4.323 6.52z" fill="currentColor"/>
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 10.667a2.667 2.667 0 0 0-1.787.693L5.82 8.693a2.72 2.72 0 0 0 0-1.387l4.393-2.666A2.667 2.667 0 1 0 9.333 3a2.64 2.64 0 0 0 .054.52L4.78 6.147a2.667 2.667 0 1 0 0 3.707l4.607 2.626a2.64 2.64 0 0 0-.054.52A2.667 2.667 0 1 0 12 10.667z" fill="currentColor"/>
    </svg>
  );
}

function UploadIcon() {
  return (
    <svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14.5 9a.5.5 0 0 0-.5.5V12H2V9.5a.5.5 0 0 0-1 0V12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9.5a.5.5 0 0 0-.5-.5z" fill="currentColor"/>
      <path d="M7.646.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 1.707V9.5a.5.5 0 0 1-1 0V1.707L5.354 3.854a.5.5 0 1 1-.708-.708l3-3z" fill="currentColor"/>
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" clipRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z" fill="currentColor"/>
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H6z" fill="currentColor"/>
      <path d="M2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1H2z" fill="currentColor"/>
    </svg>
  );
}

function EditIcon() {
  return (
    <svg width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12.146.146a.5.5 0 0 1 .708 0l1 1a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2L2 11.207V13.5h2.293L13.5 4.293 11.207 2z" fill="currentColor"/>
    </svg>
  );
}

function CommentIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4.414A2 2 0 0 0 3 11.586l-2 2V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" fill="currentColor"/>
    </svg>
  );
}

function TagIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 2v4.586l7 7L14.586 9l-7-7H3zM2 2a1 1 0 0 1 1-1h4.586a1 1 0 0 1 .707.293l7 7a1 1 0 0 1 0 1.414l-4.586 4.586a1 1 0 0 1-1.414 0l-7-7A1 1 0 0 1 2 6.586V2z" fill="currentColor"/>
      <path d="M5.5 5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0zm0 0a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" fill="currentColor"/>
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" fill="currentColor"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" fill="currentColor"/>
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z" fill="currentColor"/>
      <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z" fill="currentColor"/>
    </svg>
  );
}
*/

const actions: ActionItem[] = [
  { label: "Send Files", icon: "/figma/selection-icons/send.svg", iconSize: { width: 16, height: 14 } },
  { label: "Share", icon: "/figma/selection-icons/share.svg" },
  { label: "Upload New Version", icon: "/figma/selection-icons/upload.svg", iconSize: { width: 16, height: 14 } },
];

const moreActions: ActionItem[] = [
  { label: "Move", icon: "/figma/selection-icons/move.svg" },
  { label: "Copy", icon: "/figma/selection-icons/copy.svg" },
  { label: "Rename", icon: "/figma/selection-icons/rename.svg", iconSize: { width: 14, height: 16 } },
  { label: "Write a Comment", icon: "/figma/selection-icons/comment.svg" },
  { label: "Add or Edit Tags", icon: "/figma/selection-icons/tag.svg" },
  { label: "Delete", icon: "/figma/selection-icons/delete.svg", iconSize: { width: 14, height: 16 } },
];

export function RightSidePanel({ items, teamFolders = false }: RightSidePanelProps) {
  const item = items[0];
  const isMultiSelection = items.length > 1;
  const visibleActions = isMultiSelection
    ? actions.filter((action) => action.label !== "Upload New Version").map((action) => action.label === "Send via Rakuten Drive" ? { ...action, label: "Send Files" } : action)
    : actions;
  const visibleMoreActions = isMultiSelection
    ? moreActions.filter((action) => action.label !== "Rename")
    : moreActions;

  if (!item) return null;

  return (
    <aside className="sticky top-0 hidden h-[calc(100dvh-60px)] w-[240px] shrink-0 self-start overflow-y-auto border-l border-[#F2F2F7] bg-white px-1 py-3 xl:flex xl:flex-col" aria-label="Selected file details">
      <div className="flex flex-col items-center px-3">
        {/* File icon + name */}
        <div className="flex w-full flex-col items-center overflow-hidden bg-white p-6">
          <div className="flex flex-col items-center gap-1 w-full">
            <div className="relative flex h-[60px] w-[60px] items-center justify-center">
              {isMultiSelection ? (
                <>
                  <span className="absolute top-2 h-6 w-14 rounded-[6px] border border-[#E5E5EA] bg-white" />
                  <span className="absolute bottom-1 h-6 w-14 rounded-[6px] border border-[#E5E5EA] bg-white" />
                </>
              ) : item.type === "ppt" ? (
                <Image src="/figma/selection-icons/file-ppt.svg" alt="" aria-hidden="true" width={35.556} height={40} unoptimized />
              ) : (
                <FileIcon type={item.type} size={40} shared={item.shared} teamFolder={teamFolders && item.type === "folder"} thumbnail={item.thumbnail} />
              )}
            </div>
            <div className="flex w-full flex-col items-center gap-1 text-center text-[12px] leading-[16px]">
              <p className="w-full break-words font-semibold text-[#18181A]" style={{ fontFamily: "'Rakuten Sans UI', 'Rakuten_Sans_UI', sans-serif" }}>
                {isMultiSelection ? `${items.length} selected` : item.name}
              </p>
              <p className="w-full text-[#636366]" style={{ fontFamily: "'Rakuten Sans UI', 'Rakuten_Sans_UI', sans-serif" }}>
                {item.size}
              </p>
            </div>
          </div>
        </div>

        {/* Download button */}
        <button
          type="button"
          className="flex h-10 w-full items-center justify-center gap-2 rounded-[8px] bg-[#002896] px-4 text-[16px] leading-[24px] text-white transition-opacity hover:opacity-90 active:scale-[0.96]"
          style={{ fontFamily: "'Rakuten Sans UI', 'Rakuten_Sans_UI', sans-serif" }}
        >
          <Image src="/figma/selection-icons/download.svg" alt="" aria-hidden="true" width={16} height={16} unoptimized className="size-4 brightness-0 invert" />
          Download
        </button>

        {/* Action list */}
        <div className="mt-1 flex w-full flex-col gap-1 pb-2 pt-4 px-2">
          {visibleActions.map(({ label, icon, iconSize = { width: 16, height: 16 } }) => (
            <button
              key={label}
              type="button"
              className="flex h-10 w-full items-center gap-2 rounded-[8px] px-2 text-[16px] leading-[24px] text-[#18181A] transition-colors hover:bg-[#F2F2F7]"
              style={{ fontFamily: "'Rakuten Sans UI', 'Rakuten_Sans_UI', sans-serif" }}
            >
              <span className="flex w-4 shrink-0 items-center justify-center opacity-50">
                <Image src={icon} alt="" aria-hidden="true" width={iconSize.width} height={iconSize.height} unoptimized />
              </span>
              {label}
            </button>
          ))}

          <div className="py-3">
            <div className="h-px w-full bg-[#E5E5EA]" />
          </div>

          {visibleMoreActions.map(({ label, icon, iconSize = { width: 16, height: 16 } }) => (
            <button
              key={label}
              type="button"
              className="flex h-10 w-full items-center gap-2 rounded-[8px] px-2 text-[16px] leading-[24px] text-[#18181A] transition-colors hover:bg-[#F2F2F7]"
              style={{ fontFamily: "'Rakuten Sans UI', 'Rakuten_Sans_UI', sans-serif" }}
            >
              <span className="flex w-4 shrink-0 items-center justify-center opacity-50">
                <Image src={icon} alt="" aria-hidden="true" width={iconSize.width} height={iconSize.height} unoptimized />
              </span>
              {label}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
