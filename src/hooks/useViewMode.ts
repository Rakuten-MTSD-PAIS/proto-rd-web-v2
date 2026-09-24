"use client";

import { useEffect, useState } from "react";
import type { ViewMode } from "@/lib/types";

const KEY = "folderViewMode";

export function useViewMode(): [ViewMode, (mode: ViewMode) => void, boolean] {
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(KEY) as ViewMode | null;
    if (saved) setViewMode(saved);
    setMounted(true);
  }, []);

  const handleChange = (mode: ViewMode) => {
    setViewMode(mode);
    localStorage.setItem(KEY, mode);
  };

  return [viewMode, handleChange, mounted];
}
