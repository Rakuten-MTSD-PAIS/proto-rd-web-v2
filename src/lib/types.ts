export type FileType = "folder" | "pdf" | "image" | "zip" | "audio" | "word" | "excel" | "ppt" | "vector" | "video" | "other";

export interface DriveItem {
  id: string;
  name: string;
  type: FileType;
  modified: string;
  size: string;
  owner: string;
  creator?: string;
  sharedWith?: string[];
  ownerInitials?: string;
  ownerColor?: string;
  ownerAvatar?: string;
  thumbnail?: string;
  location: string;
  starred?: boolean;
  shared?: boolean;
}

export type ViewMode = "list" | "grid";
export type SortField = "name" | "modified" | "size" | "owner";
