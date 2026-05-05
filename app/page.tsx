"use client";

import { useState, useCallback } from "react";
import type { AnalysisResult, AppMode } from "@/lib/types";
import { useT, type Lang } from "@/lib/i18n";
import { saveHistory, type HistoryEntry } from "@/lib/history";
import FileDropzone from "@/components/FileDropzone";
import LoadingOverlay from "@/components/LoadingOverlay";
import ResultsPanel from "@/components/ResultsPanel";
import MatchPanel from "@/components/MatchPanel";
import ComparePanel from "@/components/ComparePanel";
import LanguageToggle from "@/components/LanguageToggle";
import HistoryPanel from "@/components/HistoryPanel";

const TABS: { mode: AppMode; icon: string; keyZh: string; keyEn: string }[] = [
  { mode: "analyze", icon: "📝", keyZh: "简历分析", keyEn: "Analysis" },
  { mode: "match", icon: "🎯", keyZh: "职位匹配", keyEn: "Job Match" },
  { mode: "compare", icon: "🔄", keyZh: "版本对比", keyEn: "Compare" },
];

export default function Home() {
  const [lang, setLang] = useState<Lang>("zh");
  const t = useT(lang);

  const [mode, setMode] = useState<AppMode>("analyze");
  const [status, setStatus] = useState<"idle" | "review" | "analyzing" | "done" | "error">("idle");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [supplement, setSupplement] = useState("");
  const [showHistory, setShowHistory] = useState(false);

  const handleFileSelected = useCallback((selected: File) => {
    setFile(selected);
    setSupplement("");
    setStatus("review");
  }, []);

  async function handleAnalyze() {
    if (!file) return;
    setStatus("analyzing");
    setError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("lang", lang);
      if (supplement.trim()) fd.append("supplement", supplement.trim());
      const res = await fetch("/api/analyze", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Analysis failed");
      setResult(data);
      setStatus("done");
      saveHistory({ mode: "analyze", fileName: file.name, result: data, supplement: supplement.trim() || undefined });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setStatus("error");
    }
  }

  function handleReset() { setStatus("idle"); setResult(null); setError(null); setFile(null); setSupplement(""); }

  function handleHistorySelect(entry: HistoryEntry) {
    setShowHistory(false);
    if (entry.mode === "analyze") {
      setMode("analyze");
      setResult(entry.result as AnalysisResult);
      setFile({ name: entry.fileName } as File);
      setStatus("done");
    } else {
      setMode(entry.mode);
      setFile(null as any);
      setResult(entry.result as any);
      setStatus("done");
    }
  }

  const activeTab = TABS.find((tab) => tab.mode === mode)!;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fef9f0] via-[#fff7ed] to-[#fef3e4]">
      {/* Decorative blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-orange-200/20 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-3xl mx-auto px-4 py-10 sm:py-16">
        {/* Top bar: language + history */}
        <div className="flex justify-end items-center gap-3 mb-4">
          <button
            onClick={() => { setShowHistory(true); }}
            className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-white/80 px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-amber-600 hover:border-amber-200 hover:bg-amber-50 transition-all shadow-sm"
          >
            🕐 {lang === "zh" ? "历史" : "History"}
          </button>
          <LanguageToggle lang={lang} onChange={setLang} />
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-500 mb-3 tracking-tight">
            {t("appTitle")}
          </h1>
          <p className="text-base text-gray-400">
            {mode === "analyze" ? t("analyzeDesc") : mode === "match" ? t("matchDesc") : t("compareDesc")}
          </p>
        </div>

        {/* Tab bar */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex rounded-2xl bg-white/90 backdrop-blur-sm shadow-lg shadow-amber-100/30 border border-amber-100/50 p-1.5 gap-1">
            {TABS.map((tab) => (
              <button
                key={tab.mode}
                onClick={() => { setMode(tab.mode); handleReset(); }}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                  mode === tab.mode
                    ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md shadow-amber-200"
                    : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
                }`}
              >
                <span className="text-base">{tab.icon}</span>
                <span className="hidden sm:inline">{lang === "zh" ? tab.keyZh : tab.keyEn}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {mode === "analyze" && (
          <>
            {status === "idle" && <FileDropzone onFileSelected={handleFileSelected} lang={lang} />}
            {status === "review" && file && (
              <div className="max-w-xl mx-auto space-y-5">
                <div className="flex items-center gap-3 rounded-2xl bg-white/90 backdrop-blur-sm border border-green-200/50 px-5 py-4 shadow-lg shadow-green-100/20">
                  <span className="text-2xl">📄</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-400">{t("fileSelected")}</p>
                    <p className="text-gray-800 font-medium truncate">{file.name}</p>
                  </div>
                  <button onClick={handleReset} className="text-sm text-gray-300 hover:text-red-400 transition-colors">{t("reselect")}</button>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">{t("supplementLabel")}</label>
                  <textarea value={supplement} onChange={(e) => setSupplement(e.target.value)}
                    placeholder={t("supplementPlaceholder")} rows={4} maxLength={800}
                    className="w-full rounded-2xl border border-gray-200/80 bg-white/90 backdrop-blur-sm px-4 py-3 text-sm text-gray-700 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-transparent transition-all shadow-sm" />
                  <p className="text-right text-xs text-gray-300 mt-1">{supplement.length}/800</p>
                </div>
                <button onClick={handleAnalyze}
                  className="w-full rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 py-3.5 text-base font-semibold text-white hover:from-amber-600 hover:to-orange-600 active:scale-[0.98] transition-all shadow-lg shadow-amber-200">
                  {t("startAnalysis")}
                </button>
              </div>
            )}
            {status === "analyzing" && (
              <div>
                <p className="text-center text-gray-400 text-sm mb-4">{t("analyzing")}：{file?.name}</p>
                <LoadingOverlay lang={lang} />
              </div>
            )}
            {status === "done" && result && (
              <div>
                <button onClick={handleReset} className="mb-6 text-sm text-amber-500 hover:text-amber-600 underline underline-offset-4 font-medium">{t("reupload")}</button>
                <ResultsPanel result={result} lang={lang} />
              </div>
            )}
            {status === "error" && (
              <div className="text-center py-20">
                <p className="text-5xl mb-4">😥</p>
                <p className="text-lg text-red-400 font-medium mb-1">{t("errorTitle")}</p>
                <p className="text-gray-400 text-sm mb-6">{error}</p>
                <button onClick={handleReset}
                  className="rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-8 py-2.5 text-sm font-medium text-white hover:shadow-lg transition-all">{t("retry")}</button>
              </div>
            )}
          </>
        )}

        {mode === "match" && <MatchPanel lang={lang} />}
        {mode === "compare" && <ComparePanel lang={lang} />}
      </div>

      <HistoryPanel lang={lang} open={showHistory} onClose={() => setShowHistory(false)} onSelect={handleHistorySelect} />
    </div>
  );
}
