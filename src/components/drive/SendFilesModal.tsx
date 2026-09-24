"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import { CalendarIcon, X, Eye, EyeOff } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import type { DriveItem, FileType } from "@/lib/types";
import { FileIcon } from "@/components/drive/FileIcon";

type Tab = "files" | "email" | "settings";
type View = "main" | "link-created" | "email-sent";

/** A real browser File or a virtual DriveItem entry pre-loaded from the drive. */
type FileEntry =
  | { kind: "real"; file: File; previewUrl?: string }
  | { kind: "drive"; name: string; ext: string; sizeLabel: string; itemType: FileType; thumbnail?: string };

interface SendFilesModalProps {
  onClose: () => void;
  preloadedItems?: DriveItem[];
}

type OpenFn = (items?: DriveItem | DriveItem[]) => void;

const SendFilesDialogContext = createContext<OpenFn | null>(null);

export function SendFilesDialogProvider({ onOpen, children }: { onOpen: OpenFn; children: ReactNode }) {
  return <SendFilesDialogContext.Provider value={onOpen}>{children}</SendFilesDialogContext.Provider>;
}

export function useSendFilesDialog(): OpenFn {
  const open = useContext(SendFilesDialogContext);
  if (!open) throw new Error("useSendFilesDialog must be used within SendFilesDialogProvider");
  return open;
}

function entryName(e: FileEntry) { return e.kind === "real" ? e.file.name : e.name; }
function entryExt(e: FileEntry) { return e.kind === "real" ? fileExtension(e.file.name) : e.ext; }
function entrySizeLabel(e: FileEntry) { return e.kind === "real" ? fileSize(e.file.size) : e.sizeLabel; }
function entryThumbnail(e: FileEntry) { return e.kind === "drive" ? e.thumbnail : e.previewUrl; }
function extToFileType(ext: string): FileType {
  if (ext === "pdf") return "pdf";
  if (["jpg", "jpeg", "png", "gif", "webp", "heic", "avif"].includes(ext)) return "image";
  if (["zip", "rar", "7z", "tar", "gz"].includes(ext)) return "zip";
  if (["mp3", "wav", "aac", "flac", "ogg"].includes(ext)) return "audio";
  if (["docx", "doc"].includes(ext)) return "word";
  if (["xlsx", "xls", "csv"].includes(ext)) return "excel";
  if (["pptx", "ppt"].includes(ext)) return "ppt";
  if (["svg", "ai", "eps"].includes(ext)) return "vector";
  if (["mp4", "mov", "avi", "mkv", "webm"].includes(ext)) return "video";
  return "other";
}
function entryFileType(e: FileEntry): FileType {
  if (e.kind === "drive") return e.itemType;
  return extToFileType(fileExtension(e.file.name));
}
function totalSizeLabel(entries: FileEntry[]) {
  const realBytes = entries.filter(e => e.kind === "real").reduce((s, e) => s + (e as { kind: "real"; file: File }).file.size, 0);
  const hasVirtual = entries.some(e => e.kind === "drive");
  if (!realBytes && hasVirtual) return entries.map(entrySizeLabel).join(" + ");
  return fileSize(realBytes);
}


function fileExtension(name: string) {
  return name.split(".").pop()?.toLowerCase() || "file";
}

function fileSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}


export function SendFilesModal({ onClose, preloadedItems }: SendFilesModalProps) {
  const uploadInputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<FileEntry[]>(() => {
    if (!preloadedItems?.length) return [];
    return preloadedItems.map(item => ({
      kind: "drive" as const,
      name: item.name,
      ext: item.name.split(".").pop()?.toLowerCase() ?? item.type,
      sizeLabel: item.size,
      itemType: item.type,
      thumbnail: item.thumbnail,
    }));
  });
  const [tab, setTab] = useState<Tab>("files");
  const [view, setView] = useState<View>("main");
  const [recipients, setRecipients] = useState<string[]>([]);
  const [recipientInput, setRecipientInput] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [emailSending, setEmailSending] = useState(false);
  const [copied, setCopied] = useState(false);
  const [linkCreating, setLinkCreating] = useState(false);
  const [overlayExiting, setOverlayExiting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [expirationDate, setExpirationDate] = useState<Date | undefined>(undefined);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [uploadToMyDrive, setUploadToMyDrive] = useState(true);
  const [allowComment, setAllowComment] = useState(false);
  const [closing, setClosing] = useState(false);

  const handleClose = () => {
    requestAnimationFrame(() => setClosing(true));
    setTimeout(onClose, 200);
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!linkCreating) return;
    const timer = window.setTimeout(() => {
      // Fade the overlay out first, then reveal success screen
      setOverlayExiting(true);
      setTimeout(() => {
        setLinkCreating(false);
        setOverlayExiting(false);
        setView("link-created");
      }, 250);
    }, 8000);
    return () => window.clearTimeout(timer);
  }, [linkCreating]);

  useEffect(() => {
    if (!emailSending) return;
    const timer = window.setTimeout(() => {
      setEmailSending(false);
      setView("email-sent");
    }, 2000);
    return () => window.clearTimeout(timer);
  }, [emailSending]);

  const addFiles = (newFiles: FileList | null) => {
    if (!newFiles) return;
    const entries: FileEntry[] = Array.from(newFiles).map(f => ({
      kind: "real" as const,
      file: f,
      previewUrl: f.type.startsWith("image/") ? URL.createObjectURL(f) : undefined,
    }));
    setFiles((current) => [...current, ...entries]);
    setTab("files");
  };

  useEffect(() => {
    return () => {
      files.forEach(e => { if (e.kind === "real" && e.previewUrl) URL.revokeObjectURL(e.previewUrl); });
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePickerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    addFiles(event.target.files);
    event.currentTarget.value = "";
  };

  const handleFileDrop = (event: React.DragEvent<HTMLElement>) => {
    event.preventDefault();
    setIsDragging(false);
    addFiles(event.dataTransfer.files);
  };

  const addRecipients = (value = recipientInput) => {
    const nextRecipients = value.split(/[,;\n]/).map((email) => email.trim()).filter(Boolean);
    if (!nextRecipients.length) return;
    setRecipients((current) => [...current, ...nextRecipients.filter((email) => !current.includes(email))].slice(0, 20));
    setRecipientInput("");
  };

  const shareUrl = "https://drive.rakuten.com/share/a8f3k2m9s7q";
  const showOverlay = linkCreating || overlayExiting;
  const isSuccess = view === "link-created" || view === "email-sent";

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-black/[0.72] p-0 sm:p-8 animate-in fade-in duration-200 ${closing ? "transition-opacity duration-150 opacity-0" : ""}`}
      role="presentation"
      onMouseDown={handleClose}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="send-files-dialog-title"
        className={`relative overflow-hidden bg-white shadow-[0_16px_40px_-8px_rgba(0,0,0,0.15)] transition-[border-radius,max-width] duration-300
          ${isSuccess ? "w-full max-w-[560px] rounded-[16px]" : "flex h-dvh w-full max-w-[600px] flex-col rounded-none sm:h-auto sm:max-h-[calc(100dvh-4rem)] sm:rounded-[16px]"}
          ${closing ? "transition-[opacity,transform] duration-150 opacity-0 scale-95" : "animate-in fade-in zoom-in-95 duration-200"}`}
        onMouseDown={(event) => event.stopPropagation()}
      >

        {/* ── Success: link created ── */}
        {view === "link-created" && (() => {
          const copyLink = async () => {
            await navigator.clipboard?.writeText(shareUrl);
            setCopied(true);
          };
          return (
            <div className="animate-in fade-in zoom-in-95 duration-200">
              <div className="flex flex-col gap-3 px-4 py-6 sm:px-6">
                <div className="flex flex-col items-center gap-4 text-center">
                  <div className="flex size-16 items-center justify-center rounded-full bg-[#E8F5E9]"><Image src="/figma/send-files/success-check.svg" alt="" width={32} height={32} /></div>
                  <div className="flex flex-col gap-2">
                    <h2 id="send-files-dialog-title" className="font-['Rakuten_Sans'] text-[22px] font-semibold leading-7 text-[#18181A]">Link Created Successfully!</h2>
                    <p className="font-['Rakuten_Sans_UI'] text-[14px] leading-[18px] text-[#636366]">Your files are ready to share</p>
                  </div>
                </div>
                <div className="flex flex-col gap-[6px]">
                  <div className="flex h-[46px] items-center gap-3 rounded-[8px] border border-[#E5E5EA] bg-[#F8FAFC] py-[6px] pl-3 pr-[6px]">
                    <Image src="/figma/send-files/success-link.svg" alt="" width={18} height={18} />
                    <span className="min-w-0 flex-1 truncate font-['Rakuten_Sans_UI'] text-[14px] leading-5 text-[#18181A]">{shareUrl}</span>
                    <button type="button" onClick={copyLink} className="h-[34px] shrink-0 rounded-[6px] bg-[#002896] px-4 font-['Rakuten_Sans_UI'] text-[14px] font-semibold text-[#F9F9FB] hover:bg-[#001C6B] active:scale-[0.96] transition-[transform] duration-100">Copy Link</button>
                  </div>
                  <div className="flex h-[15px] justify-end pr-2">
                    <span className={`flex items-center gap-1 font-['Rakuten_Sans_UI'] text-[14px] font-semibold text-[#2E7D32] transition-opacity duration-150 ${copied ? "opacity-100" : "opacity-0"}`}>
                      <Image src="/figma/send-files/copied-check.svg" alt="" width={14} height={14} />Copied!
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-[6px]">
                  <p className="px-2 font-['Rakuten_Sans_UI'] text-[14px] leading-[18px] text-[#636366]">Total {files.length} file{files.length === 1 ? "" : "s"} · {totalSizeLabel(files)}</p>
                  <div className="border-t border-[#E5E5EA]" />
                </div>
                <div className="flex flex-col gap-[6px] px-2 py-3 font-['Rakuten_Sans_UI'] text-[14px] leading-5 text-[#636366]">
                  <div className="flex items-center gap-2"><Image src="/figma/send-files/lock.svg" alt="" width={16} height={16} />Password protected</div>
                  <div className="flex items-center gap-2"><Image src="/figma/send-files/calendar.svg" alt="" width={16} height={16} />Expires: 10/24/2026</div>
                  <div className="flex items-center gap-2"><Image src="/figma/send-files/success-world.svg" alt="" width={24} height={24} />Anyone with the link can access the link</div>
                </div>
              </div>
              <footer className="flex items-center justify-between border-t border-[#E5E5EA] px-4 py-3 sm:px-6">
                <button type="button" onClick={() => { setFiles([]); setCopied(false); setView("main"); setTab("files"); }} className="h-10 rounded-[8px] border border-[#E5E5EA] px-4 font-['Rakuten_Sans_UI'] text-[14px] font-semibold text-[#636366] hover:bg-[#F9F9FB] active:scale-[0.96] transition-[transform] duration-100">Send Another</button>
                <button type="button" onClick={handleClose} className="h-10 rounded-[8px] bg-[#002896] px-6 font-['Rakuten_Sans_UI'] text-[14px] font-semibold text-[#F9F9FB] hover:bg-[#001C6B] active:scale-[0.96] transition-[transform] duration-100">Done</button>
              </footer>
            </div>
          );
        })()}

        {/* ── Success: email sent ── */}
        {view === "email-sent" && (
          <div className="animate-in fade-in zoom-in-95 duration-200">
            <div className="flex flex-col gap-4 px-4 py-6 sm:px-6">
              <div className="flex flex-col items-center gap-3 text-center">
                <div className="flex size-16 items-center justify-center rounded-full bg-[#E8F5E9]">
                  <Image src="/figma/send-files/success-check.svg" alt="" width={32} height={32} />
                </div>
                <div>
                  <h2 id="send-files-dialog-title" className="font-['Rakuten_Sans'] text-[22px] font-semibold leading-7 text-[#18181A]">Email Sent Successfully!</h2>
                  <p className="mt-1 font-['Rakuten_Sans_UI'] text-[14px] leading-[18px] text-[#636366]">Your files have been sent to the recipients</p>
                </div>
              </div>
              <div className="rounded-[8px] border border-[#E5E5EA] overflow-hidden font-['Rakuten_Sans_UI'] text-[14px] leading-5">
                <div className="flex gap-3 px-4 py-3">
                  <span className="w-14 shrink-0 font-semibold text-[#636366]">To</span>
                  <span className="text-[#18181A] break-all">{recipients.join(", ")}</span>
                </div>
                {emailSubject && (
                  <>
                    <div className="border-t border-[#E5E5EA]" />
                    <div className="flex gap-3 px-4 py-3">
                      <span className="w-14 shrink-0 font-semibold text-[#636366]">Subject</span>
                      <span className="text-[#18181A]">{emailSubject}</span>
                    </div>
                  </>
                )}
              </div>
              <div className="flex flex-col gap-[6px]">
                <p className="px-1 font-['Rakuten_Sans_UI'] text-[14px] leading-[18px] text-[#636366]">Total {files.length} file{files.length === 1 ? "" : "s"} · {totalSizeLabel(files)}</p>
                <div className="border-t border-[#E5E5EA]" />
              </div>
              <div className="flex flex-col gap-[6px] px-1 font-['Rakuten_Sans_UI'] text-[14px] leading-5 text-[#636366]">
                <div className="flex items-center gap-2"><Image src="/figma/send-files/lock.svg" alt="" width={16} height={16} />Password protected</div>
                <div className="flex items-center gap-2"><Image src="/figma/send-files/calendar.svg" alt="" width={16} height={16} />Expires: 10/24/2026</div>
                <div className="flex items-center gap-2"><Image src="/figma/send-files/success-world.svg" alt="" width={20} height={20} />Anyone with the link can access the link</div>
              </div>
            </div>
            <footer className="flex items-center justify-between border-t border-[#E5E5EA] px-4 py-3 sm:px-6">
              <button type="button" onClick={() => { setRecipients([]); setEmailSubject(""); setEmailMessage(""); setView("main"); setTab("email"); }} className="h-10 rounded-[8px] border border-[#E5E5EA] px-4 font-['Rakuten_Sans_UI'] text-[14px] font-semibold text-[#636366] hover:bg-[#F9F9FB] active:scale-[0.96] transition-[transform] duration-100">Send Another</button>
              <button type="button" onClick={handleClose} className="h-10 rounded-[8px] bg-[#002896] px-6 font-['Rakuten_Sans_UI'] text-[14px] font-semibold text-[#F9F9FB] hover:bg-[#001C6B] active:scale-[0.96] transition-[transform] duration-100">Done</button>
            </footer>
          </div>
        )}

        {/* ── Main form ── */}
        {view === "main" && (
          <>
            <div className="shrink-0 border-b border-[#E5E5EA] bg-white px-4 pt-5 sm:px-6 sm:pt-6">
              <header className="pb-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 id="send-files-dialog-title" className="font-['Rakuten_Sans'] text-[24px] font-semibold leading-8 text-[#18181A]">Send Files</h2>
                    <p className="mt-1.5 font-['Rakuten_Sans_UI'] text-[14px] leading-[18px] text-[#636366]">Send files securely with anyone without Rakuten Drive</p>
                  </div>
                  <button type="button" onClick={handleClose} className="-mr-2 -mt-1 flex size-8 items-center justify-center rounded-[6px] text-[#636366] hover:bg-[#F2F2F7] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#002896]" aria-label="Close Send Files dialog">
                    <X size={20} strokeWidth={1.75} />
                  </button>
                </div>
              </header>
            </div>

            <div className={`send-files-scroll min-h-0 flex-1 overscroll-contain px-4 sm:px-6 ${tab === "settings" && calendarOpen ? "overflow-y-visible" : "overflow-y-auto"}`}>
              <div className="flex flex-col gap-3 pt-4 sm:flex-row sm:gap-4">
                <div onClick={() => uploadInputRef.current?.click()} onDragOver={(event) => { event.preventDefault(); setIsDragging(true); }} onDragLeave={() => setIsDragging(false)} onDrop={handleFileDrop} className={`relative flex h-[140px] min-w-0 w-full flex-1 cursor-pointer flex-col items-center justify-center gap-3 rounded-[8px] border border-dashed bg-[#F8FAFC] px-3 text-center transition-colors hover:bg-[#F4F7FB] focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-[#002896] ${isDragging ? "border-[#002896] bg-[#E9EEF6]" : "border-[#002896]"}`}>
                  <input ref={uploadInputRef} aria-label="Choose files to upload" className="pointer-events-none absolute inset-0 size-full opacity-0" type="file" multiple onChange={handlePickerChange} />
                  <Image src="/figma/send-files/upload.svg" alt="" width={40} height={40} />
                  <span className="pointer-events-none">
                    <span className="block font-['Rakuten_Sans'] text-[16px] font-semibold leading-6 text-[#18181A]">Drop files here or choose files</span>
                    <span className="mt-1 block font-['Rakuten_Sans_UI'] text-[14px] leading-[18px] text-[#636366]">You can select multiple files to send</span>
                  </span>
                </div>
                <div className="relative flex h-[112px] w-full shrink-0 cursor-pointer flex-col items-center justify-center gap-3 rounded-[8px] border border-[#E5E5EA] bg-[#F8FAFC] px-3 text-center transition-colors hover:bg-[#F4F7FB] focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-[#002896] sm:h-[140px] sm:w-[220px]">
                  <input aria-label="Choose files from My Drive" className="absolute inset-0 z-10 size-full cursor-pointer opacity-0" type="file" multiple onChange={handlePickerChange} />
                  <Image src="/figma/send-files/my-drive.svg" alt="" width={38} height={38} />
                  <span className="pointer-events-none font-['Rakuten_Sans_UI'] text-[14px] font-semibold leading-[18px] text-[#002896]">Select Files from<br />My Drive</span>
                </div>
              </div>

              <div className="mt-4">
                <div className="sticky top-0 z-20 isolate -mx-4 bg-white px-4 shadow-[0_1px_0_#E5E5EA] sm:-mx-6 sm:px-6">
                  <div role="tablist" aria-label="Send files options" className="flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    {[
                      { id: "files" as const, icon: "/figma/send-files/uploaded.svg", label: `${files.length} Item${files.length === 1 ? "" : "s"} Uploaded`, width: "" },
                      { id: "email" as const, icon: "/figma/send-files/email.svg", label: "Email ( Optional )", width: "" },
                      { id: "settings" as const, icon: "/figma/send-files/settings.svg", label: "Settings ( Optional )", width: "flex-1" },
                    ].map(({ id, icon, label, width }) => (
                      <button key={id} type="button" role="tab" aria-selected={tab === id} onClick={() => setTab(id)} className={`-mb-px flex h-12 shrink-0 items-center gap-2 border-b-2 px-3 font-['Rakuten_Sans'] text-[14px] font-semibold whitespace-nowrap sm:px-4 ${width} ${tab === id ? "border-[#002896] text-[#002896]" : "border-transparent text-[#636366] hover:text-[#18181A]"}`}>
                        <Image src={icon} alt="" width={id === "files" ? 24 : 20} height={id === "files" ? 24 : 20} className={tab === id ? "" : "grayscale"} />
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {tab === "files" && (
                  <div className="min-h-[280px] pt-4 sm:min-h-[440px]">
                    <div className="flex items-center px-2 text-[14px] leading-[18px]">
                      <span className="flex-1 font-['Rakuten_Sans'] text-[#6B7280]">{files.length ? `Total ${files.length} file${files.length === 1 ? "" : "s"} · ${totalSizeLabel(files)}` : "No files selected"}</span>
                      {files.length > 0 && <button type="button" onClick={() => setFiles([])} className="font-['Rakuten_Sans'] font-semibold text-[#DC2626] underline underline-offset-2">Clear All</button>}
                    </div>
                    <div className="mt-3">
                      {files.length ? files.map((entry, index) => {
                        return <div key={`${entryName(entry)}-${index}`} className="flex h-14 items-center justify-between border-b border-[#E5E5EA] px-3 py-2.5">
                          <div className="flex min-w-0 items-center gap-3">
                            <span className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-[6px]">
                              <FileIcon type={entryFileType(entry)} size={40} thumbnail={entryThumbnail(entry)} />
                            </span>
                            <span className="min-w-0"><span className="block truncate font-['Rakuten_Sans'] text-[14px] font-semibold leading-[18px] text-[#18181A]">{entryName(entry)}</span><span className="block font-['Rakuten_Sans_UI'] text-[14px] leading-5 text-[#636366]">{entrySizeLabel(entry)}</span></span>
                          </div>
                          <button type="button" onClick={() => setFiles((current) => current.filter((_, i) => i !== index))} className="ml-3 flex size-7 shrink-0 items-center justify-center rounded-[6px] text-[#AEAEB2] hover:bg-[#F2F2F7] hover:text-[#636366]" aria-label={`Remove ${entryName(entry)}`}><X size={22} strokeWidth={1.5} /></button>
                        </div>;
                      }) : <div className="flex min-h-[230px] items-center justify-center text-center font-['Rakuten_Sans_UI'] text-[14px] text-[#636366] sm:min-h-[390px]">Choose files to add them to your link.</div>}
                    </div>
                  </div>
                )}
                {tab === "email" && (
                  <div className="flex min-h-[280px] flex-col gap-4 pt-2 pb-4 sm:min-h-[420px]">
                    <div className="flex flex-col gap-[6px] font-['Rakuten_Sans'] text-[14px] font-semibold leading-5 text-[#18181A]">
                      Email Address
                      <div className="flex min-h-11 flex-col gap-2 rounded-[8px] border border-[#E5E5EA] p-3 focus-within:border-[#002896]">
                        {recipients.map((recipient) => (
                          <div key={recipient} className="flex h-8 items-center gap-2 rounded-full bg-[#F2F2F7] py-1.5 pl-3 pr-2.5">
                            <span className="min-w-0 flex-1 truncate font-['Rakuten_Sans'] text-[14px] font-semibold leading-[18px] text-[#18181A]">{recipient}</span>
                            <button type="button" onClick={() => setRecipients((current) => current.filter((item) => item !== recipient))} className="flex size-4 shrink-0 items-center justify-center" aria-label={`Remove ${recipient}`}><Image src="/figma/send-files/close-recipient.svg" alt="" width={16} height={16} /></button>
                          </div>
                        ))}
                        {recipients.length < 20 && <input type="email" value={recipientInput} onChange={(event) => setRecipientInput(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === ",") { event.preventDefault(); addRecipients(); } }} onBlur={() => addRecipients()} placeholder="yourname@example.com" className="h-5 w-full bg-transparent px-2 font-normal leading-5 text-[#18181A] outline-none placeholder:text-[#636366]" />}
                      </div>
                      <span className="font-['Rakuten_Sans_UI'] text-[14px] font-normal leading-5 text-[#636366]">Max 20 recipients allowed, {20 - recipients.length} remaining</span>
                    </div>
                    <label className="flex flex-col gap-[6px] font-['Rakuten_Sans'] text-[14px] font-semibold leading-5 text-[#18181A]">
                      Subject (Optional)
                      <input type="text" value={emailSubject} onChange={(event) => setEmailSubject(event.target.value)} placeholder="Add subject" className="h-11 w-full rounded-[8px] border border-[#E5E5EA] px-4 font-normal text-[#18181A] outline-none placeholder:text-[#636366] focus:border-[#002896]" />
                    </label>
                    <label className="flex flex-col gap-[6px] font-['Rakuten_Sans'] text-[14px] font-semibold leading-5 text-[#18181A]">
                      Message (Optional)
                      <textarea value={emailMessage} maxLength={500} onChange={(event) => setEmailMessage(event.target.value)} placeholder="Add a message" className="h-[100px] w-full resize-none rounded-[8px] border border-[#E5E5EA] px-4 py-3 font-normal text-[#18181A] outline-none placeholder:text-[#636366] focus:border-[#002896]" />
                      <span className="font-['Rakuten_Sans_UI'] text-[14px] font-normal leading-5 text-[#636366]">Message must be under 500 characters</span>
                    </label>
                    <button type="button" onClick={() => { addRecipients(); setEmailSending(true); }} disabled={emailSending || (!recipients.length && !recipientInput.trim())} className="flex h-10 w-fit items-center gap-2 rounded-[8px] bg-[#002896] px-4 font-['Rakuten_Sans_UI'] text-[14px] font-semibold text-[#F9F9FB] hover:bg-[#001C6B] disabled:cursor-not-allowed disabled:opacity-50">
                      {emailSending ? <span className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-hidden="true" /> : <Image src="/figma/send-files/send-email.svg" alt="" width={20} height={18} />}
                      {emailSending ? "Sending Email…" : "Send Email"}
                    </button>
                  </div>
                )}
                {tab === "settings" && (
                  <div className="flex min-h-[280px] flex-col gap-4 pt-4 pb-4 sm:min-h-[440px]">
                    <div className="relative flex flex-col gap-[6px]">
                      <label className="font-['Rakuten_Sans'] text-[14px] font-semibold leading-5 text-[#18181A]">Set expiration date of shared link</label>
                      <button
                        type="button"
                        onClick={() => setCalendarOpen((v) => !v)}
                        className={`flex h-11 w-full items-center justify-between rounded-[8px] border px-3 text-left transition-colors duration-100 ${calendarOpen ? "border-[#002896]" : "border-[#E5E5EA]"} bg-white`}
                      >
                        <span className={`font-['Rakuten_Sans_UI'] text-[14px] ${expirationDate ? "text-[#18181A]" : "text-[#AEAEB2]"}`}>
                          {expirationDate
                            ? expirationDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                            : "MM / DD / YYYY"}
                        </span>
                        <CalendarIcon size={16} strokeWidth={1.75} className="shrink-0 text-[#636366]" />
                      </button>
                      {calendarOpen && (
                        <div className="animate-in fade-in zoom-in-95 duration-150 absolute left-0 bottom-[calc(100%+4px)] z-[200] w-[260px] rounded-[12px] border border-[#E1E1E6] bg-white p-3 shadow-[0_8px_24px_rgba(24,24,26,0.14)]">
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
                          className="mt-0.5 self-start font-['Rakuten_Sans_UI'] text-[13px] text-muted-foreground hover:text-[#C10503] transition-colors duration-100"
                        >
                          Remove expiration date
                        </button>
                      )}
                    </div>
                    <div className="flex flex-col gap-[6px]">
                      <label className="font-['Rakuten_Sans'] text-[14px] font-semibold leading-5 text-[#18181A]">Password</label>
                      <div className="flex h-11 items-center gap-3 rounded-[8px] border border-[#E5E5EA] px-3 focus-within:border-[#002896]">
                        <Image src="/figma/send-files/lock.svg" alt="" width={16} height={16} className="shrink-0 grayscale" />
                        <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Secure with password" className="flex-1 bg-transparent font-['Rakuten_Sans_UI'] text-[14px] text-[#18181A] outline-none placeholder:text-[#AEAEB2]" />
                        <button type="button" onClick={() => setShowPassword((v) => !v)} className="shrink-0 text-[#AEAEB2] hover:text-[#636366]" aria-label={showPassword ? "Hide password" : "Show password"}>
                          {showPassword ? <Eye size={16} strokeWidth={1.75} /> : <EyeOff size={16} strokeWidth={1.75} />}
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-col gap-3">
                      {[
                        { key: "uploadToMyDrive" as const, checked: uploadToMyDrive, onChange: () => setUploadToMyDrive((v) => !v), label: "Upload to My Drive", desc: "Upload files to My Drive automatically as you send them." },
                        { key: "allowComment" as const, checked: allowComment, onChange: () => setAllowComment((v) => !v), label: "Comment", desc: "Allow recipients to comment on shared files." },
                      ].map(({ key, checked, onChange, label, desc }) => (
                        <button key={key} type="button" onClick={onChange} className="flex items-start gap-3 text-left">
                          <span className={`mt-0.5 flex size-[18px] shrink-0 items-center justify-center rounded-[4px] border-2 transition-colors ${checked ? "border-[#002896] bg-[#002896]" : "border-[#C7C7CC] bg-white"}`} aria-hidden="true">
                            {checked && <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                          </span>
                          <span>
                            <span className="block font-['Rakuten_Sans'] text-[14px] font-semibold leading-5 text-[#18181A]">{label}</span>
                            <span className="block font-['Rakuten_Sans_UI'] text-[14px] leading-5 text-[#636366]">{desc}</span>
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <footer className="shrink-0 border-t border-[#E5E5EA] px-4 pb-5 pt-3 sm:px-6 sm:pb-6">
              <div className="flex items-center gap-[3px] py-[6px] font-['Rakuten_Sans'] text-[14px] leading-5 text-black"><Image src="/figma/send-files/world.svg" alt="" width={16} height={16} className="grayscale" />Anyone with the link can access the link</div>
              <div className="flex gap-2 pt-3">
                <button type="button" onClick={handleClose} className="h-10 w-1/2 rounded-[8px] border border-[#E5E5EA] bg-white px-4 font-['Rakuten_Sans_UI'] text-[14px] font-semibold text-[#18181A] hover:bg-[#F9F9FB] active:scale-[0.96] transition-[transform] duration-100 sm:w-[200px]">Cancel</button>
                <button type="button" onClick={() => setLinkCreating(true)} disabled={!files.length || linkCreating} className="flex h-10 flex-1 items-center justify-center gap-2 rounded-[8px] bg-[#002896] px-4 font-['Rakuten_Sans_UI'] text-[14px] font-semibold text-[#F9F9FB] hover:bg-[#001C6B] active:scale-[0.96] transition-[transform] duration-100 disabled:cursor-not-allowed disabled:opacity-50">
                  {linkCreating ? <span className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-hidden="true" /> : <Image src="/figma/send-files/link.svg" alt="" width={16} height={16} />}
                  {linkCreating ? "Creating link..." : "Create Link"}
                </button>
              </div>
            </footer>

            {/* Loading overlay — fades in on enter, fades out before switching to success */}
            {showOverlay && (
              <div
                className={`absolute inset-0 z-30 flex items-center justify-center bg-white/95 p-6 backdrop-blur-sm ${overlayExiting ? "transition-opacity duration-200 opacity-0" : "animate-in fade-in duration-200"}`}
                role="status"
                aria-live="polite"
              >
                <div className="flex max-w-[300px] flex-col items-center text-center">
                  <div className="relative flex size-20 items-center justify-center">
                    <svg className="absolute inset-0 size-full animate-spin motion-reduce:animate-none" viewBox="0 0 80 80" fill="none" aria-hidden="true">
                      <circle cx="40" cy="40" r="34" stroke="#E5E9F5" strokeWidth="5" />
                      <circle cx="40" cy="40" r="34" stroke="#002896" strokeWidth="5" strokeLinecap="round" strokeDasharray="50 164" strokeDashoffset="0" />
                    </svg>
                    <div className="flex size-12 items-center justify-center rounded-full bg-[#EEF1FA]">
                      <Image src="/figma/send-files/link.svg" alt="" width={20} height={20} />
                    </div>
                  </div>
                  <p className="mt-6 font-['Rakuten_Sans'] text-[18px] font-semibold leading-6 text-[#18181A]">Creating your secure link</p>
                  <p className="mt-2 font-['Rakuten_Sans_UI'] text-[14px] leading-5 text-[#636366]">Your files are being prepared for sharing.</p>
                </div>
              </div>
            )}
          </>
        )}

      </section>
    </div>
  );
}
