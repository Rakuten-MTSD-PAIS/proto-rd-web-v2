"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";

export default function DriveLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-dvh overflow-hidden bg-[#F2F2F7]">
      {mobileOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          aria-label="Close navigation menu"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <Sidebar
        collapsed={collapsed}
        onToggle={() => {
            if (typeof window !== "undefined" && window.innerWidth < 1024) {
              setMobileOpen(false);
            } else {
              setCollapsed((v) => !v);
            }
          }}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Header onMenuClick={() => setMobileOpen(true)} />
        <main className="mx-1 mb-1 mt-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto rounded-tl-[12px] rounded-tr-[12px] bg-white sm:rounded-tl-[16px] sm:rounded-tr-[16px]">
          {children}
        </main>
      </div>
    </div>
  );
}
