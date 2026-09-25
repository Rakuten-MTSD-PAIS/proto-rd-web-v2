"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CalendarProps {
  selected?: Date;
  onSelect?: (date: Date) => void;
}

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export function Calendar({ selected, onSelect }: CalendarProps) {
  const today = new Date();
  const base = selected ?? today;
  const [view, setView] = useState(new Date(base.getFullYear(), base.getMonth(), 1));

  const year = view.getFullYear();
  const month = view.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const isSelected = (d: number) =>
    selected &&
    selected.getFullYear() === year &&
    selected.getMonth() === month &&
    selected.getDate() === d;

  const isToday = (d: number) =>
    today.getFullYear() === year && today.getMonth() === month && today.getDate() === d;

  return (
    <div className="w-full select-none font-['Rakuten_Sans_UI']">
      {/* Header */}
      <div className="mb-2 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setView(new Date(year, month - 1, 1))}
          className="flex size-7 items-center justify-center rounded-[4px] text-[#636366] hover:bg-[#F2F2F7] active:scale-[0.96] transition-[transform] duration-100"
          aria-label="Previous month"
        >
          <ChevronLeft size={16} strokeWidth={2} />
        </button>
        <span className="text-[14px] font-semibold text-[#18181A]">
          {MONTHS[month]} {year}
        </span>
        <button
          type="button"
          onClick={() => setView(new Date(year, month + 1, 1))}
          className="flex size-7 items-center justify-center rounded-[4px] text-[#636366] hover:bg-[#F2F2F7] active:scale-[0.96] transition-[transform] duration-100"
          aria-label="Next month"
        >
          <ChevronRight size={16} strokeWidth={2} />
        </button>
      </div>

      {/* Day headers */}
      <div className="mb-1 grid grid-cols-7">
        {DAYS.map((d) => (
          <div key={d} className="py-0.5 text-center text-[13px] font-semibold text-muted-foreground">
            {d}
          </div>
        ))}
      </div>

      {/* Cells */}
      <div className="grid grid-cols-7">
        {cells.map((d, i) => (
          <div key={i} className="flex items-center justify-center py-0.5">
            {d ? (
              <button
                type="button"
                onClick={() => onSelect?.(new Date(year, month, d))}
                className={`flex size-8 items-center justify-center rounded-full border text-[14px] transition-colors duration-100
                  ${isSelected(d) ? "border-[#002896] bg-[#002896] text-white font-semibold" : isToday(d) ? "border-[#002896] text-[#002896] font-semibold hover:bg-[#EEF1FA]" : "border-transparent text-[#18181A] hover:bg-[#F2F2F7]"}`}
              >
                {d}
              </button>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
