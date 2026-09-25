"use client";

import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowLeft, CalendarIcon, Eye, EyeOff, Globe, Lock, Settings, Trash2, X } from "lucide-react";
import { cn } from "cn";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { FormField, FormTextarea } from "@/components/ui/form-field";
import { AccessMenu } from "@/components/ui/access-menu";
import { Button } from "@/components/ui/button";

interface CopyLinkModalProps {
  itemName: string;
  onClose: () => void;
}

const SHARE_URL = "https://www.rakuten-drive.com/cloud/share/f8k2m9s7q1p";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const isValidEmail = (email: string) => EMAIL_PATTERN.test(email);

const AUDIENCE_OPTIONS = [
  { value: "invited", label: "Only Invited People", description: "Only invited people can access this link.", icon: Lock },
  { value: "anyone", label: "Anyone with Link", description: "Publicly accessible and no sign-in required.", icon: Globe },
] as const;
type Audience = typeof AUDIENCE_OPTIONS[number]["value"];

const PERMISSION_OPTIONS = [
  { value: "Can Edit", label: "Can Edit", description: "Can download, comment and edit" },
  { value: "Can Download", label: "Can Download", description: "Can download" },
  { value: "Can View", label: "Can View", description: "Can view" },
] as const;
type Permission = typeof PERMISSION_OPTIONS[number]["value"];

export function CopyLinkModal({ itemName, onClose }: CopyLinkModalProps) {
  const [closing, setClosing] = useState(false);
  const [view, setView] = useState<"main" | "settings">("main");
  const [audience, setAudience] = useState<Audience>("invited");
  const [permission, setPermission] = useState<Permission>("Can Download");
  const [urlCopied, setUrlCopied] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [inviteEmails, setInviteEmails] = useState<string[]>([]);
  const [inviteInput, setInviteInput] = useState("");
  const [inviteMessage, setInviteMessage] = useState("");
  const inviteInputRef = useRef<HTMLInputElement>(null);

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [expirationDate, setExpirationDate] = useState<Date | undefined>(undefined);
  const [calendarOpen, setCalendarOpen] = useState(false);

  const addInviteEmail = (raw: string) => {
    const email = raw.trim().replace(/,$/, "");
    if (email && inviteEmails.length < 20 && !inviteEmails.includes(email)) setInviteEmails((prev) => [...prev, email]);
    setInviteInput("");
  };

  const commitInviteInput = () => {
    if (inviteInput.trim()) addInviteEmail(inviteInput);
  };

  const removeInviteEmail = (email: string) => {
    setInviteEmails((prev) => prev.filter((e) => e !== email));
  };

  const editInviteEmail = (email: string) => {
    setInviteEmails((prev) => prev.filter((e) => e !== email));
    setInviteInput(email);
    inviteInputRef.current?.focus();
  };

  const handleClose = () => {
    setClosing(true);
    setTimeout(onClose, 180);
  };

  const handleCopyUrl = async () => {
    await navigator.clipboard?.writeText(SHARE_URL).catch(() => {});
    setUrlCopied(true);
    setTimeout(() => setUrlCopied(false), 2000);
  };

  const isInvitedOnly = audience === "invited";

  const modal = (
    <div
      className={`fixed inset-0 z-[55] flex items-center justify-center bg-black/[0.72] p-4 animate-in fade-in duration-200 ${closing ? "transition-opacity duration-150 opacity-0" : ""}`}
      role="presentation"
      onMouseDown={handleClose}
    >
      <div
        className={`w-full max-w-[520px] rounded-[16px] bg-white p-6 shadow-[0_16px_40px_-8px_rgba(0,0,0,0.18)] animate-in fade-in zoom-in-95 duration-200 ${closing ? "transition-[opacity,transform] duration-150 opacity-0 scale-95" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="copy-link-title"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {view === "settings" ? (
          <>
            {/* Header */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setView("main")}
                aria-label="Back"
                className="flex size-8 shrink-0 items-center justify-center rounded-[6px] text-[#636366] hover:bg-[#F2F2F7]"
              >
                <ArrowLeft size={18} strokeWidth={1.75} />
              </button>
              <h2 className="font-['Rakuten_Sans'] text-[20px] font-bold text-[#18181A]">
                Link Settings
              </h2>
            </div>

            {/* Set Password */}
            <div className="mt-6 flex flex-col gap-2">
              <span className="font-['Rakuten_Sans_UI'] text-[14px] text-[#18181A]">Set Password</span>
              <FormField
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Add password"
                leftIcon={<Lock size={16} strokeWidth={1.75} />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="pointer-events-auto text-[#8E8E93] hover:text-[#18181A]"
                  >
                    {showPassword ? <EyeOff size={16} strokeWidth={1.75} /> : <Eye size={16} strokeWidth={1.75} />}
                  </button>
                }
                className={showPassword ? "" : "tracking-widest"}
              />
            </div>

            {/* Expiration Date */}
            <div className="mt-5 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="font-['Rakuten_Sans_UI'] text-[14px] text-[#18181A]">Expiration Date</span>
                {expirationDate && (
                  <>
                    <span aria-hidden="true" className="text-[14px] text-[#E5E5EA]">|</span>
                    <button
                      type="button"
                      onClick={() => setExpirationDate(undefined)}
                      className="font-['Rakuten_Sans_UI'] text-[14px] font-medium text-[#002896] hover:underline"
                    >
                      Clear
                    </button>
                  </>
                )}
              </div>
              <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                <PopoverTrigger
                  className="flex h-11 w-fit items-center gap-2 rounded-[8px] border border-input bg-transparent px-3 text-left font-['Rakuten_Sans_UI'] text-[14px] outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <CalendarIcon size={16} strokeWidth={1.75} className="shrink-0 text-[#8E8E93]" />
                  <span className={expirationDate ? "text-[#18181A]" : "text-muted-foreground"}>
                    {expirationDate
                      ? `${expirationDate.getFullYear()}/${String(expirationDate.getMonth() + 1).padStart(2, "0")}/${String(expirationDate.getDate()).padStart(2, "0")}`
                      : "YYYY/MM/DD"}
                  </span>
                </PopoverTrigger>
                <PopoverContent side="right" align="center" sideOffset={8} className="w-[280px] rounded-[12px] p-3">
                  <Calendar
                    selected={expirationDate}
                    onSelect={(d) => { setExpirationDate(d); setCalendarOpen(false); }}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Footer */}
            <div className="mt-6 -mx-6 border-t border-[#E5E5EA]" />
            <div className="flex items-center justify-end gap-3 pt-4">
              <Button type="button" variant="outline" size="lg" onClick={() => setView("main")} className="font-['Rakuten_Sans_UI']">
                Cancel
              </Button>
              <Button type="button" variant="primary" size="lg" onClick={() => setView("main")} className="font-['Rakuten_Sans_UI']">
                Save Settings
              </Button>
            </div>
          </>
        ) : (
          <>
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <h2 id="copy-link-title" className="font-['Rakuten_Sans'] text-[22px] font-bold text-[#18181A]">
            Link Copied!
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
          <div className="flex h-11 min-w-0 flex-1 items-center rounded-[8px] border border-[#E5E5EA] bg-white px-3">
            <span className="truncate rounded-[3px] bg-[#D9E2FC] font-['Rakuten_Sans_UI'] text-[14px] text-[#18181A]">{SHARE_URL}</span>
          </div>
          <button
            type="button"
            onClick={handleCopyUrl}
            className={`h-11 shrink-0 rounded-[8px] px-5 font-['Rakuten_Sans_UI'] text-[14px] font-semibold text-white active:scale-[0.96] transition-[transform,background-color] duration-100 ${urlCopied ? "bg-[#2E7D32] hover:bg-[#256427]" : "bg-[#002896] hover:bg-[#001C6B]"}`}
            aria-label="Copy link"
          >
            {urlCopied ? "Copied!" : "Copy"}
          </button>
          <Popover open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
            <PopoverTrigger
              className="group/del relative flex size-11 shrink-0 items-center justify-center rounded-[8px] border border-[#E5E5EA] text-[#636366] hover:border-[#F9D0CF] hover:bg-[#FFF5F5] hover:text-[#C10503] active:scale-[0.96] transition-[transform,colors] duration-100"
              aria-label="Remove link"
            >
              <Trash2 size={18} strokeWidth={1.75} />
              <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-[6px] bg-[#18181A] px-2 py-1 font-['Rakuten_Sans_UI'] text-[12px] text-white opacity-0 transition-opacity duration-150 group-hover/del:opacity-100">
                Remove link
              </span>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-[320px] rounded-[10px] p-4">
              <p className="font-['Rakuten_Sans'] text-[16px] font-semibold text-[#18181A]">Delete this link?</p>
              <p className="mt-1 font-['Rakuten_Sans_UI'] text-[14px] text-muted-foreground">It will no longer be accessible.</p>
              <button
                type="button"
                onClick={handleClose}
                className="mt-3 h-9 w-full rounded-[8px] bg-[#C10503] font-['Rakuten_Sans_UI'] text-[13px] font-semibold text-white hover:bg-[#A00402] active:scale-[0.96] transition-[transform] duration-100"
              >
                Delete Link
              </button>
            </PopoverContent>
          </Popover>
        </div>

        {/* Manage access */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="font-['Rakuten_Sans_UI'] text-[14px] text-[#18181A]">Manage Access:</span>

          <AccessMenu value={audience} options={AUDIENCE_OPTIONS} onChange={setAudience} />
          <AccessMenu value={permission} options={PERMISSION_OPTIONS} onChange={setPermission} contentClassName="min-w-[260px]" />
        </div>

        {/* Access info row */}
        <div className="mt-2 flex items-center gap-2 px-0.5 py-1">
          {isInvitedOnly ? (
            <Lock size={16} strokeWidth={1.75} className="shrink-0 text-[#636366]" aria-hidden="true" />
          ) : (
            <Globe size={16} strokeWidth={1.75} className="shrink-0 text-[#636366]" aria-hidden="true" />
          )}
          <span className="font-['Rakuten_Sans_UI'] text-[13px] text-[#636366]">
            {isInvitedOnly ? "Only invited people can access this link." : "Anyone with Rakuten Drive account can access this link."}
          </span>
        </div>

        {/* Invite people — only when audience is restricted */}
        {isInvitedOnly && (
          <>
          <div className="mt-4 -mx-6 border-t border-[#E5E5EA]" />
          <div className="flex flex-col gap-3 pt-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="invite-email" className="font-['Rakuten_Sans'] text-[16px] font-semibold text-[#18181A]">
                Invite People
              </label>
              <div className="flex min-h-11 w-full flex-wrap items-center gap-2 rounded-[8px] border border-[#E5E5EA] bg-white p-2 focus-within:border-[#002896]">
                {inviteEmails.map((email) => {
                  const valid = isValidEmail(email);
                  return (
                    <span
                      key={email}
                      className={cn(
                        "flex items-center gap-1.5 rounded-full px-3 py-1.5 font-['Rakuten_Sans_UI'] text-[14px]",
                        valid ? "bg-[#F2F2F7] text-[#18181A]" : "bg-[#FEECEC] text-[#C10503]"
                      )}
                    >
                      {valid ? (
                        <span>{email}</span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => editInviteEmail(email)}
                          aria-label={`Edit ${email}`}
                          className="underline-offset-2 hover:underline"
                        >
                          {email}
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => removeInviteEmail(email)}
                        aria-label={`Remove ${email}`}
                        className={valid ? "text-[#8E8E93] hover:text-[#18181A]" : "text-[#C10503]/70 hover:text-[#C10503]"}
                      >
                        <X size={14} strokeWidth={2} />
                      </button>
                    </span>
                  );
                })}
                <input
                  id="invite-email"
                  ref={inviteInputRef}
                  type="email"
                  value={inviteInput}
                  onChange={(e) => setInviteInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === "Tab" || e.key === " " || e.key === ",") {
                      if (inviteInput.trim()) {
                        if (e.key !== "Tab") e.preventDefault();
                        addInviteEmail(inviteInput);
                      } else if (e.key !== "Tab") {
                        e.preventDefault();
                      }
                    } else if (e.key === "Backspace" && !inviteInput && inviteEmails.length > 0) {
                      removeInviteEmail(inviteEmails[inviteEmails.length - 1]);
                    }
                  }}
                  onBlur={commitInviteInput}
                  placeholder={inviteEmails.length === 0 ? "Add email address" : ""}
                  className="min-w-[140px] flex-1 bg-transparent px-1 font-['Rakuten_Sans_UI'] text-[14px] text-[#18181A] outline-none placeholder:text-[#8E8E93]"
                />
              </div>
            </div>

            <p className="font-['Rakuten_Sans_UI'] text-[13px] text-[#8E8E93]">Max 20 recipients allowed</p>

            <FormTextarea
              id="invite-message"
              label="Message (Optional)"
              value={inviteMessage}
              onChange={(e) => setInviteMessage(e.target.value)}
              placeholder="Add a message"
              rows={4}
            />
          </div>
          </>
        )}

        {/* Footer — always present so the modal's height/anchor doesn't jump between audience modes */}
        <div className="mt-4 -mx-6 border-t border-[#E5E5EA]" />
        <div className="flex items-center justify-between gap-4 pt-4">
          <Button type="button" variant="primary-ghost" size="lg" onClick={() => setView("settings")} className="font-['Rakuten_Sans_UI']">
            <Settings size={18} strokeWidth={1.75} />
            Link Settings
          </Button>
          {isInvitedOnly && (
            <div className="flex items-center gap-3">
              <Button type="button" variant="outline" size="lg" onClick={handleClose} className="font-['Rakuten_Sans_UI']">
                Cancel
              </Button>
              <Button
                type="button"
                variant="primary"
                size="lg"
                disabled={inviteEmails.length === 0 || inviteEmails.some((e) => !isValidEmail(e))}
                onClick={handleClose}
                className="font-['Rakuten_Sans_UI']"
              >
                Send
              </Button>
            </div>
          )}
        </div>
          </>
        )}
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
