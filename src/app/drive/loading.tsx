const rows = Array.from({ length: 10 });

export default function DriveLoading() {
  return (
    <div className="p-4 sm:p-6" aria-busy="true" aria-label="Loading files">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div className="h-7 w-36 rounded bg-[#F2F2F7]" />
        <div className="h-10 w-36 rounded-[8px] bg-[#F2F2F7]" />
      </div>
      <div className="mb-5 flex items-center justify-between gap-3">
        <div className="flex gap-2"><span className="h-8 w-24 rounded-[8px] bg-[#F2F2F7]" /><span className="h-8 w-24 rounded-[8px] bg-[#F2F2F7]" /><span className="h-8 w-28 rounded-[8px] bg-[#F2F2F7]" /></div>
        <span className="h-10 w-20 rounded-[12px] bg-[#F2F2F7]" />
      </div>
      <div className="overflow-hidden rounded-[12px] border border-[#F2F2F7]">
        <div className="flex h-[42px] items-center gap-4 border-b border-[#F2F2F7] px-4"><span className="size-4 rounded bg-[#F2F2F7]" /><span className="h-4 w-36 rounded bg-[#F2F2F7]" /></div>
        {rows.map((_, index) => <div key={index} className="flex h-16 items-center gap-3 border-b border-[#F2F2F7] px-4 last:border-b-0"><span className="size-8 rounded-[6px] bg-[#F2F2F7]" /><span className="h-4 w-48 max-w-[36%] rounded bg-[#F2F2F7]" /><span className="ml-auto hidden h-4 w-32 rounded bg-[#F2F2F7] sm:block" /><span className="hidden h-4 w-24 rounded bg-[#F2F2F7] md:block" /><span className="hidden h-4 w-16 rounded bg-[#F2F2F7] md:block" /></div>)}
      </div>
    </div>
  );
}
