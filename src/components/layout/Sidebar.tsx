"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import horizontalLogo from "../../../reference ui/Rakuten Drive logo_1line.png";
import compactLogo from "../../../reference ui/2 RECENT/SIDEBAR/RD logo small.png";
import {
  ClockIcon,
  FolderIcon,
  FolderSharedIcon,
  ShareIcon,
  StarIcon,
  TrashIcon,
  SendIcon,
  LinkIcon,
  InboxIcon,
  ChevronRightIcon,
  ChevronDownIcon,
} from "@/components/icons";
import { STORAGE_USED_MB, STORAGE_TOTAL_TB, STORAGE_PERCENT } from "@/lib/mock-data";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

const mainNav = [
  { href: "/drive/recent", label: "Recent", icon: ClockIcon },
  { href: "/drive/my-drive", label: "My Drive", icon: FolderIcon },
  { href: "/drive/team-drive", label: "Team Drive", icon: FolderSharedIcon },
  { href: "/drive/shared", label: "Shared with Me", icon: ShareIcon },
  { href: "/drive/starred", label: "Starred", icon: StarIcon },
  { href: "/drive/trash", label: "Trash", icon: TrashIcon },
];

const transferSubNav = [
  { href: "/drive/send-files", label: "Send Files", icon: SendIcon },
  { href: "/drive/my-link", label: "My Link", icon: LinkIcon },
  { href: "/drive/received", label: "Received Link", icon: InboxIcon },
];

export function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose }: SidebarProps) {
  const pathname = usePathname();
  const [transferOpen, setTransferOpen] = useState(true);

  const isActive = (href: string) => pathname.startsWith(href);

  return (
    <aside
      className={`group relative flex h-full min-w-[80px] shrink-0 flex-col bg-[#F2F2F7] transition-transform duration-200 ease-out md:max-lg:!w-20 max-md:fixed max-md:inset-y-0 max-md:left-0 max-md:z-50 max-md:!w-[280px] max-md:shadow-2xl ${mobileOpen ? "max-md:translate-x-0" : "max-md:-translate-x-full"}`}
      style={{ width: collapsed ? 80 : 260 }}
    >
      {/* Logo row */}
      <div
        className={`flex px-4 shrink-0 ${
          collapsed ? "h-[65px] items-start justify-center pt-[14px]" : "h-[55px] items-center justify-between md:max-lg:justify-center"
        }`}
      >
        {collapsed ? (
          <Image src={compactLogo} alt="Rakuten Drive" priority className="h-[33px] w-[31px] object-contain" />
        ) : (
          <>
            <Image src={horizontalLogo} alt="Rakuten Drive" priority className="h-[23px] w-[130px] object-contain md:max-lg:hidden" />
            {/* Sidebar brand icon — layout toggle */}
            <button
              onClick={onToggle}
              className="w-8 h-8 flex items-center justify-center rounded-[6px] hover:bg-[rgba(0,40,150,0.08)] transition-colors md:max-lg:hidden"
              title="Collapse sidebar"
              aria-label="Collapse sidebar"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <rect x="1" y="2" width="5" height="12" rx="1.5" stroke="#636366" strokeWidth="1.2" />
                <path d="M9 4h5M9 8h5M9 12h5" stroke="#636366" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Main Nav */}
      <nav className="flex-1 overflow-y-auto px-2 pt-2 pb-2 flex flex-col gap-0" style={{ fontFamily: "'Rakuten Sans', sans-serif" }}>
        {/* Primary nav items */}
        <div className="space-y-0.5">
          {mainNav.map(({ href, label, icon: Icon }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 h-10 rounded-[8px] text-[16px] leading-[24px] transition-colors ${
                  collapsed ? "justify-center px-0" : "px-[16px] md:max-lg:justify-center md:max-lg:px-0"
                } ${
                  active
                    ? "bg-[rgba(0,40,150,0.1)] text-[#002896] font-semibold"
                    : "text-[#030303] font-normal hover:bg-[rgba(0,40,150,0.06)]"
                }`}
                title={label}
                onClick={onMobileClose}
              >
                <Icon
                  size={16}
                  className={active ? "text-[#002896] shrink-0" : "text-[#48484A] shrink-0"}
                />
                {!collapsed && <span className="truncate md:max-lg:hidden">{label}</span>}
              </Link>
            );
          })}
        </div>

        {/* Transfer section */}
        <div className="mt-3 border-t border-[#E5E5EA] pt-3">
          {!collapsed ? (
            <>
              {/* Transfer section header */}
              <button
                onClick={() => setTransferOpen((v) => !v)}
                className="flex h-10 w-full items-center gap-2 rounded-[8px] px-[16px] text-[16px] leading-[24px] font-normal text-[#636366] hover:bg-[rgba(0,40,150,0.06)] transition-colors md:max-lg:justify-center md:max-lg:px-0"
                aria-label="Toggle transfer navigation"
                aria-expanded={transferOpen}
              >
                {/* Transfer arrows icon */}
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="shrink-0">
                  <path d="M1 3.5h10M8.5 1.5l2 2-2 2" stroke="#48484A" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M11 8.5H1M3.5 6.5l-2 2 2 2" stroke="#48484A" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="md:max-lg:hidden">Transfer</span>
                <ChevronDownIcon
                  size={12}
                  className={`ml-auto text-[#636366] transition-transform md:max-lg:hidden ${transferOpen ? "" : "-rotate-90"}`}
                />
              </button>

              {/* Transfer sub-items */}
              {transferOpen && (
                <div className="space-y-0.5 mt-0.5">
                  {transferSubNav.map(({ href, label, icon: Icon }) => {
                    const active = isActive(href);
                    return (
                      <Link
                        key={href}
                        href={href}
                          className={`flex items-center gap-3 h-10 pl-[40px] pr-[16px] rounded-[8px] text-[16px] leading-[24px] transition-colors md:max-lg:justify-center md:max-lg:px-0 ${
                          active
                            ? "bg-[rgba(0,40,150,0.1)] text-[#002896] font-semibold"
                            : "text-[#030303] font-normal hover:bg-[rgba(0,40,150,0.06)]"
                        }`}
                          onClick={onMobileClose}
                          title={label}
                        >
                        <Icon
                          size={16}
                          className={active ? "text-[#002896] shrink-0" : "text-[#48484A] shrink-0"}
                        />
                        <span className="truncate md:max-lg:hidden">{label}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </>
          ) : (
            /* Collapsed: just icons */
            <div className="space-y-0.5">
              {transferSubNav.map(({ href, label, icon: Icon }) => {
                const active = isActive(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`flex items-center justify-center h-10 rounded-[8px] transition-colors ${
                      active
                        ? "bg-[rgba(0,40,150,0.1)] text-[#002896]"
                        : "text-[#18181A] hover:bg-[rgba(0,40,150,0.06)]"
                    }`}
                    title={label}
                    onClick={onMobileClose}
                  >
                    <Icon size={16} className={active ? "text-[#002896]" : "text-[#48484A]"} />
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </nav>

      {/* Storage widget */}
      {!collapsed && (
        <div className="mx-4 mb-4 mt-2 rounded-[8px] p-3 flex flex-col gap-5">
          {/* Plan info */}
          <div className="flex flex-col gap-1">
            <p
              className="text-[14px] leading-[20px] text-[#18181A]"
              style={{ fontFamily: "'Rakuten Sans UI', sans-serif", fontWeight: 400 }}
            >
              Free personal plan
            </p>
            {/* Progress bar */}
            <div className="h-1 rounded-[7px] bg-[#E9EEF6] overflow-hidden w-full mt-1">
              <div
                className="h-full bg-[#002896] rounded-[7px]"
                style={{ width: `${Math.max(STORAGE_PERCENT, 0.5)}%` }}
              />
            </div>
            {/* Labels */}
            <div className="flex items-center justify-between mt-0.5">
              <p
                className="text-[12px] leading-[16px] text-[#636366]"
                style={{ fontFamily: "'Rakuten Sans UI', sans-serif", fontWeight: 400 }}
              >
                {STORAGE_USED_MB}MB used
              </p>
              <p
                className="text-[12px] leading-[16px] text-[#636366]"
                style={{ fontFamily: "'Rakuten Sans UI', sans-serif", fontWeight: 400 }}
              >
                {STORAGE_TOTAL_TB}TB
              </p>
            </div>
          </div>
          <button
            className="w-full h-10 rounded-[8px] border border-[#002896] hover:bg-[rgba(0,40,150,0.05)] transition-colors"
            style={{ fontFamily: "'Rakuten Sans UI', sans-serif", fontWeight: 400, fontSize: 16, lineHeight: '24px', color: '#002896' }}
          >
            Upgrade Plan
          </button>
        </div>
      )}

      {/* Collapsed toggle button */}
      {collapsed && (
        <button
          onClick={onToggle}
          className="pointer-events-none absolute left-1/2 top-[48px] z-10 flex h-7 w-7 -translate-x-1/2 items-center justify-center rounded-full border border-[#E5E5EA] bg-white opacity-0 shadow-sm transition-opacity duration-150 hover:bg-[#F2F2F7] group-hover:pointer-events-auto group-hover:opacity-100 focus:pointer-events-auto focus:opacity-100"
          aria-label="Expand sidebar"
        >
          <ChevronRightIcon size={14} className="text-[#636366]" />
        </button>
      )}
    </aside>
  );
}
