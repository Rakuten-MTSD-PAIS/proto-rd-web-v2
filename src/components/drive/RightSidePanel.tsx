"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Check, Pencil, X } from "lucide-react";
import type { DriveItem } from "@/lib/types";
import { FileIcon } from "./FileIcon";
import { Skeleton } from "@/components/ui/skeleton";
import { Tab, TabList } from "@/components/ui/tabs";

interface RightSidePanelProps {
  items?: DriveItem[];
  teamFolders?: boolean;
  showActions?: boolean;
  folderInfo?: { name: string; location: string };
  onCloseFolderInfo?: () => void;
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

const sharedPersonAvatars: Record<string, string> = {
  "Yuki Sato": "/avatars/yuki-sato.svg",
  "Kenji Tanaka": "/avatars/kenji-tanaka.svg",
  "Aisha Patel": "/avatars/aisha-patel.svg",
  "Marcus Lee": "/avatars/marcus-lee.svg",
  "Nina Kowalski": "/avatars/nina-kowalski.svg",
  "Chen Wei": "/avatars/chen-wei.svg",
  "Olivia Brown": "/avatars/olivia-brown.svg",
  "James Wilson": "/avatars/james-wilson.svg",
  "Anita Desai": "/avatars/anita-desai.svg",
  "Kiran Pingle": "/avatars/kiran-pingle.svg",
};

function ActivityFeed({ owner, ownerAvatar, ownerInitials, ownerColor, itemName }: {
  owner: string; ownerAvatar?: string; ownerInitials?: string; ownerColor?: string; itemName: string;
}) {
  const isOwner = owner.startsWith("You");
  const youLabel = isOwner ? "You" : owner;
  const groups = [
    {
      label: "Today",
      items: [
        { who: "You", avatar: undefined, initials: "KP", color: "#002896", action: `opened "${itemName}"`, time: "10:42 AM" },
      ],
    },
    {
      label: "Yesterday",
      items: [
        { who: youLabel, avatar: ownerAvatar, initials: ownerInitials, color: ownerColor, action: `renamed this ${itemName.includes(".") ? "file" : "folder"}`, time: "3:15 PM" },
      ],
    },
    {
      label: "Older",
      items: [
        { who: youLabel, avatar: ownerAvatar, initials: ownerInitials, color: ownerColor, action: `shared "${itemName}"`, time: "Sep 18, 2026" },
        { who: youLabel, avatar: ownerAvatar, initials: ownerInitials, color: ownerColor, action: `created "${itemName}"`, time: "Sep 15, 2026" },
      ],
    },
  ];
  return (
    <div className="pt-5">
      {groups.map(({ label, items }) => (
        <div key={label} className="mb-5">
          <p className="mb-3 text-[12px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
          <div className="flex flex-col gap-4">
            {items.map(({ who, avatar, initials, color, action, time }, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-[8px] text-[11px] font-semibold text-white" style={{ backgroundColor: color ?? "#636366" }}>
                  {avatar
                    ? <Image src={avatar} alt="" width={32} height={32} unoptimized className="size-full object-cover" />
                    : (initials ?? who.slice(0, 2).toUpperCase())}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] leading-5 text-[#303039]">
                    <span className="font-medium">{who}</span>{" "}{action}
                  </p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">{time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function FolderNameField({ label, name }: { label: string; name: string }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(name);
  const [draft, setDraft] = useState(name);
  const [hovered, setHovered] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function startEdit() {
    setDraft(value);
    setEditing(true);
    requestAnimationFrame(() => {
      inputRef.current?.select();
    });
  }

  function save() {
    if (draft.trim()) setValue(draft.trim());
    setEditing(false);
  }

  function cancel() {
    setDraft(value);
    setEditing(false);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") save();
    if (e.key === "Escape") cancel();
  }

  return (
    <dl className="mt-7 grid gap-0">
      <div>
        <dt className="text-caption text-muted-foreground">{label}</dt>
        {editing ? (
          <dd className="mt-1">
            <input
              ref={inputRef}
              value={draft}
              onChange={e => setDraft(e.target.value)}
              onKeyDown={onKeyDown}
              className="w-full rounded-[6px] border border-[#002896] bg-white px-2 py-1.5 text-[14px] text-[#303039] outline-none ring-2 ring-[#002896]/20"
              autoFocus
            />
            <button
              type="button"
              onClick={save}
              className="mt-2 flex h-8 items-center justify-center rounded-[6px] bg-[#002896] px-4 text-[13px] font-medium text-white transition-colors hover:bg-[#001E6E] active:scale-[0.96]"
            >
              Done
            </button>
          </dd>
        ) : (
          <dd
            className="group mt-1 flex cursor-default items-center gap-1.5"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <span className="break-words text-body-md text-[#303039]">{value}</span>
            <button
              type="button"
              onClick={startEdit}
              aria-label="Rename"
              className={`flex size-6 shrink-0 items-center justify-center rounded-[6px] text-muted-foreground transition-[opacity,background-color] duration-150 hover:bg-[#F2F2F7] hover:text-[#18181A] ${hovered ? "opacity-100" : "opacity-0"}`}
            >
              <Pencil size={12} strokeWidth={2} />
            </button>
          </dd>
        )}
      </div>
    </dl>
  );
}

function AccessAvatars({ owner, ownerAvatar, ownerInitials, ownerColor, sharedWith }: {
  owner: string;
  ownerAvatar?: string;
  ownerInitials?: string;
  ownerColor?: string;
  sharedWith?: string[];
}) {
  const people = [
    { name: owner, avatar: ownerAvatar, initials: ownerInitials ?? owner.split(" ").map(p => p[0]).join("").slice(0, 2).toUpperCase(), color: ownerColor },
    ...(sharedWith ?? []).slice(0, 3).map(name => ({
      name,
      avatar: sharedPersonAvatars[name],
      initials: name.split(" ").map(p => p[0]).join("").slice(0, 2).toUpperCase(),
      color: undefined as string | undefined,
    })),
  ];
  return (
    <div className="mt-3 flex items-center">
      {people.map((p, i) => (
        <span
          key={p.name}
          className="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-[8px] border-2 border-white text-[11px] font-semibold text-white"
          style={{ marginLeft: i === 0 ? 0 : -8, zIndex: people.length - i, backgroundColor: p.color ?? "#636366" }}
          title={p.name}
        >
          {p.avatar
            ? <Image src={p.avatar} alt="" width={32} height={32} unoptimized className="size-full object-cover" />
            : p.initials}
        </span>
      ))}
    </div>
  );
}

function PersonInfo({ name, avatar, initials, color }: { name: string; avatar?: string; initials?: string; color?: string }) {
  const fallbackInitials = initials ?? name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();
  return <div className="flex min-w-0 items-center gap-2"><span className="flex size-7 shrink-0 items-center justify-center overflow-hidden rounded-[6px] bg-[#636366] text-[10px] font-semibold text-white" style={{ backgroundColor: color }}>{avatar ? <Image src={avatar} alt="" width={28} height={28} unoptimized className="size-full object-cover" /> : fallbackInitials}</span><span className="truncate text-body-md text-[#303039]">{name}</span></div>;
}

function SharedWithList({ people }: { people: string[] }) {
  const [showAll, setShowAll] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const visiblePeople = showAll ? people : people.slice(0, 3);
  const remainingCount = people.length - visiblePeople.length;

  function showRemainingPeople() {
    setIsLoading(true);
    window.setTimeout(() => {
      setShowAll(true);
      setIsLoading(false);
    }, 500);
  }

  return <section className="mt-7" aria-busy={isLoading}><div className="flex items-center justify-between gap-2"><h3 className="text-caption text-muted-foreground">Shared with</h3>{people.length > 3 && <button type="button" onClick={showAll ? () => setShowAll(false) : showRemainingPeople} disabled={isLoading} className="text-caption text-[#002896] hover:underline disabled:cursor-wait disabled:opacity-70">{showAll ? "View less" : "View all"}</button>}</div><div className="mt-1 flex flex-col gap-2">{visiblePeople.map((person) => <PersonInfo key={person} name={person} avatar={sharedPersonAvatars[person]} />)}{isLoading && Array.from({ length: remainingCount }, (_, index) => <div key={index} className="flex items-center gap-2" aria-hidden="true"><Skeleton className="size-7 rounded-[6px]" /><Skeleton className="h-4 w-28" /></div>)}</div></section>;
}

export function RightSidePanel({ items = [], teamFolders = false, showActions = true, folderInfo, onCloseFolderInfo }: RightSidePanelProps) {
  const [activeTab, setActiveTab] = useState<"details" | "activity">("details");

  if (folderInfo) {
    const previewItem = items[0];
    const isMultiSelection = items.length > 1;
    const locationName = previewItem?.location ?? folderInfo.location.replace(/^in /, "");
    const parentFolderHref = locationName === "Team Drive" ? "/drive/team-drive" : "/drive/my-drive";
    if (!previewItem) {
      return (
        <aside className="fixed top-[60px] bottom-0 right-0 z-50 flex w-full sm:max-w-[360px] flex-col border-l border-[#F2F2F7] bg-white px-4 py-3 shadow-[-8px_0_24px_rgba(24,24,26,0.12)] xl:sticky xl:top-0 xl:bottom-auto xl:z-auto xl:h-[calc(100dvh-60px)] xl:w-[240px] xl:max-w-none xl:shrink-0 xl:self-start xl:shadow-none" aria-label="File information">
          <div className="flex justify-end"><button type="button" onClick={onCloseFolderInfo} className="flex size-8 items-center justify-center rounded-[6px] text-foreground/50 hover:bg-[#F2F2F7] hover:text-[#18181A]" aria-label="Close file information"><X size={18} strokeWidth={1.75} aria-hidden="true" /></button></div>
          <p className="mt-5 px-4 text-center text-[14px] leading-5 text-muted-foreground">No Item selected</p>
        </aside>
      );
    }
    const isFolder = previewItem.type === "folder" && !isMultiSelection;
    const isTeamFolder = isFolder && previewItem.location === "Team Drive";
    const isSharedFolder = isFolder && Boolean(previewItem.shared);
    const folderType = isTeamFolder ? "Team folder" : isSharedFolder ? "Shared folder" : "Personal folder";
    const isOwner = previewItem.owner.startsWith("You");
    const hasAccess = isTeamFolder || (isSharedFolder && previewItem.sharedWith && previewItem.sharedWith.length > 0);

    // Access description — single sentence like Google Drive
    let accessDesc = "Private to you";
    if (hasAccess) {
      const ownerLabel = isOwner ? "you" : previewItem.owner;
      if (previewItem.sharedWith && previewItem.sharedWith.length > 0) {
        const first = previewItem.sharedWith[0].toLowerCase().replace(" ", ".") + "@example.com";
        const extra = previewItem.sharedWith.length > 1 ? ` and ${previewItem.sharedWith.length - 1} other${previewItem.sharedWith.length > 2 ? "s" : ""}` : "";
        accessDesc = `Owned by ${ownerLabel}. Shared with ${first}${extra}.`;
      } else {
        accessDesc = `Owned by ${ownerLabel}.`;
      }
    }

    return (
      <aside className="fixed top-[60px] bottom-0 right-0 z-50 flex w-full sm:max-w-[360px] flex-col overflow-hidden border-l border-[#F2F2F7] bg-white shadow-[-8px_0_24px_rgba(24,24,26,0.12)] xl:sticky xl:top-0 xl:bottom-auto xl:z-auto xl:h-[calc(100dvh-60px)] xl:w-[240px] xl:max-w-none xl:shrink-0 xl:self-start xl:shadow-none" aria-label="Item details">
        {/* Header: title + close */}
        <div className="flex shrink-0 items-center justify-between border-b border-[#E5E5EA] px-4 pt-3 pb-3">
          <h2 className="text-body-lg font-semibold text-[#18181A]">{isFolder ? "Folder information" : "File info"}</h2>
          <button type="button" onClick={onCloseFolderInfo} className="flex size-8 shrink-0 items-center justify-center rounded-[6px] text-foreground/50 hover:bg-[#F2F2F7] hover:text-[#18181A]" aria-label="Close details"><X size={18} strokeWidth={1.75} aria-hidden="true" /></button>
        </div>

        {/* Tabs */}
        <TabList className="shrink-0 border-b border-[#E5E5EA] px-4">
          {(["details", "activity"] as const).map(tab => (
            <Tab
              key={tab}
              variant="underline"
              aria-selected={activeTab === tab}
              onClick={() => setActiveTab(tab)}
              className={`relative mr-4 h-auto rounded-none border-none px-0 pb-2 pt-3 text-[13px] font-medium capitalize hover:bg-transparent ${activeTab === tab ? "text-[#002896]" : "text-muted-foreground hover:text-[#18181A]"}`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              {activeTab === tab && <span className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full bg-[#002896]" />}
            </Tab>
          ))}
        </TabList>

        {/* Scrollable content */}
        <div
          className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-6 [scrollbar-color:#D1D1D6_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-[5px] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#D1D1D6] [&::-webkit-scrollbar-track]:bg-transparent"
          role="tabpanel"
        >
          {activeTab === "details" ? (
            <>
              {/* Icon */}
              <div className="flex justify-center pt-7">
                <div className="relative flex h-[60px] w-[60px] items-center justify-center">
                  {isMultiSelection
                    ? <><span className="absolute top-2 h-6 w-14 rounded-[6px] border border-[#E5E5EA] bg-white" /><span className="absolute bottom-1 h-6 w-14 rounded-[6px] border border-[#E5E5EA] bg-white" /></>
                    : <FileIcon type={previewItem.type} size={48} shared={isSharedFolder} teamFolder={isTeamFolder} thumbnail={previewItem.thumbnail} />}
                </div>
              </div>

              {!isMultiSelection && <>
                <FolderNameField label={isFolder ? "Folder name" : "File name"} name={previewItem.name} />

                {/* Who has access */}
                <section className="mt-6" aria-label="Who has access">
                  <h3 className="text-[13px] font-semibold text-[#18181A]">Who has access</h3>
                  {/* Avatars: owner | divider | shared people (+ you if not owner) */}
                  <div className="mt-3 flex items-center gap-2">
                    {/* Owner avatar */}
                    <span className="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-[8px] text-[11px] font-semibold text-white" style={{ backgroundColor: previewItem.ownerColor ?? "#636366" }} title={previewItem.owner}>
                      {previewItem.ownerAvatar
                        ? <Image src={previewItem.ownerAvatar} alt="" width={32} height={32} unoptimized className="size-full object-cover" />
                        : (previewItem.ownerInitials ?? previewItem.owner.split(" ").map(p => p[0]).join("").slice(0, 2).toUpperCase())}
                    </span>
                    {/* Vertical divider */}
                    {(hasAccess || !isOwner) && (
                      <span className="h-7 w-px shrink-0 bg-[#D1D1D6]" aria-hidden="true" />
                    )}
                    {/* Shared people — overlapping. When not owner, prepend current user */}
                    <div className="flex items-center">
                      {(() => {
                        const shared = previewItem.sharedWith ?? [];
                        const displayList = !isOwner
                          ? [{ name: "You", avatar: undefined as string | undefined, initials: "KP", color: "#002896" }, ...shared.slice(0, 2).map(n => ({ name: n, avatar: sharedPersonAvatars[n], initials: n.split(" ").map(p => p[0]).join("").slice(0, 2).toUpperCase(), color: undefined as string | undefined }))]
                          : shared.slice(0, 3).map(n => ({ name: n, avatar: sharedPersonAvatars[n], initials: n.split(" ").map(p => p[0]).join("").slice(0, 2).toUpperCase(), color: undefined as string | undefined }));
                        const overflow = (previewItem.sharedWith?.length ?? 0) - (isOwner ? 3 : 2);
                        return <>
                          {displayList.map((p, i) => (
                            <span key={p.name} className="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-[8px] border-2 border-white text-[11px] font-semibold text-white" style={{ marginLeft: i === 0 ? 0 : -8, zIndex: displayList.length - i, backgroundColor: p.color ?? "#636366" }} title={p.name}>
                              {p.avatar ? <Image src={p.avatar} alt="" width={32} height={32} unoptimized className="size-full object-cover" /> : p.initials}
                            </span>
                          ))}
                          {overflow > 0 && (
                            <span className="flex size-8 shrink-0 items-center justify-center rounded-[8px] border-2 border-white bg-[#E5E5EA] text-[10px] font-semibold text-[#636366]" style={{ marginLeft: -8 }}>+{overflow}</span>
                          )}
                        </>;
                      })()}
                    </div>
                  </div>
                  {/* Access description */}
                  {!isOwner && hasAccess ? (
                    <div className="mt-2 text-[13px] leading-5">
                      <p className="text-muted-foreground">Owned by {previewItem.owner}.</p>
                      <p className="text-muted-foreground">(you)kiran.pingle@example.com</p>
                    </div>
                  ) : (
                    <p className="mt-2 text-[13px] leading-5 text-muted-foreground">{accessDesc}</p>
                  )}
                  {isOwner && (
                    <button type="button" className="mt-3 flex h-9 w-full items-center justify-center rounded-full border border-[#C7C7CC] bg-white px-5 text-[13px] font-medium text-[#002896] transition-colors hover:bg-[#F4F5FD] hover:border-[#002896] active:scale-[0.96]">
                      Manage access
                    </button>
                  )}
                </section>

                <div className="my-6 border-t border-[#F2F2F7]" />

                <dl className="grid gap-5 pb-2">
                  <div>
                    <dt className="text-caption text-muted-foreground">{isFolder ? "Folder type" : "File type"}</dt>
                    <dd className="mt-1 text-body-md text-[#303039]">{isFolder ? folderType : previewItem.type.toUpperCase()}</dd>
                  </div>
                  <div>
                    <dt className="text-caption text-muted-foreground">Location</dt>
                    <dd className="mt-1 text-body-md"><Link href={parentFolderHref} className="text-[#002896] hover:underline">{locationName}</Link></dd>
                  </div>
                  <div>
                    <dt className="text-caption text-muted-foreground">Owner</dt>
                    <dd className="mt-1"><PersonInfo name={previewItem.owner} avatar={previewItem.ownerAvatar} initials={previewItem.ownerInitials} color={previewItem.ownerColor} /></dd>
                  </div>
                  <div>
                    <dt className="text-caption text-muted-foreground">Created</dt>
                    <dd className="mt-1 text-body-md text-[#303039]">2025.02.26</dd>
                  </div>
                </dl>
              </>}
            </>
          ) : (
            <ActivityFeed owner={previewItem.owner} ownerAvatar={previewItem.ownerAvatar} ownerInitials={previewItem.ownerInitials} ownerColor={previewItem.ownerColor} itemName={previewItem.name} />
          )}
        </div>
      </aside>
    );
  }

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
    <aside className="sticky top-[60px] hidden h-[calc(100dvh-60px)] w-[240px] shrink-0 self-start overflow-y-auto border-l border-[#F2F2F7] bg-white px-1 py-3 xl:flex xl:flex-col" aria-label="Selected file details">
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
                <FileIcon type={item.type} size={48} shared={item.shared} teamFolder={teamFolders && item.type === "folder"} thumbnail={item.thumbnail} />
              )}
            </div>
            <div className="flex w-full flex-col items-center gap-1 text-center text-[12px] leading-[16px]">
              <p className="w-full break-words font-semibold text-[#18181A]" style={{ fontFamily: "'Rakuten Sans UI', 'Rakuten_Sans_UI', sans-serif" }}>
                {isMultiSelection ? `${items.length} selected` : item.name}
              </p>
              <p className="w-full text-muted-foreground" style={{ fontFamily: "'Rakuten Sans UI', 'Rakuten_Sans_UI', sans-serif" }}>
                {item.size}
              </p>
            </div>
          </div>
        </div>

        {showActions && <>
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
        </>}
      </div>
    </aside>
  );
}
