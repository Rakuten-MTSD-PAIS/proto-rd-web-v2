"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import horizontalLogo from "../../../reference ui/Rakuten Drive logo_1line.png";
import compactLogo from "../../../reference ui/2 RECENT/SIDEBAR/RD logo small.png";
import { STORAGE_USED_MB, STORAGE_TOTAL_TB, STORAGE_PERCENT } from "@/lib/mock-data";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
  onSendFiles: () => void;
}

const mainNav = [
  { href: "/drive/recent", label: "Recent", icon: "/navigation-icons/recent.svg" },
  { href: "/drive/my-drive", label: "My Drive", icon: "/navigation-icons/my-drive.svg" },
  { href: "/drive/team-drive", label: "Team Drive", icon: "/navigation-icons/team-drive.svg" },
  { href: "/drive/shared", label: "Shared with Me", icon: "/navigation-icons/shared-with-me.svg" },
  { href: "/drive/starred", label: "Starred", icon: "/navigation-icons/starred.svg" },
  { href: "/drive/trash", label: "Trash", icon: "/navigation-icons/trash.svg" },
];

const transferSubNav = [
  { href: "/drive/send-files", label: "Send Files", icon: "/navigation-icons/send-files.svg" },
  { href: "/drive/my-link", label: "My Links", icon: "/navigation-icons/my-link.svg" },
  { href: "/drive/received", label: "Received Links", icon: "/navigation-icons/received-link.svg" },
];

function NavigationIcon({ src, active, size = 16 }: { src: string; active: boolean; size?: number }) {
  return (
    <span
      aria-hidden="true"
      className="shrink-0"
      style={{
        width: size,
        height: size,
        backgroundColor: active ? "#002896" : "var(--foreground)",
        opacity: 1,
        mask: `url(${src}) center / 100% 100% no-repeat`,
        WebkitMask: `url(${src}) center / 100% 100% no-repeat`,
      }}
    />
  );
}

export function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose, onSendFiles }: SidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isMdLg, setIsMdLg] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px) and (max-width: 1023px)");
    setIsMdLg(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMdLg(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const iconOnly = collapsed || (isMdLg && !mobileOpen);
  const isSearching = searchParams.get("search") != null && searchParams.get("search") !== "";
  const isActive = (href: string) => !isSearching && pathname.startsWith(href);

  return (
    <aside
      className={`group relative flex h-full shrink-0 flex-col overflow-hidden bg-[#F2F2F7] transition-[width,transform] duration-200 ease-out
        max-md:fixed max-md:inset-y-0 max-md:left-0 max-md:z-50 max-md:!w-[280px] max-md:min-w-0 max-md:shadow-2xl ${mobileOpen ? "max-md:translate-x-0" : "max-md:-translate-x-full"}
        ${mobileOpen ? "md:max-lg:fixed md:max-lg:inset-y-0 md:max-lg:left-0 md:max-lg:z-50 md:max-lg:!w-[280px] md:max-lg:shadow-2xl" : "md:max-lg:relative md:max-lg:!w-20 md:max-lg:min-w-[80px]"}`}
      style={{ width: iconOnly ? 80 : 260 }}
    >
      {/* Logo row */}
      <div
        className={`flex px-4 shrink-0 ${
          iconOnly ? "flex-col items-center gap-2 pt-3 pb-1" : "h-[63px] items-center justify-between"
        }`}
      >
        {iconOnly ? (
          <>
            <Image src={compactLogo} alt="Rakuten Drive" priority className="h-[33px] w-[31px] object-contain" />
            {!isMdLg && (
              <button
                onClick={onToggle}
                className="w-8 h-8 flex items-center justify-center rounded-[6px] hover:bg-[rgba(0,40,150,0.08)] transition-colors"
                aria-label="Expand sidebar"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-foreground">
                  <rect x="1" y="2" width="5" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
                  <path d="M9 4h5M9 8h5M9 12h5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
              </button>
            )}
          </>
        ) : (
          <>
            <Image src={horizontalLogo} alt="Rakuten Drive" priority className="h-[23px] w-[130px] object-contain" />
            {/* Sidebar brand icon — layout toggle */}
            <button
              onClick={onToggle}
              className="w-8 h-8 flex items-center justify-center rounded-[6px] hover:bg-[rgba(0,40,150,0.08)] transition-colors"
              title="Collapse sidebar"
              aria-label="Collapse sidebar"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-foreground">
                <rect x="1" y="2" width="5" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
                <path d="M9 4h5M9 8h5M9 12h5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Main Nav */}
      <nav className={`flex flex-1 flex-col gap-0 overflow-y-auto px-4 pb-4 ${iconOnly ? "pt-2" : "pt-4"}`} style={{ fontFamily: "'Rakuten Sans', sans-serif" }}>
        {/* Primary nav items */}
        <div className="flex flex-col gap-2">
          {mainNav.map(({ href, label, icon }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 h-10 rounded-[8px] text-[16px] leading-[24px] transition-colors ${
                  iconOnly ? "justify-center px-0" : "px-[16px]"
                } ${
                  active
                    ? "bg-[rgba(0,40,150,0.1)] text-[#002896] font-semibold"
                    : "text-[#030303] font-normal hover:bg-[rgba(0,40,150,0.06)]"
                }`}
                title={label}
                onClick={onMobileClose}
              >
                <NavigationIcon src={icon} active={active} />
                {!iconOnly && <span className="truncate">{label}</span>}
              </Link>
            );
          })}
        </div>

        {/* Transfer section */}
        <section className="border-t border-border-subtle pt-5" aria-labelledby="transfer-heading">
          {!iconOnly ? (
            <>
              <h2 id="transfer-heading" className="px-4 font-['Rakuten_Sans_UI'] text-[0.875rem] font-normal leading-6 text-[#636366]">Transfer</h2>
              <div className="mt-3 flex flex-col gap-2">
                {transferSubNav.map(({ href, label, icon }) => {
                  const active = isActive(href);
                  if (label === "Send Files") {
                    return (
                      <button
                        key={href}
                        type="button"
                        className="flex h-10 items-center gap-3 rounded-[8px] px-4 text-[16px] leading-[24px] font-normal text-[#030303] transition-colors hover:bg-[rgba(0,40,150,0.06)]"
                        onClick={() => { onSendFiles(); onMobileClose(); }}
                        title={label}
                      >
                        <NavigationIcon src={icon} active={false} />
                        <span className="truncate">{label}</span>
                      </button>
                    );
                  }
                  return (
                    <Link
                      key={href}
                      href={href}
                      className={`flex h-10 items-center gap-3 rounded-[8px] px-4 text-[16px] leading-[24px] transition-colors ${
                        active
                          ? "bg-[rgba(0,40,150,0.1)] text-[#002896] font-semibold"
                          : "text-[#030303] font-normal hover:bg-[rgba(0,40,150,0.06)]"
                      }`}
                      onClick={onMobileClose}
                      title={label}
                    >
                      <NavigationIcon src={icon} active={active} />
                      <span className="truncate">{label}</span>
                    </Link>
                  );
                })}
              </div>
            </>
          ) : (
            /* Collapsed: just icons */
            <div className="flex flex-col gap-2">
              {transferSubNav.map(({ href, label, icon }) => {
                const active = isActive(href);
                if (label === "Send Files") {
                  return (
                    <button key={href} type="button" className="flex h-10 items-center justify-center rounded-[8px] text-[#18181A] transition-colors hover:bg-[rgba(0,40,150,0.06)]" title={label} onClick={() => { onSendFiles(); onMobileClose(); }}>
                      <NavigationIcon src={icon} active={false} />
                    </button>
                  );
                }
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
                    <NavigationIcon src={icon} active={active} />
                  </Link>
                );
              })}
            </div>
          )}
        </section>

      </nav>

      {/* Storage widget */}
      {!iconOnly && (
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
                className="text-[12px] leading-[16px] text-muted-foreground"
                style={{ fontFamily: "'Rakuten Sans UI', sans-serif", fontWeight: 400 }}
              >
                {STORAGE_USED_MB}MB used
              </p>
              <p
                className="text-[12px] leading-[16px] text-muted-foreground"
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

    </aside>
  );
}
