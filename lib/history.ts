import type { AnalysisResult, MatchResult, CompareResult } from "./types";

export type HistoryMode = "analyze" | "match" | "compare";

export interface HistoryEntry {
  id: string;
  mode: HistoryMode;
  fileName: string;
  date: string; // ISO string
  result: AnalysisResult | MatchResult | CompareResult;
  supplement?: string;
  jdText?: string;
}

const STORAGE_KEY = "resume_app_history";
const MAX_ENTRIES = 20;

export function getHistory(): HistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveHistory(entry: Omit<HistoryEntry, "id" | "date">) {
  if (typeof window === "undefined") return;
  const history = getHistory();
  const newEntry: HistoryEntry = {
    ...entry,
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    date: new Date().toISOString(),
  };
  history.unshift(newEntry);
  if (history.length > MAX_ENTRIES) history.pop();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

export function deleteHistory(id: string) {
  const history = getHistory().filter((h) => h.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

export function clearHistory() {
  localStorage.removeItem(STORAGE_KEY);
}
