import { notFound } from "next/navigation";
import { allFolderIds } from "@/lib/mock-data";
import { FolderView } from "@/components/drive/FolderView";

export function generateStaticParams() {
  return allFolderIds.map((id) => ({ id }));
}

export default async function FolderPage({ params }: PageProps<"/drive/folder/[id]">) {
  const { id } = await params;
  if (!allFolderIds.includes(id)) notFound();
  return <FolderView folderId={id} />;
}
