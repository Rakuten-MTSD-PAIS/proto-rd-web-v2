"use client";

import { useRef, useState } from "react";
import { FileUp, Send, X } from "lucide-react";
import { PageToolbar } from "@/components/drive/PageToolbar";

export default function SendFilesPage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [recipient, setRecipient] = useState("");
  const [sent, setSent] = useState(false);

  const addFiles = (nextFiles: FileList | null) => {
    if (!nextFiles) return;
    setFiles((current) => [...current, ...Array.from(nextFiles)]);
    setSent(false);
  };

  return (
    <div className="flex flex-col gap-5 p-4 sm:p-6">
      <PageToolbar breadcrumbs={[{ label: "Send Files" }]} showActions={false} />
      <section className="mx-auto w-full max-w-[760px] rounded-[12px] border border-[#E5E5EA] bg-white p-5 sm:p-6">
        <div className="mb-5">
          <h1 className="text-[20px] font-semibold leading-[28px] text-[#18181A]">Send files</h1>
          <p className="mt-1 text-[14px] leading-[20px] text-[#636366]">Share files securely with anyone by email.</p>
        </div>
        <input ref={inputRef} className="sr-only" type="file" multiple onChange={(event) => addFiles(event.target.files)} />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex min-h-44 w-full flex-col items-center justify-center rounded-[8px] border border-dashed border-[#AEB9D5] bg-[#F9FAFD] px-4 text-center transition-colors duration-150 hover:border-[#002896] hover:bg-[#F4F7FB]"
        >
          <span className="mb-3 flex size-10 items-center justify-center rounded-full bg-[#E9EEF6] text-[#002896]"><FileUp size={20} strokeWidth={1.75} /></span>
          <span className="text-[16px] font-semibold text-[#18181A]">Drop files here or choose files</span>
          <span className="mt-1 text-[13px] text-[#636366]">You can select multiple files to send.</span>
        </button>

        {files.length > 0 && (
          <ul className="mt-4 divide-y divide-[#E5E5EA] rounded-[8px] border border-[#E5E5EA]" aria-label="Selected files">
            {files.map((file, index) => (
              <li key={`${file.name}-${index}`} className="flex items-center gap-3 px-3 py-2.5">
                <FileUp size={18} className="shrink-0 text-[#002896]" />
                <span className="min-w-0 flex-1 truncate text-[14px] text-[#18181A]">{file.name}</span>
                <span className="text-[12px] text-[#636366]">{Math.ceil(file.size / 1024)} KB</span>
                <button type="button" onClick={() => setFiles((current) => current.filter((_, itemIndex) => itemIndex !== index))} className="flex size-7 items-center justify-center rounded-[6px] text-[#636366] hover:bg-[#F2F2F7]" aria-label={`Remove ${file.name}`}>
                  <X size={16} />
                </button>
              </li>
            ))}
          </ul>
        )}

        <label className="mt-5 block text-[14px] font-medium text-[#18181A]" htmlFor="recipient">Recipient email</label>
        <input id="recipient" type="email" value={recipient} onChange={(event) => { setRecipient(event.target.value); setSent(false); }} placeholder="name@example.com" className="mt-2 h-10 w-full rounded-[8px] border border-[#E5E5EA] px-3 text-[14px] text-[#18181A] outline-none placeholder:text-[#8E8E93] focus:border-[#002896]" />
        <div className="mt-5 flex items-center justify-between gap-3">
          <p className="text-[13px] text-[#636366]">{files.length ? `${files.length} file${files.length > 1 ? "s" : ""} ready to send` : "Choose files to continue"}</p>
          <button type="button" disabled={!files.length || !recipient} onClick={() => setSent(true)} className="flex h-10 items-center gap-2 rounded-[8px] bg-[#002896] px-4 text-[14px] font-semibold text-white transition-colors duration-150 hover:bg-[#001F7A] disabled:cursor-not-allowed disabled:opacity-50">
            <Send size={16} /> Send files
          </button>
        </div>
        {sent && <p className="mt-3 text-[13px] text-[#009400]">Your files are ready to send to {recipient}.</p>}
      </section>
    </div>
  );
}
