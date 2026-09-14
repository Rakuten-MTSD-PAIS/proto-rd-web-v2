"use client";

import { useState } from "react";
import { Copy, Link2, Plus } from "lucide-react";
import { PageToolbar } from "@/components/drive/PageToolbar";

const linkTemplates = [
  { name: "Q2 campaign assets", expires: "Apr 28, 2026", downloads: "3", status: "Active" },
  { name: "Design handoff", expires: "Apr 15, 2026", downloads: "12", status: "Active" },
  { name: "Webinar recording", expires: "Expired", downloads: "8", status: "Expired" },
];

const links = Array.from({ length: 25 }, (_, index) => {
  const link = linkTemplates[index % linkTemplates.length];
  const copy = Math.floor(index / linkTemplates.length);
  return { ...link, name: copy ? `${link.name} ${copy + 1}` : link.name };
});

export default function MyLinkPage() {
  const [copied, setCopied] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-5 p-4 sm:p-6">
      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <PageToolbar breadcrumbs={[{ label: "My Link" }]} showActions={false} />
        <button className="flex h-9 items-center gap-2 rounded-[8px] bg-[#002896] px-3 text-[14px] font-semibold text-white transition-colors duration-150 hover:bg-[#001F7A]">
          <Plus size={16} /> Create link
        </button>
      </div>
      <section className="overflow-hidden rounded-[12px] border border-[#E5E5EA] bg-white">
        <div className="border-b border-[#E5E5EA] px-4 py-4 sm:px-5">
          <h1 className="text-[18px] font-semibold text-[#18181A]">Shared links</h1>
          <p className="mt-1 text-[14px] text-[#636366]">Manage links you have shared with others.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] border-collapse" style={{ fontFamily: "'Rakuten Sans UI', sans-serif" }}>
            <thead><tr className="h-[42px] border-b border-[#E5E5EA] text-left text-[14px] font-normal text-[#636366]"><th className="px-5 font-normal">Name</th><th className="w-40 px-4 font-normal">Expires</th><th className="w-28 px-4 font-normal">Downloads</th><th className="w-28 px-4 font-normal">Status</th><th className="w-14 px-3" /></tr></thead>
            <tbody>{links.map((link) => <tr key={link.name} className="h-16 border-b border-[#E5E5EA] last:border-b-0 hover:bg-[#F9F9FB]"><td className="px-5"><div className="flex items-center gap-3"><Link2 size={18} className="text-[#002896]" /><span className="text-[15px] text-[#18181A]">{link.name}</span></div></td><td className="px-4 text-[14px] text-[#636366]">{link.expires}</td><td className="px-4 text-[14px] text-[#636366]">{link.downloads}</td><td className="px-4"><span className={`text-[13px] ${link.status === "Active" ? "text-[#009400]" : "text-[#636366]"}`}>{link.status}</span></td><td className="px-3"><button type="button" onClick={() => setCopied(link.name)} className="flex size-8 items-center justify-center rounded-[6px] text-[#636366] hover:bg-[#E5E5EA]" aria-label={`Copy ${link.name} link`}><Copy size={16} /></button></td></tr>)}</tbody>
          </table>
        </div>
      </section>
      {copied && <p className="text-[13px] text-[#009400]">Copied the {copied} link.</p>}
    </div>
  );
}
