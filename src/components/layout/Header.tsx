"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { CircleHelp, Database, FileBadge, FilePenLine, LogOut, LockKeyhole, MessageSquareText, Settings, Square } from "lucide-react";
import { SearchIcon, ChevronDownIcon } from "@/components/icons";
import { Input } from "@/components/ui/input";

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const [accountOpen, setAccountOpen] = useState(false);
  const accountMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const closeOnOutsidePress = (event: MouseEvent) => {
      if (!accountMenuRef.current?.contains(event.target as Node)) setAccountOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setAccountOpen(false);
    };
    document.addEventListener("mousedown", closeOnOutsidePress);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeOnOutsidePress);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  return (
    <header className="flex items-center h-[60px] px-3 gap-3 bg-[#F2F2F7] shrink-0 sm:gap-4" style={{ paddingTop: 4, paddingBottom: 0 }}>
      <button
        type="button"
        onClick={onMenuClick}
        className="flex size-10 shrink-0 items-center justify-center rounded-[8px] text-[#48484A] hover:bg-white md:hidden"
        aria-label="Open navigation menu"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
      {/* Search */}
      <div className="flex min-w-0 flex-1 items-center">
        <div className="flex h-10 w-full items-center gap-2.5 rounded-[8px] border border-[#E5E5EA] bg-white px-3 transition-colors focus-within:border-[#002896] md:max-w-[650px]">
          <SearchIcon size={16} className="text-[#8E8E93] shrink-0" />
          <Input
            type="text"
            placeholder="Search files and folders"
            className="h-auto flex-1 border-0 bg-transparent p-0 text-[14px] leading-[20px] shadow-none focus-visible:border-0 focus-visible:ring-0"
            style={{ fontFamily: "'Rakuten Sans UI', sans-serif" }}
          />
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Language selector */}
        <button className="hidden h-10 min-w-[151px] items-center gap-2.5 rounded-[8px] border border-[#E1E1E6] bg-white px-3 text-[16px] font-medium text-[#18181A] shadow-[0_1px_2px_rgba(24,24,26,0.04)] hover:bg-[#F9F9FB] sm:flex" aria-label="Select language">
          {/* Globe icon */}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-[#8E8E93]">
            <circle cx="12" cy="12" r="9.25" stroke="currentColor" strokeWidth="1.8"/>
            <ellipse cx="12" cy="12" rx="4" ry="9.25" stroke="currentColor" strokeWidth="1.8"/>
            <path d="M2.75 12h18.5M4.25 8.25h15.5M4.25 15.75h15.5" stroke="currentColor" strokeWidth="1.5"/>
          </svg>
          <span>English</span>
          <ChevronDownIcon size={14} className="ml-auto text-[#8E8E93]" />
        </button>

        {/* Bell icon */}
        <button className="flex size-10 items-center justify-center rounded-[8px] border border-[#E1E1E6] bg-white shadow-[0_1px_2px_rgba(24,24,26,0.04)] hover:bg-[#F9F9FB] transition-colors" aria-label="Notifications">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 3a6 6 0 00-6 6v3l-2 2v1.5h16V14l-2-2V9a6 6 0 00-6-6Z" stroke="#8E8E93" strokeWidth="1.7" strokeLinejoin="round"/>
            <path d="M9.5 19a2.5 2.5 0 005 0" stroke="#8E8E93" strokeWidth="1.7" strokeLinecap="round"/>
          </svg>
        </button>

        {/* Profile */}
        <div ref={accountMenuRef} className="relative">
          <button
            type="button"
            className="flex h-10 min-w-[76px] items-center gap-2 rounded-[8px] border border-[#E1E1E6] bg-white px-1.5 shadow-[0_1px_2px_rgba(24,24,26,0.04)] hover:bg-[#F9F9FB] transition-colors"
            aria-label="Open account menu"
            aria-expanded={accountOpen}
            onClick={() => setAccountOpen((open) => !open)}
          >
            <Image src="/profile-cat.png" alt="Taro Rakuten" width={32} height={32} className="size-8 rounded-[8px] object-cover" />
            <ChevronDownIcon size={14} className="hidden text-[#8E8E93] sm:block" />
          </button>
          {accountOpen && <AccountMenu onClose={() => setAccountOpen(false)} />}
        </div>
      </div>
    </header>
  );
}

function AccountMenu({ onClose }: { onClose: () => void }) {
  const primaryItems = [
    { label: "Account Setting", icon: Settings, shortcut: "⌘⇧B" },
    { label: "Cloud Storage", icon: Database },
    { label: "Security", icon: LockKeyhole },
    { label: "Help", icon: CircleHelp },
  ];
  const legalItems = [
    { label: "Privacy Policy", icon: MessageSquareText },
    { label: "Terms of Service", icon: FileBadge },
    { label: "License", icon: FilePenLine },
    { label: "Commercial Transaction", icon: Square },
  ];

  return (
    <div className="absolute right-0 top-[calc(100%+8px)] z-30 w-[280px] max-w-[calc(100vw-24px)] rounded-[8px] border border-[#E5E5EA] bg-white p-2 shadow-[0_8px_24px_rgba(24,24,26,0.12)]" role="menu" aria-label="Account menu">
      <div className="px-3 pt-2 pb-4">
        <p className="text-[16px] font-semibold leading-6 text-[#18181A]">Kiran Pingle</p>
        <p className="mt-1 truncate text-[13px] leading-5 text-[#636366]">est.esvi011@example.com</p>
      </div>
      <div className="border-t border-[#E5E5EA] pt-4 pb-3">
        <button type="button" onClick={onClose} className="flex h-10 w-full items-center justify-center rounded-[8px] border border-[#0039B9] text-[16px] font-normal text-[#002896] transition-colors hover:bg-[#F4F5FD] focus:outline-none focus:ring-2 focus:ring-[#002896] focus:ring-offset-2">Upgrade plan</button>
        <p className="mt-4 px-3 text-[14px] leading-5 text-[#636366]">Current plan<br /><span className="font-semibold text-[#48484A]">Free</span></p>
      </div>
      <MenuGroup items={primaryItems} onSelect={onClose} />
      <MenuGroup items={legalItems} onSelect={onClose} />
      <div className="border-t border-[#E5E5EA] pt-3">
        <MenuItem label="Logout" icon={LogOut} onSelect={onClose} />
        <p className="px-3 pt-3 pb-1 text-[12px] text-[#636366]">Version: 23.3.0</p>
      </div>
    </div>
  );
}

type MenuIcon = typeof Settings;

function MenuGroup({ items, onSelect }: { items: { label: string; icon: MenuIcon; shortcut?: string }[]; onSelect: () => void }) {
  return <div className="border-t border-[#E5E5EA] py-1">{items.map((item) => <MenuItem key={item.label} {...item} onSelect={onSelect} />)}</div>;
}

function MenuItem({ label, icon: Icon, shortcut, onSelect }: { label: string; icon: MenuIcon; shortcut?: string; onSelect: () => void }) {
  return <button type="button" role="menuitem" onClick={onSelect} className="flex h-10 w-full items-center gap-3 rounded-[6px] px-3 text-left text-[14px] leading-5 text-[#18181A] transition-colors hover:bg-[#F7F7FA] focus:outline-none focus:ring-2 focus:ring-[#002896] focus:ring-inset"><Icon size={20} strokeWidth={1.8} className="shrink-0 text-[#636366]" /><span className="min-w-0 flex-1 truncate">{label}</span>{shortcut && <span className="text-[13px] text-[#636366]">{shortcut}</span>}<span className="text-[24px] font-light leading-none text-[#8E8E93]" aria-hidden="true">›</span></button>;
}
