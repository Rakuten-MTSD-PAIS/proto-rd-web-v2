import Link from "next/link";
import { notFound } from "next/navigation";
import { FileIcon } from "@/components/drive/FileIcon";
import { recentItems } from "@/lib/mock-data";

export function generateStaticParams() {
  return recentItems.map((item) => ({ id: item.id }));
}

export default async function RecentFileDetailPage({ params }: PageProps<"/drive/recent/[id]">) {
  const { id } = await params;
  const item = recentItems.find((candidate) => candidate.id === id);

  if (!item) notFound();

  return <div className="mx-auto w-full max-w-3xl px-6 py-10">
    <Link href="/drive/recent" className="inline-flex h-10 items-center rounded-[8px] border border-[#E5E5EA] px-4 text-[14px] text-[#18181A] transition-colors hover:bg-[#F9F9FB]">Back to Recent</Link>
    <section className="mt-6 rounded-[12px] border border-[#E5E5EA] bg-white p-6" aria-labelledby="file-detail-heading">
      <div className="flex items-start gap-4">
        <FileIcon type={item.type} size={48} thumbnail={item.thumbnail} />
        <div className="min-w-0">
          <h1 id="file-detail-heading" className="break-words text-[24px] font-semibold leading-8 text-[#18181A]">{item.name}</h1>
          <p className="mt-1 text-[14px] leading-5 text-[#636366]">{item.location}</p>
        </div>
      </div>
      <dl className="mt-8 grid grid-cols-1 gap-5 border-t border-[#E5E5EA] pt-6 sm:grid-cols-3">
        <div><dt className="text-[13px] text-[#636366]">Modified</dt><dd className="mt-1 text-[14px] text-[#18181A]">{item.modified}</dd></div>
        <div><dt className="text-[13px] text-[#636366]">Size</dt><dd className="mt-1 text-[14px] text-[#18181A]">{item.size}</dd></div>
        <div><dt className="text-[13px] text-[#636366]">Owner</dt><dd className="mt-1 text-[14px] text-[#18181A]">{item.owner}</dd></div>
      </dl>
    </section>
  </div>;
}
