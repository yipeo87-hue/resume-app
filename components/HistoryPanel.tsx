"use client";

import { useState, useEffect } from "react";
import type { Lang } from "@/lib/i18n";
import { useT } from "@/lib/i18n";
import { getHistory, deleteHistory, clearHistory, type HistoryEntry } from "@/lib/history";

interface Props {
  lang: Lang;
  onSelect: (entry: HistoryEntry) => void;
  open: boolean;
  onClose: () => void;
}

export default function HistoryPanel({ lang, onSelect, open, onClose }: Props) {
  const t = useT(lang);
  const [entries, setEntries] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    if (open) setEntries(getHistory());
  }, [open]);

  function handleDelete(id: string, e: React.MouseEvent) {
    e.stopPropagation();
    deleteHistory(id);
    setEntries(getHistory());
  }

  function handleClear() {
    clearHistory();
    setEntries([]);
  }

  if (!open) return null;

  const modeLabel = (m: string) => {
    if (m === "analyze") return lang === "zh" ? "📝 分析" : "📝 Analysis";
    if (m === "match") return lang === "zh" ? "🎯 匹配" : "🎯 Match";
    return lang === "zh" ? "🔄 对比" : "🔄 Compare";
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end" onClick={onClose}>
      <div className="absolute inset-0 bg-black/20" />
      <div
        className="relative w-full max-w-sm bg-white shadow-2xl h-full overflow-y-auto animate-slide-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-gray-100 px-5 py-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">{t("historyTitle")}</h2>
          <div className="flex items-center gap-2">
            {entries.length > 0 && (
              <button onClick={handleClear} className="text-xs text-red-400 hover:text-red-600 transition-colors">
                {t("historyClear")}
              </button>
            )}
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
          </div>
        </div>

        {entries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <span className="text-4xl mb-3">📭</span>
            <p className="text-sm">{t("historyEmpty")}</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {entries.map((entry) => (
              <button
                key={entry.id}
                onClick={() => onSelect(entry)}
                className="w-full text-left px-5 py-4 hover:bg-amber-50/50 transition-colors group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-amber-500">{modeLabel(entry.mode)}</span>
                  <button
                    onClick={(e) => handleDelete(entry.id, e)}
                    className="text-gray-300 hover:text-red-400 text-sm opacity-0 group-hover:opacity-100 transition-all"
                  >
                    🗑
                  </button>
                </div>
                <p className="text-sm font-medium text-gray-700 truncate">{entry.fileName}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {new Date(entry.date).toLocaleString(lang === "zh" ? "zh-CN" : "en-US", {
                    month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
                  })}
                </p>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
