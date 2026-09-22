"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Download, ExternalLink, Info, Pencil, Share2 } from "lucide-react";
import { FileIcon } from "@/components/drive/FileIcon";
import type { DriveItem } from "@/lib/types";

type Tab = "comments" | "about" | "version";

const OPEN_IN_LABEL: Record<string, string> = {
  word: "Open in Word for the web",
  excel: "Open in Excel for the web",
  powerpoint: "Open in PowerPoint for the web",
  pdf: "Open in PDF viewer",
};

function getOpenInLabel(type: string): string | null {
  if (type === "word" || type === "docx") return OPEN_IN_LABEL.word;
  if (type === "excel" || type === "xlsx") return OPEN_IN_LABEL.excel;
  if (type === "powerpoint" || type === "pptx") return OPEN_IN_LABEL.powerpoint;
  if (type === "pdf") return OPEN_IN_LABEL.pdf;
  return null;
}

export function FilePreview({ item }: { item: DriveItem }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("about");
  const [panelOpen, setPanelOpen] = useState(true);

  const isMedia = item.type === "image" || item.type === "video";
  const isDocument = !isMedia;
  const previewSrc = item.thumbnail ?? null;
  const openInLabel = getOpenInLabel(item.type);
  const tags = ["Design", "Asset", "2026"];

  return (
    <div className="flex h-full flex-col overflow-hidden bg-white">
      {/* Header */}
      <header className="flex h-[60px] shrink-0 items-center justify-between border-b border-[#E5E5EA] bg-white px-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex size-8 items-center justify-center rounded-[8px] text-foreground/50 transition-colors hover:bg-[#F2F2F7]"
            aria-label="Go back"
          >
            <ChevronLeft size={20} strokeWidth={1.75} />
          </button>
          <div className="flex flex-col items-start justify-center">
            <p className="text-[16px] font-semibold leading-[22px] text-foreground">{item.name}</p>
            <p className="text-[14px] leading-[20px] text-muted-foreground">Uploaded today</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {openInLabel && (
            <button
              type="button"
              className="flex h-10 items-center gap-2 rounded-[8px] border border-[#E1E1E6] bg-white px-4 text-[14px] font-normal text-[#18181A] transition-colors hover:bg-[#F9F9FB]"
            >
              <ExternalLink size={16} strokeWidth={1.75} className="text-foreground/50" />
              {openInLabel}
            </button>
          )}
          <button
            type="button"
            className="flex h-10 items-center gap-2 rounded-[8px] border border-[#E1E1E6] bg-white px-4 text-[14px] font-normal text-[#18181A] transition-colors hover:bg-[#F9F9FB]"
          >
            <Share2 size={16} strokeWidth={1.75} className="text-foreground/50" />
            Share
          </button>
          <button
            type="button"
            className="flex h-10 items-center gap-2 rounded-[8px] border border-[#E1E1E6] bg-white px-4 text-[14px] font-normal text-[#18181A] transition-colors hover:bg-[#F9F9FB]"
          >
            <Download size={16} strokeWidth={1.75} className="text-foreground/50" />
            Download
          </button>
          <button
            type="button"
            onClick={() => setPanelOpen((open) => !open)}
            className={`flex size-10 items-center justify-center rounded-[8px] border transition-colors ${panelOpen ? "border-[#002896] bg-[rgba(0,40,150,0.06)] text-[#002896]" : "border-[#E1E1E6] bg-white text-foreground/50 hover:bg-[#F9F9FB]"}`}
            aria-label="Toggle file information"
            aria-expanded={panelOpen}
          >
            <Info size={18} strokeWidth={1.75} />
          </button>
        </div>
      </header>

      {/* Body */}
      <div className="flex min-h-0 flex-1">
        {/* Preview area */}
        <div className="relative flex min-w-0 flex-1 items-start justify-center bg-[#F2F2F7]">
          {/* Prev arrow */}
          <button
            type="button"
            className="absolute left-4 top-1/2 flex size-12 -translate-y-1/2 items-center justify-center rounded-full border border-[#E5E5EA] bg-white transition-colors hover:bg-[#F9F9FB]"
            aria-label="Previous"
          >
            <ChevronLeft size={22} strokeWidth={1.75} className="text-[#18181A]" />
          </button>

          {/* Document / media content */}
          {isDocument ? (
            /* Document page — scrollable, A4 ratio, white paper */
            <div className="mx-auto my-6 w-full max-w-[760px] overflow-y-auto">
              <div className="relative w-full overflow-hidden rounded-sm bg-white shadow-[0_2px_16px_rgba(24,24,26,0.12)]" style={{ paddingBottom: "129.4%" /* A4: 1:1.414 */ }}>
                {previewSrc ? (
                  <Image src={previewSrc} alt={item.name} fill className="object-contain object-top" unoptimized />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 p-10">
                    <FileIcon type={item.type} size={64} />
                    <div className="text-center">
                      <p className="text-[16px] font-medium text-[#18181A]">{item.name}</p>
                      <p className="mt-1 text-[14px] text-muted-foreground">Preview not available</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Media preview */
            <div className="flex h-full w-full items-center justify-center px-16 py-8">
              <div className="relative flex h-full max-h-[700px] w-full max-w-[860px] items-center justify-center">
                {previewSrc ? (
                  <div className="relative h-full w-full overflow-hidden rounded-[16px]">
                    <Image src={previewSrc} alt={item.name} fill className="object-cover" unoptimized />
                    {item.type === "video" && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <button
                          type="button"
                          className="flex size-16 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-black/70"
                          aria-label="Play video"
                        >
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center gap-6 rounded-[16px] bg-white shadow-sm">
                    <FileIcon type={item.type} size={80} />
                    <p className="text-[16px] font-medium text-[#18181A]">{item.name}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Next arrow */}
          <button
            type="button"
            className="absolute right-4 top-1/2 flex size-12 -translate-y-1/2 items-center justify-center rounded-full border border-[#E5E5EA] bg-white transition-colors hover:bg-[#F9F9FB]"
            aria-label="Next"
          >
            <ChevronRight size={22} strokeWidth={1.75} className="text-[#18181A]" />
          </button>
        </div>

        {/* Right panel */}
        {panelOpen && <RightPanel item={item} activeTab={activeTab} setActiveTab={setActiveTab} tags={tags} />}
      </div>
    </div>
  );
}

const MOCK_COMMENTS = [
  { id: 1, author: "Rakuten Taro", initials: "RT", color: "#636366", avatar: undefined as string | undefined, time: "Today at 10:42 AM", text: "Updated the color palette in this version." },
  { id: 2, author: "Yuki Sato", initials: "YS", color: "#7C3AED", avatar: undefined as string | undefined, time: "Jun 24, at 2:10 PM", text: "Looks great! Can we also update the typography?" },
];

const VERSION_HISTORY = [
  {
    month: "Today",
    defaultOpen: true,
    versions: [{ name: "Version2", uploader: "Taro", dateSize: "Today at 10:35 AM | 112.12 KB" }],
  },
  {
    month: "Jun",
    defaultOpen: true,
    versions: [{ name: "Version1", uploader: "Taro", dateSize: "Jun 24, at 1:15 PM | 112.12 KB" }],
  },
  { month: "May", defaultOpen: false, versions: [] },
  { month: "Apr", defaultOpen: false, versions: [] },
  { month: "Mar", defaultOpen: false, versions: [] },
  { month: "Feb", defaultOpen: false, versions: [] },
  { month: "Jan", defaultOpen: false, versions: [] },
];

function RightPanel({
  item,
  activeTab,
  setActiveTab,
  tags,
}: {
  item: DriveItem;
  activeTab: Tab;
  setActiveTab: (t: Tab) => void;
  tags: string[];
}) {
  const [openMonths, setOpenMonths] = useState<Record<string, boolean>>(
    Object.fromEntries(VERSION_HISTORY.map((g) => [g.month, g.defaultOpen]))
  );

  const TABS: { key: Tab; label: string }[] = [
    { key: "comments", label: "Comments" },
    { key: "about", label: "About" },
    { key: "version", label: "Version History" },
  ];

  return (
    <aside className="flex w-[300px] shrink-0 flex-col border-l border-[#E5E5EA] bg-white">
      {/* Tabs */}
      <div className="flex shrink-0 border-b border-[#E5E5EA]">
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => setActiveTab(key)}
            className={`flex h-10 shrink-0 items-center justify-center px-3 text-[14px] transition-colors ${
              activeTab === key
                ? "border-b-2 border-[#002896] font-medium text-[#002896]"
                : "text-[#002896] hover:text-[#002896]/80"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Panel content */}
      <div className="min-h-0 flex-1 overflow-y-auto flex flex-col">
        {/* ── Comments ── */}
        {activeTab === "comments" && (
          <div className="flex flex-col gap-0 p-4">
            {/* Existing comments */}
            {MOCK_COMMENTS.map((c) => (
              <div key={c.id} className="flex flex-col gap-1 border-b border-[#F2F2F7] py-3">
                <div className="flex items-center gap-2">
                  <Avatar name={c.author} initials={c.initials} color={c.color} avatar={c.avatar} />
                  <span className="text-[13px] font-semibold leading-[18px] text-[#18181A]">{c.author}</span>
                  <span className="text-[12px] leading-[16px] text-[#636366]">{c.time}</span>
                </div>
                <p className="pl-9 text-[14px] leading-[20px] text-[#18181A]">{c.text}</p>
              </div>
            ))}
            {/* Input */}
            <div className="mt-3 flex flex-col gap-2 rounded-[8px] border border-[#E5E5EA] bg-white px-3 py-2" style={{ minHeight: 100 }}>
              <div className="flex flex-1 items-start gap-3">
                <Avatar name={item.owner} initials={item.owner.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase()} color={item.ownerColor ?? "#636366"} avatar={item.ownerAvatar} />
                <p className="pt-0.5 text-[14px] leading-[20px] text-[#636366]">Write a comment</p>
              </div>
              <div className="flex justify-end">
                <div className="flex h-6 items-center rounded-[8px] bg-[#F9F9FB] px-3 text-[14px] text-[#636366]">Post</div>
              </div>
            </div>
          </div>
        )}

        {/* ── About ── */}
        {activeTab === "about" && (
          <div className="flex flex-col gap-6 p-4">
            {/* Owner */}
            <div className="flex flex-col gap-2">
              <p className="text-[14px] leading-[20px] text-[#636366]">Owner</p>
              <div className="flex items-center gap-2">
                <Avatar name={item.owner} initials={item.owner.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase()} color={item.ownerColor ?? "#636366"} avatar={item.ownerAvatar} />
                <p className="text-[14px] leading-[20px] text-[#636366]">{item.owner}</p>
              </div>
            </div>

            {/* Date uploaded */}
            <div className="flex flex-col gap-2">
              <p className="text-[14px] leading-[20px] text-[#636366]">Date uploaded</p>
              <p className="text-[16px] leading-[24px] text-[#030303]">{item.modified}</p>
            </div>

            {/* Size */}
            <div className="flex flex-col gap-2">
              <p className="text-[14px] leading-[20px] text-[#636366]">Size</p>
              <p className="text-[16px] leading-[24px] text-[#030303]">{item.size ?? "—"}</p>
            </div>

            {/* Tags */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 border-b border-[#E5E5EA] py-2">
                <p className="flex-1 text-[14px] font-semibold leading-[20px] text-[#030303]">Tags</p>
                <button type="button" aria-label="Edit tags" className="flex size-6 items-center justify-center text-foreground/50 hover:text-[#18181A]">
                  <Pencil size={14} strokeWidth={1.75} />
                </button>
                <button type="button" aria-label="Collapse tags" className="flex size-6 items-center justify-center text-foreground/50 hover:text-[#18181A]">
                  <ChevronUp size={16} strokeWidth={1.75} />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span key={tag} className="flex h-6 items-center rounded-full border border-[#E5E5EA] bg-white px-3 text-[14px] leading-[18px] text-[#636366]">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Version History ── */}
        {activeTab === "version" && (
          <div className="p-4">
            {/* border-l draws the line only as tall as the content */}
            <div className="ml-[3px] h-fit w-full border-l border-[#636366] pl-5">
              {VERSION_HISTORY.map((group) => {
                const isOpen = openMonths[group.month] ?? false;
                return (
                  <div key={group.month} className="relative pb-4 last:pb-0">
                    {/* Dot centred on the border-l line */}
                    <div className="absolute -left-[24px] top-[10px] size-2 rounded-full border border-[#636366] bg-white" />

                    {/* Content */}
                    <button
                      type="button"
                      onClick={() => setOpenMonths((prev) => ({ ...prev, [group.month]: !isOpen }))}
                      className="flex w-full items-center gap-2 py-1"
                    >
                      <span className="flex-1 text-left text-[14px] font-semibold leading-[20px] text-[#030303]">{group.month}</span>
                      {isOpen
                        ? <ChevronUp size={16} strokeWidth={1.75} className="text-foreground/50" />
                        : <ChevronDown size={16} strokeWidth={1.75} className="text-foreground/50" />
                      }
                    </button>

                    {isOpen && group.versions.map((v) => (
                      <div key={v.name} className="mt-1 flex flex-col gap-1">
                        <p className="text-[14px] font-semibold leading-[20px] text-[#636366]">{v.name}</p>
                        <p className="text-[14px] leading-[20px] text-[#636366]">Uploaded by {v.uploader}</p>
                        <p className="text-[14px] leading-[20px] text-[#030303]">{v.dateSize}</p>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}

function Avatar({ name, initials, color, avatar }: { name: string; initials: string; color: string; avatar?: string }) {
  if (avatar) {
    return (
      <div className="relative shrink-0 size-7 overflow-hidden rounded-[8px] border border-white">
        <Image src={avatar} alt={name} fill className="object-cover" unoptimized />
      </div>
    );
  }
  return (
    <div
      className="flex size-7 shrink-0 items-center justify-center overflow-hidden rounded-[8px] text-[11px] font-semibold text-white"
      style={{ backgroundColor: color }}
    >
      {initials}
    </div>
  );
}
