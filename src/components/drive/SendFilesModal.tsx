"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import { X, Eye, EyeOff } from "lucide-react";

type Tab = "files" | "email" | "settings";

interface SendFilesModalProps {
  onClose: () => void;
}

const SendFilesDialogContext = createContext<(() => void) | null>(null);

export function SendFilesDialogProvider({ onOpen, children }: { onOpen: () => void; children: ReactNode }) {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return;
      const action = event.target.closest("button, [role='menuitem']");
      const label = action?.textContent?.trim().replace(/\s+/g, " ").toLowerCase();
      if (label === "send files") onOpen();
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [onOpen]);

  return <SendFilesDialogContext.Provider value={onOpen}>{children}</SendFilesDialogContext.Provider>;
}

export function useSendFilesDialog() {
  const open = useContext(SendFilesDialogContext);
  if (!open) throw new Error("useSendFilesDialog must be used within SendFilesDialogProvider");
  return open;
}

const badgeStyles: Record<string, { background: string; color: string }> = {
  pptx: { background: "#FFF3E0", color: "#E65100" },
  jpg: { background: "#E8F5E9", color: "#2E7D32" },
  jpeg: { background: "#E8F5E9", color: "#2E7D32" },
  docx: { background: "#E3F2FD", color: "#1565C0" },
  mp3: { background: "#F3E5F5", color: "#6A1B9A" },
  pdf: { background: "#FFEBEE", color: "#C62828" },
};

function fileExtension(name: string) {
  return name.split(".").pop()?.toLowerCase() || "file";
}

function fileSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function totalSize(files: File[]) {
  return fileSize(files.reduce((total, file) => total + file.size, 0));
}

export function SendFilesModal({ onClose }: SendFilesModalProps) {
  const uploadInputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [tab, setTab] = useState<Tab>("files");
  const [linkCreated, setLinkCreated] = useState(false);
  const [recipients, setRecipients] = useState<string[]>([]);
  const [recipientInput, setRecipientInput] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [emailSending, setEmailSending] = useState(false);
  const [copied, setCopied] = useState(false);
  const [linkCreating, setLinkCreating] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [expirationDate, setExpirationDate] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [uploadToMyDrive, setUploadToMyDrive] = useState(true);
  const [allowComment, setAllowComment] = useState(false);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  useEffect(() => {
    if (!linkCreating) return;
    const timer = window.setTimeout(() => {
      setLinkCreating(false);
      setLinkCreated(true);
    }, 8000);
    return () => window.clearTimeout(timer);
  }, [linkCreating]);

  useEffect(() => {
    if (!emailSending) return;
    const timer = window.setTimeout(() => {
      setEmailSending(false);
      setEmailSent(true);
    }, 2000);
    return () => window.clearTimeout(timer);
  }, [emailSending]);

  const addFiles = (newFiles: FileList | null) => {
    if (!newFiles) return;
    setFiles((current) => [...current, ...Array.from(newFiles)]);
    setTab("files");
    setLinkCreated(false);
  };

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
    setEmailSent(false);
  };

  const shareUrl = "https://drive.rakuten.com/share/a8f3k2m9s7q";

  if (emailSent && recipients.length > 0) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-black/[0.72] p-4 sm:p-8" role="presentation" onMouseDown={onClose}>
        <section role="dialog" aria-modal="true" aria-labelledby="email-sent-title" className="animate-in fade-in zoom-in-95 duration-200 w-full max-w-[540px] overflow-hidden rounded-[16px] bg-white shadow-[0_16px_40px_-8px_rgba(0,0,0,0.1)]" onMouseDown={(event) => event.stopPropagation()}>
          <div className="flex flex-col gap-4 px-4 py-6 sm:px-6">
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="flex size-16 items-center justify-center rounded-full bg-[#E8F5E9]">
                <Image src="/figma/send-files/success-check.svg" alt="" width={32} height={32} />
              </div>
              <div>
                <h2 id="email-sent-title" className="font-['Rakuten_Sans'] text-[22px] font-semibold leading-7 text-[#18181A]">Email Sent Successfully!</h2>
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
              <p className="px-1 font-['Rakuten_Sans_UI'] text-[14px] leading-[18px] text-[#636366]">Total {files.length} file{files.length === 1 ? "" : "s"} · {totalSize(files)}</p>
              <div className="border-t border-[#E5E5EA]" />
            </div>
            <div className="flex flex-col gap-[6px] px-1 font-['Rakuten_Sans_UI'] text-[14px] leading-5 text-[#636366]">
              <div className="flex items-center gap-2"><Image src="/figma/send-files/lock.svg" alt="" width={16} height={16} />Password protected</div>
              <div className="flex items-center gap-2"><Image src="/figma/send-files/calendar.svg" alt="" width={16} height={16} />Expires: 10/24/2026</div>
              <div className="flex items-center gap-2"><Image src="/figma/send-files/success-world.svg" alt="" width={20} height={20} />Anyone with the link can access the files</div>
            </div>
          </div>
          <footer className="flex items-center justify-between border-t border-[#E5E5EA] px-4 py-3 sm:px-6">
            <button type="button" onClick={() => { setRecipients([]); setEmailSubject(""); setEmailMessage(""); setEmailSent(false); setTab("email"); }} className="h-10 rounded-[8px] border border-[#E5E5EA] px-4 font-['Rakuten_Sans_UI'] text-[14px] font-semibold text-[#636366] hover:bg-[#F9F9FB]">Send Another</button>
            <button type="button" onClick={onClose} className="h-10 rounded-[6px] bg-[#002896] px-6 font-['Rakuten_Sans_UI'] text-[14px] font-semibold text-[#F9F9FB] hover:bg-[#001C6B]">Done</button>
          </footer>
        </section>
      </div>
    );
  }

  if (linkCreated) {
    const copyLink = async () => {
      await navigator.clipboard?.writeText(shareUrl);
      setCopied(true);
    };

    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-black/[0.72] p-4 sm:p-8" role="presentation" onMouseDown={onClose}>
        <section role="dialog" aria-modal="true" aria-labelledby="link-created-title" className="animate-in fade-in zoom-in-95 duration-200 w-full max-w-[600px] overflow-hidden rounded-[16px] bg-white shadow-[0_16px_40px_-8px_rgba(0,0,0,0.1)]" onMouseDown={(event) => event.stopPropagation()}>
          <div className="flex flex-col gap-3 px-4 py-6 sm:px-6">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="flex size-16 items-center justify-center rounded-full bg-[#E8F5E9]"><Image src="/figma/send-files/success-check.svg" alt="" width={32} height={32} /></div>
              <div className="flex flex-col gap-2"><h2 id="link-created-title" className="font-['Rakuten_Sans'] text-[22px] font-semibold leading-7 text-[#18181A]">Link Created Successfully!</h2><p className="font-['Rakuten_Sans_UI'] text-[14px] leading-[18px] text-[#636366]">Your files are ready to share</p></div>
            </div>
            <div className="flex flex-col gap-[6px]">
              <div className="flex h-[46px] items-center gap-3 rounded-[8px] border border-[#E5E5EA] bg-[#F8FAFC] py-[6px] pl-3 pr-[6px]">
                <Image src="/figma/send-files/success-link.svg" alt="" width={18} height={18} />
                <span className="min-w-0 flex-1 truncate font-['Rakuten_Sans_UI'] text-[14px] leading-5 text-[#18181A]">{shareUrl}</span>
                <button type="button" onClick={copyLink} className="h-[34px] shrink-0 rounded-[6px] bg-[#002896] px-4 font-['Rakuten_Sans_UI'] text-[14px] font-semibold text-[#F9F9FB] hover:bg-[#001C6B]">Copy Link</button>
              </div>
              <div className="flex h-[15px] justify-end pr-2">{copied && <span className="flex items-center gap-1 font-['Rakuten_Sans_UI'] text-[14px] font-semibold text-[#2E7D32]"><Image src="/figma/send-files/copied-check.svg" alt="" width={14} height={14} />Copied!</span>}</div>
            </div>
            <div className="flex flex-col gap-[6px]"><p className="px-2 font-['Rakuten_Sans_UI'] text-[14px] leading-[18px] text-[#636366]">Total {files.length} file{files.length === 1 ? "" : "s"} · {totalSize(files)}</p><div className="border-t border-[#E5E5EA]" /></div>
            <div className="flex flex-col gap-[6px] px-2 py-3 font-['Rakuten_Sans_UI'] text-[14px] leading-5 text-[#636366]">
              <div className="flex items-center gap-2"><Image src="/figma/send-files/lock.svg" alt="" width={16} height={16} />Password protected</div>
              <div className="flex items-center gap-2"><Image src="/figma/send-files/calendar.svg" alt="" width={16} height={16} />Expires: 10/24/2026</div>
              <div className="flex items-center gap-2"><Image src="/figma/send-files/success-world.svg" alt="" width={24} height={24} />Anyone with the link can access the files</div>
            </div>
          </div>
          <footer className="flex items-center justify-between border-t border-[#E5E5EA] px-4 py-3 sm:px-6">
            <button type="button" onClick={() => { setFiles([]); setCopied(false); setLinkCreated(false); setTab("files"); }} className="h-10 rounded-[8px] border border-[#E5E5EA] px-4 font-['Rakuten_Sans_UI'] text-[14px] font-semibold text-[#636366] hover:bg-[#F9F9FB]">Send Another</button>
            <button type="button" onClick={onClose} className="h-10 rounded-[6px] bg-[#002896] px-6 font-['Rakuten_Sans_UI'] text-[14px] font-semibold text-[#F9F9FB] hover:bg-[#001C6B]">Done</button>
          </footer>
        </section>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-black/[0.72] p-0 sm:p-8" role="presentation" onMouseDown={onClose}>
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="send-files-title"
        className="relative flex h-dvh w-full max-w-[600px] flex-col overflow-hidden rounded-none bg-white shadow-[0_16px_40px_-8px_rgba(0,0,0,0.15)] sm:h-auto sm:max-h-[calc(100dvh-4rem)] sm:rounded-[16px]"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="shrink-0 border-b border-[#E5E5EA] bg-white px-4 pt-5 sm:px-6 sm:pt-6">
          <header className="pb-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 id="send-files-title" className="font-['Rakuten_Sans'] text-[24px] font-semibold leading-8 text-[#18181A]">Send Files</h2>
                <p className="mt-1.5 font-['Rakuten_Sans_UI'] text-[14px] leading-[18px] text-[#636366]">Send files securely with anyone without Rakuten Drive</p>
              </div>
              <button type="button" onClick={onClose} className="-mr-2 -mt-1 flex size-8 items-center justify-center rounded-[6px] text-[#636366] hover:bg-[#F2F2F7] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#002896]" aria-label="Close Send Files dialog">
                <X size={20} strokeWidth={1.75} />
              </button>
            </div>
          </header>
        </div>

        <div className="send-files-scroll min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 sm:px-6">
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
                  <span className="flex-1 font-['Rakuten_Sans'] text-[#6B7280]">{files.length ? `Total ${files.length} file${files.length === 1 ? "" : "s"} · ${totalSize(files)}` : "No files selected"}</span>
                  {files.length > 0 && <button type="button" onClick={() => setFiles([])} className="font-['Rakuten_Sans'] font-semibold text-[#DC2626] underline underline-offset-2">Clear All</button>}
                </div>
                <div className="mt-3">
                  {files.length ? files.map((file, index) => {
                    const ext = fileExtension(file.name);
                    const colors = badgeStyles[ext] ?? { background: "#F2F2F7", color: "#636366" };
                    return <div key={`${file.name}-${index}`} className="flex h-14 items-center justify-between border-b border-[#E5E5EA] px-3 py-2.5">
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="flex size-9 shrink-0 items-center justify-center rounded-[6px] font-['Rakuten_Sans_UI'] text-[10px] font-bold uppercase" style={colors}>{ext}</span>
                        <span className="min-w-0"><span className="block truncate font-['Rakuten_Sans'] text-[14px] font-semibold leading-[18px] text-[#18181A]">{file.name}</span><span className="block font-['Rakuten_Sans_UI'] text-[14px] leading-5 text-[#636366]">{fileSize(file.size)}</span></span>
                      </div>
                      <button type="button" onClick={() => setFiles((current) => current.filter((_, itemIndex) => itemIndex !== index))} className="ml-3 flex size-7 shrink-0 items-center justify-center rounded-[6px] text-[#AEAEB2] hover:bg-[#F2F2F7] hover:text-[#636366]" aria-label={`Remove ${file.name}`}><X size={22} strokeWidth={1.5} /></button>
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
                        <button type="button" onClick={() => { setRecipients((current) => current.filter((item) => item !== recipient)); setEmailSent(false); }} className="flex size-4 shrink-0 items-center justify-center" aria-label={`Remove ${recipient}`}><Image src="/figma/send-files/close-recipient.svg" alt="" width={16} height={16} /></button>
                      </div>
                    ))}
                    {recipients.length < 20 && <input type="email" value={recipientInput} onChange={(event) => { setRecipientInput(event.target.value); setEmailSent(false); }} onKeyDown={(event) => { if (event.key === "Enter" || event.key === ",") { event.preventDefault(); addRecipients(); } }} onBlur={() => addRecipients()} placeholder="yourname@example.com" className="h-5 w-full bg-transparent px-2 font-normal leading-5 text-[#18181A] outline-none placeholder:text-[#636366]" />}
                  </div>
                  <span className="font-['Rakuten_Sans_UI'] text-[14px] font-normal leading-5 text-[#636366]">Max 20 recipients allowed, {20 - recipients.length} remaining</span>
                </div>
                <label className="flex flex-col gap-[6px] font-['Rakuten_Sans'] text-[14px] font-semibold leading-5 text-[#18181A]">
                  Subject (Optional)
                  <input type="text" value={emailSubject} onChange={(event) => { setEmailSubject(event.target.value); setEmailSent(false); }} placeholder="Add subject" className="h-11 w-full rounded-[8px] border border-[#E5E5EA] px-4 font-normal text-[#18181A] outline-none placeholder:text-[#636366] focus:border-[#002896]" />
                </label>
                <label className="flex flex-col gap-[6px] font-['Rakuten_Sans'] text-[14px] font-semibold leading-5 text-[#18181A]">
                  Message (Optional)
                  <textarea value={emailMessage} maxLength={500} onChange={(event) => { setEmailMessage(event.target.value); setEmailSent(false); }} placeholder="Add a message" className="h-[100px] w-full resize-none rounded-[8px] border border-[#E5E5EA] px-4 py-3 font-normal text-[#18181A] outline-none placeholder:text-[#636366] focus:border-[#002896]" />
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
                <div className="flex flex-col gap-[6px]">
                  <label className="font-['Rakuten_Sans'] text-[14px] font-semibold leading-5 text-[#18181A]">
                    Set expiration date of shared link
                  </label>
                  <div className="flex h-11 items-center gap-3 rounded-[8px] border border-[#E5E5EA] px-3 focus-within:border-[#002896]">
                    <Image src="/figma/send-files/calendar.svg" alt="" width={16} height={16} className="shrink-0 grayscale" />
                    <input
                      type="text"
                      value={expirationDate}
                      onChange={(e) => setExpirationDate(e.target.value)}
                      placeholder="MM / DD / YYYY"
                      className="flex-1 bg-transparent font-['Rakuten_Sans_UI'] text-[14px] text-[#18181A] outline-none placeholder:text-[#AEAEB2]"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-[6px]">
                  <label className="font-['Rakuten_Sans'] text-[14px] font-semibold leading-5 text-[#18181A]">
                    Password
                  </label>
                  <div className="flex h-11 items-center gap-3 rounded-[8px] border border-[#E5E5EA] px-3 focus-within:border-[#002896]">
                    <Image src="/figma/send-files/lock.svg" alt="" width={16} height={16} className="shrink-0 grayscale" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Secure with password"
                      className="flex-1 bg-transparent font-['Rakuten_Sans_UI'] text-[14px] text-[#18181A] outline-none placeholder:text-[#AEAEB2]"
                    />
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
                        {checked && (
                          <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        )}
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
          <div className="flex items-center gap-[3px] py-[6px] font-['Rakuten_Sans'] text-[14px] leading-5 text-black"><Image src="/figma/send-files/world.svg" alt="" width={16} height={16} className="grayscale" />Anyone with the link can access the files</div>
          <div className="flex gap-2 pt-3">
            <button type="button" onClick={onClose} className="h-10 w-1/2 rounded-[8px] border border-[#E5E5EA] bg-white px-4 font-['Rakuten_Sans_UI'] text-[14px] font-semibold text-[#18181A] hover:bg-[#F9F9FB] sm:w-[200px]">Cancel</button>
            <button type="button" onClick={() => setLinkCreating(true)} disabled={!files.length || linkCreating} className="flex h-10 flex-1 items-center justify-center gap-2 rounded-[8px] bg-[#002896] px-4 font-['Rakuten_Sans_UI'] text-[14px] font-semibold text-[#F9F9FB] hover:bg-[#001C6B] disabled:cursor-not-allowed disabled:opacity-50">{linkCreating ? <span className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-hidden="true" /> : <Image src="/figma/send-files/link.svg" alt="" width={16} height={16} />}{linkCreating ? "Creating link..." : "Create Link"}</button>
          </div>
        </footer>
        {linkCreating && (
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-white/95 p-6 backdrop-blur-sm" role="status" aria-live="polite">
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
      </section>
    </div>
  );
}
