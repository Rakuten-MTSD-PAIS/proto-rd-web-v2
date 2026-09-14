"use client";

import { MoreActionsMenu } from "./MoreActionsMenu";
import { FileIcon } from "./FileIcon";

interface FolderCardItem {
  id: string;
  name: string;
  location: string;
}

interface FolderCardsProps {
  folders: FolderCardItem[];
}

export function FolderCards({ folders }: FolderCardsProps) {
  if (folders.length === 0) return null;

  return (
    <div className="grid grid-cols-1 gap-5 px-5 py-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {folders.map((folder) => (
        <article
          key={folder.id}
          className="group flex min-h-[68px] min-w-0 items-center rounded-[8px] border border-[#E5E5EA] bg-white transition-colors hover:bg-[#F9F9FB]"
        >
          <div className="flex w-full items-center justify-between px-4">
            <div className="flex min-w-0 items-center gap-3">
              <FileIcon type="folder" size={32} />
              <div className="min-w-0">
                <p className="truncate text-[16px] font-normal leading-[20px] text-[#18181A]">{folder.name}</p>
                <p className="mt-0.5 truncate text-[14px] leading-[20px] text-[#636366]">{folder.location}</p>
              </div>
            </div>
            <div className="ml-2 shrink-0"><MoreActionsMenu itemName={folder.name} isFolder /></div>
          </div>
        </article>
      ))}
    </div>
  );
}
