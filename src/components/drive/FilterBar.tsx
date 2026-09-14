"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { ChevronDownIcon, ChevronRightIcon, GridIcon, ListIcon, SearchIcon } from "@/components/icons";
import { FileIcon } from "@/components/drive/FileIcon";
import type { DriveItem, FileType, ViewMode } from "@/lib/types";

interface FilterBarProps {
  items: DriveItem[];
  viewMode: ViewMode;
  onItemsChange: (items: DriveItem[]) => void;
  onViewModeChange: (mode: ViewMode) => void;
  hideFilters?: boolean;
}

type Menu = "type" | "people" | "modified" | null;
type DateFilter = "today" | "week" | "month" | "year" | "lastYear" | "custom" | null;
const TYPE_LABELS: Record<FileType, string> = { folder: "Folders", pdf: "PDFs", image: "Images", zip: "Archives", audio: "Audio", word: "Documents", excel: "Spreadsheets", ppt: "Presentations", vector: "Vectors", video: "Videos", other: "Other" };
const DATE_OPTIONS: { value: Exclude<DateFilter, "custom" | null>; label: string }[] = [
  { value: "today", label: "Today" }, { value: "week", label: "Last 7 days" }, { value: "month", label: "Last 30 days" }, { value: "year", label: "This year (2026)" }, { value: "lastYear", label: "Last year (2025)" },
];

function itemDate(value: string) {
  if (value.toLowerCase().startsWith("today")) return new Date(2026, 8, 14);
  if (value.toLowerCase().startsWith("yesterday")) return new Date(2026, 8, 13);
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function matchesModified(item: DriveItem, filter: DateFilter, from: string, to: string) {
  if (!filter) return true;
  const date = itemDate(item.modified);
  if (!date) return false;
  if (filter === "custom") return (!from || date >= new Date(`${from}T00:00:00`)) && (!to || date <= new Date(`${to}T23:59:59`));
  const today = new Date(2026, 8, 14);
  if (filter === "today") return date.toDateString() === today.toDateString();
  if (filter === "week") return date >= new Date(2026, 8, 8) && date <= today;
  if (filter === "month") return date >= new Date(2026, 7, 16) && date <= today;
  if (filter === "year") return date.getFullYear() === 2026;
  return date.getFullYear() === 2025;
}

export function FilterBar({ items, viewMode, onItemsChange, onViewModeChange, hideFilters = false }: FilterBarProps) {
  const [openMenu, setOpenMenu] = useState<Menu>(null);
  const [selectedTypes, setSelectedTypes] = useState<Set<FileType>>(new Set());
  const [selectedPeople, setSelectedPeople] = useState<Set<string>>(new Set());
  const [modified, setModified] = useState<DateFilter>(null);
  const [draftModified, setDraftModified] = useState<DateFilter>(null);
  const [customOpen, setCustomOpen] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const filterRef = useRef<HTMLDivElement>(null);
  const availableTypes = useMemo(() => [...new Set(items.map((item) => item.type))], [items]);
  const people = useMemo(() => [...new Set(items.map((item) => item.owner))], [items]);
  const filteredItems = useMemo(() => {
    const matching = items.filter((item) => (selectedTypes.size === 0 || selectedTypes.has(item.type)) && (selectedPeople.size === 0 || selectedPeople.has(item.owner)) && matchesModified(item, modified, fromDate, toDate));
    return [...matching.filter((item) => item.type === "folder"), ...matching.filter((item) => item.type !== "folder")];
  }, [fromDate, items, modified, selectedPeople, selectedTypes, toDate]);

  useEffect(() => { onItemsChange(filteredItems); }, [filteredItems, onItemsChange]);
  useEffect(() => {
    const outside = (event: MouseEvent) => { if (filterRef.current && !filterRef.current.contains(event.target as Node)) setOpenMenu(null); };
    const escape = (event: KeyboardEvent) => { if (event.key === "Escape") setOpenMenu(null); };
    document.addEventListener("mousedown", outside); document.addEventListener("keydown", escape);
    return () => { document.removeEventListener("mousedown", outside); document.removeEventListener("keydown", escape); };
  }, []);

  function toggleSet<T>(value: T, setter: React.Dispatch<React.SetStateAction<Set<T>>>) {
    setter((previous) => { const next = new Set(previous); if (next.has(value)) next.delete(value); else next.add(value); return next; });
  }
  function clearAll() { setSelectedTypes(new Set()); setSelectedPeople(new Set()); setModified(null); setDraftModified(null); setFromDate(""); setToDate(""); setCustomOpen(false); }
  function openModified() { setDraftModified(modified); setCustomOpen(modified === "custom"); setOpenMenu(openMenu === "modified" ? null : "modified"); }
  const active = (menu: Exclude<Menu, null>) => (menu === "type" && selectedTypes.size > 0) || (menu === "people" && selectedPeople.size > 0) || (menu === "modified" && Boolean(modified));
  const hasActiveFilters = selectedTypes.size > 0 || selectedPeople.size > 0 || Boolean(modified);

  return <div ref={filterRef} className="relative flex flex-wrap items-center justify-between gap-3">
    {!hideFilters && (
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative"><FilterButton label="Type" active={active("type")} count={selectedTypes.size} open={openMenu === "type"} onClick={() => setOpenMenu(openMenu === "type" ? null : "type")} />
          {openMenu === "type" && <TypeMenu types={availableTypes} selected={selectedTypes} onToggle={(type) => toggleSet(type, setSelectedTypes)} />}
        </div>
        <div className="relative"><FilterButton label="People" active={active("people")} count={selectedPeople.size} open={openMenu === "people"} onClick={() => setOpenMenu(openMenu === "people" ? null : "people")} />
          {openMenu === "people" && <PeopleMenu people={people} selected={selectedPeople} onToggle={(person) => toggleSet(person, setSelectedPeople)} />}
        </div>
        <div className="relative"><FilterButton label="Modified" active={active("modified")} open={openMenu === "modified"} onClick={openModified} />
          {openMenu === "modified" && <ModifiedMenu draft={draftModified} customOpen={customOpen} from={fromDate} to={toDate} onDraftChange={(value) => { setDraftModified(value); setCustomOpen(false); }} onCustomOpen={() => { setDraftModified("custom"); setCustomOpen(true); }} onFromChange={setFromDate} onToChange={setToDate} onCancel={() => setOpenMenu(null)} onClear={() => { clearAll(); setOpenMenu(null); }} onApply={() => { setModified(draftModified); setOpenMenu(null); }} />}
        </div>
        {hasActiveFilters && <button type="button" onClick={() => { clearAll(); setOpenMenu(null); }} className="h-8 px-2 text-[14px] font-medium text-[#18181A] hover:text-[#002896]">Clear all</button>}
      </div>
    )}
    <div className="flex items-center rounded-[12px] bg-[#F2F2F7] p-1" aria-label="View mode"><button type="button" onClick={() => onViewModeChange("list")} className={`flex size-8 items-center justify-center rounded-[8px] ${viewMode === "list" ? "bg-white text-[#002896] shadow-sm" : "text-[#636366]"}`} aria-label="List view" aria-pressed={viewMode === "list"}><ListIcon size={16} /></button><button type="button" onClick={() => onViewModeChange("grid")} className={`flex size-8 items-center justify-center rounded-[8px] ${viewMode === "grid" ? "bg-white text-[#002896] shadow-sm" : "text-[#636366]"}`} aria-label="Grid view" aria-pressed={viewMode === "grid"}><GridIcon size={16} /></button></div>
  </div>;
}

function FilterButton({ label, active, count, open, onClick }: { label: string; active: boolean; count?: number; open: boolean; onClick: () => void }) {
  return <button type="button" onClick={onClick} aria-haspopup="menu" aria-expanded={open} className={`flex h-8 items-center gap-2 rounded-[8px] border px-3 text-[14px] leading-[20px] ${active || open ? "border-[#002896] bg-[#F4F5FD] font-semibold text-[#002896]" : "border-[#E5E5EA] bg-white text-[#18181A] hover:bg-[#F9F9FB]"}`}>{label}{count ? <span className="flex size-4 items-center justify-center rounded-full bg-[#002896] text-[11px] text-white" aria-label={`${count} selected`}>{count}</span> : null}<ChevronDownIcon size={12} className={`transition-transform ${open ? "rotate-180 text-[#002896]" : "text-[#636366]"}`} /></button>;
}

function MenuSurface({ children, className = "" }: { children: React.ReactNode; className?: string }) { return <div className={`absolute left-0 top-[calc(100%+6px)] z-50 overflow-hidden rounded-[12px] border border-[#E1E1E6] bg-white shadow-[0_8px_24px_rgba(24,24,26,0.14)] ${className}`} role="menu">{children}</div>; }
function TypeMenu({ types, selected, onToggle }: { types: FileType[]; selected: Set<FileType>; onToggle: (type: FileType) => void }) { return <MenuSurface className="w-[260px] py-2">{types.map((type) => <button key={type} type="button" role="menuitemcheckbox" aria-checked={selected.has(type)} onClick={() => onToggle(type)} className={`flex w-full items-center gap-3 px-4 py-3 text-left text-[16px] hover:bg-[#F6F7FC] ${selected.has(type) ? "bg-[#F0F2FF] font-semibold text-[#002896]" : "text-[#18181A]"}`}><span className={`flex size-5 shrink-0 items-center justify-center rounded-[6px] border ${selected.has(type) ? "border-[#002896] bg-[#002896] text-white" : "border-[#C7C7CC]"}`}>{selected.has(type) ? "✓" : null}</span><FileIcon type={type} size={32} /><span>{TYPE_LABELS[type]}</span></button>)}</MenuSurface>; }
function PeopleMenu({ people, selected, onToggle }: { people: string[]; selected: Set<string>; onToggle: (person: string) => void }) {
  const [query, setQuery] = useState("");
  const matchingPeople = people.filter((person) => person.toLowerCase().includes(query.toLowerCase()));
  return <MenuSurface className="w-[320px]">
    <div className="border-b border-[#E5E5EA] p-3"><label className="flex h-11 items-center gap-2 rounded-[8px] border border-[#E1E1E6] bg-white px-3 transition-colors focus-within:border-[#002896] focus-within:ring-1 focus-within:ring-[#002896]"><SearchIcon size={20} className="shrink-0 text-[#8E8E93]" /><input autoFocus type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search people" className="min-w-0 flex-1 appearance-none border-0 bg-transparent text-[16px] text-[#18181A] shadow-none outline-none ring-0 placeholder:text-[#8E8E93] focus:border-0 focus:outline-none focus:ring-0" aria-label="Search people" /></label></div>
    <div className="max-h-[360px] overflow-y-auto py-1">{matchingPeople.map((person, index) => <button key={person} type="button" role="menuitemcheckbox" aria-checked={selected.has(person)} onClick={() => onToggle(person)} className={`flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-[#F6F7FC] ${selected.has(person) ? "bg-[#F0F2FF]" : ""}`}><PersonAvatar person={person} index={index} /><span className="min-w-0 flex-1"><span className={`block truncate text-[16px] ${selected.has(person) ? "font-semibold text-[#002896]" : "text-[#18181A]"}`}>{person}</span><span className="block truncate text-[13px] text-[#636366]">{person.toLowerCase().replace(/[^a-z0-9]+/g, ".").replace(/^\.|\.$/g, "")}@rakuten.com</span></span>{selected.has(person) ? <span className="flex size-5 items-center justify-center rounded-[6px] bg-[#002896] text-[13px] text-white" aria-hidden="true">✓</span> : <ChevronRightIcon size={16} className="shrink-0 text-[#8E8E93]" />}</button>)}{matchingPeople.length === 0 && <p className="px-4 py-8 text-center text-[14px] text-[#636366]">No people found</p>}</div>
    <button type="button" className="flex w-full items-center gap-3 border-t border-[#E5E5EA] px-4 py-3 text-left text-[16px] text-[#18181A] hover:bg-[#F6F7FC]"><span className="flex size-9 items-center justify-center rounded-full bg-[#636366] text-[22px] text-white">◎</span>Anyone with the link</button>
  </MenuSurface>;
}

function PersonAvatar({ person, index }: { person: string; index: number }) {
  if (person.startsWith("You")) return <Image src="/profile-cat.png" alt="" width={48} height={48} className="size-9 shrink-0 rounded-full object-cover" />;
  const colors = ["#9B3FD4", "#0080B0", "#C14020", "#1A8040", "#7A5500", "#B0004E", "#005E8B"];
  const initials = person.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();
  return <span className="flex size-9 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold text-white" style={{ backgroundColor: colors[index % colors.length] }}>{initials}</span>;
}
function ModifiedMenu({ draft, customOpen, from, to, onDraftChange, onCustomOpen, onFromChange, onToChange, onCancel, onClear, onApply }: { draft: DateFilter; customOpen: boolean; from: string; to: string; onDraftChange: (value: DateFilter) => void; onCustomOpen: () => void; onFromChange: (value: string) => void; onToChange: (value: string) => void; onCancel: () => void; onClear: () => void; onApply: () => void }) { return <MenuSurface className="w-[438px]"><div className="flex"><div className="w-[220px] py-2">{DATE_OPTIONS.map((option) => <button key={option.value} type="button" onClick={() => onDraftChange(option.value)} className={`w-full px-4 py-3 text-left text-[16px] ${draft === option.value ? "bg-[#F0F2FF] font-semibold text-[#002896]" : "text-[#18181A] hover:bg-[#F6F7FC]"}`}>{option.label}</button>)}<button type="button" onClick={onCustomOpen} className={`flex w-full items-center justify-between px-4 py-3 text-left text-[16px] ${customOpen ? "bg-[#F0F2FF] font-semibold text-[#002896]" : "text-[#18181A] hover:bg-[#F6F7FC]"}`}>Custom date range <span className="text-[28px] leading-4">›</span></button></div>{customOpen && <div className="w-[218px] border-l border-[#E5E5EA] p-4"><p className="mb-4 text-[14px] text-[#636366]">Custom date range</p><DateInput label="From" value={from} onChange={onFromChange} /><DateInput label="To" value={to} onChange={onToChange} /></div>}</div><div className="flex items-center justify-end gap-4 border-t border-[#E5E5EA] px-4 py-3"><button type="button" onClick={onClear} className="text-[14px] text-[#636366] hover:text-[#18181A]">Clear all</button><button type="button" onClick={onCancel} className="text-[14px] text-[#002896]">Cancel</button><button type="button" onClick={onApply} className="rounded-[8px] bg-[#002896] px-4 py-2 text-[14px] font-semibold text-white">Apply</button></div></MenuSurface>; }
function DateInput({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) { return <label className="mb-3 block text-[14px] text-[#636366]">{label}<input type="date" value={value} onChange={(event) => onChange(event.target.value)} className="mt-1 block h-10 w-full appearance-none rounded-[8px] border border-[#E1E1E6] px-3 text-[14px] text-[#18181A] outline-none focus:border-[#002896] focus:ring-1 focus:ring-[#002896]" /></label>; }
