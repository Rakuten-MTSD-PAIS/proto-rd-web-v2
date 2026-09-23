import { notFound } from "next/navigation";
import { recentItems, myDriveItems, starredItems, sharedItems, teamDriveItems, trashItems, getAllFolderFileItems } from "@/lib/mock-data";
import { FilePreview } from "@/components/drive/FilePreview";
import type { DriveItem } from "@/lib/types";

const allItems: DriveItem[] = [
  ...recentItems,
  ...myDriveItems,
  ...teamDriveItems,
  ...sharedItems,
  ...starredItems,
  ...trashItems,
  ...getAllFolderFileItems(),
].filter((item, index, arr) => arr.findIndex((i) => i.id === item.id) === index);

export function generateStaticParams() {
  return allItems.map((item) => ({ id: item.id }));
}

export default async function PreviewPage({ params }: PageProps<"/preview/[id]">) {
  const { id } = await params;
  const item = allItems.find((i) => i.id === id);
  if (!item) notFound();
  return <FilePreview item={item} />;
}
