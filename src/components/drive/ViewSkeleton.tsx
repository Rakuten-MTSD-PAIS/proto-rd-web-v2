"use client";

import { useEffect, useState } from "react";

export function ViewSkeleton() {
  return (
    <div className="w-full animate-pulse px-4 sm:px-6">
      <div className="flex items-center gap-2 py-3">
        <div className="h-8 w-20 rounded-[8px] bg-[#F2F2F7]" />
        <div className="h-8 w-24 rounded-[8px] bg-[#F2F2F7]" />
        <div className="h-8 w-28 rounded-[8px] bg-[#F2F2F7]" />
      </div>
      <div className="h-[42px] border-b border-[#F2F2F7]" />
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 border-b border-[#F2F2F7] py-3">
          <div className="size-5 shrink-0 rounded-[4px] bg-[#F2F2F7]" />
          <div className="size-8 shrink-0 rounded-[6px] bg-[#F2F2F7]" />
          <div className="h-4 flex-1 rounded bg-[#F2F2F7]" style={{ maxWidth: `${55 + (i % 3) * 15}%` }} />
          <div className="ml-auto hidden h-4 w-24 rounded bg-[#F2F2F7] lg:block" />
          <div className="hidden h-4 w-14 rounded bg-[#F2F2F7] lg:block" />
        </div>
      ))}
    </div>
  );
}

export function MountedView({
  mounted,
  children,
}: {
  mounted: boolean;
  children: React.ReactNode;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (mounted) {
      // next frame so the initial opacity:0 is painted before transitioning
      requestAnimationFrame(() => setVisible(true));
    }
  }, [mounted]);

  if (!mounted) return <ViewSkeleton />;

  return (
    <div
      style={{
        opacity: visible ? 1 : 0,
        transition: "opacity 150ms cubic-bezier(0.2,0,0,1)",
      }}
    >
      {children}
    </div>
  );
}
