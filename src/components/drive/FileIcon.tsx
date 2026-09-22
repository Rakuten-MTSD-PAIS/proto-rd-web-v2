"use client";

import Image from "next/image";
import type { FileType } from "@/lib/types";

interface FileIconProps {
  type: FileType;
  size?: number;
  shared?: boolean;
  teamFolder?: boolean;
  thumbnail?: string;
}

export function FileIcon({ type, size = 32, shared = false, teamFolder = false, thumbnail }: FileIconProps) {
  if (thumbnail && (type === "image" || type === "video")) {
    return <span className="relative block shrink-0 overflow-hidden rounded-[4px] border border-[#E5E5EA]" style={{ width: size, height: size }}><Image src={thumbnail} alt="" width={size} height={size} unoptimized className="size-full object-cover" />{type === "video" && <span className="absolute inset-0 grid place-items-center bg-black/20"><span className="ml-0.5 size-0 border-y-[5px] border-l-[8px] border-y-transparent border-l-white drop-shadow-sm" /></span>}</span>;
  }

  const iconSource: Record<FileType, string> = {
    folder: teamFolder ? "/file-icons/folder-team.svg" : shared ? "/file-icons/folder-share.svg" : "/file-icons/folder.svg",
    pdf: "/file-icons/file-pdf.svg",
    image: "/file-icons/file-jpg.svg",
    zip: "/file-icons/file-zip.svg",
    audio: "/file-icons/file-audio.svg",
    word: "/file-icons/file-word.svg",
    excel: "/file-icons/file-excel.svg",
    ppt: "/file-icons/file-ppt.svg",
    vector: "/file-icons/file-vector.svg",
    video: "/file-icons/file-video.svg",
    other: "/file-icons/file-skeleton.svg",
  };

  if (type === "folder") {
    // List rows render folders in the design's 32 × 28 frame. Larger preview
    // contexts retain the same aspect ratio.
    const folderHeight = size === 32 ? 28 : Math.round(size * 0.875);
    return <Image src={iconSource.folder} alt="" width={size} height={folderHeight} unoptimized className="shrink-0 object-contain" style={{ width: size, height: folderHeight }} />;
  }

  return <Image src={iconSource[type]} alt="" width={size} height={size} unoptimized className="shrink-0 object-contain" style={{ width: size, height: size }} />;
}
