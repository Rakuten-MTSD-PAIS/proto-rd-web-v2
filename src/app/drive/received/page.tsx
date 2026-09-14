import { Inbox, Link2 } from "lucide-react";
import { PageToolbar } from "@/components/drive/PageToolbar";

const receivedLinkTemplates = [
  { name: "Marketing image pack", sender: "Yuki Tanaka", received: "Today, 10:30 AM", expires: "Apr 12, 2026" },
  { name: "Product roadmap", sender: "Ken Sato", received: "Yesterday, 4:15 PM", expires: "Apr 09, 2026" },
];

const receivedLinks = Array.from({ length: 25 }, (_, index) => {
  const link = receivedLinkTemplates[index % receivedLinkTemplates.length];
  const copy = Math.floor(index / receivedLinkTemplates.length);
  return { ...link, name: copy ? `${link.name} ${copy + 1}` : link.name };
});

export default function ReceivedLinkPage() {
  return (
    <div className="flex flex-col gap-5 p-4 sm:p-6">
      <PageToolbar breadcrumbs={[{ label: "Received Link" }]} showActions={false} />
      <section className="overflow-hidden rounded-[12px] border border-[#E5E5EA] bg-white">
        <div className="border-b border-[#E5E5EA] px-4 py-4 sm:px-5">
          <h1 className="text-[18px] font-semibold text-[#18181A]">Received links</h1>
          <p className="mt-1 text-[14px] text-[#636366]">Files and folders shared with you by link.</p>
        </div>
        {receivedLinks.length ? <div className="divide-y divide-[#E5E5EA]">{receivedLinks.map((link) => <article key={link.name} className="flex items-center gap-3 px-4 py-4 hover:bg-[#F9F9FB] sm:px-5"><span className="flex size-9 shrink-0 items-center justify-center rounded-[8px] bg-[#E9EEF6] text-[#002896]"><Link2 size={18} /></span><div className="min-w-0 flex-1"><p className="truncate text-[15px] font-medium text-[#18181A]">{link.name}</p><p className="mt-0.5 text-[13px] text-[#636366]">From {link.sender} · {link.received}</p></div><p className="hidden text-[13px] text-[#636366] sm:block">Expires {link.expires}</p></article>)}</div> : <div className="flex flex-col items-center py-20 text-center"><Inbox size={40} className="text-[#AEAEB2]" /><p className="mt-3 text-[16px] text-[#636366]">No received links</p></div>}
      </section>
    </div>
  );
}
