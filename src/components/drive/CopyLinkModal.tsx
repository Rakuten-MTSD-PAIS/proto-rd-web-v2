"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { CalendarIcon, Globe, Trash2, X, ChevronDown, Eye, EyeOff } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";

interface CopyLinkModalProps {
  itemName: string;
  onClose: () => void;
  isPaidUser?: boolean;
}

const SHARE_URL = "https://www.rakuten-drive.com/cloud/share/f8k2m9s7q1p";
const ACCESS_OPTIONS = ["Can Download", "Can View", "Can Edit"] as const;

export function CopyLinkModal({ itemName, onClose, isPaidUser = false }: CopyLinkModalProps) {
  const [closing, setClosing] = useState(false);
  const [accessLevel, setAccessLevel] = useState<typeof ACCESS_OPTIONS[number]>("Can Download");
  const [accessOpen, setAccessOpen] = useState(false);
  const [urlCopied, setUrlCopied] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [expirationDate, setExpirationDate] = useState<Date | undefined>(undefined);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const handleClose = () => {
    setClosing(true);
    setTimeout(onClose, 180);
  };

  const handleCopyUrl = async () => {
    await navigator.clipboard?.writeText(SHARE_URL).catch(() => {});
    setUrlCopied(true);
    setTimeout(() => setUrlCopied(false), 2000);
  };

  const modal = (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-black/[0.72] p-4 animate-in fade-in duration-200 ${closing ? "transition-opacity duration-150 opacity-0" : ""}`}
      role="presentation"
      onMouseDown={handleClose}
    >
      <div
        className={`w-full max-w-[520px] rounded-[16px] bg-white shadow-[0_16px_40px_-8px_rgba(0,0,0,0.18)] animate-in fade-in zoom-in-95 duration-200 ${closing ? "transition-[opacity,transform] duration-150 opacity-0 scale-95" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="copy-link-title"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="px-6 pt-6 pb-2">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <h2 id="copy-link-title" className="font-['Rakuten_Sans'] text-[22px] font-bold text-[#18181A]">
              Copy Link
            </h2>
            <button
              type="button"
              onClick={handleClose}
              className="flex size-8 shrink-0 items-center justify-center rounded-[6px] text-[#636366] hover:bg-[#F2F2F7]"
              aria-label="Close"
            >
              <X size={18} strokeWidth={1.75} />
            </button>
          </div>

          {/* URL row */}
          <div className="mt-5 flex items-center gap-2">
            <div className="flex h-11 min-w-0 flex-1 items-center rounded-[8px] border border-[#E5E5EA] bg-[#F8FAFC] px-3">
              <span className="truncate font-['Rakuten_Sans_UI'] text-[14px] text-[#18181A]">{SHARE_URL}</span>
            </div>
            <button
              type="button"
              onClick={handleCopyUrl}
              className={`h-11 shrink-0 rounded-[8px] px-5 font-['Rakuten_Sans_UI'] text-[14px] font-semibold text-white active:scale-[0.96] transition-[transform,background-color] duration-100 ${urlCopied ? "bg-[#2E7D32] hover:bg-[#256427]" : "bg-[#002896] hover:bg-[#001C6B]"}`}
              aria-label="Copy link"
            >
              {urlCopied ? "Copied!" : "Copy"}
            </button>
            <div className="relative shrink-0">
              <button
                type="button"
                onClick={() => setDeleteConfirmOpen((v) => !v)}
                className="group/del flex size-11 items-center justify-center rounded-[8px] border border-[#E5E5EA] text-[#636366] hover:border-[#F9D0CF] hover:bg-[#FFF5F5] hover:text-[#C10503] active:scale-[0.96] transition-[transform,colors] duration-100"
                aria-label="Remove link"
              >
                <Trash2 size={18} strokeWidth={1.75} />
                {/* Hover tooltip */}
                <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-[6px] bg-[#18181A] px-2 py-1 font-['Rakuten_Sans_UI'] text-[12px] text-white opacity-0 transition-opacity duration-150 group-hover/del:opacity-100">
                  Remove link
                </span>
              </button>
              {/* Confirm popover */}
              {deleteConfirmOpen && (
                <div className="animate-in fade-in zoom-in-95 duration-100 absolute right-0 top-[calc(100%+6px)] z-[110] w-[320px] rounded-[10px] border border-[#E1E1E6] bg-white p-4 shadow-[0_8px_24px_rgba(24,24,26,0.14)]">
                  <p className="font-['Rakuten_Sans'] text-[16px] font-semibold text-[#18181A]">Delete this link?</p>
                  <p className="mt-1 font-['Rakuten_Sans_UI'] text-[14px] text-muted-foreground">It will no longer be accessible.</p>
                  <button
                    type="button"
                    onClick={handleClose}
                    className="mt-3 h-9 w-full rounded-[8px] bg-[#C10503] font-['Rakuten_Sans_UI'] text-[13px] font-semibold text-white hover:bg-[#A00402] active:scale-[0.96] transition-[transform] duration-100"
                  >
                    Delete Link
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Access info row */}
          <div className="mt-2 flex items-center gap-2 px-0.5 py-1">
            <Globe size={16} strokeWidth={1.75} className="shrink-0 text-[#636366]" aria-hidden="true" />
            <span className="font-['Rakuten_Sans_UI'] text-[13px] text-[#636366]">Anyone with Rakuten Drive account can access this link.</span>
          </div>

          {/* Manage access */}
          <div className="mt-4 flex items-center gap-2">
            <span className="font-['Rakuten_Sans_UI'] text-[14px] text-[#18181A]">Manage Access:</span>
            <div className="relative">
              <button
                type="button"
                onClick={() => setAccessOpen((v) => !v)}
                className="flex items-center gap-1 font-['Rakuten_Sans_UI'] text-[14px] font-semibold text-[#002896] hover:underline"
                aria-haspopup="listbox"
                aria-expanded={accessOpen}
              >
                {accessLevel}
                <ChevronDown size={14} strokeWidth={2} className={`transition-transform duration-150 ${accessOpen ? "rotate-180" : ""}`} />
              </button>
              {accessOpen && (
                <div
                  className="absolute left-0 top-[calc(100%+4px)] z-[110] min-w-[140px] rounded-[8px] border border-[#E1E1E6] bg-white py-1 shadow-[0_8px_24px_rgba(24,24,26,0.14)] animate-in fade-in zoom-in-95 duration-100"
                  role="listbox"
                >
                  {ACCESS_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      role="option"
                      aria-selected={accessLevel === opt}
                      onClick={() => { setAccessLevel(opt); setAccessOpen(false); }}
                      className={`flex h-9 w-full items-center px-3 font-['Rakuten_Sans_UI'] text-[14px] hover:bg-[#F9F9FB] ${accessLevel === opt ? "font-semibold text-[#002896]" : "text-[#18181A]"}`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Link Settings — always open */}
          <p className="mt-6 font-['Rakuten_Sans'] text-[16px] font-semibold text-muted-foreground">Link Settings</p>
          <div className="mt-3 flex flex-col gap-4">
            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label className="font-['Rakuten_Sans'] text-[14px] font-semibold text-[#18181A]">
                Set Password
              </label>
              <div className="flex h-10 items-center gap-2 rounded-[8px] border border-[#E5E5EA] bg-white px-3 focus-within:border-[#002896]">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Leave blank for no password"
                  className="flex-1 bg-transparent font-['Rakuten_Sans_UI'] text-[14px] text-[#18181A] outline-none placeholder:text-[#AEAEB2]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="shrink-0 text-[#636366] hover:text-[#18181A]"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={15} strokeWidth={1.75} /> : <Eye size={15} strokeWidth={1.75} />}
                </button>
              </div>
            </div>

            {/* Expiration */}
            <div className="relative flex flex-col gap-1.5">
              <label className="font-['Rakuten_Sans'] text-[14px] font-semibold text-[#18181A]">
                Expiration Date
              </label>
              {isPaidUser ? (
                <>
                  <button
                    type="button"
                    onClick={() => setCalendarOpen((v) => !v)}
                    className={`flex h-10 w-full items-center justify-between rounded-[8px] border px-3 text-left transition-colors duration-100 ${calendarOpen ? "border-[#002896]" : "border-[#E5E5EA]"} bg-white`}
                  >
                    <span className={`font-['Rakuten_Sans_UI'] text-[14px] ${expirationDate ? "text-[#18181A]" : "text-[#AEAEB2]"}`}>
                      {expirationDate
                        ? expirationDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                        : "Select expiration date"}
                    </span>
                    <CalendarIcon size={16} strokeWidth={1.75} className="shrink-0 text-[#636366]" />
                  </button>
                  {calendarOpen && (
                    <div className="animate-in fade-in zoom-in-95 duration-150 absolute left-0 bottom-[calc(100%+4px)] z-[120] w-[260px] rounded-[12px] border border-[#E1E1E6] bg-white p-3 shadow-[0_8px_24px_rgba(24,24,26,0.14)]">
                      <Calendar
                        selected={expirationDate}
                        onSelect={(d) => { setExpirationDate(d); setCalendarOpen(false); }}
                      />
                    </div>
                  )}
                  {expirationDate && (
                    <button
                      type="button"
                      onClick={() => setExpirationDate(undefined)}
                      className="mt-1 self-start font-['Rakuten_Sans_UI'] text-[13px] text-muted-foreground hover:text-[#C10503] transition-colors duration-100"
                    >
                      Remove expiration date
                    </button>
                  )}
                </>
              ) : (
                <div className="flex h-10 w-full items-center justify-between rounded-[8px] border border-[#E5E5EA] bg-[#F8FAFC] px-3 cursor-not-allowed">
                  <span className="font-['Rakuten_Sans_UI'] text-[14px] text-[#636366]">Expires after 48 hours</span>
                  <span className="shrink-0 rounded-full bg-[#FF9500]/10 px-2 py-0.5 font-['Rakuten_Sans_UI'] text-[11px] font-semibold text-[#FF9500]">Free plan</span>
                </div>
              )}
              {!isPaidUser && (
                <div className="flex items-center justify-between rounded-[8px] bg-[#EFF6FF] px-3 py-2.5 border border-[#BFDBFE]">
                  <p className="font-['Rakuten_Sans_UI'] text-[14px] text-[#1E40AF]">Set custom expiration dates with Pro.</p>
                  <button
                    type="button"
                    className="ml-3 shrink-0 rounded-[6px] bg-[#002896] px-3 py-1 font-['Rakuten_Sans_UI'] text-[12px] font-semibold text-white hover:bg-[#001C6B] active:scale-[0.96] transition-[transform] duration-100"
                  >
                    Upgrade to Pro
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 flex items-center justify-end border-t border-[#E5E5EA] px-6 py-4">
          <button
            type="button"
            onClick={handleClose}
            className="h-10 rounded-[8px] bg-[#002896] px-8 font-['Rakuten_Sans_UI'] text-[14px] font-semibold text-white hover:bg-[#001C6B] active:scale-[0.96] transition-[transform] duration-100"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
