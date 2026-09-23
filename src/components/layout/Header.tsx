"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { CircleHelp, Clock, Database, FileBadge, FileImage, FilePenLine, Folder, LogOut, LockKeyhole, MessageSquareText, SearchX, Settings, SlidersHorizontal, Square, X } from "lucide-react";
import { SearchIcon, ChevronDownIcon } from "@/components/icons";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { FilterBar } from "@/components/drive/FilterBar";
import type { DriveItem, ViewMode } from "@/lib/types";
import { myDriveItems, recentItems, sharedItems, starredItems, teamDriveItems } from "@/lib/mock-data";

interface HeaderProps {
  onMenuClick: () => void;
}

const searchSuggestions: DriveItem[] = [
  ...recentItems,
  ...myDriveItems,
  ...teamDriveItems,
  ...sharedItems,
  ...starredItems,
];

export function Header({ onMenuClick }: HeaderProps) {
  const [accountOpen, setAccountOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredSearchSuggestions, setFilteredSearchSuggestions] = useState<DriveItem[]>(searchSuggestions);
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    try { return JSON.parse(localStorage.getItem("rd-recent-searches") ?? "[]"); } catch { return []; }
  });
  const accountMenuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const urlQuery = searchParams.get("search") ?? "";
    if (urlQuery) setSearchQuery(urlQuery);
  }, [searchParams]);

  const saveRecentSearch = (query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;
    setRecentSearches((prev) => {
      const next = [trimmed, ...prev.filter((s) => s !== trimmed)].slice(0, 8);
      localStorage.setItem("rd-recent-searches", JSON.stringify(next));
      return next;
    });
  };

  const removeRecentSearch = (query: string) => {
    setRecentSearches((prev) => {
      const next = prev.filter((s) => s !== query);
      localStorage.setItem("rd-recent-searches", JSON.stringify(next));
      return next;
    });
  };

  useEffect(() => {
    const closeOnOutsidePress = (event: MouseEvent) => {
      if (!accountMenuRef.current?.contains(event.target as Node)) setAccountOpen(false);
      if (!searchRef.current?.contains(event.target as Node)) setSearchOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setAccountOpen(false);
        setSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", closeOnOutsidePress);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeOnOutsidePress);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  const visibleSuggestions = filteredSearchSuggestions.filter(({ name, owner }) =>
    `${name} ${owner}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const showAllResults = (query = searchQuery) => {
    const trimmed = query.trim();
    saveRecentSearch(trimmed);
    const params = new URLSearchParams();
    if (trimmed) params.set("search", trimmed);
    router.push(`/drive/recent?${params.toString()}`);
    setSearchOpen(false);
  };

  return (
    <header className={`sticky top-0 ${searchOpen ? "z-[999]" : "z-50"} flex h-[60px] shrink-0 items-center gap-3 bg-[#F2F2F7] px-3 sm:gap-4`}>
      <button
        type="button"
        onClick={onMenuClick}
        className="flex size-10 shrink-0 items-center justify-center rounded-[8px] text-foreground/50 hover:bg-white lg:hidden"
        aria-label="Open navigation menu"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
      {/* Search */}
      <div className="flex min-w-0 flex-1 items-center">
        <div ref={searchRef} className="relative w-full md:max-w-[650px]">
          <div className="flex h-10 w-full items-center gap-2.5 rounded-[8px] border border-[#E5E5EA] bg-white px-3 transition-colors focus-within:border-[#002896]">
            <SearchIcon size={16} className="text-foreground/50 shrink-0" />
            <Input
              type="text"
              placeholder="Search files and folders"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              onFocus={() => setSearchOpen(true)}
              onKeyDown={(event) => {
                if (event.key === "Enter") showAllResults(searchQuery);
              }}
              className="h-auto flex-1 border-0 bg-transparent p-0 text-[14px] leading-[20px] shadow-none focus-visible:border-0 focus-visible:ring-0"
              style={{ fontFamily: "'Rakuten Sans UI', sans-serif" }}
            />
            {searchQuery && (
              <button type="button" onClick={() => { setSearchQuery(""); router.push("/drive/recent"); }} aria-label="Clear search" className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[#C7C7CC] text-white transition-colors hover:bg-[#8E8E93]">
                <X size={12} strokeWidth={2.5} aria-hidden="true" />
              </button>
            )}
          </div>
        {searchOpen && (
          <section
            className="absolute left-0 top-[calc(100%+8px)] z-[1000] flex w-full max-h-[calc(100dvh-84px)] flex-col overflow-visible rounded-[16px] border border-border-subtle bg-background shadow-[0_16px_40px_rgba(24,24,26,0.16)] max-md:fixed max-md:left-4 max-md:top-[68px] max-md:w-[calc(100vw-2rem)]"
            aria-label="Search suggestions"
          >
            <div className="border-b border-border-subtle px-5 py-3">
              <FilterBar items={searchSuggestions} viewMode={"list" as ViewMode} onItemsChange={setFilteredSearchSuggestions} onViewModeChange={() => {}} hideViewControls searchQuery={searchQuery} />
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-3 py-3 sm:px-5">
              {(() => {
                const q = searchQuery.trim().toLowerCase();
                const matchingRecent = recentSearches.filter((s) => !q || s.toLowerCase().includes(q));
                if (matchingRecent.length > 0) {
                  return (
                    <div className="flex flex-col">
                      <p className="px-3 pb-1 pt-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Recent searches</p>
                      {matchingRecent.map((query) => (
                        <div key={query} className="group flex items-center gap-3 rounded-[8px] px-3 py-2.5 hover:bg-[#F6F7FC]">
                          <Clock className="size-4 shrink-0 text-foreground/40" aria-hidden="true" />
                          <button type="button" className="min-w-0 flex-1 text-left text-[14px] text-foreground" onClick={() => { setSearchQuery(query); showAllResults(query); }}>
                            {query}
                          </button>
                          <button type="button" onClick={() => removeRecentSearch(query)} className="hidden size-6 items-center justify-center rounded-full text-foreground/40 hover:bg-[#E5E5EA] hover:text-foreground group-hover:flex" aria-label={`Remove "${query}" from recent searches`}>
                            <X size={13} strokeWidth={2} />
                          </button>
                        </div>
                      ))}
                    </div>
                  );
                }
                if (!q) {
                  return (
                    <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
                      <SearchIcon size={28} className="text-foreground/30" aria-hidden="true" />
                      <p className="text-[14px] text-muted-foreground">Search for files and folders</p>
                    </div>
                  );
                }
                return (
                  <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
                    <SearchIcon size={28} className="text-foreground/30" aria-hidden="true" />
                    <p className="text-[14px] text-muted-foreground">Press Enter to search for &ldquo;{searchQuery}&rdquo;</p>
                  </div>
                );
              })()}
            </div>

            <div className="flex items-center justify-between border-t border-border-subtle px-5 py-3">
              <button type="button" onClick={() => { setSearchOpen(false); setSearchQuery(""); router.push("/drive/recent"); }} className="flex h-10 items-center gap-2 rounded-[8px] border border-[#E1E1E6] bg-white px-4 text-[14px] font-medium text-[#18181A] transition-colors hover:bg-[#F9F9FB]">
                <X size={15} strokeWidth={2} aria-hidden="true" />
                Cancel
              </button>
              <button type="button" onClick={showAllResults} className="flex h-10 items-center gap-2 rounded-[8px] bg-[#002896] px-4 text-[14px] font-medium text-white transition-colors hover:bg-[#001F73]">
                <SearchIcon size={15} />
                Search
              </button>
            </div>
          </section>
        )}
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Language selector — icon-only on xs, full pill on sm+ */}
        <button className="flex h-10 items-center gap-1 px-2 rounded-[8px] border border-[#E1E1E6] bg-white shadow-[0_1px_2px_rgba(24,24,26,0.04)] hover:bg-[#F9F9FB] sm:hidden" aria-label="Select language">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-foreground/50" aria-hidden="true">
            <circle cx="12" cy="12" r="9.25" stroke="currentColor" strokeWidth="1.8"/>
            <ellipse cx="12" cy="12" rx="4" ry="9.25" stroke="currentColor" strokeWidth="1.8"/>
            <path d="M2.75 12h18.5M4.25 8.25h15.5M4.25 15.75h15.5" stroke="currentColor" strokeWidth="1.5"/>
          </svg>
          <ChevronDownIcon size={12} className="text-foreground/50" />
        </button>
        <button className="hidden h-10 items-center gap-2.5 rounded-[8px] border border-[#E1E1E6] bg-white px-3 text-body-md font-medium text-[#18181A] shadow-[0_1px_2px_rgba(24,24,26,0.04)] hover:bg-[#F9F9FB] sm:flex" aria-label="Select language">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-foreground/50" aria-hidden="true">
            <circle cx="12" cy="12" r="9.25" stroke="currentColor" strokeWidth="1.8"/>
            <ellipse cx="12" cy="12" rx="4" ry="9.25" stroke="currentColor" strokeWidth="1.8"/>
            <path d="M2.75 12h18.5M4.25 8.25h15.5M4.25 15.75h15.5" stroke="currentColor" strokeWidth="1.5"/>
          </svg>
          <span>English</span>
          <ChevronDownIcon size={14} className="text-foreground/50" />
        </button>

        {/* Bell icon */}
        <button className="flex size-10 items-center justify-center rounded-[8px] border border-[#E1E1E6] bg-white shadow-[0_1px_2px_rgba(24,24,26,0.04)] hover:bg-[#F9F9FB] transition-colors" aria-label="Notifications">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-foreground/50" aria-hidden="true">
            <path d="M12 3a6 6 0 00-6 6v3l-2 2v1.5h16V14l-2-2V9a6 6 0 00-6-6Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/>
            <path d="M9.5 19a2.5 2.5 0 005 0" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
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
            <ChevronDownIcon size={14} className="text-foreground/50" />
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
    <div className="absolute right-0 top-[calc(100%+8px)] z-[9999] w-[280px] max-w-[calc(100vw-24px)] rounded-[8px] border border-[#E5E5EA] bg-white p-2 shadow-[0_8px_24px_rgba(24,24,26,0.12)]" role="menu" aria-label="Account menu">
      <div className="px-3 pt-2 pb-4">
        <p className="text-body-md font-semibold text-[#18181A]">Kiran Pingle</p>
        <p className="mt-1 truncate text-caption text-muted-foreground">est.esvi011@example.com</p>
      </div>
      <div className="border-t border-[#E5E5EA] pt-4 pb-3">
        <button type="button" onClick={onClose} className="flex h-10 w-full items-center justify-center rounded-[8px] border border-[#0039B9] text-body-md font-normal text-[#002896] transition-colors hover:bg-[#F4F5FD] focus:outline-none focus:ring-2 focus:ring-[#002896] focus:ring-offset-2">Upgrade plan</button>
        <p className="mt-4 px-3 text-caption text-muted-foreground">Current plan<br /><span className="text-body-md font-semibold text-[#48484A]">Free</span></p>
      </div>
      <MenuGroup items={primaryItems} onSelect={onClose} />
      <MenuGroup items={legalItems} onSelect={onClose} />
      <div className="border-t border-[#E5E5EA] pt-3">
        <MenuItem label="Logout" icon={LogOut} onSelect={onClose} />
        <p className="px-3 pt-3 pb-1 text-caption text-muted-foreground">Version: 23.3.0</p>
      </div>
    </div>
  );
}

type MenuIcon = typeof Settings;

function MenuGroup({ items, onSelect }: { items: { label: string; icon: MenuIcon; shortcut?: string }[]; onSelect: () => void }) {
  return <div className="border-t border-[#E5E5EA] py-1">{items.map((item) => <MenuItem key={item.label} {...item} onSelect={onSelect} />)}</div>;
}

function MenuItem({ label, icon: Icon, shortcut, onSelect }: { label: string; icon: MenuIcon; shortcut?: string; onSelect: () => void }) {
  return <button type="button" role="menuitem" onClick={onSelect} className="flex h-10 w-full items-center gap-3 rounded-[6px] px-3 text-left text-body-md text-[#18181A] transition-colors hover:bg-[#F7F7FA] focus:outline-none focus:ring-2 focus:ring-[#002896] focus:ring-inset"><Icon size={20} strokeWidth={1.8} className="shrink-0 text-foreground/50" /><span className="min-w-0 flex-1 truncate">{label}</span>{shortcut && <span className="text-caption text-muted-foreground">{shortcut}</span>}<span className="text-[24px] font-light leading-none text-foreground/50" aria-hidden="true">›</span></button>;
}
